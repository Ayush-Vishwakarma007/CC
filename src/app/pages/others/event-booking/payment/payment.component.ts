import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {
  @Input() eventId = "";
  @Input() paymentArray: any = [];

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();

  categoryId: any;
  detail: any = {};
  eventDetail : any = [];
  response: any = [];
  paymentType = '';
  @Output() paymentDetailChange: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

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
    this.saveSubscription = this.save.subscribe(() => {
        this.paymentDetailChange.emit(this.paymentDetail);
    });
    this.getEventDetail();
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
  changePayment(list)
  {
    this.paymentType = list;
    this.paymentDetail['paymentMethodUsed'] =  this.paymentType;
  }

  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
}
