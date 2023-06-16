import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from "../../../../services/spinner.service";
import {CommunityDetailsService} from "../../../../services/community-details.service";

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss']
})
export class PaymentDetailComponent implements OnInit {

  @Input() eventId = "";
  @Input() checkoutType = "";
  @Input() paymentArray: any = [];
  @Input() ticket = "";
  @Input() type = "";
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() completePayment: EventEmitter<any> = new EventEmitter();
  paymentSubject: Subject<any> = new Subject();
  detail: any = {};
  eventDetail: any = [];
  response: any = [];
  paymentType = '';
  authDetail: any = [];
  userDetail: any = [];
  submitBtn: boolean = true;
  registerForm: FormGroup;
  formatedAddress = '';
  maploc = {
    componentRestrictions: {country: 'US'}
  };
  acceptTerms: boolean = false;
  @Output() discountChange: EventEmitter<any> = new EventEmitter();
  discountCode = '';
  receiptName = '';
  publicInfo: any = [];
  @Output() paymentDetailChange: EventEmitter<any> = new EventEmitter();
  publicKey = '';
  chapter:any= [];
  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService,public communityService:CommunityDetailsService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.communityService.init();
    this.registerForm = this.formBuilder.group({
      id: [''],
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      addressLine1: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  _discount: any;

  @Input()
  get discount() {
    return this._discount;
  }

  set discount(value) {
    this._discount = value;
    this.discountChange.emit(value);
  }

  _paymentDetail: any;

  @Input()
  get paymentDetail() {
    return this._paymentDetail;
  }

  set paymentDetail(value) {
    this._paymentDetail = value;
    this.paymentDetailChange.emit(value);
  }

  ngOnInit() {
    this.communityService.init();
    this.paymentType = '';
    this.getEventDetail();
    this.getPublicInfo();
    if (this.authDetail) {
      this.getUserDetail();
    }
    this.saveSubscription = this.save.subscribe(() => {
    });
  }

  getPublicInfo() {
    let request = {
      path: 'auth/configuration/publicInfo/',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.publicInfo = response['data'];
    });
  }

  getPublicKey() {
    if (this.paymentType != 'AFFINY_PAY' && this.paymentType != 'CLOVER_PAYMENT') {
      return false;
    }
    if (this.checkoutType == "chapter") {

      let request = {
        path: 'event/chapter/publicPaymentConfig/' + this.eventId + '/' + this.paymentType,
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          if(this.paymentType == "CLOVER_PAYMENT"){
            this.publicKey = response['data']['apiAccessKey'];
          }else{
            this.publicKey = response['data']['merchantId'];
          }
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    } else {

      let request = {
        path: 'event/publicPaymentConfig/' + this.eventId + '/' + this.paymentType,
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          if(this.paymentType == "CLOVER_PAYMENT"){
            this.publicKey = response['data']['apiAccessKey'];
          }else{
            this.publicKey = response['data']['merchantId'];
          }
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
    console.log(this.publicKey);

  }

  changePayment(list) {
    this.paymentType = list;
    this.paymentDetail['paymentMethodUsed'] = this.paymentType;
    this.getPublicKey();
  }

  addReceiptName() {
    this.paymentDetail['displayName'] = this.receiptName;
  }

  getEventDetail() {
    if (this.checkoutType == "chapter") {
      this.eventDetail['venuetype'] = "OFFLINE";

      let data = {
        path: "event/chapter/paymentMethod/" + this.eventId,
        isAuth: true
      };
      this.apiService.get(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          // this.eventDetail = response['data'];
          this.eventDetail.paymentMethod = [];
          this.eventDetail.paymentMethods = [];
          response['data'].map((item) => {
            this.eventDetail.paymentMethod.push(item);
            this.eventDetail.paymentMethods[item['value']] = item['name'];
          });
          //
          // this.eventDetail.paymentMethod =  Object.keys(this.eventDetail.paymentMethods);
          this.paymentType = this.eventDetail.paymentMethod[0]['value'];
          this.getPublicKey();

        }
      });

    } else {
      let data = {
        path: "event/details/" + this.eventId,
        isAuth: true
      };
      this.apiService.get(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.eventDetail = response['data'];
          this.eventDetail.paymentMethod = [];
          this.eventDetail.paymentMethod = Object.keys(this.eventDetail.paymentMethods);
          this.paymentType = this.eventDetail.paymentMethod[0];
          console.log(this.eventDetail.paymentMethod,this.paymentType)
          this.getPublicKey();

        }
      });
    }
  }

  getUserDetail() {
    let data = {
      path: "auth/user/getUserDetail",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.userDetail = response['data']['user'];
      this.registerForm.patchValue({
        id: this.userDetail['id'],
        email: this.userDetail['email'],
        firstName: this.userDetail['firstName'],
        lastName: this.userDetail['lastName'],
        phone: this.userDetail['phone'],
        state: this.userDetail['state'],
        city: this.userDetail['city'],
        addressLine1: this.userDetail['addressLine1'],
        country: this.userDetail['country'],
      });
    });
  }

  paymentDone(status='') {
    this.paymentDetail['paymentMethodUsed'] = this.paymentType;
    this.paymentDetail['displayName'] = this.receiptName;
    if (this.acceptTerms == false) {
      this.toastrService.error('Accept Terms & Conditions');
    }else if(this.paymentDetail['finalAmount'] == 0)
    {
      console.log('true')
      this.completePayment.emit();
    }
     else {

      if (this.paymentType == 'AFFINY_PAY') {
        this.paymentSubject.next(null);
        //this.submitPay();
      }
      else if (this.paymentType == 'CLOVER_PAYMENT'){
        this.paymentSubject.next(null);
      }
      else {
        console.log('trueeee')
        this.paymentDetail['nonce'] = null;
        this.completePayment.emit();
      }
    }
  }

  discountChangeDetail(event) {
    if (this.discountCode == '') {
      this.discountChange.emit(this.discountCode);
    }

    setTimeout(() => {
      this.discountAdd();
    }, 300);
  }

  discountAdd() {
    this.discountChange.emit(this.discountCode);
  }

  handleAddressChange(address: any) {
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
    this.registerForm.patchValue({
      addressLine1: this.formatedAddress,
      city: city,
      state: region,
      country: country,
    });
  }

  getNonce() {
    console.log('false')

    this.completePayment.emit();
  }
}
