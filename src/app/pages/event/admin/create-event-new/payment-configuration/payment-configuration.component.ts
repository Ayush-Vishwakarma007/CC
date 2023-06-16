import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, Subscription} from "rxjs";
import { SpinnerService } from '../../../../../services/spinner.service';

@Component({
  selector: 'app-payment-configuration',
  templateUrl: './payment-configuration.component.html',
  styleUrls: ['./payment-configuration.component.scss']
})
export class PaymentConfigurationComponent implements OnInit {
  @Input()
  save: Subject<any>;
  @Input() eventId = "";
  @Output() configurationChange: EventEmitter<any> = new EventEmitter();
  @Output() completed: EventEmitter<any> = new EventEmitter();
  saveSubscription: Subscription;
  configurationForm: FormGroup;
  foodForm: FormGroup;
  parkingForm: FormGroup;
  paymentTypeList: any = [];
  configurationList: any = [];
  foodList: any = [];
  parkingList: any = [];
  submitFood = true;
  editFood: any;
  showFood: boolean = false;
  showParking: boolean = false;
  response: any = [];
  pTypeArray: any = [];
  submitParking = true;
  editParking: any;
  eventDetail: any = [];
  configType = '';
  submitBtn  = true;
  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, public toastrService: ToastrService) {
    this.configurationForm = this.formBuilder.group({
      clientId:["", Validators.required],
      clientSecret:["", Validators.required]
    });


  }

  _configuration: any;

  @Input()
  get configuration() {
    return this._configuration;
  }

  set configuration(value) {
    this._configuration = value;
    this.configurationChange.emit(value);
  }

  async ngOnInit() {
    await this.getEventDetail();
    this.configType ='';
    if(this.eventDetail.eventConfigurations.gatewayConfiguration != null)
    {
      this.configurationForm.patchValue({
        clientId: this.eventDetail.eventConfigurations.gatewayConfiguration.paypalConfiguration.clientId,
        clientSecret: this.eventDetail.eventConfigurations.gatewayConfiguration.paypalConfiguration.clientSecret,
      });
    }
    this.saveSubscription = this.save.subscribe(() => {
      this.spinner.show();
      if (this.configurationForm.valid) {
        let formval = {};
        formval['allowedPaymentMethods'] = ['PAYPAL'];
        formval['gatewayConfiguration']= {
            "paypalConfiguration":  this.configurationForm.value
          };
        let data = {
          path: "event/updateConfig/" + this.eventId,
          data: formval,
          isAuth: true
        };
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            this.response = response['data'];
            this.toastrService.success(response['status']['description']);
            this.completed.emit();
            this.spinner.hide();
            // this.router.navigate(['eventlist/my-hosted-event']);
          }
        });
      } else {
        this.submitBtn =false;
        this.toastrService.error("Please fill all required fields!");
        this.spinner.hide();
      }
    });
  }
  getEventDetail() {
    let data = {
      path: "event/details/" + this.eventId,
      isAuth: true
    };
    return new Promise((resolve) => {
      this.apiService.get(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.eventDetail = response['data'];
        }
        resolve(null);
      });
    });
  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
}
