import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {ApiService} from "../../services/api.service";
import {SpinnerService} from "../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Location} from '@angular/common';

@Component({
  selector: 'app-sponsor-donor-checkout-new',
  templateUrl: './sponsor-donor-checkout-new.component.html',
  styleUrls: ['./sponsor-donor-checkout-new.component.scss']
})
export class SponsorDonorCheckoutNewComponent implements OnInit {
  currentStep: number = 1;
  checkoutArray: any = [];
  paymentType = ''
  submitted: boolean = false;
  modalRef: BsModalRef;
  type: any
  id: any;
  alertText = ''
  title = ''

  constructor(private modalService: BsModalService, public apiService: ApiService, public _location: Location, public spinner: SpinnerService, private route: ActivatedRoute, public router: Router, private toastrService: ToastrService) {
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    if (authDetail) {
      this.checkoutArray['userDetail'] = authDetail;
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
    if (this.checkoutArray['url'] == 'donor-checkout-new') {
      this.title = 'Donor';
    } else {
      this.title = 'Sponsor';
    }
    console.log(this.checkoutArray, this.title, this.title);

  }

  ngOnInit() {
  }


  calculateAmount() {
    let detail = [];
    detail = this.checkoutArray['details'];

    if (detail != undefined) {
      let postData = {};
      if (this.checkoutArray['url'] == 'donor-checkout-new') {
        postData['donationCategoryId'] = detail['id'];
        postData['donation'] = detail['amount'];
      } else {
        postData['sponsorshipCategoryId'] = detail['id'];
        postData['sponsorship'] = detail['amount'];

      }
      postData['discountCode'] = this.checkoutArray['discountCode'];
      postData['registrations'] = [];
      if (detail['amount'] != '' && detail['amount'] != 0) {

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
            console.log()
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

  getPaymentMethod() {
    if (this.checkoutArray['chapterDetail']) {
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

  finalPayment() {
    this.spinner.show();
    console.log('eee', this.checkoutArray['nonce'],this.checkoutArray['paymentType'])
    if (this.checkoutArray['paymentType'] == 'CLOVER_PAYMENT' || this.checkoutArray['paymentType'] == 'AFFINY_PAY') {
      if (!this.checkoutArray['nonce']) {
        this.toastrService.error('Please enter valid Value');
        this.spinner.hide();
        return false;
      }
    } else {
      this.spinner.hide();
      delete this.checkoutArray['nonce']
    }
    this.spinner.show();

    console.log(this.checkoutArray)
    this.submitted = true;
    let formdata = {};
    formdata = this.checkoutArray['userDetail']
    formdata['achPayment'] = this.checkoutArray['achPayment']
    formdata['discountCode'] = this.checkoutArray['discountCode'];
    if(this.checkoutArray['paymentType']=='SQUARE_PAYMENT'){
      formdata['nonce'] = this.checkoutArray['nonces'];
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
    let path=''
    console.log(formdata);
    if(this.checkoutArray['type'] == 'chapter'){
      path="event/chapter/sponsorship/request";
    }
    else{
      path="event/sponsorship/request";
    }
    let data = {
      path: path,
      data: formdata,
      isAuth: true
    };

    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
        this.alertText = response['status']['description'];
        if (response['data']['url'] != null) {
          localStorage.setItem('isNotEvent', 'true');
          window.location.href = response['data']['url'];
        } else {
          $('#openSuccessModel').click();
        }
        this.spinner.hide();

      } else {
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

}
