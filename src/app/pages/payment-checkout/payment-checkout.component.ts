import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Subject} from "rxjs";
import {FormControl} from "@angular/forms";
import {Location} from "@angular/common";
import {CommunityDetailsService} from "../../services/community-details.service";
import {ApiService} from "../../services/api.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime} from "rxjs/operators";
import {SpinnerService} from "../../services/spinner.service";

@Component({
  selector: 'app-payment-checkout',
  templateUrl: './payment-checkout.component.html',
  styleUrls: ['./payment-checkout.component.scss']
})
export class PaymentCheckoutComponent implements OnInit {

  modalRef: BsModalRef;
  acceptTerms: boolean = false;
  paymentType = '';
  publicKey = '';
  paymentSubject: Subject<any> = new Subject();
  promoBox: FormControl = new FormControl('');
  currentStep = ''
  checkoutArray: any = [];
  id = '';

  constructor(private modalService: BsModalService,public spinner: SpinnerService,  private route: ActivatedRoute, public router: Router, public _location: Location, public communityService: CommunityDetailsService, private apiService: ApiService, private toastrService: ToastrService) {
    this.route.params.subscribe(params => {
        this.id = params['id'];
      }
    );
  }

  ngOnInit() {
    this.getDetails();
    this.promoBox.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe((promo) => {
      this.checkoutArray['discountCode'] = promo;
    });
  }

  getDetails() {
    let data = {
      path: 'payment/payment/page/' + this.id,
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
        this.checkoutArray = response['data'];
        if(this.checkoutArray['successfulPayment'] == true){
          $('#openDoneModel').click();
        }else{
          this.toastrService.info("Your amount is not paid, so you need to pay");
        }
        if (this.checkoutArray['paymentMethods'][0]) {
          this.paymentType = this.checkoutArray['paymentMethods'][0]['value'];
          this.checkoutArray['achPayment'] = this.checkoutArray['paymentMethods'][0]['achPayment'];
        } else {
          this.paymentType = '';
        }
      }
    });
  }

  changeStep(back: string) {
    if (this.paymentType != 'AFFINY_PAY' && this.paymentType != 'CLOVER_PAYMENT'  && this.paymentType != 'SQUARE_PAYMENT') {
      this.checkNonce();
      return false;
    }
    this.paymentSubject.next('data');
  }

  changeTypeTab(event) {
    this.paymentType = event.tab.textLabel;

    this.checkoutArray['paymentType'] = this.paymentType;
    if (event.tab.templateLabel.viewContainerRef._view.oldValues[0] == 'true') {
      this.checkoutArray['achPayment'] = true;
    } else {
      this.checkoutArray['achPayment'] = false;

    }
    if (this.paymentType != 'AFFINY_PAY' && this.paymentType != 'CLOVER_PAYMENT' && this.paymentType != 'SQUARE_PAYMENT') {
      this.publicKey = '';
      console.log();
      console.log(this.publicKey)
      this.checkoutArray['nonce'] = ''
      return false;
    } else {
      let list = this.checkoutArray['paymentMethods'].filter((data) => data.value == this.paymentType);
      if(this.paymentType == "SQUARE_PAYMENT"){
        this.publicKey = list[0]['publicConfig']['applicationId'];
      }else{
      this.publicKey = list[0]['publicConfig']['merchantId'];
      }
    }

  }

  checkNonce() {
    let postData = {
      "achPayment": this.checkoutArray['achPayment'],
      "nonce": this.checkoutArray['nonce'],
      "paymentType": this.paymentType
    };
    this.spinner.show();
    console.log('eee', this.checkoutArray['nonce'], postData)
    let data = {
      path: 'payment/payment/page/pay/' + this.id,
      data: postData,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {
      if (response['status']['status'] == 'SUCCESS') {
        this.spinner.hide();
        $('#openSuccessModel').click();
      }else if(response['status']['status'] == 'CONTINUE'){
        window.location = response['data']['url'];
        this.toastrService.success(response['status']['description']);
        this.spinner.hide();
      }else {
        this.toastrService.error(response['status']['description']);
        this.spinner.hide();
      }
    });
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
