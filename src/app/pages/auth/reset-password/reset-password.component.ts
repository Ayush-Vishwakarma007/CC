import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {CommunityDetailsService} from "../../../services/community-details.service";
import {MenuService} from "../../../services/menu.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm:FormGroup;
  constructor(private fb:FormBuilder,public menuService:MenuService,public communityService:CommunityDetailsService,public apiService: ApiService,private toastrService: ToastrService,private router:Router) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z\\d!@#$%^&*()_+-=]{8,}$')]],
        cPassword: [''],
    });
  }

  ngOnInit() {
    // this.communityService.init();
  }
  resetPassword(){
    console.log(this.resetPasswordForm.controls.password)
    if(this.resetPasswordForm.controls.password.invalid) {
      this.toastrService.error('Please check Password requirements.');
    }else {
      let fData = this.resetPasswordForm.value;
      if(fData.password == fData.cPassword){
        if(fData.password.length >= 7){
            let data = {
              path: "auth/user/forgetPassword/update",
              data: {
                "newPassword": btoa(fData.password)
              },
              isAuth: true
            }
            this.apiService.postWithToken(data).subscribe(response => {
              if(response['status']['status'] == 'SUCCESS'){
                this.toastrService.success(response['status']['description']);
                let redirect = localStorage.getItem("eventUrl");
                this.menuService.getMenus();
                this.menuService.setProfile();
                if (redirect) {
                  this.router.navigate([redirect]);
                }else {
                  this.router.navigate(['/']);
                }
              }else{
                this.toastrService.error(response['status']['description']);
              }
            });
          }else{
            this.toastrService.error('Please enter min 8 character');
          }
      }else{
        this.toastrService.error('Password mot match.');
      }
    }
  }
  HomeClick() {
    this.router.navigate(['/']);
  }
}
