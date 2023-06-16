import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../../services/api.service';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";
import {SpinnerService} from "../../../services/spinner.service";

@Component({
  selector: 'app-become-member-steps',
  templateUrl: './become-member-steps.component.html',
  styleUrls: ['./become-member-steps.component.scss']
})

export class BecomeMemberStepsComponent implements OnInit {
  isMemberFormSubmitted = false;
  addMemberForm: FormGroup;
  validation: any;
  memberDetail: any = [];
  addMember: boolean = false;
  fieldName: any;
  currentTab :any = [];
  filedValue: any;
  value: any;
  showArray: any = [];
  showName: any;
  paymentDiv: boolean = false;
  publicInfo: any = [];
  membershipDetail: any = [];
  price = 0;
  otherData = [];
  submitBtn:boolean= false;
  lastStep = false;
  // step: any = [
  //   {stepNo: 1, name: "Basic Information", step: "BASIC_INFO", class: "icon-file"},
  //   {stepNo: 2, name: "Address", step: "ADDRESS", class: "icon-wallet"},
  //   {stepNo: 2, name: "Education marital info", step: "EDUCATION_MARITAL_INFO", class: "icon-wallet"},
  //   {stepNo: 2, name: "Paresents info", step: "PARESENTS_INFO", class: "icon-wallet"},
  // ];
  submitBasic: boolean = false;
  activeTabName: any;
  activeIndex: any = 0;
  maxTabIndex: any;
  typeId = '';
  urlPattern =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;


  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService,public Http: HttpClient, public apiService: ApiService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router) {
    this.addMemberForm = this.formBuilder.group({});
    this.route.params.subscribe(params =>
      this.typeId = params['id']
    );
  }

  ngOnInit() {
    //this.activeTabName = this.step[0]['step'];
    this.getPublicInfo();
    this.getMemberDetails();
    //this.getMembershipList();

  }

  backTab() {
    let index = this.activeIndex - 1;
    if (this.memberDetail[index] == undefined) {
      this.router.navigate(['become-member']);
    } else {
      this.openActiveTab(this.memberDetail[index]);
    }
  }

  openActiveTab(tabName, i = '') {
    this.paymentDiv = false;
    if (tabName == undefined) {
      this.onPaymentStatus(null);

    } else {
      this.lastStep = false;
      if(tabName.index == this.memberDetail.length)
      {
        this.lastStep = true;
      }
      this.currentTab = tabName;
      this.showArray = tabName.fieldValues;
      this.showName = tabName.stepName;
      this.activeIndex = tabName.index - 1;
    }
  }

  openPaymentTab() {
    if (this.publicInfo.memberAdminApprovalRequired == false) {
      this.paymentDiv = true;
    }
  }

  getMemberDetails() {
    this.addMemberForm = this.formBuilder.group({});
    let req = {
      path: "auth/formSteps/",
      isAuth: true,
    };
    this.spinner.show();
    let userDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.apiService.get(req).subscribe(response => {
      this.memberDetail = response['data'];
      this.maxTabIndex = this.memberDetail.length;
      this.memberDetail.forEach((item, index) => {
        if (index == 0) {
          this.openActiveTab(item);
        }
        this.addMemberForm.addControl('id', new FormControl(userDetail.id, Validators.required));
        item.fieldValues.forEach((value, index1) => {
          let fieldName = value.fieldName;
          this.filedValue = value.value;
          if (this.filedValue == null) {
            this.filedValue = '';
          }
          if (value.type == 'CHECK_BOX') {
            value.optionList = [];
            value.options.filter((op) => {
              value.optionList.push({'value': op, 'check': false});
            });
            let filedValue = this.filedValue.split(',');
            value.optionList.filter((list) => {
              filedValue.filter((op) => {
                if (op == list['value']) {
                  list['check'] = true;
                }
              });
            });
          }
          if (value.required == true) {
            if (value.type == 'URL')
            {
              this.validation = [Validators.required,Validators.pattern(this.urlPattern)];
            }else{
              this.validation = [Validators.required];
            }
          } else {
            if (value.type == 'URL')
            {
              this.validation = [Validators.pattern(this.urlPattern)];
            }else{
              this.validation = [];
            }
          }
          this.addMemberForm.addControl(fieldName, new FormControl(this.filedValue, this.validation));
        });
      });
      this.isMemberFormSubmitted = true;
      this.spinner.hide();
    });
  }

  addMemberFormSubmit(tabName:any,payment:any) {
    this.memberDetail.forEach((item, index) => {
      item.fieldValues.forEach((value, index1) => {
        let fieldName = value.fieldName;
        if (value.type == 'CHECK_BOX') {
          let checked = '';
          value['optionList'].filter((list) => {
            if (list['check'] == true) {
              checked += list['value'] + ',';
            }
          });
          if (value.required == true) {
            this.validation = [Validators.required];
          } else {
            this.validation = [];
          }
          this.addMemberForm.patchValue({
            fieldName: checked
          });
          this.addMemberForm.removeControl(fieldName);
          this.addMemberForm.addControl(fieldName, new FormControl(checked, this.validation));
          value.value = checked;
        }
      });
    });
    this.submitBtn = true
    let status = true;
      this.showArray.forEach((item, index) =>{
        if(this.addMemberForm.controls[item['fieldName']]['errors'])
        {
          this.toastrService.error('All * fields are required ');
          status = false;
        }
      });
      if(status == true)
    {
      if( payment == 'paymentDiv')
      {
        this.openPaymentTab();
      }else if(tabName != undefined)
      {
        this.openActiveTab(tabName);
      }else{
        let index = this.activeIndex + 1;
        this.openActiveTab(this.memberDetail[index]);
        this.submitBtn = false;
      }

    }
  }
  formSubmit()
  {
    this.memberDetail.forEach((item, index) => {
      item.fieldValues.forEach((value, index1) => {
        let fieldName = value.fieldName;
        if (value.type == 'CHECK_BOX') {
          let checked = '';
          value['optionList'].filter((list) => {
            if (list['check'] == true) {
              checked += list['value'] + ',';
            }
          });
          if (value.required == true) {
            this.validation = [Validators.required];
          } else {
            this.validation = [];
          }
          this.addMemberForm.patchValue({
            fieldName: checked
          });
          this.addMemberForm.removeControl(fieldName);
          this.addMemberForm.addControl(fieldName, new FormControl(checked, this.validation));
          value.value = checked;
        }
      });
    });
    if (this.addMemberForm.valid) {
      let formdata = {"fieldValues": this.addMemberForm.value}
      let data = {
        path: "auth/member/update/" + this.addMemberForm.value.id,
        data: formdata,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.addMember = false;
          this.isMemberFormSubmitted = false;
          this.toastrService.success(response['status']['description']);

        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    } else {
      this.toastrService.error('All * fields are required ');
    }
  }

  onPaymentStatus(response): void {
    this.formSubmit();
  }

  getPublicInfo() {
    let request = {
      path: 'auth/configuration/publicInfo',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.publicInfo = response['data'];
    });
  }

  getMembershipList() {
    let request = {
      path: 'auth/membershipType/details/' + this.typeId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.membershipDetail = response['data'];
      this.membershipDetail['plans'].forEach((i, j) => {
        if (i['durationType'] == 'LIFETIME') {
          this.price = i['price'];
          this.otherData = i;
        }
      });
    });
  }
}

