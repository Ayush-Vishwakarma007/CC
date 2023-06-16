import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
//import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SpinnerService} from "../../../services/spinner.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-create-membership-new',
  templateUrl: './create-membership-new.component.html',
  styleUrls: ['./create-membership-new.component.scss']
})
export class CreateMembershipNewComponent implements OnInit {

  fieldTypes: any = [];
  newSectionShow: boolean = false;
  stepArray: any = [];
  formStepsWithFields: any = [];
  submitBtn = true;
  options: any = [];
  sectionForm: FormGroup;
  fieldForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, public toastrService: ToastrService) {
    this.sectionForm = this.formBuilder.group({
      stepDetails: ['', Validators.required],
      stepName: ['', Validators.required],
      index: [''],
    });
    this.fieldForm = this.formBuilder.group({
      fieldName: ['', Validators.required],
      name: ['', Validators.required],
      required: [false, Validators.required],
      type: ['', Validators.required],
      options: [[]],
      id :['']
    });
    this.options = [{'value': ''}];
  }

  ngOnInit() {
    document.querySelector("body").removeAttribute('class'); ///remove body class after modal
    window.scroll(0,0);
    this.getFieldType();
    this.getformStepsWithFields();
  }

  getformStepsWithFields() {
    let data = {
      path: "/auth/getFormSteps",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      if (response['status']['status'] == 'OK') {
        this.formStepsWithFields = response['data'];
        this.formStepsWithFields.forEach((item, index) => {
          item['editSection'] = false;
        });
      }
    });
  }

  getFieldType() {
    let data = {
      path: "auth/membershipFieldsType",
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      if (response['status']['status'] == 'OK') {
        this.fieldTypes = response['data'];
      }
    });
  }

  addSections() {
    this.newSectionShow = true;
    this.sectionForm.reset();
    this.options.push([{'value': ''}]);
  }

  editSection(steps, index) {
    this.formStepsWithFields.map((t,i) => {
      if(i != index)
      {
        t.editSection = false;
      }
      return t
    });
    steps['editSection'] = !steps['editSection'];

    this.sectionForm.patchValue({
      stepDetails: steps.stepDetails,
      stepName: steps.stepName,
      index: index + 1,
    });
  }

  cancelSection(index) {
    this.formStepsWithFields[index]['editSection'] = false;
  }

  editField(steps, index, array, mainIndex = '') {
    array.map((t, i) => {
      if (i != index) {
        t.active = false;
      }
      return t
    });
    this.stepArray = [];
    steps['active'] = !steps['active'];

    this.formStepsWithFields.map((t, i) => {
      if (i != mainIndex) {
        t['fieldValues'].map((a) => {
          a.active = false;
        });
      }
    });
    this.options = [{'value': ''}];
    this.fieldForm.reset();
    this.formStepsWithFields[mainIndex]['value'] = '';
    if (steps['active'] == true) {
      this.getFieldDetailById(steps['id'], mainIndex);
    }

  }

  getFieldDetailById(id, index) {
    let data = {
      path: "/auth/field/details/" + id,
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      if (response['status']['status'] == 'OK') {
        this.changeFieldEvent(response['data']['type'], index, true);
        this.options = [];
        response['data']['options'].filter((op)=>{
          this.options.push({'value':op});
        });
        this.fieldForm.patchValue({
          fieldName: response['data']['fieldName'],
          name: response['data']['name'],
          required:response['data']['required'],
          type: response['data']['type'],
          id : response['data']['id'],
        });
      }
    });
  }
  changeFieldType(e)
  {
    if (e != '') {
      this.stepArray['type'] = [];
      this.stepArray['value'] = e;
      this.fieldTypes.filter((item, index) => {
        if (item.value == e) {
          this.stepArray['type'] = item;
        }
      });
    } else {
      this.stepArray = [];
    }
  }

  changeFieldEvent(e, i, edit = false) {
    if (edit == false) {
      this.formStepsWithFields.map((t, s) => {
        t.fieldValues.map((a, b) => {
          a['active'] = false;
        });
      });
    }
    this.clearArray(i);
    this.stepArray['value'] = e;
    if (e != '') {
      this.stepArray['index'] = i;
      this.stepArray['type'] = [];
      this.fieldTypes.filter((item, index) => {
        if (item.value == e) {
          this.stepArray['type'] = item;
        }
      });
    } else {
      this.stepArray = [];
    }
  }

  addOption() {
    this.options.push({'value': ''});
  }

  removeOption(i) {
    this.options.splice(i, 1);
  }

  clearArray(i = '') {
    this.options = [{'value': ''}];

    this.formStepsWithFields.forEach((item, index) => {
      if (index != i) {
        this.formStepsWithFields[index]['value'] = '';
      }
    });
    this.fieldForm.reset();     this.options = [{'value': ''}];
  }

  cancelNewFiled(i) {
    this.stepArray = [];
    this.formStepsWithFields[i]['value'] = '';
  }

  submitSection(id = '', index = '', fieldId = '') {
    if (this.sectionForm.valid) {
      this.submitBtn = true;
      let data = {};
      let formData = this.sectionForm.value;
      if (id != '') {
        let fieldIds = [];
        if (fieldId != '') {
          fieldIds.push(fieldId);
        }
        this.formStepsWithFields[index]['fieldValues'].forEach((item, index) => {
          fieldIds.push(item.id);
        });
        formData['fieldIds'] = fieldIds;
        data = {
          path: "auth/formStep/" + id,
          data: formData,
          isAuth: true
        };
      } else {
        formData['index'] = this.formStepsWithFields.length+1;
        data = {
          path: "auth/formStep",
          data: formData,
          isAuth: true
        };
      }
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.fieldForm.reset();
          this.sectionForm.reset();
          this.stepArray['index'] = null;
          this.getformStepsWithFields();
          this.newSectionShow = ! this.newSectionShow
        } else {
          this.toastrService.error(response['status']['description']);
          this.submitBtn = false;
        }
      });
    } else {
      this.toastrService.error("Please fill all required fields!");
      this.submitBtn = false;
    }
  }
  removeSection(id)
  {


    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Section!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let data = {
          path: "/auth/formStep/" + id,
          isAuth: true
        };

        this.apiService.get(data).subscribe(response => {
          if (response['status']['status'] == 'OK' || response['status']['status'] == 'DELETED') {
            this.toastrService.success(response['status']['description']);
            this.getformStepsWithFields();
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Section is safe.',
          'error'
        )
      }
    })

  }
  submitField(index, id = '') {
    let filedTypes = {};
    let optionValue = this.options.filter(t => t.value != '');
    let option = [];
    optionValue.filter((op)=>{
      option.push(op['value']);
    });
    this.fieldForm.patchValue({
      options: option,
      type: this.stepArray.value
    });
    this.sectionForm.patchValue({
      index: this.formStepsWithFields[index]['index'],
      stepName: this.formStepsWithFields[index]['stepName'],
      stepDetails: this.formStepsWithFields[index]['stepDetails'],
    });
    if (this.fieldForm.valid) {
      this.submitBtn = true;
      let data = {};
      let formData = this.fieldForm.value;
      let editTime= false;
    if(this.fieldForm.value.id != '' && this.fieldForm.value.id !=  null)
    {
      editTime = true;
      data = {
        path: "auth/field/"+this.fieldForm.value.id,
        data: formData,
        isAuth: true
      };
    }else {
      delete formData['id'];
      data = {
        path: "auth/field",
        data: formData,
        isAuth: true
      };
    }
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          if(editTime == true)
          {
            this.toastrService.success(response['status']['description']);
            this.getformStepsWithFields();
          }else {
            this.submitSection(this.formStepsWithFields[index]['id'], index, response['data']['id']);
          }
          this.stepArray['index'] = null;
        } else {
          this.toastrService.error(response['status']['description']);
          this.submitBtn = false;
        }
      });
    } else {
      this.toastrService.error("Please fill all required fields !");
      this.submitBtn = false;
    }
  }
  removeFiled(index,id)
  {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Field!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let data = {
          path: "/auth/field/" + id,
          isAuth: true
        };

        this.apiService.get(data).subscribe(response => {
          if (response['status']['status'] == 'OK' || response['status']['status'] == 'DELETED') {

            this.toastrService.success(response['status']['description']);
            this.fieldForm.reset();
            this.stepArray['index'] = null;
            this.getformStepsWithFields();
          }else {
            this.toastrService.error(response['status']['description']);
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Field is safe.',
          'error'
        )
      }
    })

  }

}
