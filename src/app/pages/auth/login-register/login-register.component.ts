import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { isNumeric } from 'jquery';
import { EMAIL_PATTERN } from '../../../helpers/validations';
import { UsernameValidator } from '../../../helpers/whitespaceValidator';

import {
  SocialAuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  // LinkedinLoginProvider
} from '@abacritt/angularx-social-login';
import {MenuService} from "../../../services/menu.service";
import {CommunityDetailsService} from "../../../services/community-details.service";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';



@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// pradip kor 01-09-2020
export class LoginRegisterComponent implements OnInit,AfterViewInit {

  filteredOptions: Observable<any[]>;

  options: string[] = ['One', 'Two', 'Three'];

  @ViewChild('emailId') emailId: ElementRef;

  activeTab: any = 'signup';
  activeTabForgotPass: any = 'forgotpass';

  loginForm: FormGroup;
  regForm: FormGroup;
  verifyOTPForm: FormGroup;
  ForgotPasswordForm: FormGroup;
  sendOtpForm: FormGroup;
  ResetPasswordForm: FormGroup;

  userData: any;
  otpMail: string;
  otpContact: string;

  isLogin: boolean = false;
  sendOTPHTML: boolean = false;
  forgotPasswordHtml: boolean = true;
  verifyOTPHTML: boolean = false;
  firstTimeLogin: boolean = false;
  ResetPasswordFormHTML: boolean = false;
  submitted: boolean = false;
  errorMsg: string;
  otpType: any;
  countryData = [];
  dropdownList :any = [];
  dropdownSettings = {};
  selectedItems = [];
  chapter :any;
  fbUserData: any;
  chapterList: any = [];
  new:any=[];
  passwordStrength : boolean = false;
  passwordStrengthCheck : any;
  showBecomeMemberOnLogin=false;
  showSignUpOnLogin=false;
  constructor(public menuService:MenuService,public cd:ChangeDetectorRef,public communityService:CommunityDetailsService,private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, public router: Router, private authService: SocialAuthService) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      otp: ['']
    });
    this.regForm = this.fb.group({
      firstName: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      lastName: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      userName: [''],
      countryPhoneCode: ['(+1) United States', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(EMAIL_PATTERN)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      chapterId: ['', Validators.required],
    });

    this.ForgotPasswordForm = this.fb.group({
      email: ['', [Validators.required]],
    });

    this.verifyOTPForm = this.fb.group({
      otp: ['', [Validators.required]]
    });

    this.sendOtpForm = this.fb.group({
      otpType: ['email']
    });

    this.ResetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z\\d!@#$%^&*()_+-=]{8,}$')]],
      cPassword: ['', [Validators.required]],
    });
    
    this.showBecomeMemberOnLogin = this.communityService.communityDetail['showBecomeMemberOnLogin'];
    this.showSignUpOnLogin = this.communityService.communityDetail['showSignUpOnLogin'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.emailId.nativeElement.focus();
    }, 500);
    console.log(this.activeTabForgotPass)
  }

  ngOnInit() {
    this.communityService.init();
    //this.CheckLoginSession();
    this.get_country();
    this.forgotPasswordHtml = true;
    this.verifyOTPHTML = false;
    this.CheckLoginSession();
    this.getChapterList();
    this.getCode();



  }


  facebooklogin() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((userData) => {
      this.fbUserData = userData;
      this.Sociallogin('FACEBOOK');
    });
  }

  googlelogin() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData) => {
      this.fbUserData = userData;
      this.Sociallogin('GOOGLE');
    });
  }

  getChapterList() {
    let request = {
      path: "community/chapters",
      isAuth: true
    };

    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.chapterList = response['data'];
        this.chapterList = this.chapterList.filter((data) => data['mainChapter'] != true);

        resolve(null);
      });
    });
  }

  Sociallogin(loginType) {

    //======= social login ======  28-04-2020 | pradip kor ==========
    if(this.fbUserData){
      let data = {
        path: "auth/auth/socialSignup",
        data: {
          "socialAccessToken": this.fbUserData.token,
          "socialLoginType": loginType,
        },
        isAuth: false,
      }

      this.apiService.postWithoutToken(data).subscribe(response => {

        this.userData = response['data'];
        if (response['status']['status'] == "SUCCESS") {
          this.isLogin = true;
          localStorage.setItem('authDetail', JSON.stringify(this.userData));
          localStorage.setItem('token', JSON.stringify(this.userData.apiInteraction));
          localStorage.setItem('login', JSON.stringify(this.isLogin));
          this.toastrService.success(response['status']['description']);
          let redirect = localStorage.getItem("eventUrl");
          this.menuService.setProfile();
          this.menuService.getMenus();
          if (redirect) {
            this.router.navigate([redirect]);
          } else if (this.userData['showMembership'] == true) {
            this.router.navigate(['/membership-plan']);
          }
          else {
            this.router.navigate(['/']);
          }
        }

      });
    }

    // let email = null;
    // let mobile = null;

    // if (this.loginForm.invalid) {
    //   this.toastrService.error('Fill all fields');
    // } else {

    //   let loginData = this.loginForm.value;
    //   if (isNumeric(loginData.email)) {
    //     mobile = loginData.email;
    //   } else {
    //     email = loginData.email;
    //   }

    //   let data = {
    //     path: "auth/user/login",
    //     data: {
    //       "email": email,
    //       "latestRequestSource": "WEB",
    //       "password": btoa(loginData.password),
    //       "phone": mobile
    //     },
    //     isAuth: false,
    //   }

    //   this.apiService.postWithoutToken(data).subscribe(response => {

    //     this.userData = response['data'];
    //     if (response['status']['status'] == "VERIFY") {

    //       localStorage.setItem('token', JSON.stringify(this.userData.apiInteraction));
    //     } else if (response['status']['status'] == "SUCCESS") {
    //       this.isLogin = true;
    //       localStorage.setItem('authDetail', JSON.stringify(this.userData));
    //       localStorage.setItem('token', JSON.stringify(this.userData.apiInteraction));
    //       localStorage.setItem('login', JSON.stringify(this.isLogin));
    //       this.toastrService.success(response['status']['description']);
    //       let redirect = localStorage.getItem("eventUrl");
    //       console.log(redirect);
    //       if (redirect) {
    //         this.router.navigate([redirect]);
    //       } else if (this.userData['showMembership'] == true) {
    //         this.router.navigate(['/become-member']);
    //       }
    //       else {
    //         this.router.navigate(['/']);
    //       }
    //     } else {
    //       this.toastrService.error(response['status']['description']);
    //     }

    //   });
    // }
  }


  get regFormCon() {
    return this.regForm.controls;
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


  submit() {
    this.submitted = true;

    let contryCode = '';
    if (this.selectedItems[0]) {
      contryCode = this.selectedItems[0]['id'];
    }
    let phone = this.regForm.value.phone;
    if (this.regForm.value.phone.length >= 17) {
      phone = phone.slice(0, -1);
    }
    phone = phone.replace('(', '');
    phone = phone.replace(')', '');
    phone = phone.replace(' ', '');
    phone = phone.replace(/[^0-9\.]+/g, "");

    this.regForm.patchValue({
      //countryPhoneCode:  countryPhoneCode,
      userName: this.regForm.value.email,
      phone: phone,
    });

    if(this.regForm.value.chapterId == ''){
      this.regForm.patchValue({
        chapterId: this.communityService.chapterList[0].id
      });
    }

    console.log(this.communityService.chapterList.length);
    let regFormValue = this.regForm.value;

    let regData = {
      path: "auth/user/signUp",
      data: regFormValue,
      isAuth: false
    };
    console.log(this.communityService.chapterList[0])
    if(this.communityService.chapterList.length=='1'){
      this.regForm.patchValue({
        chapterId:this.communityService.chapterList[0].id
      });
    }
    regData.data.latestRequestSource = "WEB";
    regData.data.latitude = "0";
    regData.data.longitude = "0";
    regData.data.password = btoa(regData.data.password);
    let regResponse;
    console.log(regData.data.chapterId);
    if (this.regForm.valid) {
      this.apiService.postWithoutToken(regData).subscribe(response => {
        regResponse = response;
        if (regResponse.status.status == "SUCCESS") {
          localStorage.setItem('currentUser', JSON.stringify(regResponse.userResponseGeneral));

          let redirect = localStorage.getItem("eventUrl");
          this.menuService.getMenus();
          this.menuService.setProfile();

          if (redirect) {
            this.router.navigate([redirect]);
          }
          else {
            this.router.navigate(['/']);
          }
          this.toastrService.success(response['status']['description']);
        } else {
          this.errorMsg = regResponse.status.description;
          this.toastrService.error(response['status']['description']);
        }
      });
    } else {
      this.toastrService.error('Something went wrong!');
    }
  }

  // =========== get country code list | pradip kor 10-01-2020 ===================
  get_country() {
    let contry_data = {
      path: "auth/country",
      isAuth: false
    };
    this.apiService.get(contry_data).subscribe(response => {
      this.countryData = response['data'];
      //this.dropdownList = response['data']['id'];

      this.countryData.forEach((item, index) => {
        var tempArray = [];
        let codeArr = {
          id: item.phoneCode,
          itemName: '(' + item.phoneCode + ') ' + item.name
        };
        this.dropdownList.push(codeArr);
        this.new.push(codeArr['itemName'])

      },

      console.log("country code ", this.new));

      this.dropdownSettings = {
        singleSelection: true,
        text: "Select Countries",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        classes: "myclass custom-class",
      };


    });

  }

  getCode() {
    this.filteredOptions = this.regForm.controls.countryPhoneCode.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value))
      );
  }
  filter(value: any): any {
    const filterValue = value.toLowerCase();

    return this.new.filter(option => option.toLowerCase().includes(filterValue));
  }


  onItemSelect(item: any) {

  }

  OnItemDeSelect(item: any) {

  }

  //===============================================================================

  sendOTP() {
    let sendOTPData = this.sendOtpForm.value;

    let type = sendOTPData.otpType;

    let sendOtpData = {};
    if (type == 'mobile') {
      this.otpType = 'mobile';
      sendOtpData = {
        "type": "PHONE"
      };
    } else {
      this.otpType = 'email';
      sendOtpData = {
        "type": "EMAIL"
      };
    }

    if (this.ForgotPasswordForm.invalid) {
      this.toastrService.error('Fill all fields');
    } else {
      let fpData = this.ForgotPasswordForm.value;
      let mobile = null;
      let email = null;

      if (isNumeric(fpData.email)) {
        mobile = fpData.email.trim();
      } else {
        email = fpData.email.trim();
      }

      let data = {
        path: "auth/user/forgetPassword",
        data: {
          "email": email,
          "phone": mobile
        },
        isAuth: false,
      }
      //Authenticat API
      this.apiService.postWithoutToken(data).subscribe(response => {
        if (response['status']['status'] == 'OK') {

          this.otpMail = this.mask(response['data']['email']);
          if(response['data']['phone'] != null && response['data']['phone'] != ''){
            this.otpContact = this.mask(response['data']['phone']);
          }

          localStorage.setItem('token', JSON.stringify(response['data']['token']));
          let data_otp = {
            path: "auth/user/sendOtp",
            data: sendOtpData,
            isAuth: true,
          }

          //Send OTP API
          
            
          
          this.apiService.postWithToken(data_otp).subscribe(response => {
            if (response['status']['status'] == 'SUCCESS') {

              this.sendOTPHTML = false;
              this.forgotPasswordHtml = false;
              
              this.verifyOTPHTML = true;
            
              console.log("1",this.verifyOTPHTML,
              this.sendOTPHTML)
               //   $('#verifybtn').click();
              this.forgotPasswordHtml = false;
              this.cd.detectChanges()
              this.toastrService.success(response['status']['description']);





            } else {
              this.toastrService.error('Somthing went wrong!');
            }
            console.log("2",this.verifyOTPHTML,
            this.sendOTPHTML)
       
     
        
         console.log("verify",this.verifyOTPHTML,
         this.sendOTPHTML)
        });
        } else {
          this.toastrService.error('Credential Not Found');
        }

      });
      console.log("3",this.verifyOTPHTML,
      this.sendOTPHTML)
     
    }

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
          if (this.firstTimeLogin) {
            this.isLogin = true;
            localStorage.setItem('login', JSON.stringify(this.isLogin));
            let redirect = localStorage.getItem("eventUrl");
            if (redirect) {
              this.router.navigate([redirect]);
            } else {
              this.router.navigate(['/']);
            }
          } else {
            this.sendOTPHTML = false;
            this.verifyOTPHTML = false;
            this.forgotPasswordHtml = false;
            this.ResetPasswordFormHTML = true;
            this.cd.detectChanges()
            localStorage.removeItem('token');
            localStorage.setItem('token', JSON.stringify(response['data']['apiInteraction']));
          }
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
  }

  resetPassword() {

    if(this.ResetPasswordForm.controls.password.invalid) {
      this.toastrService.error('Please check Password requirements.');
    }else if(this.ResetPasswordForm.value.password != this.ResetPasswordForm.value.cPassword) {
      this.toastrService.error('Please enter valid confirm password.');
    }else {
      let fData = this.ResetPasswordForm.value;
      if (fData.password == fData.cPassword) {
        if (fData.password.length >= 6) {
          let data = {
            path: "auth/user/forgetPassword/update",
            data: {
              "newPassword": btoa(fData.password)
            },
            isAuth: false,
          }
          this.apiService.postWithToken(data).subscribe(response => {
            if (response['status']['status'] == 'SUCCESS') {
              this.toastrService.success(response['status']['description']);
              this.router.navigate(['/login']);
              location.reload();
              this.signupClick();
              this.signInForgotClick();
            } else {
              this.toastrService.error('Somthing Went Wrong!');
            }
          });
        } else {
          this.toastrService.error('Please enter min 6 character');
        }
      } else {
        this.toastrService.error('Password Not Match.');
      }
    }
  }

  forgotPass() {
    if (this.ForgotPasswordForm.invalid) {
      this.toastrService.error('Fill all fields');
    } else {
      let fpData = this.ForgotPasswordForm.value;
      let mobile = null;
      let email = null;

      if (isNumeric(fpData.email)) {
        mobile = fpData.email.trim();
      } else {
        email = fpData.email.trim();
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
        if (response['status']['status'] == 'OK') {

          this.otpMail = this.mask(response['data']['email']);
          this.otpContact = this.mask(response['data']['phone']);
          localStorage.setItem('token', JSON.stringify(response['data']['token']));
          this.toastrService.success(response['status']['description']);
          this.forgotPasswordHtml = false;
          this.sendOTPHTML = true;
        } else {
          this.toastrService.error('Credential Not Found');
        }
      });
    }
  }

  HomeClick() {
    this.router.navigate(['/']);
  }

  CheckLoginSession() {
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    let isLogin = JSON.parse(localStorage.getItem("login"));
    if (authDetail) {
      if (isLogin == true) {
        let redirect = localStorage.getItem("eventUrl");
        if (redirect) {
          this.router.navigate([redirect]);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.router.navigate(['/login']);
      }
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
        mobile = loginData.email.trim();
      } else {
        email = loginData.email.trim();
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

          localStorage.setItem('token', JSON.stringify(this.userData.apiInteraction));
        } else if (response['status']['status'] == "SUCCESS") {
          this.isLogin = true;
          localStorage.setItem('authDetail', JSON.stringify(this.userData));
          localStorage.setItem('token', JSON.stringify(this.userData.apiInteraction));
          localStorage.setItem('login', JSON.stringify(this.isLogin));
          localStorage.setItem('showPopup', 'true');
          //localStorage.setItem("ExpriyTime", JSON.stringify(new Date().getTime()));
          this.menuService.getMenus();
          this.menuService.setProfile();
          this.toastrService.success(response['status']['description']);
          let redirect = localStorage.getItem("eventUrl");
          this.chapter = JSON.parse(localStorage.getItem('chapter'));
          if (redirect) {
            this.router.navigate([redirect]);
          } else if(response['data']['roles'].find(x => x==="ADMIN")){
            this.router.navigate(['/membership-dashboard']);
          } else if (this.userData['showMembership'] == true) {
            this.router.navigate(['/membership-plan']);
          }else if (this.userData['userState']== "UNPAID_MEMBER") {
            let req = {
              path: "auth/member/paymentLink/get",
              isAuth: true,
            }
            this.apiService.get(req).subscribe(response => {
              console.log("sfsd",response);
              window.location.href=response['data']['url'];
            });
          }else if(this.chapter.level!=0){
            this.router.navigate(['chapter/'+this.chapter.name]);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.toastrService.error(response['status']['description']);
        }

      });
    }
  }

  signinClick() {
    this.activeTab = "signin";
  }

  signupClick() {
    this.activeTab = "signup";
  }

  forgotClick() {
    this.activeTab = "forgot";
    this.activeTabForgotPass = "forgotlogin";
  }

  signInForgotClick() {
    this.activeTabForgotPass = "forgotpass";
    this.forgotPasswordHtml = true;
    this.activeTab='signup';
    this.sendOTPHTML = false;
    this.verifyOTPHTML = false;
    this.ResetPasswordFormHTML = false;
    this.ForgotPasswordForm.reset();
    this.sendOtpForm.reset();
    this.verifyOTPForm.reset();
    this.ResetPasswordForm.reset();
  }

  charOnly(evt): boolean {
    var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode :
      ((evt.which) ? evt.which : 0));
    if (charCode > 32 && (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  // ===================== add mask || pradip kor 17-2-2020

  mask(string) {
    let s = string;
    let length = s.length;
    let limit = length - 2;
    let first_three = s.slice(0, 2);
    let last_three = s.slice(limit, length);

    let final_string = '';
    final_string += first_three;
    for (let i = 1; i < limit - 1; i++) {
      final_string += '*';
    }
    final_string += last_three;
    return final_string;
  }

  onStrengthChanged(strength: number) {
    this.passwordStrengthCheck = strength;
    if(strength>=20){
      this.passwordStrength = true;
    }else{
      this.passwordStrength = false;
    }
  }

  onChanegNewOldPassword(checkStatus:any){
    if( this.passwordStrengthCheck<100 || checkStatus=='New'){
      this.passwordStrength = true;
    }else{
      this.passwordStrength = false;
    }
  }
}


