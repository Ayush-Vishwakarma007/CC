import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../../services/api.service';
import { Location, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from "rxjs";
import { SpinnerService } from '../../../../../services/spinner.service';
import { startWith } from "rxjs/internal/operators/startWith";
import { map } from "rxjs/operators";
import { merge } from 'rxjs'
import { time } from 'console';
import { Configuration, configuration } from 'src/app/configration';
import { start } from "repl";

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss']
})

export class BasicInfoComponent implements OnInit, OnDestroy {

  @Input()
  currentConfigDetail = [];

  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();

  @Input() eventId = "";
  @Output() basicInformationChange: EventEmitter<any> = new EventEmitter();
  basicInformationForm: FormGroup;
  eventCategory: any = [];
  eventCategoryType: any = [];
  eventType: any = [];
  venueType: any = [];
  tags: any = [];
  tagName = "";
  flag: boolean
  maploc = {
    componentRestrictions: { country: 'US' }
  };
  mediaList = [];
  mediaUploadUrl = "event/uploadPicture";
  @Input() save: Subject<any>;
  saveSubscription: Subscription;
  formatedAddress = '';
  submitBtn = true;
  response = [];
  communityList: any = [];
  showAddr: boolean = false;
  showmeetingUrl: boolean = false;
  zoomUrl = '';
  zoomAllow: boolean = false;
  showUrl: boolean = false;
  startDate = new Date();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  recurringEvent: boolean = false;
  scheduleTypeList: any = [];
  scheduleType = '';
  WeekDay: any = [];
  WeekDays: any = [];
  scheduleDay: any = [];
  cronScheduleRequest: any = {};
  statusRecurring: boolean = true;
  chapterList: any = [];
  userPermisssion: any = [];
  location: any = [];
  optionType: string[] = [];
  filteredEventType: Observable<string[]>;
  typeControl = new FormControl();
  optionCategory: string[] = [];
  filteredEventCategory: Observable<string[]>;
  categoryControl = new FormControl();
  updateCategorySubject: Subject<string> = new Subject();
  checkUrlPattern: any
  urlPattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, private datePipe: DatePipe, public router: Router, private route: ActivatedRoute, private apiService: ApiService, public toastrService: ToastrService) {
    this.basicInformationForm = this.formBuilder.group({
      addressLine1: ['', Validators.required],
      addressLine2: [null],
      city: ['', Validators.required],
      addressUrl: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      communityName: [''],
      chapterId: ['', Validators.required],
      name: ['', Validators.required],
      type: ['', Validators.required],
      category: ['', Validators.required],
      eventCapacity: ['', Validators.required],
      venueType: ['', Validators.required],
      venueTypeName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      arenaPicture: [''],
      recurringEvent: [''],
      meetingUrl: [''],
    });
  }

  _basicInformation: any;

  @Input()
  get basicInformation() {
    return this._basicInformation;
  }

  set basicInformation(value) {
    this._basicInformation = value;
    this.basicInformationChange.emit(value);
  }

  public handleAddressChange(address: any) {
    this.formatedAddress = address.formatted_address;
    let city = '';
    let region = '';
    let country = '';
    let zipCode = '';
    for (let i = 0; i < address.address_components.length; i++) {
      if (address.address_components[i].types[0] == "locality") {
        city = address.address_components[i].long_name;
      }
      if (address.address_components[i].types[0] == "administrative_area_level_1") {
        region = address.address_components[i].long_name;
      }
      if (address.address_components[i].types[0] == "country") {
        country = address.address_components[i].long_name;
      }
      if (address.address_components[i].types[0] == "postal_code") {
        zipCode = address.address_components[i].long_name;
      }
    }
    this.location = [];
    this.location.push(address.geometry.location.lat());
    this.location.push(address.geometry.location.lng());
    address.geometry.location.lat();
    this.basicInformationForm.patchValue({
      addressUrl: address.url,
      addressLine1: this.formatedAddress,
      city: city,
      state: region,
      country: country,
      zipCode: zipCode,
    });
  }

  async ngOnInit() {
    //this.getZoomUrl();
    await this.getEventType();
    await this.getCommunityList();
    await this.getCronScheduleType();
    await this.getWeekDay();
    await this.getWeekDays();
    await this.getScheduleDay();
    await this.getPermission();
    this.getChapterList();
    this.getVenueType();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.filteredEventType = this.typeControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filtertype(value))
      );
    this.filteredEventCategory = merge(this.categoryControl.valueChanges
      , this.updateCategorySubject).pipe(
        startWith(''),
        map(value => this._filtercategory(value))
      );
    if (this.basicInformation != '') {
      let dateTime = this.basicInformation.startDateTime.replace(/([+\-]\d\d)(\d\d)$/, "$1:$2");
      let startDateTime = new Date(dateTime);
      if (startDateTime < this.startDate) {
        this.startDate = new Date(this.basicInformation.startDateTime);
      }

      this.getEventCategoryType(this.basicInformation.type);
      this.basicInformationForm.patchValue({
        addressLine1: this.basicInformation.addressLine1,
        addressLine2: this.basicInformation.addressLine2,
        city: this.basicInformation.city,
        addressUrl: this.basicInformation.addressUrl,
        meetingUrl: this.basicInformation.meetingUrl,
        country: this.basicInformation.country,
        chapterId: this.basicInformation.chapterId,
        state: this.basicInformation.state,
        zipCode: this.basicInformation.zipCode,
        communityName: this.basicInformation.communityName,
        name: this.basicInformation.name,
        type: this.basicInformation.type,
        category: this.basicInformation.category,
        eventCapacity: this.basicInformation.eventCapacity,
        venueType: this.basicInformation.venueType,
        startDate: new Date(this.basicInformation.startDateTime),
        startTime: new Date(this.basicInformation.startDateTime),
        endDate: new Date(this.basicInformation.endDateTime),
        endTime: new Date(this.basicInformation.endDateTime),
        venueTypeName: this.basicInformation.venueTypeName,
        arenaPicture: this.basicInformation.arenaPicture
      });
      if (this.basicInformation.location) {
        this.location = this.basicInformation.location;
      }
      this.myControl.patchValue(this.basicInformation.communityName);
      //this.myControl =this.basicInformation.communityName;
      console.log(this.myControl);

      this.recurringEvent = this.basicInformation.recurringEvent;
      if (this.basicInformation['cronScheduleRequest'] != null) {
        this.cronScheduleRequest = this.basicInformation['cronScheduleRequest'];
        this.changeType(this.cronScheduleRequest['scheduleType']);
        if (this.cronScheduleRequest['weekDays'] != null) {
          this.WeekDay.map((item) => {
            this.cronScheduleRequest['weekDays'].map((week) => {
              if (item['value'] == week) {
                item['check'] = true;
              }
            });
          });
        }
        if (this.cronScheduleRequest['cronMonthWeekDay'] == null) {
          this.cronScheduleRequest['type'] = 'month';
        } else {
          this.cronScheduleRequest['weekIndex'] = this.cronScheduleRequest['cronMonthWeekDay']['weekIndex'];
          this.cronScheduleRequest['weekDay'] = this.cronScheduleRequest['cronMonthWeekDay']['weekDay'];
        }
      }
      let array = [];
      if (this.basicInformation.arenaPicture != '') {
        array.push(this.basicInformation.arenaPicture);
      }
      array.forEach((item, index) => {
        this.mediaList[index] = [];
        this.mediaList[index]['responseData'] = [];
        this.mediaList[index]['responseData']['data'] = [];
        this.mediaList[index]['responseData']['data']['imageUrl'] = item;
      });
    }
    this.saveSubscription = this.save.subscribe((data) => {
      this.flag = data
      console.log(data)
      this.spinner.show();
      this.basicInformationForm.patchValue({
        communityName: this.myControl.value
      });
      if (this.basicInformationForm.valid) {

        this.submitBtn = true;
        let data = {};
        let image = '';
        if (this.mediaList[0] != undefined) {
          image = this.mediaList[0]['responseData']['data']['imageUrl'];
        }
        this.basicInformationForm.patchValue({
          arenaPicture: image
        });
        let formData = this.basicInformationForm.value;
        let addressurl = this.basicInformationForm.value.addressUrl;
        let meetingurl = this.basicInformationForm.value.meetingUrl;
        formData['meetingUrl'] = meetingurl;
        formData['addressUrl'] = addressurl;

        formData['customTemplate'] = this.currentConfigDetail['customTemplate'];

        let sDate = configuration.dateFormatCreateEvent(this.basicInformationForm.value.startDate);
        let sTime = configuration.getTimeCreateEvent(this.basicInformationForm.value.startTime);
        let eDate = configuration.dateFormatCreateEvent(this.basicInformationForm.value.endDate);
        let eTime = configuration.getTimeCreateEvent(this.basicInformationForm.value.endTime);

        formData['startDateTime'] = new Date(sDate + ' ' + sTime);
        formData['endDateTime'] = new Date(eDate + ' ' + eTime);

        delete formData['startDate'];
        delete formData['endDate'];
        delete formData['startTime'];
        delete formData['endTime'];

        if (this.currentConfigDetail['templateConfig']) {
          formData['configurationAnswers'] = this.currentConfigDetail['templateConfig']['configurationAnswers'];
          formData['templateId'] = this.currentConfigDetail['templateConfig']['id'];
        }
        let statusRecurring = true;
        formData['recurringEvent'] = this.recurringEvent;
        if (this.recurringEvent) {
          if (this.cronScheduleRequest['type'] == 'month') {
            this.cronScheduleRequest['cronMonthWeekDay'] = null;
          } else if (this.cronScheduleRequest['type'] == 'week') {
            delete this.cronScheduleRequest['dayOfMonth'];
          }
        }
        this.validateRecurring();
        if (this.statusRecurring != true) {
          this.toastrService.error("Please fill all recurring event fields!");
          this.spinner.hide();
          return false;
        }
        formData['location'] = this.location;
        if (this.location.length == 0) {
          formData['location'] = null;
        }


        formData['cronScheduleRequest'] = this.cronScheduleRequest;

        if (this.eventId != '' && this.eventId != undefined) {
          data = {
            path: "event/update/" + this.eventId,
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

        this.basicInformationChange.emit(this.basicInformationForm.value);
        this.apiService.post(data).subscribe(response => {
          console.log(this.showmeetingUrl, formData['meetingUrl'])
          if ((this.showmeetingUrl == true && (formData['meetingUrl'] == null || formData['meetingUrl'] == ''))) {

            this.toastrService.error("Please fill all required fields!");
            this.submitBtn = false;
            this.spinner.hide();
            return false
          }
          else {
            if (this.showmeetingUrl == true && (formData['meetingUrl'] != '')) {
              if (formData['meetingUrl'].match(this.urlPattern)) {
                // this.toastrService.success("success match!"); 
              }
              else {
                this.toastrService.error("please enter valid url!");
                this.submitBtn = false;
                this.spinner.hide();
                return false
              }
            }

            if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
              if (this.flag == false) {
                this.toastrService.success(response['status']['description']);
              }
              if (this.flag == true) {
                this.toastrService.success("Event saved successfully to draft!");
              }
              this.response = response['data'];
              this.eventId = this.response['id'];
              this.basicInformationChange.emit(this.response);
              this.completed.emit();
              this.next.emit();
              this.spinner.hide();
            } else {
              this.toastrService.error(response['status']['description']);
              this.submitBtn = false;
              this.spinner.hide();
            }
          }
        });

      } else {


        this.toastrService.error("Please fill all required fields!");
        this.spinner.hide();
        this.submitBtn = false;


      }
    });
  }
  handleDateChange(event) {
    let startDate = this.datePipe.transform(this.basicInformationForm.value.startDate, 'yyyy-MM-dd');
    let endDate = this.datePipe.transform(event, 'yyyy-MM-dd');
    if (endDate < startDate) {
      this.toastrService.error("End date should be greater than or equal to start date");
      this.basicInformationForm.patchValue({ endDate: "" });
    }
  }
  handleTimeChange(event) {
    let d = new Date(event)
    let startTime = this.basicInformationForm.value.startTime.getHours();
    let endTime = new Date(event).getHours();
    if (endTime < startTime) {
      this.toastrService.error("End time should be greater than start time");
      this.basicInformationForm.patchValue({ endTime: "" });
    }
  }
  remove(i) {
    this.tags.splice(i, 1);
    // this.basicInformationForm.patchValue({
    //   tags: this.tags
    // });
  }

  addTag(e) {
    this.tags.push(e.value);
    this.tagName = "";
    $('.mat-chip-input').val('');
  }

  submitBasicInformation() {

  }

  counter(i: number) {
    return new Array(i);
  }

  getCronScheduleType() {
    let request = {
      path: "event/cronScheduleType",
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.scheduleTypeList = response['data'];
        resolve(null);
      });
    });
  }

  changeType(value) {
    if (value == 'DAILY') {
      this.scheduleType = 'Day';
    } else if (value == 'WEEKLY') {
      this.scheduleType = 'Week';
    } else if (value == 'MONTHLY') {
      this.scheduleType = 'Month';
    } else {
      this.scheduleType = '';
    }
  }

  changeScheduleType(value) {
    this.spinner.show();
    delete this.cronScheduleRequest['weekDays'];
    delete this.cronScheduleRequest['weekIndex'];
    delete this.cronScheduleRequest['weekDay'];
    delete this.cronScheduleRequest['type'];
    delete this.cronScheduleRequest['dayOfMonth'];
    delete this.cronScheduleRequest['repeatCount'];
    delete this.cronScheduleRequest['cronMonthWeekDay'];
    if (value == 'DAILY') {
      this.scheduleType = 'Day';
    } else if (value == 'WEEKLY') {
      this.scheduleType = 'Week';
    } else if (value == 'MONTHLY') {
      this.scheduleType = 'Month';
      this.cronScheduleRequest['type'] = 'month';
      this.cronScheduleRequest['cronMonthWeekDay'] = {};
    } else {
      this.scheduleType = '';
    }
    this.setSchedule();
    this.spinner.hide();
  }

  setSchedule(type = '') {
    if (type == 'week') {
      let weeks = [];
      this.WeekDay.map((item) => {
        if (item['check'] && item['check'] == true) {
          weeks.push(item['value']);
        }
      });
      this.cronScheduleRequest['weekDays'] = weeks;
    } else if (type == 'month') {
      this.cronScheduleRequest['cronMonthWeekDay'] = {};
      delete this.cronScheduleRequest['dayOfMonth'];

    } else if (type == 'month+month') {
      this.cronScheduleRequest['type'] = 'month';
      this.cronScheduleRequest['cronMonthWeekDay'] = {};
    } else if (type == 'month+week+day') {
      this.cronScheduleRequest['type'] = 'week';
      this.cronScheduleRequest['cronMonthWeekDay']['weekDay'] = this.cronScheduleRequest['weekDay'];
    } else if (type == 'month+week+count') {
      this.cronScheduleRequest['type'] = 'week';
      this.cronScheduleRequest['cronMonthWeekDay']['weekIndex'] = this.cronScheduleRequest['weekIndex'];
    }
  }

  _filtertype(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(this.optionType);
    return this.optionType.filter(option => option.toLowerCase().includes(filterValue));
  }

  getEventType() {
    let request = {
      path: "event/eventType",
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.eventType = response['data'];
        this.optionType = [];
        this.eventType.forEach((item, index) => {
          this.optionType.push(item.name);
        });
        resolve(null);
      });
    });
  }

  getWeekDay() {
    let request = {
      path: "event/schedulerWeekDay",
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.WeekDay = response['data'];
        resolve(null);
      });
    });
  }

  getScheduleDay() {
    let request = {
      path: "event/schedulerOccurOn",
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.scheduleDay = response['data'];
        resolve(null);
      });
    });
  }

  getWeekDays() {
    let request = {
      path: "event/schedulerWeekDays",
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.WeekDays = response['data'];
        resolve(null);
      });
    });
  }

  _filtercategory(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionCategory.filter(option => option.toLowerCase().includes(filterValue));
  }

  getEventCategoryType(typeId, event = []) {
    let data = '';
    this.eventType.filter(element => {
      if (element['name'] == typeId) {
        data = element['id'];
      }
    });


    let request = {
      path: "event/getAllEventCategory/" + data,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.eventCategoryType = response['data'];
      this.optionCategory = [];
      this.eventCategoryType.forEach((item, index) => {
        this.optionCategory.push(item.name);
      });
      this.updateCategorySubject.next('');
    });
  }

  getChapterList() {
    let request;

    //if(this.userPermisssion['EVENT_CHAPTER_ACCESS']){
    request = {
      path: "community/chapters",
      isAuth: true
    };
    //}else{
    //   request = {
    //     path: 'community/chapters/access',
    //     isAuth: true,
    //   };
    // }

    this.apiService.get(request).subscribe(response => {
      this.chapterList = response['data'];
      if (this.chapterList.length == 1) {
        this.basicInformationForm.patchValue({
          chapterId: this.chapterList[0]['id']
        });
      }
    });
  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
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
    // let image = this.mediaList[0]['responseData']['data']['imageUrl'];
    // console.log(image);
    // this.basicInformationForm.patchValue({
    //   arenaPicture : image
    // });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  getVenueType() {
    let request = {
      path: "event/eventVenueType",
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.venueType = response['data'];

      if (this.basicInformation.venueTypeName == null) {
        let data = this.venueType.filter((item) => {
          if (item['value'] == this.basicInformation.venueType) {
            this.basicInformationForm.patchValue({
              venueTypeName: item['name'],
            });
            return item;
          }
        })[0];
      } else {
        this.changeVenueType(this.basicInformation.venueTypeName);
      }


    });
  }

  changeVenueType(event) {

    let data = this.venueType.filter((item) => {
      if (item['name'] == event) {
        this.basicInformationForm.patchValue({
          venueType: item['value'],
        });
        return item;
      }
    })[0];
    console.log(data)

    if (data) {
      if (data['acceptAddress'] == true) {
        this.showAddr = true;
      } else {
        this.showAddr = false;
        // this.basicInformationForm.patchValue({
        //   addressLine1: '',
        //   city: '',
        //   state: '',
        //   country: '',
        //   zipCode: '',
        // });
        //this.location = [];
      }

      if (data['acceptMeetingUrl'] == true) {
        this.showmeetingUrl = true;


      } else {
        this.showmeetingUrl = false;
      }
    }
  }

  getZoomUrl() {
    let request = {
      path: "auth/getOAuthUrl",
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.zoomUrl = response['data'];
    });
  }

  changeServiceType(event) {
    this.zoomAllow = false;
    this.showUrl = false;
    if (event == 'zoom') {
      this.zoomAllow = true;
    } else {
      this.showUrl = true;
    }
  }

  addZoomLink() {
    let child = window.open(this.zoomUrl, '', 'toolbar=0,status=0,width=626,height=436');
    let timer = setInterval(function () {
      if (child.closed) {
        clearInterval(timer);
      }
    }, 1000);
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getCommunityList() {
    let request = {
      path: "event/eventCommunities",
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.communityList = response['data'];
        this.options = [];
        this.communityList.forEach((item, index) => {
          this.options.push(item.name);
        });
        resolve(null);
      });
    });

  }
  getPermission() {
    let req = {
      path: 'uiPermission/getPermissionByRole',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.userPermisssion = [];
          response['data'].forEach((item, index) => {
            this.userPermisssion[item.name] = item;
          });
        } else {
        }
        resolve(null);
      });
    });
  }

  validateRecurring() {
    this.statusRecurring = true;
    if (this.recurringEvent == true && this.cronScheduleRequest['scheduleType'] == '') {
      this.statusRecurring = false;
    }
    if (this.recurringEvent == true) {
      if (this.cronScheduleRequest['scheduleType'] == 'DAILY' &&
        (this.cronScheduleRequest['repeatCount'] == '' ||
          this.cronScheduleRequest['repeatCount'] == undefined)) {
        this.statusRecurring = false;
      }

      if (this.cronScheduleRequest['scheduleType'] == 'WEEKLY' &&
        !this.cronScheduleRequest['weekDays']) {
        this.statusRecurring = false;
      } else if (this.cronScheduleRequest['scheduleType'] == 'WEEKLY' &&
        this.cronScheduleRequest['weekDays'].length == 0) {
        this.statusRecurring = false;
      }

      if (this.cronScheduleRequest['scheduleType'] == "MONTHLY" &&
        this.cronScheduleRequest['type'] == "month") {
        if (!this.cronScheduleRequest['repeatCount'] ||
          this.cronScheduleRequest['repeatCount'] == '') {
          this.statusRecurring = false;
        } else if (!this.cronScheduleRequest['dayOfMonth'] ||
          this.cronScheduleRequest['dayOfMonth'] == '') {
          this.statusRecurring = false;
        }
      }
      if (this.cronScheduleRequest['scheduleType'] == "MONTHLY" &&
        this.cronScheduleRequest['type'] == "week") {
        if (!this.cronScheduleRequest['repeatCount'] ||
          this.cronScheduleRequest['repeatCount'] == '') {
          this.statusRecurring = false;
        } else if (this.cronScheduleRequest['cronMonthWeekDay'] == null ||
          this.cronScheduleRequest['cronMonthWeekDay']['weekIndex'] == null ||
          this.cronScheduleRequest['cronMonthWeekDay']['weekDay'] == null) {
          this.statusRecurring = false;
        } else if (!this.cronScheduleRequest['cronMonthWeekDay']['weekDay'] ||
          this.cronScheduleRequest['cronMonthWeekDay']['weekDay'] == '') {
          this.statusRecurring = false;
        } else if (!this.cronScheduleRequest['cronMonthWeekDay']['weekIndex'] ||
          this.cronScheduleRequest['cronMonthWeekDay']['weekIndex'] == '') {
          this.statusRecurring = false;
        }
      }
    } else {
      this.cronScheduleRequest = null;
    }

  }
}
