import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {CommunityDetailsService} from "../../../services/community-details.service";

@Component({
  selector: 'app-send-otp',
  templateUrl: './send-otp.component.html',
  styleUrls: ['./send-otp.component.scss']
})
export class SendOtpComponent implements OnInit {
  token="";
  phoneNo="";
  email:any;
  emailVerification:boolean = false;
  constructor( private toastrService: ToastrService,    public communityService: CommunityDetailsService,
               private activatedRoute: ActivatedRoute, public apiService: ApiService,public router: Router) { }

  ngOnInit() {
    this.verifyUser();
    this.activatedRoute.params.subscribe(params=> {
      this.email = params['email'];
    });
  }

  verifyUser(){
    this.activatedRoute.params.subscribe(params=>{
      this.email = params['email'];
      if(params['email'] && params['string']){
        this.apiService.logout(true);
        let reqData = {
          path : "auth/email/verify/check",
          data : {
            'email' : params['email']
          }
        };
        this.apiService.post(reqData).subscribe(response => {
          if(response['status']['code']=="OK"){
              // if(response['data']['value'] == true){
              //   this.toastrService.error("You are already verified!");
              //   this.router.navigate(['/']);
              // }
              if(response['data']['onlyEmailVerification'] == true){
                  this.emailVerification = true;
              }
          }else{

          }
        });
      }
    })
  }

  emailVerificationRedirect() {
    this.redirectInPassword(true);
  }
  redirectInPassword(url= false){
    this.activatedRoute.params.subscribe(params=>{
      this.email = params['email'];
      if(params['email'] && params['string']){
        this.apiService.logout(true);
        let reqData = {
          path : "auth/email/verify",
          data : {
            'email' : params['email'],
            'verificationCode' : params['string']
          }
        };
        this.apiService.post(reqData).subscribe(response => {
          if(response['status']['code']=="OK"){
            let isLogin = true;
            localStorage.setItem('authDetail', JSON.stringify(response['data']['user']));
            localStorage.setItem('token', JSON.stringify(response['data']['token']));
            localStorage.setItem('login', JSON.stringify(isLogin));
            // this.token=response['data']['token'];
            // this.phoneNo=response['data']['phone'];
            localStorage.removeItem('eventUrl');
            if(url == true){
              localStorage.setItem('eventUrl', '/');
            }else{
              localStorage.setItem('eventUrl', 'membership-plan');
            }
            this.router.navigateByUrl('reset-password');
          } else {
            this.toastrService.error(response['status']['description']);
            this.router.navigate(['/']);
          }
        });
      }
    })

  }
  verifyNewsletter(){
    this.activatedRoute.params.subscribe(params=>{
      this.email = params['email'];
      if(params['email'] && params['string']){
        //this.apiService.logout(true);
        let reqData = {
          path : "auth/email/verify?role=NEWSLETTER",
          data : {
            'email' : params['email'],
            'verificationCode' : params['string'],
            'newsLetter':true
          }
        };
        this.apiService.post(reqData).subscribe(response => {
          if(response['status']['code']=="OK") {
            this.toastrService.success(response['status']['description']);
            this.router.navigate(['/']);
          }else{
            this.toastrService.error(response['status']['description']);
            this.router.navigate(['/']);
          }
        });
      }
    })
  }
  verifyPhone(){
    this.router.navigateByUrl('reset-password');

    // let data = {
    //   path: "auth/user/sendOtp",
    //   data: {"type": "PHONE"},
    //   isAuth: true,
    // }
    // this.apiService.postWithToken(data).subscribe(response => {
    //   if(response['status']['code']="OK"){
    //     this.toastrService.success(response['status']['description']);
    //     this.router.navigateByUrl('/verify-otp');
    //   } else {
    //     this.toastrService.error(response['status']['description']);
    //   }
    // });
  }
}
