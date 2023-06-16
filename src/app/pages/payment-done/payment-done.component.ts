import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../services/spinner.service';
import {HttpClient} from '@angular/common/http';
import {Location} from '@angular/common';

@Component({
  selector: 'app-payment-done',
  templateUrl: './payment-done.component.html',
  styleUrls: ['./payment-done.component.scss']
})
export class PaymentDoneComponent implements OnInit {
  paymentStatus: string;
  paymentStatusType: any;
  eventId = '';
  type: string;
  authDetail: any = [];
  isNotEvent: any;
  constructor(private http: HttpClient,
              public location: Location,
              private route: ActivatedRoute,
              public router: Router, public spinner: SpinnerService, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));

  }

  ngOnInit() {
    this.eventId = localStorage.getItem("eventId");
    this.isNotEvent = localStorage.getItem('isNotEvent');

    this.route.params.subscribe((params) => {
      this.paymentStatus = params['type'];
      this.type = params['status'];
    });
    if (this.paymentStatus == "success" || this.paymentStatus == "payment-success") {
      this.paymentStatusType = true;
    } else {
      this.paymentStatusType = false;
    }
  }

  redirect() {
    if (this.type == "event") {
      if(this.isNotEvent){
        this.router.navigate(['/'])
      }else{
        this.router.navigate(['/event-details/' + this.eventId])
      }
    }
    else if (this.type == "chapter") {
      this.router.navigate(['/'])
    } else if (this.type == "pay-page") {
      this.router.navigate(['/'])
    }
    else if (this.type == "auth") {
      if(this.authDetail)
      {
        this.router.navigate(['/'])
      }
      else {
        this.router.navigate(['/login'])
      }
    } else {
      this.router.navigate(['/'])
    }
  }
  failRedirect() {
    this.router.navigate(['/'])
  }

}
