import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from "rxjs";
import { SpinnerService } from '../../../../../services/spinner.service';
import { data, merge } from 'jquery';
// import { validateConfig } from '@angular/router/src/config';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';

import { BsCurrentDateViewComponent } from 'ngx-bootstrap/datepicker/themes/bs/bs-current-date-view.component';
import { timeStamp } from 'console';
@Component({
  selector: 'app-configuration-pricing',
  templateUrl: './configuration-pricing.component.html',
  styleUrls: ['./configuration-pricing.component.scss']
})

export class ConfigurationPricingComponent implements OnInit, OnDestroy {

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
  registrationType: any = [];
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
  showFees: boolean = false;
  configType = '';
  submitBtn = true;
  selectedIndex = 0;
  endDateTimeForm: FormGroup;
  startDate = new Date();
  parkingoption: FormGroup;
  eventFoodOptions: FormGroup;
  myDate = new Date();
  now: any;
  newConfigurationList = [];
  newQuestionList: any = [];
  venueType: any;
  grpName: any;
  chk: boolean;
  queValue: any
  error: any = { isError: false, errorMessage: '' };
  isValidDate: any;
  storeMainQue: any = []
  storeSubQue: any = []
  storeconfig: any = []
  newQueResponse: any = []
  storeKeyName: any = []
  storeSelected: any = []
  questionRequest = {}
  selectedState: boolean
  registerselect: any = []
  flag: boolean
  
