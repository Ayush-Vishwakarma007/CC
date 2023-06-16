import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-book-vendors',
  templateUrl: './book-vendors.component.html',
  styleUrls: ['./book-vendors.component.scss']
})
export class BookVendorsComponent implements OnInit {


  @Input()
  eventId = '';
  submitSubject: Subject<any> = new Subject();
  response: any = [];
  donorSponsorDetail: any = [];
  eventDetail:any = [];
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() vendorDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() paymentDetailChange: EventEmitter<any> = new EventEmitter();
  @Input()
  discount: Subject<any>;
  discountSubscription: Subscription;
  discountCode = '';
  constructor(private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

  }

  _vendorDetail: any;

  @Input()
  get vendorDetail() {
    return this._vendorDetail;
  }

  set vendorDetail(value) {
    this._vendorDetail = value;
    this.vendorDetailChange.emit(value);
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
      this.getEventDetail();
    this.discountSubscription = this.discount.subscribe((value) => {
      this.discountCode =  $.trim(value);
      this.calculateAmount();
    });
  }
  getEventDetail() {
    let data = {
      path: "event/details/" + this.eventId,
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.eventDetail = response['data'];
      }
    });
  }

  vendorChange(check, index, onload = false) {
    if (onload == false) {
      this.vendorDetail.map(t => {
        t.amount = 0;
        t.checked = false;
        return t
      });
    }
    this.vendorDetail[index]['checked'] = check;

    this.vendorDetailChange.emit(this.vendorDetail);
    this.calculateAmount();
  }

  calculateAmount() {
    let detail = [];
    let postData = {};
    detail = this.vendorDetail.filter(t => t.checked == true)[0];
    if ($.isEmptyObject(this.donorSponsorDetail) == false) {

      postData = this.donorSponsorDetail;
      if (detail == undefined) {
        this.vendorDetail.map((t, i) => {
          if (i == 0) t.checked = true
        });
        detail = this.vendorDetail.filter(t => t.checked == true)[0];
      }
    }
    if (detail != undefined) {
      let tempArr = [];
      tempArr.push({
        "categoryId": detail['id'],
        "count": 1,
      });
      postData['discountCode'] =  this.discountCode;
      postData['expoCategories'] = tempArr;
      postData['eventId'] = this.eventId;
      postData['registrations'] = [];
      postData['role'] = 'VENDOR';
      let data = {
        path: "event/calculateAmount",
        data: postData,
        isAuth: true,
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          let paymentArray = [];

          paymentArray['finalAmount'] = response['data']['finalAmount'];
          paymentArray['successfulPayment'] = false;
          paymentArray['display'] = [];
          paymentArray['donor'] = this.donorSponsorDetail;
          let amount = [];
          amount['name'] = detail['name'];
          amount['value'] = response['data']['totalExpoAmount'];
          amount['info'] = true;
          amount['description'] = '';
          let tax = [];
          tax['name'] = 'Taxes';
          tax['value'] = response['data']['tax'];
          tax['info'] = false;
          tax['description'] = '';
          paymentArray['display'].push(amount);
          if (postData['donationName']) {
            let donation = [];
            donation['name'] = postData['donationName'];
            donation['value'] = response['data']['totalDonation'];
            donation['info'] = false;
            donation['description'] = ''
            paymentArray['display'].push(donation);
          }
          if (postData['sponsorName']) {
            let sponsor = [];
            sponsor['name'] = postData['sponsorName'];
            sponsor['value'] = response['data']['totalSponsorship'];
            sponsor['info'] = false;
            sponsor['description'] = '';
            paymentArray['display'].push(sponsor);
          }
          paymentArray['display'].push(tax);
          if(response['data']['discount'] != 0) {
            response['data']['discountList'].map(data => {
              let discount = [];
              discount['name'] = data['name'];
              discount['value'] = data['finalDiscount'];
              discount['info'] = false;
              paymentArray['display'].push(discount);
            });
          }
          this.paymentDetailChange.emit(paymentArray);
          this.completed.emit();
        } else {
          this.paymentDetailChange.emit([]);
          this.toastrService.error(response['status']['description']);
        }
      });
    } else {
      this.toastrService.error("Please Select Valid Category  !");
    }
  }
}
