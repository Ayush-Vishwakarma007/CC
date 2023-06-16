import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SpinnerService } from "../../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { EMAIL_PATTERN } from "../../../helpers/validations";

@Component({
  selector: 'app-community-settings',
  templateUrl: './community-settings.component.html',
  styleUrls: ['./community-settings.component.scss']
})
export class CommunitySettingsComponent implements OnInit {

  communitySettingForm: FormGroup;
  bccList: any = [] = [{ bcc: '' }];
  isShow: boolean = false;
  communitySettings: any = [];
  isSubmit: boolean = false;

  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

    this.communitySettingForm = this.formBuilder.group({
      allowMultiCommitteeHighPriority: [false],
      allowStaticContactUs: [false],
      globalPaymentConfiguration:[false],
      contactEmail: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      contactFirstName: ['', Validators.required],
      contactLastName: ['', Validators.required],
      contactSupportForPayment: [''],
      imageMaxSize: ['1']
    })

  }

  ngOnInit() {
    this.getCommunitySetting();
  }

  getCommunitySetting() {
    let request = {
      path: "community/configuration/get",
      isAuth: true
    }
    this.apiService.get(request).subscribe(response => {
      this.communitySettings = response['data'];
      if (this.communitySettings != null) {
        this.communitySettingForm.patchValue({
          allowMultiCommitteeHighPriority: this.communitySettings.allowMultiCommitteeHighPriority,
          allowStaticContactUs: this.communitySettings.allowStaticContactUs,
          contactEmail: this.communitySettings.contactEmail,
          contactFirstName: this.communitySettings.contactFirstName,
          globalPaymentConfiguration:this.communitySettings.globalPaymentConfiguration,
          contactLastName: this.communitySettings.contactLastName,
          contactSupportForPayment: this.communitySettings.contactSupportForPayment,
          imageMaxSize: this.communitySettings.imageMaxSize
        });
      }

      if(this.communitySettings.allowStaticContactUs){
        this.isShow = true
      }

      this.bccList = [];
      this.communitySettings.bcc.forEach((item, index) => {
        this.bccList.push({ bcc: item })
      })

    });
  }

  submit() {
    this.isSubmit = true;

    if (this.communitySettingForm.value.allowStaticContactUs) {
      if (!this.communitySettingForm.valid) {
        this.toastrService.error('Please fill all required fields.');
        return false;
      }
    }

    if (this.communitySettingForm.value.imageMaxSize <= 0) {
      this.toastrService.error('Please enter valid image size');
      return false;
    }

    let formData = this.communitySettingForm.value

    let bccItemList = this.bccList.filter(item => item.bcc !== '');
    let bcc = []
    if (bccItemList.length != 0) {
      bccItemList.filter(function (item) {
        bcc.push(item.bcc)
      })
      formData['bcc'] = bcc
    }

    let request = {
      path: "community/configuration/update",
      data: formData,
      isAuth: true
    }

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

  allowContact(event) {
    if (event.checked) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  emailValidation(email) {
    let test = EMAIL_PATTERN.test(email);
    if (!test) {
      this.toastrService.error('Please enter valid email')
    }
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

  charOnly(evt): boolean {
    var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode :
      ((evt.which) ? evt.which : 0));
    if (charCode > 32 && (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }


}
