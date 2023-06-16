import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-agewise-booking',
  templateUrl: './agewise-booking.component.html',
  styleUrls: ['./agewise-booking.component.scss']
})
export class AgewiseBookingComponent implements OnInit {
  @Input() eventId = "";
  response: any = [];
  @Output() completed: EventEmitter<any> = new EventEmitter();

  @Output() ageGroupDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() paymentDetailChange: EventEmitter<any> = new EventEmitter();
  @Input()
  discount: Subject<any>;
  discountSubscription: Subscription;
  discountCode = '';
  constructor(private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

  }

  _ageGroupDetail: any;

  @Input()
  get ageGroupDetail() {
    return this._ageGroupDetail;
  }

  set ageGroupDetail(value) {
    this._ageGroupDetail = value;
    this.ageGroupDetailChange.emit(value);
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
      this.calculateAmount();
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  incrementCount(data) {
    data['count'] = data['count'] + 1;
    this.calculateAmount();
  }

  decrementCount(data) {
    data['count'] = data['count'] - 1;
    this.calculateAmount();
  }

  calculateAmount() {
    let detail = [];
    let postData = {};
    let paymentArray = [];
    detail = this.ageGroupDetail.filter(t => t.count != 0);
    let groupArray = [];
    detail.map(list => {
      let amount = {};
      amount['name'] = list['name'];
      amount['count'] = list['count'];
      groupArray.push(amount);
    });
    postData['ageRequests'] = groupArray;
    postData['discountCode'] =  this.discountCode;
    let data = {
      path: "event/ageRegistration/calculateAmount/" + this.eventId,
      data: postData,
      isAuth: true,
    };
    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
        paymentArray['finalAmount'] = response['data']['finalAmount'];
        paymentArray['successfulPayment'] = false;
        paymentArray['display'] = [];
        response['data']['ageRequests'].map(list => {
          let group = [];
          group['name'] = list['name'];
          group['value'] = list['totalAmount'];
          group['info'] = false;
          group['description'] = '';
          paymentArray['display'].push(group);
        });
        let tax = [];
        tax['name'] = 'Taxes';
        tax['value'] = response['data']['tax'];
        tax['info'] = false;
        tax['description'] = '';
        paymentArray['display'].push(tax);
        if(response['data']['discount'] != 0){
          let discount = [];
          discount['name'] = 'Discount ';
          discount['value'] = response['data']['discount'];
          discount['info'] = false;
          paymentArray['display'].push(discount);
        }
        this.paymentDetailChange.emit(paymentArray);
        this.completed.emit();
      } else {
        this.paymentDetailChange.emit([]);
        this.toastrService.error(response['status']['description']);
      }
    });



  }

}
