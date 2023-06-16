import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})

export class ConfigurationComponent implements OnInit, OnDestroy {

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

  constructor(private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute, private apiService: ApiService, public toastrService: ToastrService) {

    this.configurationForm = this.formBuilder.group({});

    this.foodForm = this.formBuilder.group({
      foodName: ["", Validators.required],
      price: ["", Validators.required],
      description: ["", Validators.required]
    });

    this.parkingForm = this.formBuilder.group({
      totalSlots: ["", Validators.required],
      title: ["", Validators.required],
      price: ["", Validators.required],
      description: ["", Validators.required]
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
    this.paymentType();

    await this.getConfiguration();
    if (this.configuration != '') {
      this.pTypeArray = this.configuration.allowedPaymentMethods || [];
      this.parkingList = this.configuration.parkingOptions || [];
      this.foodList = this.configuration.eventFoodOptions || [];
      this.showFood = false;
      this.showParking = false;
      this.configurationList.forEach((item, index) => {
        this.configurationList[index]['checked'] = this.configuration[item.key];
      });
      let configurationList = [];
      this.configurationList.forEach((item, index) => {
        configurationList[item.key] = item['checked'];
        if (item['checked'] == true && item.key == "allowFood") {

          this.showFood = true;
        }
        if (item['checked'] == true && item.key == "paidParking") {
          this.showParking = true;
        }
      });
      this.paymentTypeList.filter((element, index) => {
        this.paymentTypeList[index]['checked'] = false;
      });
      this.pTypeArray.forEach((item, index) => {
        this.paymentTypeList.filter((element, index) => {
          if (element.value == item) {
            this.paymentTypeList[index]['checked'] = true;
          }
        });

        // if(i != null)
        // {
        //   this.paymentTypeList[i]['checked'] = true;
        // }else
        // {
        //   this.paymentTypeList[i]['checked'] = false;
        // }
      });
      this.configurationForm = this.formBuilder.group(configurationList);
    }

    this.saveSubscription = this.save.subscribe(() => {
      if (this.configurationForm.valid) {
        let formval = this.configurationForm.value;
        formval['eventFoodOptions'] = [];
        formval['parkingOptions'] = [];
        if (this.configurationForm.value['allowFood'] == true) {
          formval['eventFoodOptions'] = this.foodList;
        }
        if (this.configurationForm.value['paidParking']== true) {
          formval['parkingOptions'] = this.parkingList;
        }
        formval['allowedPaymentMethods'] = this.pTypeArray;
        let data = {
          path: "event/updateConfig/" + this.eventId,
          data: formval,
          isAuth: true
        };
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            this.response = response['data'];
            this.toastrService.success(response['status']['description']);
            this.response['data'] = this.configurationForm.value;

            this.configurationChange.emit(this.configurationForm.value);
            this.completed.emit();

          }
        });
      } else {
        this.toastrService.error("Please fill all required fields!");
      }
    });
  }

  addFoodItem() {
    if (this.foodForm.valid) {

      if (this.editFood != undefined) {
        this.foodList.splice(this.editFood, 1);
        this.editFood = undefined;
      }
      this.foodList.push(this.foodForm.value);
      this.foodForm.reset();
      this.submitFood = true;
    } else {
      this.submitFood = false;
      this.toastrService.error("Please fill required fields!");
    }
  }

  removeFoodList(i) {
    this.foodList.splice(i, 1);
  }

  editFoodList(data, id) {
    this.editFood = id;
    this.foodForm.patchValue({
      foodName: data.foodName,
      price: data.price,
      description: data.description
    });
  }


  addParkingItem() {
    if (this.parkingForm.valid) {
      if (this.editParking != undefined) {
        this.parkingList.splice(this.editParking, 1);
        this.editParking = undefined;
      }
      this.parkingList.push(this.parkingForm.value);
      this.parkingForm.reset();
      this.submitParking = true;
    } else {
      this.submitParking = false;
      this.toastrService.error("Please fill required fields!");
    }
  }

  removeParkingList(i) {
    this.parkingList.splice(i, 1);
  }

  editParkingList(data, id) {
    this.editParking = id;
    this.parkingForm.patchValue({
      title: data.title,
      totalSlots: data.totalSlots,
      price: data.price,
      description: data.description
    });
  }

  getConfiguration() {
    let request = {
      path: "event/configuration/eventConfig",
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        let configurationList = [];
        this.configurationList = response['data'];
        this.configurationList.forEach((item, index) => {
          this.configurationList[index]['checked'] = false;
          configurationList[item.key] = false;
        });
        this.configurationForm = this.formBuilder.group(configurationList);
        resolve(null);
      });
    });
  }

  paymentType() {
    let request = {
      path: "event/eventPaymentType",
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.paymentTypeList = response['data'];

      this.paymentTypeList.forEach((item, index) => {
        this.paymentTypeList[index]['checked'] = false;
      });
    });
  }

  onChangePaymentType(event, type: any) { // Use appropriate model type instead of any

    if (event.checked == true) {
      this.pTypeArray.push(type.value);
    } else {
      this.pTypeArray = this.pTypeArray.filter(t => t !== type.value);
    }
    this.pTypeArray.forEach((item, index) => {
      let i = this.paymentTypeList.findIndex((element) => {
        return (element.value == item);
      });
      // if(i != null)
      // {
      //   this.paymentTypeList[i]['checked'] = true;
      // }else
      // {
      //   this.paymentTypeList[i]['checked'] = false;
      // }
    });
  }

  submitConfig(event, user) {
    if(user.key == "allowFood")
    {
      if (event.value == true) {
        this.showFood = true;
      } else {
        this.showFood = false;
      }
    }else if( user.key == "paidParking")
    {
      if(event.value == true) {
        this.showParking = true;
      } else {
        this.showParking = false;
      }
    }
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  onBlur(event){
    if(event.target.value !== '')
     event.target.value = parseFloat(event.target.value).toFixed(2)
    }
    
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
}