  /* dateValidator(control: FormControl): { [s: string]: boolean } {
     if (control.value) {
       const date = moment(control.value);
       const today = moment();
       if (date.isBefore(today)) {
         return { 'invalidDate': true }
       }
     }
     return null;
   }*/

  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, public toastrService: ToastrService) {
    this.configurationForm = this.formBuilder.group({});

    this.foodForm = this.formBuilder.group({
      registrationFees: ["", Validators.required],
      registrationType: ["", Validators.required]
    });
    var datePipe = new DatePipe('en-US');
    this.now = datePipe.transform(this.myDate, 'dd/MM/yyyy h:mm a');


    this.endDateTimeForm = this.formBuilder.group({
      donationEndDate: [''],
      donationGoal: ['0'],
      performanceEndDate: [''],
      registrationEndDate: [''],
      sponsorshipEndDate: [''],
      registrationRedirectUrl: [''],
      vendorRedirectUrl: ['']
    })

    // let performanceEndDateControl = this.endDateTimeForm.controls['performanceEndDate'];
    //
    //
    // performanceEndDateControl.valueChanges.subscribe(() => {
    //   if (performanceEndDateControl.value != "") {
    //     performanceEndDateControl.setValidators(this.dateValidator());
    //   }
    //   if(performanceEndDateControl.value == "")
    //   {
    //     performanceEndDateControl.setValidators(Validators.required)
    //   }
    //
    // });
    //
    //
    // let donationEndDateControl = this.endDateTimeForm.controls['donationEndDate'];
    //
    //
    // donationEndDateControl.valueChanges.subscribe(() => {
    //   if (donationEndDateControl.value != "") {
    //     donationEndDateControl.setValidators(this.dateValidator());
    //   }
    //   if(donationEndDateControl.value == "")
    //   {
    //     donationEndDateControl.setValidators(Validators.required)
    //   }
    //
    // });
    // let registrationEndDateControl = this.endDateTimeForm.controls['registrationEndDate'];
    //
    //
    // registrationEndDateControl.valueChanges.subscribe(() => {
    //   if (registrationEndDateControl.value != "") {
    //     registrationEndDateControl.setValidators(this.dateValidator());
    //   }
    //   if(registrationEndDateControl.value == "")
    //   {
    //     registrationEndDateControl.setValidators(Validators.required)
    //   }
    //
    // });
    // let sponsorshipEndDateControl = this.endDateTimeForm.controls['sponsorshipEndDate'];
    //
    //
    // sponsorshipEndDateControl.valueChanges.subscribe(() => {
    //   if (sponsorshipEndDateControl.value != "") {
    //     sponsorshipEndDateControl.setValidators(this.dateValidator());
    //   }
    //   if(sponsorshipEndDateControl.value == "")
    //   {
    //     sponsorshipEndDateControl.setValidators(Validators.required)
    //   }
    //
    // });


    this.parkingoption = this.formBuilder.group({

      description: ["", Validators.required],
      price: ["", Validators.required],
      title: ["", Validators.required],
      totalslot: ["", Validators.required],
    })
    this.eventFoodOptions = this.formBuilder.group({
      description: ["", Validators.required],
      foodName: ["", Validators.required],
      price: ["", Validators.required],

    })
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
    await this.getEventDetail();
    //await this.getConfiguration();
    await this.newCatwiseQuestions();
    this.getEventRegistrationType();

    if (this.configuration != '') {

      this.newConfigurationList.forEach((element, index) => {
        element.selected = [];
        if (this.configuration[element.key] == true) {
          element.selected.push(element.key);
        }

        element.eventConfigKeyModels.forEach((e, i) => {

          if (this.configuration[e.key] == true) {
            element.selected.push(e.key);
          }


        })
        if (element['selected'].length !== 0) {
          element.selected.push(element.key);
        }
        
      })
      console.log(this.newConfigurationList)
      this.registerselect.push(this.configuration)

      // this.newGroupByQuesList();
      //  console.log(Object.keys(this.configuration))

    }
    /*   if(this.eventDetail.eventConfigurations.gatewayConfiguration != null)
       {
         this.foodForm.patchValue({
           clientId: this.eventDetail.eventConfigurations.gatewayConfiguration.paypalConfiguration.clientId,
           clientSecret: this.eventDetail.eventConfigurations.gatewayConfiguration.paypalConfiguration.clientSecret,
         });
       }*/

    this.changeRegistrationType(this.eventDetail.eventConfigurations.registrationType);
    this.foodForm.patchValue({
      registrationType: this.eventDetail.eventConfigurations.registrationType,
      registrationFees: this.eventDetail.eventConfigurations.registrationFees,
    });
    this.endDateTimeForm.patchValue({
      donationEndDate: this.configuration.donationEndDate,
      donationGoal: this.configuration.donationGoal,
      performanceEndDate: this.configuration.performanceEndDate,
      registrationEndDate: this.configuration.registrationEndDate,
      sponsorshipEndDate: this.configuration.sponsorshipEndDate,
      registrationRedirectUrl: this.configuration.registrationRedirectUrl,
      vendorRedirectUrl: this.configuration.vendorRedirectUrl
    });

    this.saveSubscription = this.save.subscribe(() => {
      if (this.showFees == true && this.foodForm.value.registrationFees == 0) {
        this.submitBtn = false;
        this.toastrService.error("Please fill all required fields !");
        this.spinner.hide();
        return false;
      }

      if (this.foodForm.valid) {
        this.newConfigurationList.forEach((element, index) => {

          if (this.newConfigurationList[index]['chk'] == false) {
            this.newConfigurationList[index]['selected'] = []
          }


          this.storeSelected.push(element.selected)

        });


        this.storeSelected = this.storeSelected.filter(function (element) {
          return element != undefined;
        });

        var merged = [].concat.apply([], this.storeSelected);
        let tempArr = {}
        this.storeconfig.forEach((e, index) => {
          tempArr[e] = false
          merged.filter((element) => { if (element == e) { tempArr[e] = true } });
        });
        this.questionRequest = tempArr

  

        let formval = tempArr;
        formval['freeEvent'] = true;
        formval['registrationType'] = this.foodForm.value.registrationType;

        if (this.foodForm.value.registrationType != 'FREE') {
          formval['freeEvent'] = false;
          if (this.foodForm.value.registrationType == 'INDIVIDUAL') {
            formval['registrationFees'] = this.foodForm.value.registrationFees;
          } else {
            formval['registrationFees'] = 0;
          }

          if (this.foodForm.value.registrationType == 'AGE') {
            formval['newRegistrationType'] = 'PAID'
          }
        } else {
          delete formval['allowedPaymentMethods'];
        }

        formval['donationEndDate'] = this.endDateTimeForm.value.donationEndDate;
        formval['donationGoal'] = this.endDateTimeForm.value.donationGoal;
        formval['performanceEndDate'] = this.endDateTimeForm.value.performanceEndDate;
        formval['registrationEndDate'] = this.endDateTimeForm.value.registrationEndDate;
        formval['sponsorshipEndDate'] = this.endDateTimeForm.value.sponsorshipEndDate;
        formval['registrationRedirectUrl'] = this.endDateTimeForm.value.registrationRedirectUrl;
        formval['vendorRedirectUrl'] = this.endDateTimeForm.value.vendorRedirectUrl
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
            this.spinner.hide();
            // this.router.navigate(['eventlist/my-hosted-event']);
          }
          else {


            this.submitBtn = false;
            this.toastrService.error(response['status']['description']);
            // this.spinner.hide();
          }
        });

      }
      else {
        this.submitBtn = false;
        this.toastrService.error("Please fill all required fields!");
        this.spinner.hide();
        // this.submitBtn=false;
      }
      // else {


      //   this.submitBtn =false;
      //   this.toastrService.error("Please fill all required fields!");
      //   this.spinner.hide();


      // }
    });
    
  }
  isValiddate(date: string) {
    // return new RegExp(/^[ 0 ]{1,1}?[0-9- ]{9,15}$/).test(date);
    if (date < this.now) {
      return
    }
  }
  dateValidator(): ValidatorFn {
    return (control): ValidationErrors => {
      if (!this.isValidDate(control.value)) {
        return {
          'invaliddate': true
        }
      } else {
        return null;
      }
    }
  }
  submitConfig(event, user) {
    if (user.key == "allowFood") {
      if (event.value == true) {
        this.showFood = true;
      } else {
        this.showFood = false;
      }
    } else if (user.key == "paidParking") {
      if (event.value == true) {
        this.showParking = true;
      } else {
        this.showParking = false;

      }
    }
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
      this.foodForm.patchValue({
        allowedPaymentMethods: this.pTypeArray
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

  numberOnly(event): boolean {

    this.foodForm.value.registrationFees = parseInt(this.foodForm.value.registrationFees);
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  onBlur(event) {
    if (event.target.value !== '')
      event.target.value = parseFloat(event.target.value).toFixed(2)
  }

  getConfiguration() {
    let request = {
      path: "event/configuration/eventConfig/" + this.eventDetail.venueType,
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        let configurationList = [];
        this.configurationList = response['data'];

        configurationList['freeEvent'] = false;
        this.configurationList.forEach((item, index) => {
          this.configurationList[index]['checked'] = false;
          configurationList[item.key] = false;
        });
        this.configurationForm = this.formBuilder.group(configurationList);
        resolve(null);
      });
    });
  }

  changeTab(event) {
    let tab = event.tab.textLabel;
    this.configType = tab;
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

          this.venueType = this.eventDetail['venueType'];

          if (this.configuration['donationEndDate'] == null || this.configuration['donationEndDate'] == '') {
            this.endDateTimeForm.patchValue({
              donationEndDate: this.eventDetail['endDateTime']


            })

          }
          if (this.configuration['performanceEndDate'] == null || this.configuration['performanceEndDate'] == '') {
            this.endDateTimeForm.patchValue({
              performanceEndDate: this.eventDetail['endDateTime']
            })
          }
          if (this.configuration['registrationEndDate'] == null || this.configuration['registrationEndDate'] == '') {
            this.endDateTimeForm.patchValue({
              registrationEndDate: this.eventDetail['endDateTime']
            })

          }
          if (this.configuration['sponsorshipEndDate'] == null || this.configuration['sponsorshipEndDate'] == '') {
            this.endDateTimeForm.patchValue({
              sponsorshipEndDate: this.eventDetail['endDateTime']
            })
          }
        }
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

 
  getEventRegistrationType() {

    let request = {
      path: "event/eventRegistrationType?venueType=" + this.eventDetail['venueType'],
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.registrationType = response['data'];

    });
  }
  changeRegistrationType(value) {


    if (value == 'INDIVIDUAL') {
      this.showFees = true;
    } else {
      this.showFees = false;
    }
  }
  updateConfig() {


    //  this.spinner.show();


    if (this.showFees == true && this.foodForm.value.registrationFees == 0) {

      this.submitBtn = false;
      this.toastrService.error("Please fill all required fields !");
      this.spinner.hide();
      return false;
    }

    if (this.foodForm.valid) {

      this.newConfigurationList.forEach((element, index) => {
      this.storeSelected.push(element.selected)

      });


      this.storeSelected = this.storeSelected.filter(function (element) {
        return element != undefined;
      });

      var merged = [].concat.apply([], this.storeSelected);


      let tempArr = {}


      this.storeconfig.forEach((e, index) => {
        tempArr[e] = false
        merged.filter((element) => { if (element == e) { tempArr[e] = true } });
      });
      this.questionRequest = tempArr



      let formval = tempArr;
      formval['freeEvent'] = true;
      formval['registrationType'] = this.foodForm.value.registrationType;

      if (this.foodForm.value.registrationType != 'FREE') {
        formval['freeEvent'] = false;
        if (this.foodForm.value.registrationType == 'INDIVIDUAL') {
          formval['registrationFees'] = this.foodForm.value.registrationFees;
        } else {
          formval['registrationFees'] = 0;
        }

        if (this.foodForm.value.registrationType == 'AGE') {
          formval['newRegistrationType'] = 'PAID'
        }
      } else {
        delete formval['allowedPaymentMethods'];
      }

      formval['donationEndDate'] = this.endDateTimeForm.value.donationEndDate;
      formval['donationGoal'] = this.endDateTimeForm.value.donationGoal;
      formval['performanceEndDate'] = this.endDateTimeForm.value.performanceEndDate;
      formval['registrationEndDate'] = this.endDateTimeForm.value.registrationEndDate;
      formval['sponsorshipEndDate'] = this.endDateTimeForm.value.sponsorshipEndDate;
      formval['registrationRedirectUrl'] = this.endDateTimeForm.value.registrationRedirectUrl;
      formval['vendorRedirectUrl'] = this.endDateTimeForm.value.vendorRedirectUrl
      let data = {
        path: "event/updateConfig/" + this.eventId,
        data: formval,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.response = response['data'];

          // this.toastrService.success(response['status']['description']);
          this.response['data'] = this.configurationForm.value;
          this.configurationChange.emit(this.configurationForm.value);
          // this.completed.emit();
          this.spinner.hide();
          // this.router.navigate(['eventlist/my-hosted-event']);
        }
        else {


          this.submitBtn = false;
          this.toastrService.error("Please fill all required fields!");
          // this.spinner.hide();


        }
      });

    }
    // else {


    //   this.submitBtn =false;
    //   this.toastrService.error("Please fill all required fields!");
    //   this.spinner.hide();


    // }

  }
  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];



  


  newCatwiseQuestions() {

    let request = {
      path: "event/configuration/eventConfig/group?venueType=" + this.eventDetail['venueType'],
      isAuth: true,
    };
    let array: any = []
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.newConfigurationList = response['data'];
        
        this.newConfigurationList.forEach(item => {

          this.storeMainQue.push(item.key)
          item.eventConfigKeyModels.forEach(element => {

            this.storeSubQue.push(element.key)
          });
       
          resolve(null);
        })
        this.storeconfig.push(this.storeMainQue, this.storeSubQue)
        this.storeconfig = [].concat.apply([], this.storeconfig);
      });
   });
 }

  checkUncheckMain(event:MatOptionSelectionChange, list:any, groupname:any, index) {
  

    if (event.source.selected) {

      list.chk = true
      this.chk = list.chk
      this.grpName = groupname
      // this.newGroupByQuesList()
      
     

    }
    else {
      
      list.chk = false
      this.chk = list.chk
     
     this.storeSelected  = this.storeSelected .filter(item => item != list.key  );
     list['selected'].forEach(element => {
      this.storeSelected  =this.storeSelected .filter(item => item != element );
     });
    
      this.storeSelected = [].concat.apply([], this.storeSelected);
     


    };

  }

  checkUncheckSub(event:MatOptionSelectionChange, keyname, index, list) {

    if (event.source.selected) {

      this.storeSelected.push(keyname)
      this.storeSelected = [].concat.apply([], this.storeSelected);
    
    }
    else {
      this.flag = false
      this.storeSelected = this.storeSelected.filter(item => item != keyname);
     
    }

  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }

  
 

}
