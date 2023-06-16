import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  HostListener,
  OnDestroy,
  TemplateRef
} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
// import {AlertService} from 'ngx-alerts';
import {ApiService} from '../../services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import {DatePipe,Location} from '@angular/common';
import {GooglePlaceDirective} from 'ngx-google-places-autocomplete';
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-assign-form-modal',
  templateUrl: './assign-form-modal.component.html',
  styleUrls: ['./assign-form-modal.component.scss']
})
export class AssignFormModalComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  sideMenuLarge: boolean = false;
  submitted: boolean = false;
  personInfo: any = [];
  checked: boolean = true;
  reqData: any = [];
  checkValue: any;
  public e: any;
  businessId: any;
  userList: any = [];
  formName = "Assign form"
  assignForm: FormGroup;
  formId:any;
  @ViewChild("template") model: TemplateRef<any>;
  @Input()
  openModelSubject: Subject<any>;
  subscription: Subscription;
  _output: any;
  @Output() output: EventEmitter<any> = new EventEmitter();
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  recurringForm: boolean = false;
  scheduleTypeList:any =[];
  scheduleType = '';
  WeekDay: any = [];
  WeekDays:any = [];
  scheduleDay:any = [];
  cronScheduleRequest: any = {};
  statusRecurring: boolean = true
  checkbox:boolean = false;
  constructor(public apiService: ApiService, public location: Location,
              private modalService: BsModalService, private fb: FormBuilder, private toastr:ToastrService, //private alertService: AlertService,
              public router: ActivatedRoute, private r: Router,private datePipe:DatePipe) {
    this.assignForm = this.fb.group({
      id: [''],
      assignmentName: ['', [Validators.required, this.noWhitespaceValidator]],
      assignType: ['', [Validators.required, this.noWhitespaceValidator]],
      assignees: ['', [Validators.required, this.noWhitespaceValidator]],
      formId: [''],
      date: ['', [Validators.required, this.noWhitespaceValidator]],
      dueDate: ['',],
      comment: [''],
      activeStatus: [''],
      recurringForm: [''],
      anonymousForm: [''],
    });
  }

  get formCon() {
    return this.assignForm.controls;
  }

  async  ngOnInit() {
    this.subscription = this.openModelSubject.subscribe((data) => {
      this.modalRef = this.modalService.show(
        this.model,
        Object.assign({}, {class: 'modal-md modal-dialog-centered accounts-add assign-form-modal animated slideInRight '})
      );
      this.formId ="2324324"
    })
    this.reqData = {
      "filter": {},
      "page": {
        "limit": 100,
        "page": 0
      }
    };
    this.getUsers();
    await this.getCronScheduleType();
    this.getWeekDay();
    this.getWeekDays();
    this.getScheduleDay();
  }

  getUsers() {
    let data = {
      path: "auth/user/getUsers/",
      data: this.reqData,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {
      this.userList = response['data']['content']
    });
  }

  modalHide() {
    this.modalRef.hide();
    this.assignForm.reset();
    this.formName = "Assign form";
    this.submitted = false;
    this.assignForm.patchValue({
      id: '',
    })
  }
  refreshForm() {
    this.assignForm.reset();
    this.formName = "Assign Form";
    this.submitted = false;
    this.assignForm.patchValue({
      id: '',
    })
  }
  counter(i: number) {
    return new Array(i);
  }
  getCronScheduleType() {
    let request = {
      path: "survey/survey/cronScheduleType",
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
  getWeekDay() {
    let request = {
      path: "survey/survey/schedulerWeekDay",
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.WeekDay = response['data'];
    });
  }
  getScheduleDay()
  {
    let request = {
      path: "survey/survey/schedulerOccurOn",
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.scheduleDay = response['data'];
    });
  }
  getWeekDays() {
    let request = {
      path: "survey/survey/schedulerWeekDays",
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.WeekDays = response['data'];
    });
  }
  validateRecurring() {
    this.statusRecurring = true;
    if (this.recurringForm == true && this.cronScheduleRequest['scheduleType'] == '') {
      this.statusRecurring = false;
    }
    if (this.recurringForm == true) {
      if (this.cronScheduleRequest['scheduleType'] == 'DAILY' &&
        (this.cronScheduleRequest['repeatCount'] == ''||
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
  editAssignForm(id) {
    let data = {
      path: "survey/assignSurvey/details/" + id,
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      this.formName = 'Edit Assign Form';
      let option = {value: response['data'].assignType}
      this.changeOption(option)
      this.assignForm.patchValue({
        id: response['data']._id,
        assignmentName: response['data'].assignmentName,
        assignType: response['data'].assignType,
        assignees: response['data'].assignees,
        comment: response['data'].comment,
        date: response['data'].date,
        dueDate: response['data'].dueDate,
        activeStatus: response['data'].activeStatus,
        anonymousForm: response['data'].anonymousForm,
      });
      console.log(this.assignForm);
    })
  }
  changeOption(id){

  }
  onChangeCheckbox(event) {
    this.checkbox = event.checked;
  }
  submit() {
    this.submitted = true;
    let activeStatus;
    if (this.checkValue == 'false') {
      activeStatus = false;
    } else {
      activeStatus = true;
    }
    this.businessId = localStorage.getItem('businessId');
    if (this.assignForm.valid) {
      let formValue = this.assignForm.value;
      let startDate = this.datePipe.transform(formValue['date'], 'yyyy-MM-dd');
      let endDate = this.datePipe.transform(formValue['dueDate'], 'yyyy-MM-dd');
      if (endDate < startDate) {
        this.toastr.warning("Start date should be less than or equal to due date ");
      } else {
        let statusRecurring = true;
        formValue['recurringForm'] = this.recurringForm;
        if(this.recurringForm == true) {
          if (this.cronScheduleRequest['type'] == 'month') {
            this.cronScheduleRequest['cronMonthWeekDay'] = null;
          } else if (this.cronScheduleRequest['type'] == 'week') {
            delete this.cronScheduleRequest['dayOfMonth'];
          }
        }
        this.validateRecurring();
        //console.log(this.statusRecurring);
        if (this.statusRecurring != true) {
          this.toastr.warning("Please fill all recurring event fields!");
          return false;
        }
        formValue['cronScheduleRequest'] = this.cronScheduleRequest;

        formValue['formId'] = this.formId;
        formValue['date'] = this.datePipe.transform(formValue['date'], 'yyyy-MM-dd');
        formValue['dueDate'] = this.datePipe.transform(formValue['dueDate'], 'yyyy-MM-dd');
        formValue['businessId'] = this.businessId;
        formValue['activeStatus'] = activeStatus;
        formValue['anonymousForm'] = this.checkbox
        let data = {};
        if (formValue.id == "" || formValue.id == undefined) {
          data = {
            path: "survey/assignSurvey/create",
            data: formValue,
            isAuth: true
          };
        } else {
          data = {
            path: "survey/assignSurvey/update/" + formValue.id,
            data: formValue,
            isAuth: true
          };
        }
        this.apiService.post(data).subscribe(response => {
          if (response['response']['code'] == 'OK') {
            if (formValue['assignType'] == "team") {
              let formData = {};
              formData['id'] = formValue['assignees']
              formData['formId'] = this.formId;
              let req = {
                path: "survey/team/updateFormId",
                data: formData,
                isAuth: true
              };
              this.apiService.post(req).subscribe(response => {
              })
            }
            this.toastr.success(response['response']['description']);
            this.assignForm.reset();
            this.modalRef.hide();
            this.r.navigate(['/assign-form/', this.formId]);
            this.submitted = false;
            this.assignForm.patchValue({
              id: ""
            });
            this.formName = "Assign Form";
          } else {
            this.toastr.warning(response['message'][0]);
          }
        });
      }
    }
  }

  charOnly(evt): boolean {
    var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode :
      ((evt.which) ? evt.which : 0));
    if (charCode > 32 && (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      return false;
    }
    return true;
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control && control.value && control.value.toString() || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : {'whitespace': true};
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
