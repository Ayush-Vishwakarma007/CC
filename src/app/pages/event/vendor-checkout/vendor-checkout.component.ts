import { Component, OnInit } from '@angular/core';
import {Gallery} from "@ngx-gallery/core";
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {SeoService} from "../../../services/seo.service";
import {Subject} from "rxjs";
import {configuration} from "../../../configration";

@Component({
  selector: 'app-vendor-checkout',
  templateUrl: './vendor-checkout.component.html',
  styleUrls: ['./vendor-checkout.component.scss']
})
export class VendorCheckoutComponent implements OnInit {


  submitSubject: Subject<any> = new Subject();
  discountSubject: Subject<any> = new Subject();

  guestDetail:any = [];
  authDetail :any =[];
  eventId ='';
  eventDetail:any = [];
  vendorExpoDetail :any = [];
  paymentExpoDetail :any = [];
  guestShow: boolean = false;
  discountCode = '';
  constructor(public gallery: Gallery, public spinner: SpinnerService,  private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService,private seo:SeoService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.route.params.subscribe(params =>
      this.eventId = params['id']
    );
  }

  async ngOnInit() {
    document.querySelector("body").removeAttribute('class');
    await this.getEventDetail();
    await this.getVendorExpoDetail();
    if (!this.authDetail) {
      this.guestShow = true;
    }
  }
  getEventDetail() {
    this.spinner.show();
    let request = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        if(response['status']['code'] == 'OK')
        {
          this.eventDetail = response['data'];
        }else
        {
          this.toastrService.error(response['status']['description']);
        }
        resolve(null);
        this.spinner.hide();
      });
    });
  }
  getVendorExpoDetail() {
    let data = {
      path: "event/getAllVendorExpo/" + this.eventId,
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.vendorExpoDetail = response['data'];
        this.vendorExpoDetail.forEach((item, index) => {
          item['totalPrice'] = 0
        });
      }
    });
  }
  paymentStep()
  {
      this.submitSubject.next(null);
  }
  paymentCheckout() {
    let details = this.vendorExpoDetail.filter(t => t.checked == true)[0];
    if(details == undefined)
    {
      this.toastrService.error('Select Vaild Booth');
    }else {
      if (this.paymentExpoDetail['paymentMethodUsed'] == undefined || this.paymentExpoDetail['paymentMethodUsed'] == '') {
        this.toastrService.error('Select Payment Method');
      }
      else {

        let tempArr = [];
        this.spinner.show();
        tempArr.push({
          "categoryId": details['id'],
          "count": 1,
        });
        let detail = {};
        detail['expoCategories'] = tempArr;
        detail['eventId'] = this.eventId;
        if(this.guestDetail.length == 0)
        {
          detail['registrations'] =  [];
        }else{
          detail['registrations'] =  [this.guestDetail];
        }
        if ($.isEmptyObject(this.paymentExpoDetail['donor']) == false) {
          if(this.paymentExpoDetail['donor']['donation'])
          {
            detail['donation'] = this.paymentExpoDetail['donor']['donation'];
            detail['donationCategoryId'] = this.paymentExpoDetail['donor']['donationCategoryId'];
          }
          if(this.paymentExpoDetail['donor']['sponsorship'])
          {
            detail['sponsorship'] = this.paymentExpoDetail['donor']['sponsorship'];
            detail['sponsorshipCategoryId'] = this.paymentExpoDetail['donor']['sponsorshipCategoryId'];
          }
        }else{
          detail["sponsorshipCategoryId"] = null;
        }
        detail['discountCode']= this.discountCode;
        detail['role'] = 'VENDOR';
        detail['nonce'] = this.paymentExpoDetail['nonce'];
        detail['paymentMethodUsed'] = this.paymentExpoDetail['paymentMethodUsed'];
        detail["sponsorshipDiscount"] = true;
        let data = {
          path: "event/event/registration/",
          data: detail,
          isAuth: true
        };
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            localStorage.setItem('eventId', this.eventId);
            if(response['data']['url'] != null)
            {
              window.location.href = response['data']['url'];
            }else {
              this.router.navigate(['/payment/event/payment-success']);
            }
            this.spinner.hide();
          } else {
            this.toastrService.error(response['status']['description']);
            this.spinner.hide();
          }
        });
      }
    }
  }


  addGuest()
  {
    if(this.guestDetail)
    {
      this.guestDetail['age'] = configuration.calculateAge(this.guestDetail['birthYear']);
      this.guestDetail['relation'] = 'SELF';
      this.guestShow = false;
    }

  }
  addDiscount() {
    if (this.discountCode == '') {
      this.discountSubject.next(null);
      this.discountSubject.next(null);
    } else {
      this.discountSubject.next(this.discountCode);
    }
  }
}
