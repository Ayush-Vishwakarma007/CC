import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {CommunityDetailsService} from "../../../../services/community-details.service";

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {
  @Input()
  planId = '';
  @Input()
  allMemberShip : any = [];
  @Input()
  membershipDetail: any = [];
  publicInfo: any = [];
  authDetail: any = [];
  acceptTerms: boolean = false;

  paymentType = '';
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  paymentSubject: Subject<any> = new Subject();
  chapter: any;
  chapterId: '';

  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() completePayment: EventEmitter<any> = new EventEmitter();
  @Output() discountChange: EventEmitter<any> = new EventEmitter();
  discountCode = '';
  @Output() paymentDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() paymentMethodChange: EventEmitter<any> = new EventEmitter();

  //publicKey = 'm_plpW1YarQGKmd2fxNVTIQA';
  publicKey = '';
  constructor(private formBuilder: FormBuilder, public communityService: CommunityDetailsService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.chapter = JSON.parse(localStorage.getItem('chapter'));
    this.chapterId = this.chapter.id;
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

  _paymentMethod: any;
  @Input()
  get paymentMethod() {
    return this._paymentMethod;
  }

  set paymentMethod(value) {
    if(value[0])
    {
      this.paymentType = value[0]['value']
    }
    else{
      this.paymentType = '';
    }
    this.getPublicKey();
    this._paymentMethod = value;
    this.paymentMethodChange.emit(value);
  }

  ngOnInit() {
    this.getPublicInfo();
    this.calculateAmount();
    //this.getPaymentMethod();
  }
  paymentDone() {
    this.paymentDetail['paymentMethodUsed'] = this.paymentType;
    this.paymentDetail['membershipTypeId'] = this.membershipDetail['id'];
    this.paymentDetail['discountCode'] =this.discountCode;
    this.paymentDetail['planId'] = this.planId;
    this.paymentDetail['showInDirectory'] = true;

    if (this.acceptTerms == false) {
      this.toastrService.error('Accept Terms & Conditions');
    }else if(this.paymentType == '') {
      this.toastrService.error('Please Select Payment Type');
    } else {
      if( this.paymentType =='AFFINY_PAY')
      {
        this.paymentSubject.next(null);
        //this.submitPay();
      }
      else if ( this.paymentType == 'CLOVER_PAYMENT'){
        this.paymentSubject.next(null);
      }
      else{
        this.paymentDetail['nonce'] =null;
        this.completePayment.emit();
      }
    }
  }

  getCurrentMembership() {
    let request = {
      path: 'auth/membershipType/details/plan/' + this.planId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.membershipDetail = response['data'];
      this.calculateAmount();

    });
  }

  getPublicInfo() {
    let request = {
      path: 'auth/configuration/publicInfo/',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.publicInfo = response['data'];
      //this.paymentType= this.paymentMethod['value'];
    });
  }

  getPublicKey() {
    if (this.paymentType != 'AFFINY_PAY' && this.paymentType != 'CLOVER_PAYMENT') {
      return false;
    }
    let request = {
      path: 'auth/configuration/publicPaymentConfig/' + this.chapterId + '/' + this.paymentType,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        if (this.paymentType == "CLOVER_PAYMENT") {
          this.publicKey = response['data']['apiAccessKey'];
        } else {
          this.publicKey = response['data']['merchantId'];
        }
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
    console.log(this.publicKey);
  }

  calculateAmount() {
    console.log('ddd')
    let postData = {};
    postData['membershipTypeId'] = this.membershipDetail['id'];
    postData['planId'] = this.planId;
    postData['discountCode'] = this.discountCode;
    let request = {
      path: 'auth/member/calculateAmount',
      data: postData,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if(response['status']['code'] == 'OK'){
        let paymentArray = [];
        paymentArray['finalAmount'] = response['data']['finalAmount'];
        paymentArray['successfulPayment'] = false;
        paymentArray['discountCode'] =  this.discountCode;
        paymentArray['display'] = [];

        let plan = [];
        plan['name'] = this.membershipDetail['name'];
        plan['value'] = response['data']['totalAmount'];
        plan['info'] = false;
        plan['description'] = '( '+ response['data']['durationType']+' )';
        paymentArray['display'].push(plan);

        let tax = [];
        tax['name'] = 'Taxes';
        tax['value'] = response['data']['tax'];
        tax['info'] = false;
        tax['description'] = '';
        paymentArray['display'].push(tax);
        if (response['data']['discount'] != 0) {
          let discount = [];
          discount['name'] = 'Discount ';
          discount['value'] = response['data']['discount'];
          discount['info'] = false;
          paymentArray['display'].push(discount);
        }
        this.paymentDetail = paymentArray;
        setTimeout(()=>{
          this.getPublicKey();
        },100);
      }else{
        this.discountCode= '';
        this.toastrService.error(response['status']['description']);
      }

    });
  }

  getNonce()
  {
    this.completePayment.emit();
  }
  discountChangeDetail(event) {
    this.calculateAmount();
  }

  getPaymentMethod(){
  }
}
