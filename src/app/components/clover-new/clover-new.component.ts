import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {ToastrService} from "ngx-toastr";

declare var Clover: any;

@Component({
  selector: 'app-clover-new',
  templateUrl: './clover-new.component.html',
  styleUrls: ['./clover-new.component.scss']
})
export class CloverNewComponent implements OnInit,OnDestroy {
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() checkoutArrayChange: EventEmitter<any> = new EventEmitter();
  @Output() dataTransferChange: EventEmitter<any> = new EventEmitter();

  @Input()
  publicKey = '';
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  hostedFieldsConfiguration = {};
  clover: any;
  status :boolean=false;
  constructor(private toastrService: ToastrService) {
  }

  _checkoutArray: any;

  @Input()
  get checkoutArray() {
    return this._checkoutArray;
  }

  set checkoutArray(value) {
    this._checkoutArray = value;
    this.checkoutArrayChange.emit(value);
  }


  ngOnInit() {
    console.log(this.publicKey,this.checkoutArray)
    if (this.publicKey != '' && this.checkoutArray['paymentType'] == 'CLOVER_PAYMENT') {
      console.log('dddd', this.clover);
      $('#card-number').html('');
      $('#card-date').html('');
      $('#card-cvv').html('');
      $('#card-postal-code').html('');
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
    }
    this.saveSubscription = this.save.subscribe(() => {
      this.submitPay();
    });
  }

  ngOnDestroy() {
    this.saveSubscription.unsubscribe();
    this.clover=undefined;
    $('iframe').prop('src', '');

    $('#card-number').html('');
    $('#card-date').html('');
    $('#card-cvv').html('');
    $('#card-postal-code').html('');
  }

  submitPay() {
    this.clover.createToken()
      .then((paymentResult) => {
        console.log(paymentResult)
        if(paymentResult['errors']){
          this.toastrService.error('Please enter valid Value');
        }else{
          this.checkoutArray['nonce'] = paymentResult['token'];
          this.completed.emit();
        }
      }).catch((err) => {
        console.log(err)
      this.toastrService.error(err.messages);
    })
   // this.dataTransferChange.emit();

  }
}
