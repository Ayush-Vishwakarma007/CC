import { Component, OnInit ,ViewChild ,ElementRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import { Options } from '@angular-slider/ngx-slider';
import { SpinnerService } from '../../../services/spinner.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register-done',
  templateUrl: './register-done.component.html',
  styleUrls: ['./register-done.component.scss']
})
export class RegisterDoneComponent implements OnInit {

  paymentStatus: string;
  eventId = '';
  paymentStatusType: any;
  constructor(private http: HttpClient,
              public location: Location,
              private route: ActivatedRoute,
              public router: Router,public spinner: SpinnerService, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService) {
    this.eventId  = localStorage.getItem("eventId");
  }

  ngOnInit() {
  }

}
