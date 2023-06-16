import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject, Subscription } from "rxjs";
import {ToastrService} from 'ngx-toastr';
declare var Clover: any;

@Component({
  selector: 'app-clover',
  templateUrl: './clover.component.html',
  styleUrls: ['./clover.component.scss']
})
export class CloverComponent implements OnInit {

  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() paymentDetailChange: EventEmitter<any> = new EventEmitter();
  @Input()
  publicKey = '';
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  hostedFieldsConfiguration = {};
  clover: any;

  constructor(private toastrService: ToastrService) { }

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
    this.clover = new Clover(this.publicKey);
    const elements = this.clover.elements();
    const styles = {
      body: {
        fontFamily: 'Roboto, Open Sans, sans-serif',
        fontSize: '16px',
      },
      input: {
        fontSize: '16px',
      },
    };
    const cardNumber = elements.create('CARD_NUMBER', styles);
    const cardDate = elements.create('CARD_DATE', styles);
    const cardCvv = elements.create('CARD_CVV', styles);
    const cardPostalCode = elements.create('CARD_POSTAL_CODE', styles);

    cardNumber.mount('#card-number');
    cardDate.mount('#card-date');
    cardCvv.mount('#card-cvv');
    cardPostalCode.mount('#card-postal-code');

    const cardResponse = document.getElementById('card-response');

    const displayCardNumberError = document.getElementById('card-number-errors');
    const displayCardDateError = document.getElementById('card-date-errors');
    const displayCardCvvError = document.getElementById('card-cvv-errors');
    const displayCardPostalCodeError = document.getElementById('card-postal-code-errors');


    cardNumber.addEventListener('change', function (event) {
      console.log(`cardNumber changed ${JSON.stringify(event)}`);
      displayCardNumberError.innerHTML = event.CARD_NUMBER.error || '';
    });

    cardNumber.addEventListener('blur', function (event) {
      console.log(`cardNumber blur ${JSON.stringify(event)}`);
      displayCardNumberError.innerHTML = event.CARD_NUMBER.error || '';
    });

    cardDate.addEventListener('change', function (event) {
      console.log(`cardDate changed ${JSON.stringify(event)}`);
      displayCardDateError.innerHTML = event.CARD_DATE.error || '';
    });

    cardDate.addEventListener('blur', function (event) {
      console.log(`cardDate blur ${JSON.stringify(event)}`);
      displayCardDateError.innerHTML = event.CARD_DATE.error || '';
    });

    cardCvv.addEventListener('change', function (event) {
      console.log(`cardCvv changed ${JSON.stringify(event)}`);
      displayCardCvvError.innerHTML = event.CARD_CVV.error || '';
    });

    cardCvv.addEventListener('blur', function (event) {
      console.log(`cardCvv blur ${JSON.stringify(event)}`);
      displayCardCvvError.innerHTML = event.CARD_CVV.error || '';
    });

    cardPostalCode.addEventListener('change', function (event) {
      console.log(`cardPostalCode changed ${JSON.stringify(event)}`);
      displayCardPostalCodeError.innerHTML = event.CARD_POSTAL_CODE.error || '';
    });

    cardPostalCode.addEventListener('blur', function (event) {
      console.log(`cardPostalCode blur ${JSON.stringify(event)}`);
      displayCardPostalCodeError.innerHTML = event.CARD_POSTAL_CODE.error || '';
    });

    this.saveSubscription = this.save.subscribe(() => {
      this.submitPay();
    });
  }

  submitPay(){
    this.clover.createToken()
      .then((paymentResult) => {
        this.paymentDetail['nonce'] = paymentResult['token'];
        this.completed.emit();
      }).catch((err) => {
      this.toastrService.error(err.messages);
    })
  }
}
