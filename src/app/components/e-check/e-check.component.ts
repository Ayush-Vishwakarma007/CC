import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {SpinnerService} from "../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-e-check',
  templateUrl: './e-check.component.html',
  styleUrls: ['./e-check.component.scss']
})
export class ECheckComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  publicKey = '';
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  hostedFields = '';
  hostedFieldsConfiguration = {}
  @Output() completed: EventEmitter<any> = new EventEmitter();
  callback: any;
  @Output() checkoutArrayChange: EventEmitter<any> = new EventEmitter();
  submit: boolean = false;
  type='business';
  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

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

  ngOnDestroy() {
    console.log('sss');
    $('#credit_card_field_id').html('');
    $('#cvv_field_id').html('');
    this.saveSubscription.unsubscribe();
  }

  ngOnInit() {
    if (this.publicKey != '') {
      let style = {
        border: "1px solid rgb(204, 204, 204)",
        'border-style': 'inset',
        color: "#000",
        "font-size": "11px",
        "font-weight": "400",
        padding: "8px",
        width: "100%"
      };
      this.hostedFieldsConfiguration = {
        publicKey: this.publicKey,
        css: style,
        fields: [
          {
            selector: '#my_bank_account_number_id',
            placeholder: 'Bank Account Number',
            input: {
              type: 'bank_account_number',
              css: style
            }
          },
          {
            selector: '#my_routing_number_id',
            input: {
              type: 'routing_number',
              css: style
            }
          }
        ]
      };
    }
    console.log(this.save)
    this.saveSubscription = this.save.subscribe(() => {
      this.submitPay();
    });

    this.callback = (state) => {
      console.log(state)
      this.submit = state['isReady'];
    }
  }

  ngAfterViewInit() {
    this.hostedFields = window['AffiniPay'].HostedFields.initializeFields(this.hostedFieldsConfiguration, this.callback)
  }

  submitPay() {
    this.spinner.show();
    let status = false;
    console.log(this.hostedFields, this.hostedFields['getState']());
    if (this.hostedFields['getState']()['isReady'] == false) {
      this.completed.emit();
    } else {
      this.hostedFields['getPaymentToken'](this.getFormData())
        .then((paymentResult) => {
          status = true;
          this.checkoutArray['nonce'] = paymentResult['id'];
          this.completed.emit();
        }).catch((err) => {
      })
    }
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }
  changeRadio(event,type){
    this.type= type;
    console.log(event,type)
  }
  getFormData() {
    const given_name = $('#given_name').val();
    const surname = $('#surname').val();
    const business_name = $('#business_name').val();
    const name = $('#name').val();
    const isBusiness = $('#business_radio').is(':checked');
    const isSavings = $('#savings_radio').is(':checked');

    const extra_fields = {}
    extra_fields['account_holder_type'] = isBusiness ? 'business' : 'individual'
    extra_fields['account_type'] = isSavings ? 'savings' : 'CHECKING'.toLowerCase()
    console.log(isBusiness,isSavings);

    if (this.type == 'business') {
      extra_fields['business_name'] = business_name
      console.log("sff",business_name,extra_fields['business_name'])
      extra_fields['given_name'] = business_name;
      if(extra_fields['business_name'] ==""){
        this.toastrService.error('Business name is empty');
        return  false;
      }
    } else {
      extra_fields['given_name'] = given_name
      extra_fields['surname'] = surname
    }
    extra_fields['name'] = name;
    console.log(extra_fields['account_holder_type'],extra_fields['account_type'])
    if(extra_fields['account_holder_type'] =="" && extra_fields['account_type'] ==""){
      return false;
    }
    return extra_fields;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

}
