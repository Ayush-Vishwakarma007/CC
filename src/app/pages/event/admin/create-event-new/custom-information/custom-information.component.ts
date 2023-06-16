import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { configuration } from '../../../../../configration';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from "rxjs";

@Component({
  selector: 'app-custom-information',
  templateUrl: './custom-information.component.html',
  styleUrls: ['./custom-information.component.scss']
})

export class CustomInfoComponent implements OnInit, OnDestroy {

  @Input()
  save: Subject<any>;
  @Input() eventId = "";

  _customInfo: any;
  @Output() customInfoChange: EventEmitter<any> = new EventEmitter();
  @Output() completed: EventEmitter<any> = new EventEmitter();

  @Input()
  get customInfo() {
    return this._customInfo;
  }
  set customInfo(value) {
    this._customInfo = value;
    this.customInfoChange.emit(value);
  }
  mediaUploadUrl = "event/uploadPicture";
  saveSubscription: Subscription;



  dynamicField: any[];
  selectedBtn: any = "TEXT";
  optionshow: boolean = false;
  dynamicFieldAddForm: FormGroup;
  editOption: any;
  optionList: any[] = [{ name: '' }];
  levelList: any = [];
  submitBtn: boolean = true;
  response: any = [];
  editId = '';
  constructor(private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.dynamicFieldAddForm = this.formBuilder.group({
      answerLevel: ['', Validators.required],
      fieldName: ['', Validators.required],
      fieldType: [''],
      required: [false, Validators.required],
      options: [''],
    });
  }

  dynamicFieldIconMapping = {
    "TEXT": "icon-capitalize",
    "DROPDOWN_SINGLE": "icon-drop-down-round-button",
    "DROPDOWN_MULTI": "icon-drop-down icon",
    "RADIOBUTTON": "icon-radio-on-button",
    "CHECKBOX_SINGLE": "icon-check-sign-in-a-square",
    "CHECKBOX_MULTI": "icon-shopping-list",
    "TEXTAREA": "icon-document-rounded-square-interface-symbol-with-text-lines",
  };
  ngOnInit() {
    this.dynamicFieldType();
    this.getLevelList();
    this.saveSubscription = this.save.subscribe(() => {
      this.customInfoChange.emit(this.response);
      this.completed.emit();
    });
  }
  addNewOption() {
    this.optionList.push({ name: '' });
  }

  removeLastOption() {
    this.optionList.pop();
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
  getLevelList() {
    let request = {
      path: "event/dynamicFieldAnswerLevel",
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.levelList = response['data'];
    });
  }

  dynamicSelectedBtn(name, option) {
    this.selectedBtn = name;
    this.optionshow = option;
  }
  addDynamicField() {
    if (this.dynamicFieldAddForm.valid) {
      let formval = this.dynamicFieldAddForm.value;
      formval['fieldType'] = this.selectedBtn;
      let optionList = this.optionList.filter(function (entry) {
        return entry.name.trim() != '';
      });
      if (this.optionshow == true && optionList.length == 0) {
        this.submitBtn = false;
        this.toastrService.error("Please fill all required fields!");
      } else {
        formval['options'] = this.optionList.map(e => e.name);
        if (this.editOption != undefined) {
          this.editOption = undefined;
        } else {
        }
        let data = {};
        if (this.editId != '') {
          data = {
            path: "event/dynamicField/" + this.eventId + "/" + this.editId,
            data: formval,
            isAuth: true
          };
        } else {
          data = {
            path: "event/dynamicField/" + this.eventId,
            data: formval,
            isAuth: true
          };
        }
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            this.dynamicFieldAddForm.reset();
            this.optionList = [];
            this.optionList.push({ name: '' });
            this.selectedBtn = 'TEXT';
            this.optionshow = false;
            this.submitBtn = true;
            this.completed.emit();
            this.editId = '';
            this.eventDetail();

            this.dynamicFieldAddForm.patchValue({
              required: false
            });
          } else {
            this.toastrService.error(response['status']['description']);
            this.submitBtn = false;
          }
        });
      }
    } else {
      this.submitBtn = false;
      this.toastrService.error("Please fill all required fields!");
    }
  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
  edit(data, type) {
    this.editId = data.fieldId;
    this.dynamicFieldAddForm.patchValue({
      answerLevel: data.answerLevel,
      fieldName: data.fieldName,
      fieldType: data.fieldType,
      required: data.required,
      options: data.options,
    });
    let i;
    this.dynamicField.filter(function (entry, index) {
      if (entry.value == data.fieldType) {
        i = index;
      }
    });
    this.optionList = [];
    data.options.forEach((item, index) => {
      this.optionList.push({ name: item });
    });

    this.dynamicSelectedBtn(data.fieldType, this.dynamicField[i]['allowOption']);
  }
  delete(data, type) {
    let request = {
      path: "event/dynamicField/" + this.eventId + "/" + data.fieldId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.eventDetail();
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }
  eventDetail() {
    let data = {
      path: "event/details/" + this.eventId,
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.customInfo = response['data']['dynamicFields'];
      }
    });
  }

}
