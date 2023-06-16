import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Gallery} from "@ngx-gallery/core";
import {SpinnerService} from "../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {ToastrService} from "ngx-toastr";
import {SeoService} from "../../services/seo.service";
import {configuration} from "../../configration";

@Component({
  selector: 'app-checkout-management',
  templateUrl: './checkout-management.component.html',
  styleUrls: ['./checkout-management.component.scss']
})
export class CheckoutManagementComponent implements OnInit {

  submitSubject: Subject<any> = new Subject();
  discountSubject: Subject<any> = new Subject();
  authDetail: any = [];
  eventId = '';
  eventDetail: any = [];
  categoryList: any = [];
  paymentDetail: any = [];
  guestDetail: any = [];
  guestShow: boolean = false;
  type = '';
  discountCode = '';

  constructor(public gallery: Gallery, public spinner: SpinnerService, private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, private seo: SeoService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.route.params.subscribe(params =>
      this.eventId = params['id']
    );
    if (!this.authDetail) {
      this.guestShow = true;
    }
  }

  ngOnInit() {
    this.getEventDetail().then(r => {
    });
    this.getCategoryDetail();
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
          this.eventDetail.paymentMethod = Object.keys(this.eventDetail.paymentMethods);
        } else {
          this.toastrService.error(response['status']['description']);
        }
        resolve(null);
        this.spinner.hide();
      });
    });
  }

  getCategoryDetail() {
    let path = '';
    if (this.type == 'donor-checkout') {
      path = "event/getAllSponsorshipCategories/DONATION/" + this.eventId;
    } else {
      path = "event/getAllSponsorshipCategories/SPONSOR/" + this.eventId;
    }
    let data = {
      path: path,
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.categoryList = response['data'];
        this.categoryList.forEach((item, index) => {
          item['amount'] = 0
        });
      }
    });
  }

  addGuest() {
    if (this.guestDetail) {
      this.guestDetail['age'] = configuration.calculateAge(this.guestDetail['birthYear']);
      this.guestDetail['relation'] = 'SELF';
      this.guestShow = false;
    }
  }

  paymentStep() {
    console.log(this.paymentDetail)

    // this.submitSubject.next(null);
  }

  addDiscount() {
    if (this.discountCode == '') {
      this.discountSubject.next(null);
      this.discountSubject.next(null);
    } else {
      this.discountSubject.next(this.discountCode);
    }
  }

  paymentCheckout() {
    console.log(this.paymentDetail)
  }
}
