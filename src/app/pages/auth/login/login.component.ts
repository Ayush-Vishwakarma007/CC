import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { SpinnerService } from '../../../services/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {SeoService} from "../../../services/seo.service";
import { isNumeric } from 'jquery';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] 
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  sendOtpForm: FormGroup;
  verifyOTPForm: FormGroup;
  ForgotPasswordForm: FormGroup;
  ResetPasswordForm: FormGroup;

  invalidMobile: boolean = false;
  validMobile: boolean = false;
  otpSend: boolean = false;
  timeLeft = 60;
  interval: any;
  canResend: boolean = false;
  sendCounter: boolean = false;
  otpCode: any;
  otpVerified: boolean = false;
  codeData: any;
  loginVerifyRole: any;
  userData: any;
  otpType: any;
  isLogin: boolean = false;

  loginFormHTML: boolean = true;
  sendOTPHTML: boolean = false;
  verifyOTPHTML: boolean = false;
  forgotPasswordHtml: boolean = false;
  ResetPasswordFormHTML: boolean = false;
  firstTimeLogin:boolean = false;
  public phoneMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  constructor(private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, public router: Router,private seo:SeoService) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      otp: ['']
    });

    this.sendOtpForm = this.fb.group({
      otpType: ['email']
    });

    this.verifyOTPForm = this.fb.group({
      otp: ['', [Validators.required]]
    });

    this.ForgotPasswordForm = this.fb.group({
      email: ['', [Validators.required]],
    });

    this.ResetPasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      cPassword: ['', [Validators.required]],
    });


  }

  showAlerts(): void {
    // For normal messages
    this.toastrService.info('this is an info alert');
    this.toastrService.error('this is a danger alert');
    this.toastrService.success('this is a success alert');
    this.toastrService.warning('this is a warning alert');

    // For html messages:
    // this.toastrService.warning({ html: '<b>This message is bold</b>' });
  }

  ngOnInit() {
    this.CheckLoginSession();
    this.seo.generateTags({});
  }

  CheckLoginSession() {
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    let isLogin = JSON.parse(localStorage.getItem("login"));
    if (authDetail) {
      if (isLogin == true) {
        this.router.navigate(['/profile']);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  returnToLogin() {
    this.loginFormHTML = true;
    this.sendOTPHTML = false;
    this.verifyOTPHTML = false;
    this.ResetPasswordFormHTML = false;
    this.forgotPasswordHtml = false;
  }

  forgotPassword(){
    this.loginFormHTML = false;
    this.sendOTPHTML = false;
    this.verifyOTPHTML = false;
    this.forgotPasswordHtml = true;
  }

  resetPassword(){
    if (this.ResetPasswordForm.invalid) {
      this.toastrService.error('Fill all fields');
    }else{
      let fData = this.ResetPasswordForm.value;
      if(fData.password == fData.cPassword){
        if(fData.password.length >= 6){
            let data = {
              path: "auth/user/forgetPassword/update",
              data: {
                "newPassword": btoa(fData.password)
              },
              isAuth: false,
            }
            this.apiService.postWithToken(data).subscribe(response => {
              if(response['status']['status'] == 'SUCCESS'){
                this.toastrService.success(response['status']['description']);
                this.returnToLogin();
              }else{
                this.toastrService.error('Somthing Went Wrong!');
              }
            });
          }else{
            this.toastrService.error('Please enter min 6 character');
          }
      }else{
        this.toastrService.error('Password not match.');
      }
    }
  }
  showSendOTP(){
    this.loginFormHTML = false;
    this.sendOTPHTML = true;
    this.verifyOTPHTML = false;
    this.forgotPasswordHtml = false;
  }

  forgotPass(){
    if (this.ForgotPasswordForm.invalid) {
      this.toastrService.error('Fill all fields');
    } else {
      let fpData = this.ForgotPasswordForm.value;
      let mobile = null;
      let email = null;

      if (isNumeric(fpData.email)) {
        mobile = fpData.email;
      } else {
        email = fpData.email;
      }

      let data = {
        path: "auth/user/forgetPassword",
        data: {
          "email": email,
          "phone": mobile
        },
        isAuth: false,
      }
      this.apiService.postWithoutToken(data).subscribe(response => {
        if(response['status']['status'] == 'OK'){
          localStorage.setItem('token', JSON.stringify(response['data']['token']));
          this.ResetPasswordFormHTML = false;
          this.loginFormHTML = false;
          this.sendOTPHTML = true;
          this.verifyOTPHTML = false;
          this.forgotPasswordHtml = false;
        }else{
          this.toastrService.error('Your Data Not Found');
        }
      });
    }
  }

  sendOTP() {
    let sendOTPData = this.sendOtpForm.value;

    // let mobile = this.userData.phone;
    // let email = this.userData.email;

    let type = sendOTPData.otpType;

    let sendOtpData = {};
    if (type == 'email') {
      this.otpType = 'email';
      sendOtpData = {
        "type": "EMAIL"
      };
    } else {
      this.otpType = 'mobile';
      sendOtpData = {
        "type": "PHONE"
      };
    }

    let data = {
      path: "auth/user/sendOtp",
      data: sendOtpData,
      isAuth: true,
    }

    this.apiService.postWithToken(data).subscribe(response => {
      // localStorage.getItem("token");
      if (response['status']['status'] == 'SUCCESS') {
        this.loginFormHTML = false;
        this.sendOTPHTML = false;
        this.verifyOTPHTML = true;
        this.toastrService.success(response['status']['description']);
      } else {
        this.toastrService.error('Somthing went wrong!');
      }
    });
  }


  verifyOTP() {
    if (this.verifyOTPForm.invalid) {
      this.toastrService.error('Fill all fields');
    } else {
      let verifyOTPData = this.verifyOTPForm.value;

      let VerifyData = {};

      let data = {
        path: "auth/user/verifyOtp/" + verifyOTPData.otp,
        isAuth: false,
      }
      this.apiService.getwithHeader(data).subscribe(response => {
        if (response['status']['status'] == 'SUCCESS') {
          this.toastrService.success(response['status']['description']);
          if(this.firstTimeLogin){
            this.isLogin = true;
            localStorage.setItem('login', JSON.stringify(this.isLogin));
            this.router.navigate(['/profile']);
          }else{
            this.loginFormHTML = false;
            this.sendOTPHTML = false;
            this.verifyOTPHTML = false;
            this.ResetPasswordFormHTML = true;
            this.forgotPasswordHtml = false;
            localStorage.removeItem('token');
            localStorage.setItem('token', JSON.stringify(response['data']['apiInteraction']));
          }
        } else {
          this.toastrService.success(response['status']['description']);
        }
      });


    }
  }

  login() {

    let email = null;
    let mobile = null;

    if (this.loginForm.invalid) {
      this.toastrService.error('Fill all fields');
    } else {

      let loginData = this.loginForm.value;
      if (isNumeric(loginData.email)) {
        mobile = loginData.email;
      } else {
        email = loginData.email;
      }

      let data = {
        path: "auth/user/login",
        data: {
          "email": email,
          "latestRequestSource": "WEB",
          "password": btoa(loginData.password),
          "phone": mobile
        },
        isAuth: false,
      }

      this.apiService.postWithoutToken(data).subscribe(response => {

        this.userData = response['data'];
        if (response['status']['status'] == "VERIFY") {
          this.loginFormHTML = false;
          this.sendOTPHTML = true;
          this.firstTimeLogin = true;
          localStorage.setItem('token', JSON.stringify(this.userData.apiInteraction));
        } else if (response['status']['status'] == "SUCCESS") {
          this.isLogin = true;
          localStorage.setItem('authDetail', JSON.stringify(this.userData));
          localStorage.setItem('token', JSON.stringify(this.userData.apiInteraction));
          localStorage.setItem('login', JSON.stringify(this.isLogin));
          this.toastrService.success(response['status']['description']);
          this.router.navigate(['/profile']);
        }else{
          this.toastrService.error(response['status']['description']);
        }

      });
    }
  }

}
