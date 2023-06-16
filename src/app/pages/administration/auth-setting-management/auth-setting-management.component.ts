import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SpinnerService } from "../../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { EMAIL_PATTERN } from "../../../helpers/validations";
// import {botUserAgents} from "rendertron-middleware";


@Component({
  selector: 'app-auth-setting-management',
  templateUrl: './auth-setting-management.component.html',
  styleUrls: ['./auth-setting-management.component.scss']
})
export class AuthSettingManagementComponent implements OnInit {


  authForm: FormGroup;
  rejectionReasonList: any[] = [{ reason: '' }];
  bccList: any = [] = [{ bcc: '' }];
  isSubmit: boolean = false;
  authSettingInfo: any = [];
  fieldList: any[] = [{generationType: '', value: '',length :0}];
  samplePreview : any;
  generationTypeList: any = [];
  generationMethodList: any = [];
  globalNumberGeneration:boolean = false;
  separators:any=[];
  divHideShow:boolean =false;
  isClicked:boolean =false;
  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

    this.authForm = this.formBuilder.group({
      memberAdminApprovalRequired: [false],
      textVerification: [false],
      emailVerification: [false],
      allowGuest: [false],
      globalNumberGeneration:[false],
      tokenLength: ['6', Validators.required],
      sequentialGenerationNumber:['1',Validators.required],
      memberNumberLength: ['6', Validators.required],
    })
  }

  ngOnInit() {
    this.getAuthSetting();
    this.getNumberGenerationType();
    this.getNumberGenerationMethod();
    this.getNumberSeparators();
  }

  getNumberGenerationMethod() {
    let request = {
      path: 'auth/numberGenerationMethod',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.generationMethodList = response['data'];
    });
  }
  getNumberSeparators() {
    let request = {
      path: 'auth/configuration/formatSeparators',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.separators = response['data'];
    });
  }
  getNumberGenerationType() {
    let request = {
      path: 'auth/numberGenerationType',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.generationTypeList = response['data'];
    });
  }
  getAuthSetting() {
    let request = {
      path: "auth/configuration/getDetails",
      isAuth: true
    }
    this.apiService.get(request).subscribe(response => {
      this.authSettingInfo = response['data'];
      if (this.authSettingInfo != null) {
        this.authForm.patchValue({
          memberAdminApprovalRequired: this.authSettingInfo.memberAdminApprovalRequired,
          textVerification: this.authSettingInfo.textVerification,
          emailVerification: this.authSettingInfo.emailVerification,
          allowGuest: this.authSettingInfo.allowGuest,
          tokenLength: this.authSettingInfo.tokenLength,
          memberNumberLength: this.authSettingInfo.memberNumberLength,
          globalNumberGeneration:this.authSettingInfo.globalNumberGeneration,
          sequentialGenerationNumber:this.authSettingInfo.sequentialGenerationNumber
        });
      }
      if(this.authSettingInfo.globalNumberGeneration==true){
        this.divHideShow =true;
      }else{
        this.divHideShow =false;
      }
      this.rejectionReasonList = [];
      this.authSettingInfo.rejectionReasons.forEach((item, index) => {
        this.rejectionReasonList.push({ reason: item });
      });
      this.fieldList=[];
      this.authSettingInfo.numberFormatGenerators.forEach((item, index) => {
        this.fieldList.push({generationType: item.generationType, value: item.value,length :item.length});
      });
      this.getPreviewAll();
      this.bccList = [];
      this.authSettingInfo.bcc.forEach((item, index) => {
        this.bccList.push({ bcc: item })
      })

    });
  }
   onIsFollowUpChanged(value: boolean): void {
    if(value==true){
      this.divHideShow =true;
    }else{
      this.divHideShow =false;
    }
    this.globalNumberGeneration = value;
  }
  addDynamicField() {
    this.fieldList.push({generationType: '', value: '',length :0});
  }
  removeField(i) {
    this.fieldList.splice(i, 1);
  }
  getPreviewAll()
  {
    let fieldList = this.fieldList.filter(item => item.generationType !== '' && item.value !== '');
    let data = {
      'numberFormatGenerators':fieldList,
    };

    let request = {
      path: 'auth/membershipType/numberFormat/',
      data : data,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK' || response['status']['code'] == 'UPDATED' || response['status']['code'] == 'CREATED')
      {
        this.samplePreview = response['data']['memberNumber'];
      }else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }
  submit() {
    this.isSubmit = true;

    if (this.authForm.valid) {
      let fieldList = this.fieldList.filter(item => item.generationType !== '' && item.value !== '');

      let formData = this.authForm.value
      let rejectionList = this.rejectionReasonList.filter(item => item.reason !== '');
      if(formData['globalNumberGeneration'] == true) {
        if (fieldList.length == 0) {
          this.toastrService.error('Please Select Filed Type');
        }
      }
        formData['numberFormatGenerators'] = fieldList;

      let reasons = []
      if (rejectionList.length != 0) {
        rejectionList.filter(function (item) {
          reasons.push(item.reason)
        })
        formData['rejectionReasons'] = reasons
      }

      let bccItemList = this.bccList.filter(item => item.bcc !== '');
      let bcc = []
      if (bccItemList.length != 0) {
        bccItemList.filter(function (item) {
          bcc.push(item.bcc)
        })
        formData['bcc'] = bcc
      }

      console.log(formData);
      let request = {
        path: "auth/configuration/update",
        data: formData,
        isAuth: true
      }

      if(this.isClicked==true || this.authForm.dirty==true) {

      this.apiService.post(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.isSubmit = false;
        }
        else {
          this.toastrService.error(response['status']['description']);
          this.isSubmit = false;
        }
      })
    }
    }
    else {
      this.toastrService.error('Please fill all required fields.');
    }
  }

  emailValidation(email) {
    let test = EMAIL_PATTERN.test(email);
    if (!test) {
      this.toastrService.error('Please enter valid email')
    }
  }

  addReason() {
    this.rejectionReasonList.push({ reason: '' });
  }

  removeLastReason(i) {
    this.rejectionReasonList.splice(i, 1);
  }

  addBCC() {
    this.bccList.push({ bcc: '' });
  }

  removeLastBCC(i) {
    this.bccList.splice(i, 1);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }


  clickEvent(event) {
    if(event=true) {
      this.isClicked=true;
      console.log(this.isClicked);
    }
  }

}
