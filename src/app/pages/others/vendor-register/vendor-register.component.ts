import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-vendor-register',
  templateUrl: './vendor-register.component.html',
  styleUrls: ['./vendor-register.component.scss']
})
export class VendorRegisterComponent implements OnInit {

  activeForm: string = "activeForm_1";
  activeFormNo: number = 1;
  lastSubmitBtnValue: string = "Next";
  addGuestMemberForm: FormGroup;
  step: any = [];
  eventId: string = "5de5f2744914d61844801360";

  activeTabName: any;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private toastrService: ToastrService) {
    this.addGuestMemberForm = this.formBuilder.group({
      allowedLogin: [true],
      birthYear: ['', Validators.required],
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      relation: [''],
    });
  }

  ngOnInit() {
    this.getStep();
  }

  back() {
    if (this.activeFormNo != 1) {
      this.activeFormNo = this.activeFormNo - 1;
      this.activeForm = "activeForm_" + this.activeFormNo;
      this.lastSubmitBtnValue = "Next";
    }
  }

  next() {
    if (this.activeFormNo != 5) {
      this.activeFormNo = this.activeFormNo + 1;
      this.activeForm = "activeForm_" + this.activeFormNo;
      this.lastSubmitBtnValue = "Next";
    }
    if (this.activeFormNo == 5) {
      this.lastSubmitBtnValue = "Confirm & Pay";
    }
  }

  uploadphotoclick() {

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
        this.activeTabName = this.step[0];
      }
    });
  }
}
