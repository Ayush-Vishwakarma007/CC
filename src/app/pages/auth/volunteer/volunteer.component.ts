import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EMAIL_PATTERN } from '../../../helpers/validations';
import {SeoService} from "../../../services/seo.service";
import {CommunityDetailsService} from "../../../services/community-details.service";

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss']
})
export class VolunteerComponent implements OnInit {

  chapterDetail: any = [];
  subjectList: any;

  chapter : any = [];
  contactUsForm: FormGroup;
  submitted: any = false;
  authDetail: any;
  zoom = 12
  center:''
  markers: any = [];
  constructor(private route: ActivatedRoute, public router: Router,public communityService:CommunityDetailsService, public apiService: ApiService, private fb: FormBuilder, private toastrService: ToastrService, private seo:SeoService) {
    this.contactUsForm = this.fb.group({
      // chapterId: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      firstName:  [null, [ Validators.required ,Validators.pattern('[a-zA-Z ]*$')]],
      lastName:  [null, [ Validators.required ,Validators.pattern('[a-zA-Z ]*$')]],
      middleName: [''],
      message: ['', Validators.required],
      subject: ['', Validators.required],
      chapterId: [''],
      phoneNumber: ['', [Validators.required,Validators.minLength(10)]],
    });
  }

  ngOnInit() {
    this.getChapterDetail();
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    if (this.authDetail) {
      this.getProfileDetail();
    }
    this.seo.generateTags({});
  }

  get contactUsFormvalid() { return this.contactUsForm.controls; }

  getChapterDetail() {
    let request;
        if(this.authDetail)
        {
          request = {
            path: "community/chapters/access",
            isAuth: true
          };
        }else
        {
          request = {
            path: "community/chapters",
            isAuth: true
          };
        }
    this.apiService.get(request).subscribe(response => {
      this.chapter = JSON.parse(localStorage.getItem('chapter'));
      if(this.chapter.level!= 0){
         this.chapterDetail[0] = this.chapter;
         this.contactUsForm.patchValue({
           chapterId: this.chapterDetail[0]['name']
         })
      }else{
        this.chapterDetail = response['data'];
        this.contactUsForm.patchValue({
          chapterId: this.chapterDetail[0]['id']
        })
      }
    });
    let request2 = {
      path: 'community/volunteer/subject',
      isAuth: true,
    };
    this.apiService.get(request2).subscribe(response => {
      this.subjectList = response['data'];
    });
  }

  ContactUsSubmit() {
    this.submitted = true;

    let formValue = this.contactUsForm.value;
    if(formValue['phoneNumber']){
      let phone = formValue['phoneNumber'];
    if (formValue['phoneNumber'].length >= 17) {
      phone = phone.slice(0, -1);
    }
    phone = phone.replace('(', '');
    phone = phone.replace(')', '');
    phone = phone.replace(' ', '');
    phone = phone.replace(/[^0-9\.]+/g, "");
    formValue['phoneNumber'] = phone;
    this.contactUsForm.patchValue({
      phoneNumber : phone
    })
    console.log(this.contactUsForm.value.phoneNumber);
    }

    if(this.communityService.uiPermission['PLATFORM'])
    {
      this.contactUsForm.controls["chapterId"].clearValidators();
      this.contactUsForm.controls["chapterId"].updateValueAndValidity();
      delete formValue.chapterId;
      delete formValue.subject;
    }
    if (this.contactUsForm.invalid) {
      this.toastrService.error('Fill required fields');
      return ;
    } else {
      let Data = {
        path: "community/volunteer/query",
        data: formValue,
        isAuth: false
      };

      this.apiService.postWithoutToken(Data).subscribe(response => {

        if (response['status'].status == "SUCCESS") {
          this.toastrService.success(response['status'].description);
        }else{
          this.toastrService.error(response['status'].description);
        }
        this.contactUsForm.reset();
        this.submitted = false
      });

    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  getProfileDetail() {
    let data = {
      path: "auth/user/getUserDetail",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      //console.log(response['data']['user']);
      this.contactUsForm.patchValue({
        firstName: response['data']['user']['firstName'],
        middleName: response['data']['user']['middleName'],
        lastName: response['data']['user']['lastName'],
        phoneNumber: response['data']['user']['phone'],
        email: response['data']['user']['email'],

      });
    });
  }
}
