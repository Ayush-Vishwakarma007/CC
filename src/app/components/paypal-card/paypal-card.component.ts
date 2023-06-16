import {Component, Input, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import { configuration } from '../../configration';
import {ApiService} from '../../services/api.service';
import {map} from "rxjs/operators";
import {BehaviorSubject, Subject, Subscription} from "rxjs";

import {
  IPayPalConfig,
  ICreateOrderRequest 
} from 'ngx-paypal';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-paypal-card',
  templateUrl: './paypal-card.component.html',
  styleUrls: ['./paypal-card.component.scss']
})
export class PaypalCardComponent implements OnInit ,OnDestroy{

  public payPalConfig ? : IPayPalConfig;

  
  token = '';
  clientId = '';
  url = '';
  @Input() price = 0;
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
    this.initConfig();
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



private initConfig(): void {
        this.payPalConfig = {
            currency: 'EUR',
            clientId: environment.clientID,
            createOrderOnClient: (data) => < ICreateOrderRequest > {
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'EUR',
                        value: '9.99',
                        breakdown: {
                            item_total: {
                                currency_code: 'EUR',
                                value: '9.99'
                            }
                        }
                    },
                    items: [{
                        name: 'Enterprise Subscription',
                        quantity: '1',
                        category: 'DIGITAL_GOODS',
                        unit_amount: {
                            currency_code: 'EUR',
                            value: '9.99',
                        },
                    }]
                }]
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: 'paypal',
                layout: 'vertical'
            },
            onApprove: (data, actions) => {
                console.log('onApprove - transaction was approved, but not authorized', data, actions);
                actions.order.get().then(details => {
                    console.log('onApprove - you can get full order details inside onApprove: ', details);
                });

            },
            onClientAuthorization: (data) => {
                console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
                // this.showSuccess = true;
            },
            onCancel: (data, actions) => {
                console.log('OnCancel', data, actions);
                // this.showCancel = true;

            },
            onError: err => {
                console.log('OnError', err);
                // this.showError = true;
            },
            onClick: (data, actions) => {
                console.log('onClick', data, actions);
                // this.resetStatus();
            }
        };
    }


}
