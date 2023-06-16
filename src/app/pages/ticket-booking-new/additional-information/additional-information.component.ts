import { Component, OnInit, Input,
  TemplateRef,
  Output,
  EventEmitter,
 } from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiService} from "../../../services/api.service";
import {SpinnerService} from "../../../services/spinner.service";
import {ToastrService} from 'ngx-toastr';
import {Moment} from "moment";
import * as moment from 'moment';
// import { ValueConverter } from '@angular/compiler/src/render3/view/template';
@Component({
  selector: 'app-additional-information',
  templateUrl: './additional-information.component.html',
  styleUrls: ['./additional-information.component.scss']
})
export class AdditionalInformationComponent implements OnInit {
  editMemberForm: FormGroup;
  formDetail:any=[]
  reqData:any={}
  filedValue: any;
  validation: any;
  urlPattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  @Input() eventId: string;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() completenext: EventEmitter<any> = new EventEmitter();
  @Output() registerArraychange: EventEmitter<any> = new EventEmitter();
  @Output() skipvalue: EventEmitter<any> = new EventEmitter();
  _register: any;
  @Input()
  get register() {
    return this._register;
  }

  set register(value) {
    this._register = value;
    this.registerArraychange.emit(value);
  }

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  startDate: Date;
  endDate: Date;
  selected: {startDate: Moment, endDate: Moment};

  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [
      moment()
        .subtract(1, 'month')
        .startOf('month'),
      moment()
        .subtract(1, 'month')
        .endOf('month')
    ],
    'Last 3 Month': [
      moment()
        .subtract(3, 'month')
        .startOf('month'),
      moment()
        .subtract(1, 'month')
        .endOf('month')
    ]
  };
  constructor(public Http: HttpClient, private modalService: BsModalService, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, ) {
    this.editMemberForm = this.formBuilder.group({});
    this.reqData={
      "fieldValues": {}
    }
   }

  ngOnInit() {

    this.getFormStep()
    this.saveSubscription = this.save.subscribe(() => {
      this.checkboxCheck()
      if(this.editMemberForm.valid){
        this.register['fieldValues']=this.editMemberForm.value
        
        this.completenext.emit()
      }
      else{
        this.toastrService.error('All * fields are required');
      }
    })


    console.log("patch",this.editMemberForm)
  }
  getFormStep(){
    let req = {
      path: "event/userRegistration/form/"+this.eventId,
      isAuth: true,

    };
    this.apiService.get(req).subscribe(response => {

      this.formDetail = response['data'];
  
      this.formDetail.forEach((item, index) => {
        //this.editMemberForm.addControl('id', new FormControl(id, Validators.required));
        item.fieldValues.forEach((value, index1) => {
          let fieldName = value.fieldName;
          this.filedValue = value.value;
          if (this.filedValue == null) {
            this.filedValue = '';
          }
          if (value.type == 'CHECK_BOX') {
            value.optionList = [];
            value.options.filter((op) => {
              value.optionList.push({'value': op, 'check': false});
            });
            let filedValue = this.filedValue.split(',');
            value.optionList.filter((list) => {
              filedValue.filter((op) => {
                if (op == list['value']) {
                  list['check'] = true;
                }
              });
            });
          }
          //this.editMemberForm.controls[fieldName].clearValidators();\
          if (value.required == true) {
            if (value.type == 'URL') {
              this.validation = [Validators.required, Validators.pattern(this.urlPattern)];
            } else {
              this.validation = [Validators.required];
            }
          } else {
            if (value.type == 'URL') {
              this.validation = [Validators.pattern(this.urlPattern)];
            } else {
              this.validation = [];
            }
          }
          this.editMemberForm.addControl(fieldName, new FormControl(this.filedValue, this.validation));

        });

      });
    
      this.formDetail.forEach(element => {
        element.fieldValues.forEach(e => {
          e.value=this.register["fieldValues"][e.fieldName]
          this.editMemberForm.controls[e.fieldName].patchValue(this.register["fieldValues"][e.fieldName]);
        
          if(e.type=="CHECK_BOX")
          {

           let myArray = this.register["fieldValues"][e.fieldName].split(',')
     
            e.optionList.forEach(ele => {
              myArray.forEach(i => {
         
                if(i==ele.value)
                {
           
                  ele.check=true
                }

              });

            });

          }
        });
        console.log(this.formDetail)

      });


    })


  }
  checkboxCheck(){
    this.formDetail.forEach((item, index) => {
      item.fieldValues.forEach((value, index1) => {
        let fieldName = value.fieldName;
        if (value.type == 'CHECK_BOX') {
          let checked = '';
          value['optionList'].filter((list) => {
            if (list['check'] == true) {
              checked += list['value'] + ',';
            }
          });
          if (value.required == true) {
            this.validation = [Validators.required];
          } else {
            this.validation = [];
          }
          this.editMemberForm.patchValue({
            fieldName: checked
          });
          this.editMemberForm.removeControl(fieldName);
          this.editMemberForm.addControl(fieldName, new FormControl(checked, this.validation));
          value.value = checked;
        }
      });
    });

  }
  submit(){
    if(this.editMemberForm.valid){

    }
    else{
      this.toastrService.error('All * fields are required');
    }
  
  }
  skip() {
 
    this._register["fieldValues"]={}
   
    this.completed.emit()
    this.skipvalue.emit(true);
  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
}
