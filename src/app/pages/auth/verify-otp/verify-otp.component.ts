import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {
  verifyOTPForm: FormGroup;
  constructor(public router: Router,private fb: FormBuilder, private toastrService: ToastrService,public apiService: ApiService) {
    this.verifyOTPForm = this.fb.group({
      otp: ['', [Validators.required]]
    });
  }
  ngOnInit() {
  }
  verifyOTP(){
    if (this.verifyOTPForm.invalid) {
      this.toastrService.error('Fill all fields');
    } else {
      let data = {
        path: "auth/user/verifyOtp/" + this.verifyOTPForm.value.otp,
        isAuth: true,
      }
      this.apiService.get(data).subscribe(response => {
        if(response['status']['code']=="OK"){
          localStorage.setItem('token', JSON.stringify(response['data']['apiInteraction']));
          this.toastrService.success(response['status']['description']);
          this.router.navigateByUrl('/reset-password');
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
  }
}
