import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {configuration} from '../../../configration';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {

  isOpenSideMenu: boolean = true;
  step: any = [];
  activeTabName :any;
  mediaUploadUrl = "event/uploadPicture";
  mediaList = [];
  mediaUrl = [];
  eventId = "5de5f2744914d61844801360";
  basicInformationForm: FormGroup;
  dynamicFieldAddForm: FormGroup;
  ConfigurationForm: FormGroup;
  PriceForm: FormGroup;
  seatingForm: FormGroup;
  stateForm: FormGroup;

  seatArray: any = [];
  roleList: any = [];
  roleTypeList: any = [];
  selectedBtn: any = "TEXT";
  optionshow: boolean = false;
  eventTypeList: any;
  eventStateList: any;
  paymentTypeList: any;
  dynamicFieldArray: any = [];

  submitBasic: boolean = false;
  submitImageUpload: boolean = false;
  submitDynamic: boolean = false;
  submitConfiguration: boolean = false;
  submitPrice: boolean = false;
  submitSeat: boolean = false;
  submitSession: boolean = false;
  submitSchedule: boolean = false;
  submitState: boolean = false;


  tags = [];
  tagName = "";
  editId: any;
  editOption: any;
  userPriceArray: any = [];
  vendorPriceArray: any = [];
  ruleType: any;
  editPrice: any;
  pTypeArray: any = [];
  showData: any = [];
  showSchedule: boolean = false;
  showDiscount: boolean = false;
  dynamicFieldIconMapping = {
    "TEXT": "icon-capitalize",
    "DROPDOWN_SINGLE": "icon-drop-down-round-button",
    "DROPDOWN_MULTI": "icon-drop-down icon",
    "RADIOBUTTON": "icon-radio-on-button",
    "CHECKBOX_SINGLE": "icon-check-sign-in-a-square",
    "CHECKBOX_MULTI": "icon-shopping-list",
    "TEXTAREA": "icon-document-rounded-square-interface-symbol-with-text-lines",
  };


  foodList: any[] = [
    {
      foodName: "",
      price: ""
    }
  ];
  seatList: any[] = [{name: ''}];

  optionList: any[] = [{name: ''}];
  dynamicField: any[];

  constructor(private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.basicInformationForm = this.formBuilder.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      dateTime: ['', Validators.required],
      endDateTime: ['', Validators.required],
      description: ['', Validators.required],
      details: ['', Validators.required],
      name: ['', Validators.required],
      country: ['', Validators.required],
      tags: ['', Validators.required],
      type: ['', Validators.required],
    });
    this.dynamicFieldAddForm = this.formBuilder.group({
      fieldName: ['', Validators.required],
      answerLevel: ['', Validators.required],
      required: ['', Validators.required],
      options: [''],
    });
    this.ConfigurationForm = this.formBuilder.group({
      allowGuests: ['true'],
      allowedPaymentMethods: [[], Validators.required],
      cancellable: ['false'],
      allowSponsorship: ['true'],
      multipleFoodSelection: ['true'],
      paidParking: ['true'],
      eventCapacity: [''],
      allowFood:['true'],
      lowestPriceTicketFree:['false'],
      freeEvent:['false'],
      vendorExpo:['false'],
      allowDonor:['false'],
      freeSeating:['false'],

    });
    this.PriceForm = this.formBuilder.group({
      ruleName: ['', Validators.required],
      ruleType: ['', Validators.required],
      rule: ['', Validators.required],
      maxValue: ['0', Validators.min(1)],
      minValue: ['0', Validators.min(0)],
      maxDiscount: ['0', Validators.min(1)],
      name: [''],
      type: ['USER'],
      parkingFeesPerVehicle: ['0']
    });
    this.seatingForm = this.formBuilder.group({
      seatingCategoryName: ['', Validators.required],
      categoryPrice: ['', Validators.required],
      seatingCategoryId: ['']
    });
    this.stateForm = this.formBuilder.group({
      eventState: ['', Validators.required],
    });
  }

  ngOnInit() {
    document.querySelector("body").removeAttribute('class'); ///remove body class after modal

    this.route.params.subscribe(params =>
      this.editId = params['string']
    );
    this.dynamicFieldType();
    this.eventType();
    this.paymentType();
    this.roles();
    this.getSeatList();
    this.eventState();
    this.getStep();
    if (this.editId != undefined) {
      this.editEvent();
    }

  }

  addTag(e) {
    this.tags.push(e.value);
    this.tagName = "";
    this.basicInformationForm.patchValue({
      tags: this.tags
    });
    $('.mat-chip-input').val('');
  }

  remove(i) {
    this.tags.splice(i, 1);
    this.basicInformationForm.patchValue({
      tags: this.tags
    });
  }

  addNewOption() {
    this.optionList.push({});
  }

  removeLastOption() {
    this.optionList.pop();
  }

  addNewSeat() {
    this.seatList.push({name: ''});
  }

  removeLastSeat() {
    this.seatList.pop();
  }

  addFoodItem() {
    this.foodList.push({
      foodName: "",
      price: ""
    });
  }

  removeIndex(i) {
    this.foodList.splice(i, 1);
  }


  openActiveTab(tabName) {
    this.nextBackActiveTab(tabName,'current');
  }

  dynamicSelectedBtn(name, option) {
    this.selectedBtn = name;
    this.optionshow = option;
  }

  removeDynamicField(i) {
    this.dynamicFieldArray.splice(i, 1);
  }

  addDynamicField() {
    if (this.dynamicFieldAddForm.valid) {

      let formval = this.dynamicFieldAddForm.value;
      let array = {};

      array['answerLevel'] = formval.answerLevel;
      array['fieldName'] = formval.fieldName;
      array['fieldType'] = this.selectedBtn;
      array['required'] = formval.required;
      let optionList = this.optionList.filter(function (entry) {
        return entry.name.trim() != '';
      });
      if (this.optionshow == true && optionList.length == 0) {
        this.toastrService.error("Please fill all required fields!");
      } else {
        array['options'] = this.optionList.map(e => e.name);
        if (this.editOption != undefined) {
          this.dynamicFieldArray[this.editOption] = array;
          this.editOption = undefined;
        } else {
          this.dynamicFieldArray.push(array);
        }
        this.dynamicFieldAddForm.reset();
        this.optionList = [];
        this.optionList.push({name: ''});
        this.selectedBtn = 'TEXT';
        this.optionshow = false;
      }
    } else {
      this.toastrService.error("Please fill all required fields!");
    }
  }

  editDynamicField(data, index) {
    this.editOption = index;
    this.dynamicFieldAddForm.patchValue({
      fieldName: data.fieldName,
      answerLevel: data.answerLevel,
      required: data.required,
    });
    this.optionList = [];
    data.options.forEach(item => {
      this.optionList.push({name: item});
    });
    var array = this.dynamicField.filter(function (item) {
      return item.value === data.fieldType;
    })[0];
    this.dynamicSelectedBtn(data.fieldType, array['allowOption']);

  }

  dynamicFormSubmit() {
    if (this.dynamicFieldArray.length != 0) {
      let formval = this.dynamicFieldAddForm.value;
      let formData = {
        "dynamicFields": this.dynamicFieldArray
      };
      let data = {
        path: "event/updateDynamicFields/" + this.eventId,
        data: formData,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.submitDynamic = true;
          this.nextBackActiveTab(this.activeTabName,'next');
        }
      });
    } else {
      this.toastrService.error("Please fill all required fields!");
    }

  }

  onChangePaymentType(event, type: any) { // Use appropriate model type instead of any
    if (event.checked == true) {
      this.pTypeArray.push(type.value);
    } else {
      this.pTypeArray = this.pTypeArray.filter(t => t !== type.value);
    }
    this.ConfigurationForm.patchValue({
      allowedPaymentMethods: this.pTypeArray
    });

  }

  submitConfig() {
    if (this.ConfigurationForm.valid) {
      let formval = this.ConfigurationForm.value;
      formval['eventFoodOptions'] = this.foodList;
      let data = {
        path: "event/updateConfig/" + this.eventId,
        data: formval,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.submitConfiguration = true;
          this.toastrService.success(response['status']['description']);
          this.nextBackActiveTab(this.activeTabName,'next');

        }
      });
    } else {
      this.toastrService.error("Please fill all required fields!");
    }
  }


  submitBasicInformation() {
    if (this.basicInformationForm.valid) {
      if (new Date(this.basicInformationForm.value.dateTime) <= new Date(this.basicInformationForm.value.endDateTime)) {
        let formData = this.basicInformationForm.value;
        //formData['dateTime']="2019-11-27T06:32:12.007Z";
        let data = {};
        formData['tags'] = ["tags"];
        if (this.editId != undefined) {
          data = {
            path: "event/update/" + this.editId,
            data: formData,
            isAuth: true
          };
        } else {
          data = {
            path: "event/create",
            data: formData,
            isAuth: true
          };
        }
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            this.eventId = response['data']['id'];
            this.submitBasic = true;
            this.nextBackActiveTab(this.activeTabName,'next');
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });

      } else {
        this.toastrService.error("Please enter valid Time!");
      }
    } else {
      this.toastrService.error("Please fill all required fields!");
    }

  }

  submitMedia() {
    let mediaUrl = [];
    if (this.mediaList.length > 0) {
      this.mediaList.forEach(item => {
        mediaUrl.push(item.responseData.data.profilePictureUrl);
      });
          let data = {
        path: "event/updateImages/" + this.eventId,
        data: {
          'eventProfilePicture': mediaUrl[0],
          'imagePictures':  mediaUrl
        },
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.nextBackActiveTab(this.activeTabName,'next');
          this.submitImageUpload = true;
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    } else {
      this.toastrService.error('Please add Image');

    }


  }

  invalidUploadFile() {
    //this.notify.notifyUserError('Please upload vaild file');
  }

  maxFileError() {
    //this.notify.notifyUserError('Maximum 4 files allowed');
  }

  fileSizeError() {
    //this.notify.notifyUserError('Maximum 4MB size allowed');
  }

  uploadStarted() {
    //this.isFileUploading=true;
  }

  queueCompleted() {
    this.mediaUrl = [];
    if (this.mediaList.length > 0) {
      this.mediaList.forEach(item => {
        this.mediaUrl.push(item.responseData.data);
      });
    }
  }

  dynamicFieldType() {
    let request = {
      path: "event/dynamicFieldType",
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.dynamicField = response['data'];
    });
  }

  eventType() {
    let request = {
      path: "event/eventType",
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.eventTypeList = response['data'];
    });
  }

  eventState() {
    let request = {
      path: "event/eventState",
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.eventStateList = response['data'];
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

  roles() {
    let request = {
      path: "event/ruleName",
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.roleList = response['data'];
    });
  }

  changeRoles(roleValue) {
    let data = [];
    data = this.roleList.filter(t => t.value === roleValue);
    this.showData = [];
    this.roleTypeList = [];
    if (data.length != 0) {
      this.roleTypeList = data[0]['ruleTypes'];
      this.showData = data[0];
      this.PriceForm.patchValue({minValue: 0, maxValue: 0, ruleType: '', maxDiscount: ''});
    }


  }

  changeRolesType(typeValue) {
    let role = this.PriceForm.value.ruleName;
    this.showDiscount = false;
    if (role == 'DONOR' && typeValue == "PERCENT") {
      this.showDiscount = true;
    }

  }

  addEventPrice() {
    let submit = true;
    if (this.PriceForm.valid) {
      if ((this.showData.takeMin && this.PriceForm.value.minValue == '') ||
        (this.showData.takeMax && this.PriceForm.value.maxValue == '') ||
        (this.PriceForm.value.minValue > this.PriceForm.value.maxValue)) {
        if (this.showData.ruleFormat == 'DATE_TIME' && ((this.PriceForm.value.minValue.toISOString()) > (this.PriceForm.value.maxValue.toISOString()))) {
          submit = false;
        }
        submit = false;
        this.toastrService.error("Please enter valid Value !");
      }
      if ((this.showDiscount && this.PriceForm.value.maxDiscount == '') || (this.showData.takeName && this.PriceForm.value.name == '') || (this.ConfigurationForm.value.paidParking == 'true' && this.PriceForm.value.parkingFeesPerVehicle <= '0')) {
        submit = false;
        this.toastrService.error("Please fill all required fields!");
      }

      if (submit) {
        let array = {};
        let data = this.roleList.filter(t => t.value === this.PriceForm.value.ruleName);
        array['ruleName'] = this.PriceForm.value.ruleName;
        array['ruleType'] = this.PriceForm.value.ruleType;
        array['rule'] = this.PriceForm.value.rule;
        array['min'] = this.PriceForm.value.minValue;
        array['max'] = this.PriceForm.value.maxValue;
        array['name'] = this.PriceForm.value.name;
        array['parkingFeesPerVehicle'] = this.PriceForm.value.parkingFeesPerVehicle;

        array['showRole'] = data[0].name;
        array['showMin'] = this.PriceForm.value.minValue;
        array['showMax'] = this.PriceForm.value.maxValue;

        if (data[0].ruleFormat == 'DATE_TIME') {
          array['showMin'] = configuration.dateFormat(this.PriceForm.value.minValue);
        }
        if (this.editPrice != undefined) {
          if (this.ruleType == 'USER') {
            delete this.userPriceArray[this.editPrice];
          } else if (this.ruleType == 'VENDOR') {
            delete this.vendorPriceArray[this.editPrice];
          }
          this.vendorPriceArray = this.vendorPriceArray.filter(t => t !== '');
          this.userPriceArray = this.userPriceArray.filter(t => t !== '');
          this.editPrice = undefined;
        }

        if (this.PriceForm.value.type == 'USER') {
          this.userPriceArray.push(array);
        } else if (this.PriceForm.value.type == 'VENDOR') {
          this.vendorPriceArray.push(array);
        }
        this.showData = [];
        this.PriceForm.patchValue({
          minValue: 0,
          maxValue: 0,
          ruleType: '',
          ruleName: '',
          rule: 0,
          maxDiscount: 0,
          type: "USER"
        });
      }
    } else {
      this.toastrService.error("Please fill all required fields!");
    }
  }

  submitEventPrice() {
    let data = {
      path: "event/updatePricing/" + this.eventId,
      data: {
        'parkingFeesPerVehicle': this.PriceForm.value.parkingFeesPerVehicle,
        'userRules': this.userPriceArray,
        'vendorRules': this.vendorPriceArray

      },
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.submitPrice = true;
        this.nextBackActiveTab(this.activeTabName,'next');
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  removeFromPriceArray(id, type) {
    if (type == 'user') {
      this.userPriceArray.splice(id, 1);
    }
  }

  editPriceArray(data, index, type) {
    this.changeRoles(data.ruleName);
    this.editPrice = index;
    this.PriceForm.patchValue({
      minValue: data.min,
      maxValue: data.max,
      ruleType: data.ruleType,
      ruleName: data.ruleName,
      maxDiscount: data.maxDiscount,
      rule: data.rule,
      name: data.name,
    });
    if (type == 'user') {
      this.ruleType = 'USER';
    } else if (type == 'vendor') {
      this.ruleType = 'VENDOR';
    }
  }

  addSeating() {
    let list = [];
    this.seatList.filter(function (entry) {
      list.push(entry.name);
    });

    let seats = list.filter(function (entry) {
      return entry.trim() != '';
    });
    if (seats.length == 0) {
      this.toastrService.error("Please fill all required fields!");
    } else {

      let data = {
        data: {
          'categoryPrice': this.seatingForm.value.categoryPrice,
          'seatingCategoryName': this.seatingForm.value.seatingCategoryName,
          'eventSeatingDetail': {
            'maxNumberOfSeatsInCategory': seats.length,
            'seats': seats
          }
        },
        isAuth: true
      };
      if (this.seatingForm.value.seatingCategoryId == '') {
        data['path'] = "event/createSeating/" + this.eventId;
      } else {
        data['path'] = "event/updateSeating/" + this.eventId + "/" + this.seatingForm.value.seatingCategoryId;
      }


      this.apiService.post(data).subscribe(response => {

        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.getSeatList();
          this.seatingForm.reset();
          this.seatList = [{name: ''}];
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
  }

  submitSeating() {
    this.submitSeat = true;
    this.nextBackActiveTab(this.activeTabName,'next');
  }

  getSeatList() {
    let data = {
      path: "event/getSeatings/" + this.eventId,
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      //console.log(response);
      if (response['status']['code'] == 'OK') {
        this.seatArray = response['data'];
        this.seatArray.forEach(item => {
          item['total'] = item['eventSeatingDetail']['seats'].length;
        });
      }
    });
  }

  editSeat(data) {
    this.seatingForm.patchValue({
      seatingCategoryId: data.seatingCategoryId,
      seatingCategoryName: data.seatingCategoryName,
      categoryPrice: data.categoryPrice
    });
    data.eventSeatingDetail.seats.forEach(item => {
      this.seatList.push({name: item});
    });
  }

  removeSeat(id) {
    let data = {
      path: "event/deleteSeating/" + this.eventId + "/" + id,
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      //console.log(response);
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.getSeatList();
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  submitScheduleData() {
    this.submitSchedule = true;
    this.nextBackActiveTab(this.activeTabName ,'next');
  }
  backSchedule() {
    this.nextBackActiveTab(this.activeTabName,'back');
  }
  backSession() {
    this.nextBackActiveTab(this.activeTabName,'back');
  }
  submitSessionData() {
    this.submitSession = true;
    this.nextBackActiveTab(this.activeTabName,'next');
  }

  addStateData() {
    if (this.stateForm.valid) {
      let data = {
        path: "event/changeState/" + this.eventId,
        data: this.stateForm.value,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.submitState = true;
          this.toastrService.success(response['status']['description']);
        }
      });
    } else {
      this.toastrService.error("Please fill all required fields!");
    }

  }
  submitStateData()
  {
      this.router.navigate(['my-event']);
  }

  editEvent() {
    let request = {
      path: "event/details/" + this.editId,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      let data = response['data'];

      this.tags = data.tags;
      this.basicInformationForm.patchValue({
        address: data.address,
        city: data.city,
        dateTime: new Date(configuration.dateFormat(data.dateTime)),
        endDateTime: new Date(configuration.dateFormat(data.endDateTime)),
        description: data.address,
        details: data.details,
        name: data.name,
        country: data.country,
        type: data.type,
        tags: this.tags
      });
      this.submitBasic =  true;
      this.pTypeArray = data.eventConfigurations.allowedPaymentMethods;
      this.foodList = data.eventConfigurations.eventFoodOptions;

      this.ConfigurationForm.patchValue({
        allowGuests: data.eventConfigurations.allowGuests,
        allowedPaymentMethods: this.pTypeArray,
        cancellable:  data.eventConfigurations.cancellable,
        allowSponsorship:  data.eventConfigurations.allowSponsorship,
        multipleFoodSelection: data.eventConfigurations.multipleFoodSelection,
        paidParking:  data.eventConfigurations.paidParking,
        eventCapacity:  data.eventConfigurations.eventCapacity,

        lowestPriceTicketFree:data.eventConfigurations.lowestPriceTicketFree,
        freeEvent:data.eventConfigurations.freeEvent,
        vendorExpo:data.eventConfigurations.vendorExpo,
        allowDonor:data.eventConfigurations.allowDonor,
        freeSeating:data.eventConfigurations.freeSeating,

      });

      this.vendorPriceArray =  data.pricing.vendorRules;
      this.userPriceArray = data.pricing.userRules;

      this.vendorPriceArray.forEach((item, index) => {
        let data1 = [];
         data1 = this.roleList.filter(t => t.value ===item.ruleName)[0];
        this.vendorPriceArray[index]['showRole'] =  data1['name'];
        this.vendorPriceArray[index]['showMin'] = item.min;
        this.vendorPriceArray[index]['showMax'] = item.max;

      });

      this.userPriceArray.forEach((item, index) => {
        let data1 = [];
        data1= this.roleList.filter(t => t.value ===item.ruleName)[0];
        this.userPriceArray[index]['showRole'] = data1['name'];
        this.userPriceArray[index]['showMin'] = item.min;
        this.userPriceArray[index]['showMax'] = item.max;

      });
      this.mediaList = data.imagePictures;
      this.mediaUrl = data.imagePictures;
      let i = 0;
      this.mediaList.forEach((item, index) => {
          let array =[];let array1 =[];
        this.mediaList[i] = [];
        array1['profilePictureUrl']  = item;
        array['data'] = array1;
        this.mediaList[i]['responseData'] =array;
        i++;
      });

      this.dynamicFieldArray = data.dynamicFields;

      this.stateForm.patchValue({
        eventState : data.eventState
      });

    });

  }
  getStep() {
    let data = {
      path: "event/eventCreateSteps",
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      //console.log(response);
      if (response['status']['code'] == 'OK') {
        this.step = response['data'];

        this.step.forEach((item, index) => {
          this.step[index]['active'] = false;
        });
        this.activeTabName = this.step[0]['step'];
      }
    });
  }


  nextBackActiveTab(currentTabName,type) {
    if (this.submitBasic == false) {
      this.toastrService.error('Please fill out basic Information first !');
    } else {
      let step;
      this.step.filter(function (entry,index) {
        if(entry.step == currentTabName)
        {
           step=index;
        }
      });
      if(type == 'next')
      {
        step = step+1;
      }else  if(type == 'back')
      {
        step = step-1;
      }
      this.step.forEach((item, index) => {
        if( this.activeTabName == item['step'])
        {
          this.step[index]['active'] = true;
        }
      });
       if(step >=0 && step < this.step.length)
       {
         let tab;
         tab = this.step[step]['step'];
         this.activeTabName = tab;
       }

    }
  }

}





