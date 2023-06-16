import { Component, OnInit, TemplateRef  } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-scholarship-user-side',
  templateUrl: './scholarship-user-side.component.html',
  styleUrls: ['./scholarship-user-side.component.scss']
})
export class ScholarshipUserSideComponent implements OnInit {
  modalRef: BsModalRef;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isOptional = false;
  isLinear = false;
  constructor(private modalService: BsModalService, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg scholarship-modal' })
    );
  }

}
