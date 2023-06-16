import {Component, OnInit, TemplateRef} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {ToastrService} from "ngx-toastr";
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Location} from '@angular/common';

@Component({
  selector: 'app-membership-checkout-new',
  templateUrl: './membership-checkout-new.component.html',
  styleUrls: ['./membership-checkout-new.component.scss']
})
export class MembershipCheckoutNewComponent implements OnInit {

  currentStep: number ;
  checkoutArray: any = [];
  paymentType = ''
  submitted: boolean = false;
  modalRef: BsModalRef;
  alertText = ''
  authDetail:any=[]
  constructor(private modalService: BsModalService, public apiService: ApiService, public _location: Location, public spinner: SpinnerService, private route: ActivatedRoute, public router: Router, private toastrService: ToastrService) {
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.authDetail=authDetail
    if (authDetail) {
     this.currentStep=1
      this.checkoutArray['userDetail'] = authDetail;
    }
    else
    {
      this.currentStep=0
    }
  
    let chapter = JSON.parse(localStorage.getItem("chapter"));
    if (chapter) {
      this.checkoutArray['chapterId'] = chapter['id'];
    }
  }

  ngOnInit() {
    /*if (this.checkoutArray['userDetail']['userState'] == "UNPAID_MEMBER") {
      this.userDetail();
      this.currentStep = 3;
    }*/
  }

  userDetail() {
    let req = {
      path: "auth/user/getUserDetail/" + this.checkoutArray['userDetail']['id'],
      isAuth: true,
    };
  this.spinner.show()
    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        console.log(this.checkoutArray['chapterlist']);
        this.checkoutArray['userDetail'] = response['data']['user']
        console.log( this.checkoutArray['userDetail'])
        this.checkoutArray['chapterId'] = response['data']['user']['chapterId'];
        this.checkoutArray['selectedMembershipId'] = response['data']['user']['membershipTypeId'];

        this.getChapterList();
      }
      this.spinner.hide()

    });
  }
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
  calculateAmount() {
    let postData = {};
    if (this.checkoutArray['selectedPlan']) {
      postData['membershipTypeId'] = this.checkoutArray['selectedPlan']['id'];
      postData['planId'] = this.checkoutArray['selectedPlan']['plans'][0]['id'];
      postData['discountCode'] = this.checkoutArray['discountCode']
    
      console.log('vvg',this.checkoutArray,postData)
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
          this.spinner.hide();

        }
        else {
          this.toastrService.error(response['status']['description'])
        }
      });
    }
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
        console.log(this.paymentType)
        this.checkoutArray['paymentType'] = this.paymentType;
      });
    }

  }

  finalPayment() {
    this.spinner.show();
    console.log('eee', this.checkoutArray['nonce'])
    if (this.checkoutArray['paymentType'] == 'CLOVER_PAYMENT' || this.checkoutArray['paymentType'] == 'AFFINY_PAY') {
      if (!this.checkoutArray['nonce']) {
        this.toastrService.error('Please enter valid value');
        this.spinner.hide();
        return false;
      }
    } else {
      delete this.checkoutArray['nonce']
    }
    this.spinner.show();

    console.log(this.checkoutArray)
    this.submitted = true;
    let formdata = {};
    formdata['achPayment'] = this.checkoutArray['achPayment']
    formdata['discountCode'] = this.checkoutArray['discountCode'];
    if(this.checkoutArray['paymentType']=='SQUARE_PAYMENT'){
      if(this.checkoutArray['square']){
        formdata['nonce'] = this.checkoutArray['square'];
      }else{
        formdata['nonce'] = this.checkoutArray['nonce'];
      }
    }else{
      if(this.checkoutArray['square']){
        formdata['nonce'] = this.checkoutArray['square'];
      }else{
        formdata['nonce'] = this.checkoutArray['nonce'];
      }
    }
    formdata['signUpRequest'] = this.checkoutArray['userDetail'];
    formdata['signUpRequest']['relation'] = 'SELF';
    formdata['signUpRequest']['chapterId'] = this.checkoutArray['chapterDetail']['id'];

    formdata['membershipTypeId'] = this.checkoutArray['selectedMembershipId'];
    formdata['paymentMethod'] = this.checkoutArray['paymentType'];
    formdata['planId'] = this.checkoutArray['selectedPlan']['plans'][0]['id'];
    formdata['showInDirectory'] = true;
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
          $('#openSuccessModel').click();
        }
      } else {
        this.toastrService.error(response['status']['description']);
      }
      this.spinner.hide();
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
}
