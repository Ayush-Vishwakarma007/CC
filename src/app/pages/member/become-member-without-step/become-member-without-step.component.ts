import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Observable, Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {CommunityDetailsService} from "../../../services/community-details.service";
import {ApiService} from "../../../services/api.service";
import {SpinnerService} from "../../../services/spinner.service";
import {EMAIL_PATTERN} from "../../../helpers/validations";
import { UsernameValidator } from '../../../helpers/whitespaceValidator';

@Component({
  selector: 'app-become-member-without-step',
  templateUrl: './become-member-without-step.component.html',
  styleUrls: ['./become-member-without-step.component.scss']
})
export class BecomeMemberWithoutStepComponent implements OnInit {

  modalRef: BsModalRef;
  
  userForm: FormGroup;
  loginForm: FormGroup;

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() currentStepChange: EventEmitter<any> = new EventEmitter();
  @Output() checkoutArrayChange: EventEmitter<any> = new EventEmitter();
  membershipDetail: any = [];
  chapterList: any = [];
  chapterId = '';
  duration:any =[];
  durationTypeList: any = [];
  checkoutArray: any = [];
  nonce:any=[]
  paymentType = ''
  publicKey='';
  submitted: boolean = false;
  alertText = ''
  acceptTerms: boolean = false;
  @Input()
  title = ''
  paymentSubject: Subject<any> = new Subject(); 
  formatedAddress = '';
  location:any = [];
  maploc = {
    componentRestrictions: {country: 'US'}
  };
  showPayment = false;
  durationCount = true;
  constructor(private router:Router,private modalService: BsModalService, public _location: Location, public communityService: CommunityDetailsService,public spinner: SpinnerService, private toastrService: ToastrService, public apiService: ApiService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      lastName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      phone: ['',[Validators.required]],
      countryPhoneCode:[''],
      email: ['', [Validators.required,Validators.pattern(EMAIL_PATTERN), UsernameValidator.removeSpaces]],
      middleName:[''],
      city:['',[Validators.required]],
      addressLine1:['',[Validators.required]],
      addressLine2:[''],
      zipCode:[''],
      state:['',[Validators.required]]
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    let chapter = JSON.parse(localStorage.getItem("chapter"));
    if (chapter) {
      this.checkoutArray['chapterId'] = chapter['id'];
    }
  }

