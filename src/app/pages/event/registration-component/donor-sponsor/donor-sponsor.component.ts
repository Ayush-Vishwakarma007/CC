import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-donor-sponsor',
  templateUrl: './donor-sponsor.component.html',
  styleUrls: ['./donor-sponsor.component.scss']
})
export class DonorSponsorComponent implements OnInit {

  @Input() eventId = "";
  @Input() chapterId = "";
  @Input() type = "";
  @Input() checkoutType = "";
  response: any = [];
  @Output() completed: EventEmitter<any> = new EventEmitter();

  @Output() categoryDetailChange: EventEmitter<any> = new EventEmitter();
  @Input()
  discount: Subject<any>;
  discountSubscription: Subscription;
  discountCode = '';
  @Output() paymentDetailChange: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

  }

  _categoryDetail: any;

  @Input()
  get categoryDetail() {
    return this._categoryDetail;
  }

  set categoryDetail(value) {
    this._categoryDetail = value;
    this.categoryDetailChange.emit(value);
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
    this.discountSubscription = this.discount.subscribe((value) => {
      this.discountCode =  $.trim(value);
      if(this.categoryDetail.length != 0){
        this.calculateAmount();
      }
    });
  }

  categoryChange(check, index, onload = false) {
    if (onload == false) {
      this.categoryDetail.map(t => {
        t.amount = 0;
        t.checked = false;
        return t
      });
    }
    this.categoryDetail[index]['checked'] = check;
    this.categoryDetail[index]['amount'] = this.categoryDetail[index]['range']['min'];

    this.categoryDetailChange.emit(this.categoryDetail);
    this.calculateAmount();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  calculateAmount() {
    let detail = [];
    detail = this.categoryDetail.filter(t => t.checked == true)[0];

    if (detail != undefined) {
      let postData = {};
      if (this.type == 'donor-checkout') {
        postData['donationCategoryId'] = detail['id'];
        postData['donation'] = detail['amount'];
      } else {
        postData['sponsorshipCategoryId'] = detail['id'];
        postData['sponsorship'] = detail['amount'];

      }
      postData['discountCode'] =  this.discountCode;
      postData['registrations'] = [];
      if (detail['amount'] != '' && detail['amount'] != 0) {

        let data = {};
        if(this.checkoutType == "chapter"){
          let postSponser = {};
          postSponser['chapterId'] = this.eventId;
          postSponser['amount'] = detail['amount'];
          postSponser['categoryId'] = detail['id'];
          postSponser['discountCode'] = this.discountCode;
          data = {
            path: "event/chapter/sponsorship/calculateAmount",
            data: postSponser,
            isAuth: true,
          };
        }
        else{
          postData['eventId'] = this.eventId;
          data = {
            path: "event/calculateAmount",
            data: postData,
            isAuth: true,
          };
        }
        
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            let paymentArray = [];

            paymentArray['finalAmount'] = response['data']['finalAmount'];
            paymentArray['successfulPayment'] = false;
            paymentArray['display'] = [];
            let amount = [];
            amount['name'] = detail['categoryName'];

            if(this.checkoutType == 'chapter'){
              amount['value'] = response['data']['totalAmount'];
            }
            else{
              if (this.type == 'donor-checkout') {
                amount['value'] = response['data']['totalDonation'];
              } else {
                amount['value'] = response['data']['totalSponsorship'];
              }
            }

            amount['info'] = true;
            amount['description'] = '';
            let tax = [];
            tax['name'] = 'Taxes';
            tax['value'] = response['data']['tax'];
            tax['info'] = false;
            tax['description'] = '';
            paymentArray['display'].push(amount);
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
        this.toastrService.error("Please Add Valid Amount !");
      }
    } else {
      this.toastrService.error("Please Select Valid Category  !");
    }
  }
}
