import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import {Subject, Subscription} from "rxjs";
import {CommunityDetailsService} from "../../../../services/community-details.service";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from "ngx-toastr";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'app-membership-plan-payment-new',
  templateUrl: './membership-plan-payment-new.component.html',
  styleUrls: ['./membership-plan-payment-new.component.scss']
})
export class MembershipPlanPaymentNewComponent implements OnInit {
  modalRef: BsModalRef;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() currentStepChange: EventEmitter<any> = new EventEmitter();
  @Output() checkoutArrayChange: EventEmitter<any> = new EventEmitter();
  acceptTerms: boolean = false;
  @Input()
  paymentType='';
  publicKey='';
  paymentSubject: Subject<any> = new Subject();
  promoBox: FormControl = new FormControl('');

  constructor(public router:Router,private modalService: BsModalService,public _location :Location, public communityService: CommunityDetailsService, private apiService: ApiService, private toastrService: ToastrService) {
  }

  _currentStep: any;
  @Input()
  get currentStep() {
    return this._currentStep;
  }

  set currentStep(value) {
    this._currentStep = value;
    this.currentStepChange.emit(value);
  }

  _checkoutArray: any;
  @Input()
  get checkoutArray() {
    return this._checkoutArray;
  }

  set checkoutArray(value) {
    this._checkoutArray = value;
    this.checkoutArrayChange.emit(value);
  }

  ngOnInit() {
    console.log(this.checkoutArray)
    if (this.paymentType != 'AFFINY_PAY' && this.paymentType != 'SQUARE_PAYMENT' &&  this.paymentType != 'CLOVER_PAYMENT') {
      return false;
    }
    this.promoBox.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe((promo) => {
      this.checkoutArray['discountCode'] = promo;
      this.completed.emit();
    });
    this.getKey();
  }


  changeStep(type) {
    if (type == 'next') {
      if(this.checkoutArray['paymentMethod'].length !=0){
        if (this.finalCheckout()) {
          this.completed.emit();
          //this.currentStep = 4;
        }
      }else{
        this.toastrService.error('No Payment method Available')
      }

    }
    if (type == 'back') {
      this.currentStep = 2;
    }
  }

  finalCheckout() {
    if (this.acceptTerms == false) {
      this.toastrService.error('Accept Terms & Conditions');
      return false;
    } else {
      if (this.paymentType != 'AFFINY_PAY'&& this.paymentType != 'SQUARE_PAYMENT' && this.paymentType != 'CLOVER_PAYMENT') {
        this.completed.emit();
        return false;
      }
      delete this.checkoutArray['nonce'];
      if(this.checkoutArray['achPayment']){
        this.paymentSubject.next('data');
      }else{
        console.log('bbpppp');
        setTimeout(() => {
          this.paymentSubject.next('data');
        }, 800);
      }
      
    }
  }
  checkNonce(){
    this.completed.emit();
  }
  changeTypeTab(event){

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
  getKey(){
    let request = {
      path: 'auth/configuration/publicPaymentConfig/' + this.checkoutArray['chapterDetail']['id'] + '/' + this.paymentType+'?achPayment='+this.checkoutArray['achPayment'],
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
  goBack()
  {
    this.router.navigate(['/']);
  }
}