  ngOnInit() {
    this.getDurationType();
    this.getChapterList();
    this.getPaymentMethod();
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
  public handleAddressChange(address: any) {
    this.formatedAddress = address.formatted_address;
    let city = '';
    let region = '';
    let country = '';
    let zipCode = '';
    for (let i = 0; i < address.address_components.length; i++) {
      if (address.address_components[i].types[0] == "locality") {
        city = address.address_components[i].long_name;
      }
      if (address.address_components[i].types[0] == "administrative_area_level_1") {
        region = address.address_components[i].long_name;
      }
      if (address.address_components[i].types[0] == "country") {
        country = address.address_components[i].long_name;
      }
      if (address.address_components[i].types[0] == "postal_code") {
        zipCode = address.address_components[i].long_name;
      }
    }
    this.location= [];
    this.location.push( address.geometry.location.lat());
    this.location.push( address.geometry.location.lng());
    address.geometry.location.lat();
    this.userForm.patchValue({
      addressLine1: this.formatedAddress,
      city: city,
      state: region,
      country: country,
      zipCode: zipCode,
    });
  }

  getDurationType() {
    let request = {
      path: 'auth/membershipType/durationType',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.durationTypeList = response['data'];
        resolve(null);
      });
    });
  }

  checkUserDetail() {
    if (this.userForm.value.phone) {
      let phone = this.userForm.value.phone;
      if (this.userForm.value.phone.length >= 17) {
        phone = phone.slice(0, -1);
      }
      phone = phone.replace('(', '');
      phone = phone.replace(')', '');
      phone = phone.replace(' ', '');
      phone = phone.replace(/[^0-9\.]+/g, "");
      this.userForm.patchValue({
        phone: phone
      })
    }
    if (this.userForm.valid) {
      let userCheckValue = {};
      userCheckValue['userName'] = this.userForm.value.firstName+" "+this.userForm.value.lastName;
      userCheckValue['email'] = this.userForm.value.email;
      userCheckValue['phone'] = this.userForm.value.phone;
      let regData = {
        path: "auth/user/check",
        data: userCheckValue,
        isAuth: false
      };
      this.apiService.postWithoutToken(regData).subscribe(response => {
        if(response['data'].phone == true && this.title =="Member"){
          this.toastrService.error('Phone number is already exists');
          return false;
        }else if(response['data'].email == true && this.title =="Member"){
          this.toastrService.error('Email address is already exists ');
          return false;
        }else{
          this.checkoutArray['userDetail'] = {}
          this.checkoutArray['userDetail']['firstName'] = this.userForm.value.firstName;
          this.checkoutArray['userDetail']['middleName'] = this.userForm.value.middleName;
          this.checkoutArray['userDetail']['lastName'] = this.userForm.value.lastName;
          this.checkoutArray['userDetail']['email'] = this.userForm.value.email;
          this.checkoutArray['userDetail']['phone'] = this.userForm.value.phone;
          this.checkoutArray['userDetail']['countryPhoneCode'] = "+1";
          this.checkoutArray['userDetail']['addressLine1'] = this.userForm.value.addressLine1;
          this.checkoutArray['userDetail']['addressLine2'] = this.userForm.value.addressLine2;
          this.checkoutArray['userDetail']['city'] = this.userForm.value.city;
          this.checkoutArray['userDetail']['state'] = this.userForm.value.state;
          this.checkoutArray['userDetail']['zipCode'] = this.userForm.value.zipCode;
          let authDetail = JSON.parse(localStorage.getItem("authDetail"));
          return true;
        }
      });
    } else {
      this.toastrService.error('All * fields are required')
      return false;
    }
  }
  /*getChapterList() {
    let request = {
      path: 'community/chapters',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.chapterList = response['data'];
      this.checkoutArray['chapterList'] = response['data'];
      this.chapterList = this.chapterList.filter((data) => data['mainChapter'] != true);
      if(response['data'].length==1){
        this.checkoutArray['chapterDetail'] =  response['data'][0];
        //this.chapterId= this.chapterList[0]['name'];
      }
      if (this.checkoutArray['chapterId']) {
        let list = this.chapterList.filter((data) => data['id'] == this.chapterId)[0];
        if (!list) {
          if (this.chapterList[0]) {
          }
        }
      } else {
        if (this.chapterList[0]) {
        }
      }
      this.checkoutArray['chapterId'] = this.chapterId;
      this.changeChapter();
    });
  }*/

  getChapterList() {
    let request = {
      path: 'community/chapters',
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.get(request).subscribe(response => {
      this.checkoutArray['chapterList'] = response['data'];
      if (this.checkoutArray['chapterId']) {
        this.checkoutArray['chapterId'] = this.checkoutArray['chapterId']
        let list = this.checkoutArray['chapterList'].filter((data) => data['id'] == this.checkoutArray['chapterId'])[0];
        if (list) {
            this.checkoutArray['chapterDetail'] = list;
          }
        this.getPaymentMethod();
        this.spinner.hide();

      }
    });
  }

  changeChapter() {
    let list = this.chapterList.filter((data) => data['id'] == this.chapterId)[0];
    if (list) {
      this.checkoutArray['chapterDetail'] = list;
    } else {
      //this.toastrService.error('Please Select Any Chapter')
    }
  }

  changeTypeTab(event) {
    this.getMembershipList(event.tab.textLabel);
  }

  getMembershipList(type) {
    this.duration = (type.split("_"));
    let path;
    // if(this.duration[1]=="true"){
    //   path = 'auth/membershipType/getAll?durationType=' + this.duration[0]+'&duration=' +this.duration[2];
    // }else{
    //   path = 'auth/membershipType/getAll?durationType=' + this.duration[0];
    // }
    if(this.duration[1]=="true"){
      path = 'auth/membershipType/getAll?duration=' +this.duration[2];
    }else{
      path = 'auth/membershipType/getAll';
    }
    let request = {
      path: path,
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.get(request).subscribe(response => {
      
      if (response['status']['code'] == 'OK') {
        this.membershipDetail = response['data'];
        this.membershipDetail.map((data, index) => {
          data['plans'].map((plan, i) => {
            if (plan['durationType'] == type) {
              this.membershipDetail[index]['price'] = plan['price'];
              this.membershipDetail[index]['planId'] = plan['id'];
            }
          })
        });
        this.membershipDetail = this.membershipDetail.filter((data) => data['disabled']==false);
        this.changePlan()
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    });
  }

  changePlan() {
    let list = this.membershipDetail.filter((data) => data['id'] == this.checkoutArray['selectedMembershipId'])[0];
    if (list) {
      this.checkoutArray['selectedPlan'] = list;
    }
    
    this.calculateAmount()
  }
  
  getPaymentMethod() {
    if (this.checkoutArray['chapterDetail']) {
      let request = {
        path: 'auth/configuration/paymentMethod/' + this.checkoutArray['chapterDetail']['id'],
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        this.checkoutArray['paymentMethod'] = response['data'];
        // this.checkoutArray['paymentMethod'] = this.checkoutArray['paymentMethod'].filter((data) => data.value != 'CLOVER_PAYMENT');
        if (this.checkoutArray['paymentMethod'][0]) {
          this.paymentType = this.checkoutArray['paymentMethod'][0]['value'];
          this.checkoutArray['achPayment'] = this.checkoutArray['paymentMethod'][0]['achPayment'];
        } else {
          this.paymentType = '';
        }
        this.checkoutArray['paymentType'] = this.paymentType;
      });
    }

  }
  changeTypeTabPayment(event){

    this.paymentType=event.tab.textLabel;

    this.checkoutArray['paymentType']= this.paymentType;
    if(event.tab.templateLabel.viewContainerRef._view.oldValues[0] =='true'){
      this.checkoutArray['achPayment']= true;
    }else{
      this.checkoutArray['achPayment']= false;

    }

    if (this.paymentType != 'AFFINY_PAY'&& this.paymentType != 'SQUARE_PAYMENT' && this.paymentType != 'CLOVER_PAYMENT') {
      this.publicKey = '';
      delete this.checkoutArray['nonce']
      return false;
    }

      this.getKey();
  }

  checkNonce(){
    console.log("dsnkdnks");
  }

  getPayemnt(){
    let finaldata=[]
     finaldata = this.checkoutArray
    console.log(this.checkUserDetail())
    if (this.userForm.valid) {
      if (this.acceptTerms == false) {
        this.toastrService.error('Accept Terms & Conditions');
        return false;
      }  else {
        this.checkUserDetail()
        console.log("dsfnjndfjk");
        this.spinner.show();
        // if(this.checkoutArray['achPayment']){
        //   this.paymentSubject.next('data');
        // }else{
        //   console.log('bbpppp');
        //   setTimeout(() => {
        //     this.paymentSubject.next('data');
        //   }, 100);
        // }
        if(this.checkoutArray['selectedMembershipId']){        
          // if (this.checkoutArray['paymentType'] == 'CLOVER_PAYMENT' || this.checkoutArray['paymentType'] == 'AFFINY_PAY') {
          //   if (!this.checkoutArray['nonce']) {
          //     this.toastrService.error('Please enter valid value');
          //     this.spinner.hide();
          //     return false;
          //   }
          // } else {
          //   delete this.checkoutArray['nonce']
          // }
          this.paymentSubject.next('data');
          setTimeout(() => {
            this.spinner.show();
            this.submitted = true;
            let formdata = {};
            formdata['achPayment'] = this.checkoutArray['achPayment']
            formdata['discountCode'] = this.checkoutArray['discountCode'];
            if(this.checkoutArray['paymentType']=='SQUARE_PAYMENT'){
              formdata['nonce'] = this.checkoutArray['square'];
            }
            else{
              formdata['nonce'] = this.checkoutArray['square'];
            }
            formdata['nonce'] = this.checkoutArray['square'];
            formdata['signUpRequest'] = this.checkoutArray['userDetail'];
            //formdata['signUpRequest']['relation'] = 'SELF';
            formdata['signUpRequest']['chapterId'] = this.checkoutArray['chapterDetail']['id'];
  
            formdata['membershipTypeId'] = this.checkoutArray['selectedMembershipId'];
            formdata['paymentMethod'] = this.checkoutArray['paymentType'];
            formdata['planId'] = this.checkoutArray['selectedPlan']['plans'][0]['id'];
            formdata['showInDirectory'] = true;
            
        console.log("dsfnjndfjk");
            let request = {
              path: 'auth/member/register',
              data: formdata,
              isAuth: true,
            };
            this.apiService.post(request).subscribe(response => {
              if (response['status']['code'] == 'OK' || response['status']['code'] == 'CREATED') {
                ///this.toastrService.success(response['status']['description']);
                this.alertText = response['status']['description'];
                if (response['data']['url'] != null) {
                  window.location.href = response['data']['url'];
                } else {
                  this.spinner.hide();
                  $('#openSuccessModel').click();
                }
              } else {
                this.spinner.hide();
                this.toastrService.error(response['status']['description']);
              }
              this.spinner.hide();
            });
            
          }, 2000);
        }else{
          this.toastrService.error('Please select any plan');
          this.spinner.hide();
        }
      }
    }else {
      this.toastrService.error('All * fields are required')
      return false;
    }
    
  }

  getKey(){
    this.getPaymentMethod()
    let request = {
      path: 'auth/configuration/publicPaymentConfig/' + this.checkoutArray['chapterId'] + '/SQUARE_PAYMENT' +'?achPayment=false',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        if(this.paymentType == "CLOVER_PAYMENT"){
          this.publicKey = response['data']['apiAccessKey'];
        }else if(this.paymentType == "SQUARE_PAYMENT"){
          this.publicKey = response['data']['applicationId'];
        }
        else{
          this.publicKey = response['data']['merchantId'];
        }
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  calculateAmount() {
    let postData = {};
    if (this.checkoutArray['selectedPlan']) {
      postData['membershipTypeId'] = this.checkoutArray['selectedPlan']['id'];
      postData['planId'] = this.checkoutArray['selectedPlan']['plans'][0]['id'];
      postData['discountCode'] = this.checkoutArray['discountCode']
      let request = {
        path: 'auth/member/calculateAmount',
        data: postData,
        isAuth: true,
      };
      this.apiService.post(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.checkoutArray['summery'] = [];
          let detail = [];
          detail['name'] = this.checkoutArray['selectedPlan']['name'];
          detail['value'] = response['data']['totalAmount']
          this.checkoutArray['summery'].push(detail);
          if (response['data']['discountCode']) {
            let discount = [];
            discount['name'] = 'Discount';
            discount['value'] = response['data']['discount']
            this.checkoutArray['summery'].push(discount);
          }
          let tax = [];
          tax['name'] = 'Tax';
          tax['value'] = response['data']['tax']
          this.checkoutArray['summery'].push(tax);
          this.checkoutArray['finalAmount'] = response['data']['finalAmount'];
          this.showPayment = true;
    
          this.getKey()
          this.spinner.hide();

        }
        else {
          this.toastrService.error(response['status']['description'])
        }
      });
    }
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      {backdrop: 'static', ignoreBackdropClick: false, class: 'gray modal-md payment-success-new'}
    );
  }

  return() {
    this.modalRef.hide();
    this.router.navigate(['/']);
  }

  goBack()
  {
    this.router.navigate(['/']);
  }
}
