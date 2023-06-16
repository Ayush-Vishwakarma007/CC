import {Component, Input, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import { configuration } from '../../configration';
import {ApiService} from '../../services/api.service';
import {map} from "rxjs/operators";
import {BehaviorSubject, Subject, Subscription} from "rxjs";


@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})

export class PaypalComponent implements OnInit ,OnDestroy{

  clientId = '';
  url = '';
  @Input() price = 0;
  @Input() token = '';
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;

  @Output()tokenOutput: EventEmitter<any> = new EventEmitter();

  _output:any;
  @Output()outputChange: EventEmitter<any> = new EventEmitter();
  @Input()
  get output(){
    return this._output;
  }
  set output(value){
    this._output = value;
    this.outputChange.emit(value);
  }
  constructor( public apiService: ApiService) { }
  ngOnInit() {

    this.saveSubscription = this.save.subscribe(() => {
      $('#open').click();
    });
  }
  onPaymentStatus(response): void {
    this.outputChange.emit(response);
    this.tokenOutput.emit();
    $('#closePaypalId').click();
  }
  getClientToken()
  {
    return () => {
      let request = {
        path: 'payment/configuration/PAYPAL_PAYMENT',
        isAuth: true,
      };
      return this.apiService.get(request).pipe(map(response => {
        if(response['status']['code'] == 'OK')
        {
          this.clientId =  response['data']['clientId'];
          return response['data']['clientId'];
        }
      }));
    }
  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }

  createPurchase()
  {
    return (nonce) => {
      return new BehaviorSubject(nonce);
    }

  }
}
