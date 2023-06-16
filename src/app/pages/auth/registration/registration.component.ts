import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  regForm: FormGroup;
  submitted: boolean = false;
  countryData=[];
  lat;
  lng;
  yearArr = [];
  errorMsg: string;
  file; 
  startYear = 1950;
  endYear = 2000;
  country: any;

  constructor(private route: ActivatedRoute, private _location: Location, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService) {
    this.regForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      //birthYear: ['', Validators.required],
      countryPhoneCode: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      //password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      //addressLine1: ['', Validators.required],
      //addressLine2: [''],
      //addressLine3: [''],
      //country: ['', Validators.required],
      //state: ['', Validators.required],
      //city: ['', Validators.required],
    });
  }


  ngOnInit() {
    for (let i = this.startYear; i <= this.endYear; i++) {
      this.yearArr.push(i);
    }

    //this.countryData = countryArr;

    this.get_country();
  }

  get regFormCon() { return this.regForm.controls; }

  upload(files: FileList) {
    this.file = files.item(0);
  }

  get_country(){
    let contry_data = {
      path: "auth/country",
      isAuth: false
    };

    this.apiService.get(contry_data).subscribe(response => {
        this.countryData = response['data'];
    });

  }

  submit() {
    this.submitted = true;

    // if (this.regForm.invalid) {
    //   return;
    // }

    let regFormValue = this.regForm.value;

    let regData = {
      path: "auth/user/signUp",
      data: regFormValue,
      isAuth: false
    };
    regData.data.latestRequestSource = "WEB";
    regData.data.latitude = "0";
    regData.data.longitude = "0";
    regData.data.password = btoa(regData.data.password);
    let regResponse;

    this.apiService.postWithoutToken(regData).subscribe(response => {
      regResponse = response;
      if (regResponse.status.status == "SUCCESS") {
        localStorage.setItem('currentUser', JSON.stringify(regResponse.userResponseGeneral));
        this.router.navigate(['/']);
        this.toastrService.success(response['status']['description']);
      } else {
        this.errorMsg = regResponse.status.description;
        this.toastrService.error(response['status']['description']);
      }
    });

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
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

}
