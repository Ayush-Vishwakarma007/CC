import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import {debounceTime} from "rxjs/operators";
import { EMAIL_PATTERN } from 'src/app/helpers/validations';
import { ApiService } from 'src/app/services/api.service';
import { CommunityDetailsService } from 'src/app/services/community-details.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { DecimalPipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-sponsor-donor-checkout-without-steps',
  templateUrl: './sponsor-donor-checkout-without-steps.component.html',
  styleUrls: ['./sponsor-donor-checkout-without-steps.component.scss']
})
export class SponsorDonorCheckoutWithoutStepsComponent implements OnInit {

  checkoutArray: any = [];
  modalRef: BsModalRef;
  uploadedFlyer: any = [];
  uploadedLogo: any = [];
  type: any
  authDetail:any
  minAmount = 1;
  id: any;
  paymentType='';
  publicKey='';
  title: string;
  userForm: FormGroup;
  loginForm: FormGroup;
  eventId: string;
  chapterList: any = [];
  categoryList: any = [];
  eventDetail: any = [];
  isAnonymous : boolean = false;
  acceptTerms: boolean = false;
  submitted: boolean = false;
  changedEmail:any;
  amount : any;
  checkValue : any;
  completeAddress : string;
  isLogin: boolean = false;
  promoBox: FormControl = new FormControl('');
  maploc = {
    componentRestrictions: {country: 'US'}
  };
  userData: any;
  locationId = '';
  chapterId: string;
  alertText: any;
  isPaymentMode : boolean = false;
  termsAndCondition: any;
  paymentSubject: Subject<any> = new Subject();
  paymentsSubject:Subject<any> = new Subject();
  userDetail : {}

  constructor( private route : ActivatedRoute,
               private fb: FormBuilder,
               private router : Router,
               private modalService : BsModalService,
               private toastrService: ToastrService,
               private apiService: ApiService,
               private spinner : SpinnerService,
               private communityService : CommunityDetailsService,
               private currencyPipe: CurrencyPipe) 
  // constructor
  { 
    this.userForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      middleName: [''],
      lastName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      phone: [''],
      email: ['', [Validators.pattern(EMAIL_PATTERN)]],
      addressLine1: ['', [Validators.required]],
      city: [''],
      state: [''],
      zipCode: ['', ],
      companyName: [null],
      companyWebsite: [null],
      displayName: [null],
      stayAnonymous: [false],
      flyer: [null],
      logo: [null],
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getAuthDetail();
    if(this.checkoutArray['userDetail']){
      this.pathValueToCheckoutArray();
    }
    if(this.checkoutArray['type'] === 'chapter'){
      console.log("Type chapter is true")
      this.chapterId = this.checkoutArray['id'];
      this.isAnonymousDonation();
      this.getChapterList();
    }else{
      this.getEventDetail();
    }
  }  

