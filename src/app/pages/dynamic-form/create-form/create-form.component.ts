import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from 'src/app/services/authentication.service';
// import {falseIfMissing} from "protractor/built/util";
import {fakeAsync} from "@angular/core/testing";

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit {
  formItem = [];
  formItem1 = [];
  formId: any;
  formName: any;
  description: any;
  submitted: Boolean = false;
  data: any = [];
  businessId: any;
  checkbox : boolean = false;
  @ViewChildren("formItemList") formSteps: QueryList<CdkDropList>;
  steps: any[] = [{
    stepName: "",
    formsFields: []
  }]
  formsFields = []

  constructor(public apiService: ApiService, public location: Location,private modalService: BsModalService, private fb: FormBuilder, private toastrService: ToastrService,
              public router: ActivatedRoute, public authService: AuthenticationService, private r: Router) {

  }

  ngOnInit(): void {
    this.authService.CheckLoginSession();
    this.getItemsList()
    this.formId = localStorage.getItem('formId')
    this.data = localStorage.getItem('formDetails')
    this.data = JSON.parse(this.data)
    if (this.formId != null) {
      if (this.data != null) {
        this.steps = this.data['formSteps']
        this.description = this.data['description'];
        this.formName = this.data['name'];
        localStorage.removeItem('formDetails');
      }else{
        this.getFormDetails()
      }
    }else{
      this.steps = this.data['formSteps']
      this.description = this.data['description'];
      this.formName = this.data['name'];
      localStorage.removeItem('formDetails');
    }
  }

  getFormDetails() {
    let data = {
      path: "survey/survey/getById/" + this.formId,
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      let copyForm = localStorage.getItem('copyForm')
      if(copyForm ==null){
        this.formName = response['data']['name']
      }else{
        this.formName = "Copy of " +response['data']['name']
      }
      this.description = response['data']['description']
      this.steps = response['data']['formSteps'];
    });
  }

  getArray() {
    return this.formSteps ? this.formSteps.toArray() : [];
  }

  getItemsList() {
    let data = {
      path: "survey/survey/getFormFields",
      isAuth: false
    }
    this.apiService.get(data).subscribe(response => {
      this.formsFields = response['data'];
    })
 }

  remove(array, index) {
    array.splice(index, 1);
  }

  removeForm() {
    this.formName = "";
    this.description = "";
    this.steps = [{
      stepName: "",
      formsFields: []
    }]
    localStorage.removeItem('formId')
  }

  previewForm() {
    let formDetails: any = {};
    formDetails['name'] = this.formName;
    formDetails['description'] = this.description;
    formDetails['formSteps'] = this.steps;
    localStorage.setItem('formDetails', JSON.stringify(formDetails));
    this.r.navigate(['/preview-form']);
  }
  keyDownHandler(event) {
    if (event.which === 32 && !event.value.length) {
      event.preventDefault();
    }
  }
  onChangeCheckbox(event) {
    this.checkbox = event.checked;
  }
    submitForm() {
    this.businessId = localStorage.getItem('businessId');
    this.submitted = true;
    try {
      if (this.formName == undefined) {
        this.toastrService.error('Please enter form name')
        throw new Error();
      }
      if (this.formName == "") {
        this.toastrService.error('Please enter form name')
        throw new Error();
      }
      this.steps.forEach((val, index) => {
        if (!val.stepName) {
          this.toastrService.error('Please enter section name')
          throw new Error();
        }
        val['formsFields'].forEach((value, index1) => {
          if (value.type == 'TEXT') {
            if (!value.fieldName) {
              this.toastrService.error('Please enter short text field name')
              throw new Error();
            }
          } else if (value.type == 'DROPDOWN') {
            if (!value.fieldName) {
              this.toastrService.error('Please enter drop down field name ')
              throw new Error();
            } else if (value.options.length == parseInt('0')) {
              this.toastrService.error('Please add drop down option ')
              throw new Error();
            }
            value.options.forEach((opt) =>{
              if (!opt.value) {
                this.toastrService.error('Please add drop down option ')
                throw new Error();
              }
            });
            var valueArr = value.options.map(function (item) { return item.value });
            var isDuplicate = valueArr.some(function (item, idx) {
              return valueArr.indexOf(item) != idx
            });
            if(isDuplicate  == true){
              this.toastrService.error('Duplicate option is not allowed ')
              throw new Error();
            }
          } else if (value.type == 'CHECKBOX') {
            if (!value.fieldName) {
              this.toastrService.error('Please enter check box field name ')
              throw new Error();
            } else if (value.options.length == parseInt('0')) {
              this.toastrService.error('Please add check box option ')
              throw new Error();
            }
            value.options.forEach((opt) =>{
              if (!opt.value) {
                this.toastrService.error('Please add check box option ')
                throw new Error();
              }
            });
            var valueArr = value.options.map(function (item) { return item.value });
            var isDuplicate = valueArr.some(function (item, idx) {
              return valueArr.indexOf(item) != idx
            });
            if(isDuplicate  == true){
              this.toastrService.error('Duplicate option is not allowed ')
              throw new Error();
            }
          } else if (value.type == 'TIME') {
            if (!value.fieldName) {
              this.toastrService.error('Please Enter time field name')
              throw new Error();
            }
          } else if (value.type == 'DATE') {
            if (!value.fieldName) {
              this.toastrService.error('Please Enter date field name ')
              throw new Error();
            }
          } else if (value.type == 'NUMBER') {
            if (!value.fieldName) {
              this.toastrService.error('Please enter number field name')
              throw new Error();
            }
          } else if (value.type == 'LABEL') {
            if (!value.fieldName) {
              this.toastrService.error('Please enter label field name')
              throw new Error();
            }
          } else if (value.type == 'TEXTAREA') {
            if (!value.fieldName) {
              this.toastrService.error('Please enter paragraph field name ')
              throw new Error();
            }
          }
        })
      })
      let formData = {};
      formData['addSign'] = this.checkbox;
      formData['name'] = this.formName;
      formData['businessId'] = "cc_id";
      formData['description'] = this.description;
      formData['formSteps'] = this.steps;
      let data = {};
      let copyForm = localStorage.getItem('copyForm')
      if (this.formId == null || copyForm!=null) {
        data = {
         path: "survey/survey/create",
          data: formData,
          isAuth: false
        };
      } else {
        data = {
          path: "survey/survey/update/" + this.formId,
          data: formData,
          isAuth: false
        };
      }

      this.apiService.post(data).subscribe(response => {
        this.toastrService.success(response['response']['description']);
        if (this.formId == null || copyForm!=null) {
          this.r.navigate(['/assign-form/', response['data']['id']]);
        } else {
          this.r.navigate(['/assign-form/', this.formId]);
          localStorage.removeItem('formId');
        }
      });
    } catch (e) {
      //console.log(e);
    }

  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      let item = event.previousContainer.data[event.previousIndex];
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.getItemsList();
      // this.items.splice(event.previousIndex, 0, item);
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

  AvoidSpace(event){
    let stringLength = event.target.value.length;
    console.log(stringLength);
      if(event.keyCode == 32 && stringLength == 0){
        return false;
      }else{
        return true;
      }
  }
}
