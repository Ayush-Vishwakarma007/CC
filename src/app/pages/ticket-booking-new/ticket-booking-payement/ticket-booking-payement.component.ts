import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { CommunityDetailsService } from 'src/app/services/community-details.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-ticket-booking-payement',
  templateUrl: './ticket-booking-payement.component.html',
  styleUrls: ['./ticket-booking-payement.component.scss']
})
export class TicketBookingPayementComponent implements OnInit {
  modalRef: BsModalRef;
  @Input()title=''
  // isdisabled = false

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
  paymentsSubject:Subject<any> = new Subject();
  promoBox: FormControl = new FormControl('');
  id:any;
  termsAndCondition:any;

  constructor(private modalService: BsModalService,public _location :Location,public router: Router,private route: ActivatedRoute, public communityService: CommunityDetailsService, private apiService: ApiService, private toastrService: ToastrService) { }

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
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
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
    this.getEvent();
  }


  // acptTandc(){
  //   // this.isdisabled
  //   this.paymentsSubject.next(this.acceptTerms)
  // }


  getEvent(){
    let data = {
      path: "event/details/"+this.id,
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
  
  changeStep(type) {
    if (type == 'next') {
      if(this.checkoutArray['paymentMethod']){
        if (this.finalCheckout()) {
          setTimeout(() => {
          this.completed.emit();
        }, 5000);
          localStorage.removeItem("formDetails");
          localStorage.removeItem("mediaFile");
          localStorage.removeItem("videoFile");
          localStorage.removeItem("formDetails1")
        }
      }else{
        this.toastrService.error('No Payment method Available')
      }
    }
    if (type == 'back') {
      this.currentStep = 1;
    }
  }


  finalCheckout() {
    if (this.acceptTerms == false) {
      this.toastrService.error('Accept Terms & Conditions');
      return false;
    } else {
      if (this.paymentType != 'AFFINY_PAY' && this.paymentType != 'SQUARE_PAYMENT' && this.paymentType != 'CLOVER_PAYMENT') {
        this.completed.emit();        
        return false;
      }
      delete this.checkoutArray['nonce'];
      if(this.checkoutArray['achPayment']){
        this.paymentSubject.next('data');       
      }else{
      if(this.checkoutArray['finalAmount']>0){
        setTimeout(() => {
          this.paymentsSubject.next('data');
        }, 800);
        return true;
      }
      else{       
        this.completed.emit()
      }
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
    if (this.paymentType != 'AFFINY_PAY' && this.paymentType != 'CLOVER_PAYMENT'&& this.paymentType != 'SQUARE_PAYMENT' ) {
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
        }else{
          this.publicKey = response['data']['merchantId'];
        }
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
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

}