  getEventDetail() {
    this.spinner.show();
    let request = {
      path: "event/details/" + this.checkoutArray['id'],
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.eventDetail = response['data'];
          this.eventDetail.paymentMethod = [];
          Object.keys(this.eventDetail.paymentMethods).map((index) => {
            this.eventDetail.paymentMethod.push({value: index, name: this.eventDetail.paymentMethods[index]});
          });
          this.checkoutArray['eventDetail']=this.eventDetail;
          this.getCategoryList();
        }
        this.spinner.hide();
        console.log("Event Detail: ",this.eventDetail)
      });
      resolve(null);
    });
  }

  return() {
    this.modalRef.hide();
    localStorage.removeItem("eventUrl")
    this.router.navigate(['/home']);
  }

  getEvent(){
    let data = {
      path: "event/details/"+this.checkoutArray['id'],
      isAuth: true,
    };
    this.apiService.get(data).subscribe(response => {
      if(this.checkoutArray['type'] == 'chapter'){
        this.termsAndCondition =this.communityService.communityDetail.memberTermsAndConditions;
      }else{
        this.termsAndCondition = response['data']['termsAndCondition'];
      }
    });
  }

  getAuthDetail(){
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    if (authDetail) {
      this.checkoutArray['userDetail'] = authDetail;
      console.log("AuthDetail: ", this.checkoutArray)
      this.authDetail = authDetail
    }

    this.route.params.subscribe(params => {
        this.id = params['id'];
        this.type = params['type'];
        console.log(this.id,this.type,this.route)
      }
    );

    this.checkoutArray['id'] = this.id;
    this.checkoutArray['type'] = this.type;
    
    this.route.pathFromRoot[1].url.subscribe(val => {
        this.checkoutArray['url'] = val[0].path;
        console.log(val[0].path)
      }
    );
    if (this.checkoutArray['url'] == 'donor-checkout-without-steps') {
      this.title = 'Donor';
    } else {
      this.title = 'Sponsor';
    }
  }

  goBack()
  {
    if(this.checkoutArray['type'] == 'chapter') {
      this.router.navigate(['/']);
    }
    else {
      this.router.navigate(['/event-details/' + this.id]);
    }
  }

  displayName(){
    this.userForm.patchValue({
      displayName: this.userForm.value.firstName
    });
  }
  displayName1()
  {
    this.userForm.patchValue({
      displayName: this.userForm.value.firstName+ ' ' +this.userForm.value.middleName
    });
  }
  displayName2(){
    this.userForm.patchValue({
      displayName: this.userForm.value.firstName+ ' ' +this.userForm.value.middleName + ' ' +this.userForm.value.lastName
    });
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'gray modal-md login-modal-main'})
    );
  }

  pathValueToCheckoutArray(){
    this.userForm.patchValue({
      firstName: this.checkoutArray['userDetail']['firstName'],
      email: this.checkoutArray['userDetail']['email'],
      phone: this.checkoutArray['userDetail']['phone'],
      middleName: this.checkoutArray['userDetail']['middleName'],
      lastName: this.checkoutArray['userDetail']['lastName'],
      addressLine1: this.checkoutArray['userDetail']['addressLine1'],
      city: this.checkoutArray['userDetail']['city'],
      state: this.checkoutArray['userDetail']['state'],
      zipCode: this.checkoutArray['userDetail']['zipCode'],
    });
    if(!this.isAnonymous){
      if(this.checkoutArray['userDetail']['middleName']==null){
        this.userForm.patchValue({
          displayName:this.checkoutArray['userDetail']['firstName']  + ' '+this.checkoutArray['userDetail']['lastName']
        });  
      }
      else{
        this.userForm.patchValue({
        displayName:this.checkoutArray['userDetail']['firstName'] + ' '+this.checkoutArray['userDetail']['middleName'] + ' '+this.checkoutArray['userDetail']['lastName']
        });
      }
    }
    
    this.checkUserDetail();
  }

  onChangeEmail(emailValue){
    this.userForm.value.email = emailValue;
    this.checkUserDetail();
  }

  checkUserDetail() {
    if (this.userForm.value.phone) {
      let phone = this.userForm.value.phone;
      this.checkValue += 1;
      if (this.userForm.value.phone.length >= 17) {
        phone = phone.slice(0, -1);
      }
      phone = phone.replace('(', '');
      phone = phone.replace(')', '');
      phone = phone.replace(' ', '');
      phone = phone.replace(/[^0-9\.]+/g, "");
      this.userForm.patchValue({
        phone: phone
      });
    }
    if (this.uploadedFlyer[0]) {
      this.userForm.patchValue({
        flyer: this.uploadedFlyer[0]['responseData']['data']['imageUrl']
      });
    } else {
      this.userForm.patchValue({
        flyer: null
      });
    }
    console.log(this.uploadedLogo)
    if (this.uploadedLogo[0]) {
      console.log("hello")
      this.userForm.patchValue({
        logo: this.uploadedLogo[0]['responseData']['data']['imageUrl']
      });
    } else {
      this.userForm.patchValue({
        logo: null
      });
    }

    if (this.userForm.valid) {
      this.checkoutArray['userDetail'] = {}
      this.checkoutArray['userDetail']['firstName'] = this.userForm.value.firstName;
      this.checkoutArray['userDetail']['lastName'] = this.userForm.value.lastName;
      this.checkoutArray['userDetail']['middleName'] = this.userForm.value.middleName;
      this.checkoutArray['userDetail']['email'] = this.userForm.value.email;
      this.checkoutArray['userDetail']['phone'] = this.userForm.value.phone;
      if(this.userForm.value.middleName!=null){
        this.checkoutArray['userDetail']['displayName'] = this.userForm.value.firstName +' ' +this.userForm.value.middleName+' ' + this.userForm.value.lastName;
      }
      else{
        this.checkoutArray['userDetail']['displayName'] = this.userForm.value.firstName  + this.userForm.value.lastName;
      }
      if(this.userForm.value.stayAnonymous){
        this.isAnonymous = true;
        this.checkoutArray['userDetail']['anonymousDonation'] = this.userForm.value.stayAnonymous;
      }
      this.checkoutArray['userDetail']['flyer'] = this.userForm.value.flyer;
      this.checkoutArray['userDetail']['logo'] = this.userForm.value.logo;
      this.calculateAmount();
      return true;
    } else {
      if(this.checkValue > 1){
        this.toastrService.error('All field are required')
        return false;
      }
      return false;
    }
  }

  isNumeric(value: any): boolean {
      return /^\d+$/.test(value);
  }

  login() {
    let email = null;
    let mobile = null;

    if (this.loginForm.invalid) {
      this.toastrService.error('Fill all fields');



    } else {

      let loginData = this.loginForm.value;
      if (this.isNumeric(loginData.email)) {
        mobile = loginData.email.trim();
      } else {
        email = loginData.email.trim();
      }

      let data = {
        path: "auth/user/login",
        data: {
          "email": email,
          "latestRequestSource": "WEB",
          "password": btoa(loginData.password),
          "phone": mobile
        },
        isAuth: false,
      }

      this.apiService.postWithoutToken(data).subscribe(response => {

        this.userData = response['data'];
        if (response['status']['status'] == "VERIFY") {

          localStorage.setItem('token', JSON.stringify(this.userData.apiInteraction));
        } else if (response['status']['status'] == "SUCCESS") {
          this.isLogin = true;
          localStorage.setItem('authDetail', JSON.stringify(this.userData));
          localStorage.setItem('token', JSON.stringify(this.userData.apiInteraction));
          localStorage.setItem('login', JSON.stringify(this.isLogin));
          localStorage.setItem('showPopup', 'true');
          this.toastrService.success(response['status']['description']);
          location.reload();

        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
  }
  
  isAnonymousDonation(){
    this.userForm.controls['stayAnonymous'].valueChanges.subscribe((value) => {
      if (value) {
        this.isAnonymous = true;
          if (this.authDetail) {
            this.userDetail = {}; 
            this.userDetail['firstName'] = this.userForm.value.firstName;
            this.userDetail['middleName'] = this.userForm.value.middleName;
            this.userDetail['lastName'] = this.userForm.value.lastName;
            this.userDetail['phone'] = this.userForm.value.phone;
            this.userDetail['addressLine1'] = this.userForm.value.addressLine1;
            console.log('User Detail: ', this.userDetail);
          }
            this.userForm.get('firstName').setValue("");
            this.userForm.get('middleName').setValue("");
            this.userForm.get('lastName').setValue("");
            this.userForm.get('phone').setValue("");
            this.userForm.get('addressLine1').setValue("");
            this.checkoutArray['userDetail']['anonymousDonation'] = true;
      } else {
        if(this.authDetail){
            this.isAnonymous = false;
            this.userForm.get('firstName').setValue(this.userDetail['firstName']);
            this.userForm.get('middleName').setValue(this.userDetail['middleName']);
            this.userForm.get('lastName').setValue(this.userDetail['lastName']);
            this.userForm.get('phone').setValue(this.userDetail['phone']);
            this.userForm.get('addressLine1').setValue(this.userDetail['addressLine1']);
            this.checkoutArray['userDetail']['anonymousDonation'] = true;
        }else{
            this.isAnonymous = false;
            this.checkoutArray['userDetail']['anonymousDonation'] = false;
        }
      }
    });
  }

  getChapterList() {
    let request = {
      path: 'community/chapters',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.chapterList = response['data'];
      console.log("ChapterList: ", this.chapterList);
      if (this.chapterId == '') {
        this.chapterId = this.chapterList[0]['id'];
      }
      this.changeChapter();
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  changeAmount(list) {
    this.amount = list['amount'];
    if(list['amount'] < 1){
      this.toastrService.warning("$1 is required");
      this.amount = 1;
      return;
    }

    list['amount'] = JSON.stringify(list['amount']);
    list['amount'] = parseFloat(list['amount'])
    if (list['amount'] >= list['range']['min'] && list['amount'] <= list['range']['max']) {
      list['amount'] = parseFloat(list['amount'])
    } else {
      list['amount'] = list['range']['min']
    }
    this.checkoutArray['details'] = list;
    console.log("This is List: ",list);
    this.calculateAmount();
    this.getPaymentMethod();

    list['amount'] = this.amount.toString();
  }

  handleAddressChange(address: any) {
    this.userForm.get('addressLine1').setValue(address.formatted_address);
  }

  changeChapter() {
    let list = this.chapterList.filter((data) => data['id'] == this.chapterId)[0];
    if (list) {
      this.checkoutArray['chapterDetail'] = list;
      console.log("ChapterDetail: ", this.checkoutArray['chapterDetail'] )
      this.checkoutArray['id'] = this.chapterId;
      console.log("Change Chapter True :")
      this.getCategoryList();
     // this.modalRef.hide();
    } else {
      this.toastrService.error('Please select any chapter')
    }
    console.log("Chapter Detail Added: ", list);
  }

  getCategoryList() {
    let path = '';
    console.log(this.checkoutArray['url'])
    if (this.checkoutArray['type'] == 'event') {
      if (this.checkoutArray['url'] == 'sponsor-checkout-new') {
        path = 'event/getAllSponsorshipCategories/SPONSOR/' + this.checkoutArray['id']
      } else {
        path = 'event/getAllSponsorshipCategories/DONATION/' + this.checkoutArray['id']
      }
    }else{
      if (this.checkoutArray['url'] == 'sponsor-checkout-new') {
        path = 'event/chapter/sponsorshipCategory/getAll/SPONSOR/' + this.checkoutArray['chapterDetail']['id']
      } else {
        path = 'event/chapter/sponsorshipCategory/getAll/DONATION/' + this.checkoutArray['chapterDetail']['id']
      }
    }
    let request = {
      path: path,
      isAuth: true,
    };
    this.categoryList = [];
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.categoryList = response['data'];
        this.categoryList[0]['categoryName']
        console.log("categoryList: ",this.categoryList);
        if (this.categoryList.length == 0) {
          this.checkoutArray['details'] = undefined;
          this.checkoutArray['summery'] = null;
          this.calculateAmount();
        }
        console.log(this.categoryList)
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  calculateAmount() {
    let detail = [];
    detail = this.checkoutArray['details'];

    if (detail != undefined) {
      let postData = {};
      if (this.checkoutArray['url'] == 'donor-checkout-without-steps') {
        postData['donationCategoryId'] = detail['id'];
        postData['donation'] = detail['amount'];
        this.minAmount = detail['amount'];
      } else {
        postData['sponsorshipCategoryId'] = detail['id'];
        postData['sponsorship'] = detail['amount'];
        this.minAmount = detail['amount'];
      }
      postData['discountCode'] = this.checkoutArray['discountCode'];
      postData['registrations'] = [];
      if (detail['amount'] != '' && detail['amount'] != 0) {
        this.minAmount = detail['amount'];
        let data = {};
        if (this.type == "chapter") {
          let postSponser = {};
          postSponser['chapterId'] = this.checkoutArray['id'];
          postSponser['amount'] = detail['amount'];
          postSponser['categoryId'] = detail['id'];
          postSponser['discountCode'] = this.checkoutArray['discountCode'];
          data = {
            path: "event/chapter/sponsorship/calculateAmount",
            data: postSponser,
            isAuth: true,
          };
        } else {
          postData['eventId'] = this.id;
          data = {
            path: "event/calculateAmount",
            data: postData,
            isAuth: true,
          };
        }
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.checkoutArray['summery'] = [];
            let amount = [];
            amount['name'] = detail['categoryName'];

            if (this.type == 'chapter') {
              amount['value'] = response['data']['totalAmount'];
            } else {
              if (this.checkoutArray['url'] == 'donor-checkout-new') {
                amount['value'] = response['data']['totalDonation'];
              } else {
                amount['value'] = response['data']['totalSponsorship'];
              }
            }
            amount['info'] = true;
            amount['description'] = '';
            let tax = [];
            tax['name'] = 'Taxes';
            tax['value'] = response['data']['tax'];
            tax['info'] = false;
            tax['description'] = '';
            this.checkoutArray['summery'].push(amount);
            this.checkoutArray['summery'].push(tax);
            if (response['data']['discount'] != 0) {
              response['data']['discountList'].map(data => {
                let discount = [];
                discount['name'] = data['name'];
                discount['value'] = data['finalDiscount'];
                discount['info'] = false;
                this.checkoutArray['summery'].push(discount);
              });
            }
            this.checkoutArray['finalAmount'] = response['data']['finalAmount'];
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });
      } else {
        this.toastrService.error("Please add valid amount !");
      }
    } else {
     // this.toastrService.error("Please Select Valid Category  !");
    }
  }

  changeTypeTab(event){
    console.log("Event: ", event);
    this.paymentType=event.tab.textLabel;
    this.checkoutArray['paymentType']= this.paymentType;
    if(event.tab.templateLabel.viewContainerRef._view?.oldValues[0] =='true'){
      this.checkoutArray['achPayment']= true;
    }else{
      this.checkoutArray['achPayment']= false;
    }
    if (this.paymentType != 'AFFINY_PAY' && this.paymentType != 'SQUARE_PAYMENT' && this.paymentType != 'CLOVER_PAYMENT') {
      this.publicKey=''
      delete this.checkoutArray['nonce']
      return false;
    }
    this.getKey();
  }

  getKey(){
    let path=''
    if(this.checkoutArray['type'] == 'chapter'){
      path='event/chapter/publicPaymentConfig/' + this.checkoutArray['chapterDetail']['id'] + '/' + this.paymentType+'?achPayment='+this.checkoutArray['achPayment'];
    }
    else{
      path='event/publicPaymentConfig/' + this.checkoutArray['id'] + '/' + this.paymentType+'?achPayment='+this.checkoutArray['achPayment'];
    }
    let request = {
      path: path,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        if(this.paymentType == "CLOVER_PAYMENT"){
          this.publicKey = response['data']['apiAccessKey'];
        }else if(this.paymentType == "SQUARE_PAYMENT"){
          this.publicKey = response['data']['applicationId'];
          console.log("Public Key: ", this.publicKey)
          this.locationId = response['data']['locationId'];
        }else{
          this.publicKey = response['data']['merchantId'];
        }
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  finalPayment() {
    this.paymentsSubject.next('data');
    console.log("final Payment called")
    this.spinner.show();
    setTimeout(()=>{
    this.submitted = true;
    let formdata = {};
    if(this.checkoutArray['userDetail']){
      formdata = this.checkoutArray['userDetail'];
      console.log("CheckoutArry: ", this.checkoutArray['userDetail'])
    }
    formdata = this.userForm.value
    formdata['achPayment'] = this.checkoutArray['achPayment']
    formdata['discountCode'] = this.checkoutArray['discountCode'];
    if(this.checkoutArray['paymentType']=='SQUARE_PAYMENT'){
      formdata['nonce'] = this.checkoutArray['nonce'];
    }
    else{
      formdata['nonce'] = this.checkoutArray['nonce'];
    }
    formdata["amount"] = this.checkoutArray['finalAmount'];
    formdata["categoryId"] = this.checkoutArray['details']['id'];
    if(this.checkoutArray['type']=='chapter'){
      formdata["chapterId"] = this.checkoutArray['chapterDetail']['id'];
    }
    if(this.checkoutArray['type']=='event'){
      formdata["eventId"] = this.checkoutArray['id'];
    }
    formdata["paymentMethodUsed"] = this.checkoutArray['paymentType'];
    formdata['discountCode'] = this.checkoutArray['discountCode'];
    formdata['donationType'] = 'DONATION';
    let path=''
    console.log(formdata);
    if(this.checkoutArray['type'] == 'chapter'){
      path="event/chapter/sponsorship/request";
    }
    else{
      path="  ";
    }
    if(this.isAnonymous){
      formdata['displayName'] = ""
    }
    let data = {
      path: path,
      data: formdata,
      isAuth: true
    };
    console.log("Request FormData: ", formdata);
    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
        this.alertText = response['status']['description'];
        if (response['data']['url'] != null) {
          localStorage.setItem('isNotEvent', 'true');
          window.location.href = response['data']['url'];
        } else {
          console.log("Payment Done Succssfully!");
          $('#openSuccessModel').trigger('click');
        }
        this.spinner.hide();

      } else {
        this.toastrService.error(response['status']['description']);
        this.spinner.hide();
      }
    });
    },5000);
  }

  openModalWithClass1(template1: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template1,
      { backdrop: 'static', ignoreBackdropClick: false, class: 'gray modal-md payment-success-new' }
    );
  }

  checkNonce(){
    console.log("Check Nonce: ",this.checkoutArray['nonce'])
  }

  finalCheckout() {
    if (this.paymentType != 'AFFINY_PAY' && this.paymentType != 'SQUARE_PAYMENT' && this.paymentType != 'CLOVER_PAYMENT') {
      // this.finalPayment();
      return false;
    }
    delete this.checkoutArray['nonce'];
    if(this.checkoutArray['achPayment']){
      this.paymentSubject.next('data');
    }else{
      setTimeout(() => {
        this.paymentsSubject.next('data');
      }, 800);
    }
    return true;
  }

  changeStep(type) {
    if(!this.isAnonymous && !this.userForm.valid){
      this.toastrService.error("Fill all required fileds");
      return;
    }
    if (type == 'next') {
      if(this.checkoutArray['paymentMethod'].length !=0){
        if (this.finalCheckout()){
          console.log("final checkout is true")
          this.finalPayment();
        }
      }else{
        this.toastrService.error('No Payment method Available')
      }
    }
  }

  getPaymentMethod() {
    if (this.checkoutArray['chapterDetail']) {
      this.isPaymentMode = true;
      let request = {
        path: 'event/chapter/paymentMethod?chapterId=' + this.checkoutArray['chapterDetail']['id']+'&paymentType=ONLINE',
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        this.checkoutArray['paymentMethod'] = response['data'];
        this.checkoutArray['paymentMethod'] = this.checkoutArray['paymentMethod'].filter((data) => data.value != 'CLOVER_PAYMENT');
        if (this.checkoutArray['paymentMethod'][0]) {
          this.paymentType = this.checkoutArray['paymentMethod'][0]['value'];
          this.checkoutArray['achPayment'] = this.checkoutArray['paymentMethod'][0]['achPayment'];
        } else {
          this.paymentType = '';
        }
        this.checkoutArray['paymentType'] = this.paymentType;
      });
    }  if (this.checkoutArray['eventDetail']) {
      let request = {
        path: 'event/paymentMethod?eventId=' + this.checkoutArray['id']+'&paymentType=ONLINE',
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        console.log("Payment Method: ", response);
        this.checkoutArray['paymentMethod'] = response['data'];
        this.checkoutArray['paymentMethod'] = this.checkoutArray['paymentMethod'].filter((data) => data.value != 'CLOVER_PAYMENT');
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
}
