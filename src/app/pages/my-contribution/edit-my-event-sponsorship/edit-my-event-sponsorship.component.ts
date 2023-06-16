import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { SpinnerService } from "../../../services/spinner.service";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { EMAIL_PATTERN } from "../../../helpers/validations";

@Component({
  selector: 'app-edit-my-event-sponsorship',
  templateUrl: './edit-my-event-sponsorship.component.html',
  styleUrls: ['./edit-my-event-sponsorship.component.scss']
})
export class EditMyEventSponsorshipComponent implements OnInit {

  addSponsorForm: FormGroup;
  sponsorId = ''
  eventId = ''
  sponsorDetail: any = [];
  logo: any;
  showProfile: boolean = true
  isSubmit: boolean = false;
  logoList: any = [];
  validTypesImage = ['jpeg', 'jpg', 'png'];
  mediaUploadUrl = 'event/file/upload/file'

  constructor(public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {

    this.route.params.subscribe(params =>
      this.sponsorId = params['id']
    );

    this.addSponsorForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.pattern(EMAIL_PATTERN)]],
      phone: ['', [Validators.minLength(10)]],
      websiteUrl: [''],
      displayName: [''],
      addressLine1: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      companyName: [''],
      //anonymousDonation: [false],
    });
   }

  ngOnInit() {
    this.getSponsorshipDetail();
  }

  getSponsorshipDetail() {
    let request = {
      path: 'event/sponsorDetails/' + this.sponsorId,
      isAuth: true
    }

    this.apiService.get(request).subscribe(response => {
      console.log("res",response)
      this.sponsorDetail = response['data'];
     
      this.eventId = this.sponsorDetail['eventId']
      this.logo = this.sponsorDetail.logo
      if (this.logo != null && this.logo != '') {
        this.showProfile = true;
      } else {
        this.showProfile = false
      }

      let array = [];
      this.logoList = [];
      if (this.sponsorDetail.logo != '' && this.sponsorDetail.logo != null) {
        array.push(this.sponsorDetail.logo);
      }
      array.forEach((item, index) => {
        this.logoList[index] = [];
        this.logoList[index]['responseData'] = [];
        this.logoList[index]['responseData']['data'] = [];
        this.logoList[index]['responseData']['data']['url'] = item;
      });

      this.addSponsorForm.patchValue({
        firstName: this.sponsorDetail.firstName,
        lastName: this.sponsorDetail.lastName,
        email: this.sponsorDetail.email,
        phone: this.sponsorDetail.phone,
        websiteUrl: this.sponsorDetail.websiteUrl,
        displayName: this.sponsorDetail.displayName,
        companyName: this.sponsorDetail.companyName,
        addressLine1: this.sponsorDetail.addressLine1,
        city: this.sponsorDetail.city,
        state: this.sponsorDetail.state,
        zipCode: this.sponsorDetail.zipCode,
        //anonymousDonation: this.sponsorDetail.anonymousDonation,
      });
    })
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

  submit() {
    this.isSubmit = true;
    if (this.addSponsorForm.valid) {
      let formData = this.addSponsorForm.value;
      formData["donationType"] = "SPONSOR";
      formData['finalAmount'] = Number(formData['amount'])
      formData['eventId'] = this.eventId

      if (this.logoList[0]) {
        formData['logo'] = this.logoList[0]['responseData']['data']['url'];
      }else{
        formData['logo'] = '';
      }

      if ((formData['displayName'] == '' || formData['displayName'] == null) && (formData['logo'] == '' || formData['logo'] == null)) {
        this.toastrService.error("Please Select logo or fill Display Name!");
        return false;
      }

      let data = {
        path: "event/sponsorship/edit/" + this.sponsorId,
        data: formData,
        isAuth: true
      };

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.addSponsorForm.reset();
          this.isSubmit = false;
          this.router.navigate(['/my-contribution/event-my-sponsorship'])
        } else {
          this.toastrService.error(response['status']['description']);
          this.isSubmit = false;
        }
      });
    }
    else {
      this.toastrService.error("Please fill all required fields!");
    }
  }


  cancel() {
    this.router.navigate(['/my-contribution/event-my-sponsorship'])
  }

  removeLogo(){
    this.logoList = [];

    let data = {
      "link": this.logo,
    }

    let request = {
      path: 'event/file/delete',
      data: data,
      isAuth: true
    }

    this.apiService.post(request).subscribe(response => {
    });

    this.logo = '';
    this.showProfile = false
  }

  invalidUploadFile() {
    this.toastrService.error('Please upload only image file');
  }

  maxFileError() {
    this.toastrService.error('Maximum 1 file is allowed');
  }

  fileSizeError() {
    let request = {
      path: 'community/configuration/publicInfo',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.toastrService.error('Maximum ' + response['data']['imageMaxSize'] + 'MB size is allowed');
    });
  }

  uploadStarted() {
    this.spinner.show();
  }

  queueCompleted() {
    this.logo = this.logoList[0]['responseData']['data']['url'];
    this.showProfile = true;
    this.spinner.hide();
  }

}
