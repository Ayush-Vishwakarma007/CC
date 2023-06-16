import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {SpinnerService} from "../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-affiny-pay-new',
  templateUrl: './affiny-pay-new.component.html',
  styleUrls: ['./affiny-pay-new.component.scss']
})
export class AffinyPayNewComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input()
  publicKey = '';
  @Input()
  save: Subject<any>;
   _destroy : Subject<any> = new Subject();
  saveSubscription: Subscription;
  hostedFields = '';
  hostedFieldsConfiguration = {}
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() checkoutArrayChange: EventEmitter<any> = new EventEmitter();
  callback: any;
  status: boolean = false;
  token=''
  yearList=[];
  exp_month='';
  exp_year='';
  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    var year = new Date().getFullYear();
    this.yearList.push(year);
    for (var i = 1; i < 15; i++) {
      this.yearList.push(year + i);
    }
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

  @HostListener('unloaded')
  ngOnDestroy() {
    console.log('sss');
    $('#credit_card_field_id').html('');
    $('#cvv_field_id').html('');
    this.saveSubscription.unsubscribe();
  }

  ngOnChanges() {
    console.log('dddccc');
  }

  ngOnInit() {
    if (this.publicKey != '') {
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
    }
    console.log(this.save.observers,this.saveSubscription)

    this.saveSubscription = this.save.subscribe((data) => {console.log('bbbbbbbb',data)
      this.returnData();
    return false
    });

    this.callback = (state) => {
    }
  }

  ngAfterViewInit() {
    this.hostedFields = window['AffiniPay'].HostedFields.initializeFields(this.hostedFieldsConfiguration, this.callback)
  }

  submitPay() {
    this.spinner.show();
    let status = false;
    this.status = false;
    this.token = ''
    console.log(this.hostedFields,"dfds", this.hostedFields['getState']());
    console.log(this.getFormData());
    return new Promise(resolve => {
      this.hostedFields['getPaymentToken'](this.getFormData()).then((paymentResult) => {
        this.token = paymentResult['id'];
      }).catch((err) => {
        status = true;
      })
      setTimeout(() => {
        resolve(this.token)
      }, 3000);
    });



  }

  returnData() {
    this.submitPay().then((value) => {
      console.log(value);
      if (this.token != '') {
        this.checkoutArray['nonce'] = this.token;
        this.completed.emit();
        this.spinner.hide();
      } else {
        if(this.hostedFields['getState']().fields[0].error){
          this.toastrService.error(this.hostedFields['getState']().fields[0].error);
        }else  if(this.hostedFields['getState']().fields[1].error){
          this.toastrService.error(this.hostedFields['getState']().fields[1].error);
        }else{
          this.toastrService.error('Please enter valid card or CVV number');
        }
        this.spinner.hide();
      }
    });
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
    formData['exp_month']= this.exp_month;
    formData['exp_year']= this.exp_year;
    console.log(formData)
    return formData;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  hide = true;

  myFunction() {
    this.hide = !this.hide;
    
  }

}
