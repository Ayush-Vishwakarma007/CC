import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {ToastrService} from "ngx-toastr";
import {CommunityDetailsService} from "../../../services/community-details.service";

@Component({
  selector: 'app-payments-checkout',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
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
    this.paymentType = '';
    this.getEventDetail();
  }
  getEventDetail() {
    this.spinner.show();
    let request = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.eventDetail = response['data'];
          this.eventDetail.paymentMethod = [];
          Object.keys(this.eventDetail.paymentMethods).map((index)=>{
            this.eventDetail.paymentMethod.push({value:index,name:this.eventDetail.paymentMethods[index]});
          });
          this.paymentType = this.eventDetail.paymentMethod[0]['value'];

          console.log(this.eventDetail.paymentMethod);
        } else {
          this.toastrService.error(response['status']['description']);
        }
        resolve(null);
        this.spinner.hide();
      });
    });
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
  paymentDone() {
    this.paymentDetail['paymentMethodUsed'] = this.paymentType;
    this.paymentDetail['displayName'] = this.receiptName;
    if (this.acceptTerms == false) {
      this.toastrService.error('Accept Terms & Conditions');
    }else if(this.paymentDetail['finalAmount'] == 0)
    {
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
        this.paymentDetail['nonce'] = null;
        this.completePayment.emit();
      }
    }
    this.completePayment.emit();
  }
}
