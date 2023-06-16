import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-term-condition-management',
  templateUrl: './term-condition-management.component.html',
  styleUrls: ['./term-condition-management.component.scss']
})
export class TermConditionManagementComponent implements OnInit, OnDestroy {
  T_CDetail :any = {};
  communityDetail:any = [];
  generalTermsEditor : Editor;
  eventTermsEditor : Editor;
  memberTermsEditor : Editor;

  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService){}

  ngOnInit() {
    this.generalTermsEditor = new Editor();
    this.eventTermsEditor = new Editor();
    this.memberTermsEditor = new Editor();

    this.getCommunityDetail();
  }
  ngOnDestroy() {
    this.generalTermsEditor.destroy();
    this.eventTermsEditor.destroy();
    this.memberTermsEditor.destroy();
  }

  getCommunityDetail() {
    let request = {
      path: '/community/community',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.communityDetail = response['data'];
      this.T_CDetail['eventTermsAndConditions'] =  this.communityDetail['eventTermsAndConditions'];
      this.T_CDetail['generalTermsAndConditions'] =  this.communityDetail['generalTermsAndConditions'];
      this.T_CDetail['memberTermsAndConditions'] =  this.communityDetail['memberTermsAndConditions'];
    });
  }
  submit() {
    let request = {
      path: 'community/community/termsAndConditions',
      data: this.T_CDetail,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.getCommunityDetail();
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }
}
