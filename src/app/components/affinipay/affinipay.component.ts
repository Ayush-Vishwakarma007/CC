import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {SpinnerService} from "../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-affinipay',
  templateUrl: './affinipay.component.html',
  styleUrls: ['./affinipay.component.scss']
})
export class AffinipayComponent implements OnInit, AfterViewInit {
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() paymentDetailChange: EventEmitter<any> = new EventEmitter();
  @Input()
  publicKey='';
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  hostedFields = '';
  hostedFieldsConfiguration = {}

  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

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
    this.hostedFieldsConfiguration = {
      publicKey: this.publicKey,
      tokenizationTimeout: 5000,
      input: {
        css: {
          ':disabled': {
            'background': '#dddddd'
          }
        }
      },
      fields: [
        {
          selector: '#credit_card_field_id',
          input: {
            type: 'credit_card_number',
          }
        },
        {
          selector: '#cvv_field_id',
          input: {
            type: 'cvv',
          }
        }
      ]
    }
    this.saveSubscription = this.save.subscribe(() => {
      this.submitPay();
    });
  }

  ngAfterViewInit(){
  console.log(this.publicKey);
    this.hostedFields = window['AffiniPay'].HostedFields.initializeFields(this.hostedFieldsConfiguration, this.hostedFieldsCallBack)
  }

  hostedFieldsCallBack() {
  }

  submitPay() {
    this.spinner.show();
    this.hostedFields['getPaymentToken'](this.getFormData())
      .then((paymentResult) => {
        this.paymentDetail['nonce'] = paymentResult['id'];
        this.completed.emit();
        this.spinner.hide();
      }).catch((err) => {
      this.spinner.hide();
      if(err){
        this.toastrService.error('Please enter valid details!');
      }
      //this.toastrService.error(err.messages);
    })
  }

  getFormData() {
    const form = $('#paymentForm').serializeArray();
    const formData = {}
    // for (let i = 0; i < form.elements.length; i++) {
    //   if (form.elements[i]['type'] !== 'text') {
    //     continue
    //   }
    //   let fieldName = form.elements[i]['name'];
    //   formData[fieldName] = form.elements[i]['value']
    // }
    form.forEach((item, index) => {
      formData[item['name']] = item['value']
    });
    return formData;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
}
