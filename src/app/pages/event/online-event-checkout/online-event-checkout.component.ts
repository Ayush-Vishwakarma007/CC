import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Gallery} from "@ngx-gallery/core";
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {ToastrService} from "ngx-toastr";
import {SeoService} from "../../../services/seo.service";
import {EMAIL_PATTERN} from "../../../helpers/validations";
import {configuration} from "../../../configration";

@Component({
  selector: 'app-online-event-checkout',
  templateUrl: './online-event-checkout.component.html',
  styleUrls: ['./online-event-checkout.component.scss']
})
export class OnlineEventCheckoutComponent implements OnInit {
  submitSubject: Subject<any> = new Subject();
  discountSubject: Subject<any> = new Subject();
  authDetail: any = [];
  eventId = '';
  eventDetail: any = [];
  ageGroupDetail: any = [];
  paymentDetail: any = [];
  userDetail: any = [];
  userStatus: boolean = false;
  eventRules: any = [];
  checkedMembers: any = [];
  guestDetail: any = [];
  guestArray: any = [];
  guestShow: boolean = false;
  discountCode = '';
  registerForm: FormGroup;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, public gallery: Gallery, public spinner: SpinnerService, private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, private seo: SeoService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.route.params.subscribe(params =>
      this.eventId = params['id']
    );
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    });
  }

  ngOnInit() {
    this.getEventDetail();

    this.registerForm.patchValue({
      firstName: this.authDetail.firstName,
      lastName: this.authDetail.lastName,
      phone: this.authDetail.phone,
      email: this.authDetail.email,
    });
  }

  getEventDetail() {
    this.spinner.show();
    let request = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.eventDetail = response['data'];
          let amount = [];
          amount['name'] = 'Event Fees';
          amount['value'] = this.eventDetail['eventConfigurations']['registrationFees'];
          amount['info'] = true;
          amount['description'] = '';
          this.paymentDetail['display'] = [];
          this.paymentDetail['display'].push(amount);
          this.paymentDetail['finalAmount'] = this.eventDetail['eventConfigurations']['registrationFees'];
        } else {
          this.toastrService.error(response['status']['description']);
        }
        resolve(null);
        this.spinner.hide();
      });
    });
  }

  addGuest() {

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
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  submitRegister() {
    this.registerNow();
  }

  registerNow() {

    this.submitted = true;
    if (this.registerForm.valid) {
      let detail = {};
      detail['registrations'] = [];
      let checkedMember = [];
      if (!this.authDetail) {
        checkedMember = this.registerForm.value;
        detail['role'] = 'USER';
        checkedMember['relation'] = 'SELF';
        detail['registrations'].push(checkedMember);
      } else {
        checkedMember.push({
          'userId': this.authDetail['id'],
          'selectedFoods': {},
          'eventRuleId': null,
          'relation': 'SELF'
        });
        detail['role'] = 'USER';
        detail['registrations'] = checkedMember;

      }
      this.spinner.show();

      detail['eventId'] = this.eventId;

      detail['paymentMethodUsed'] = this.paymentDetail['paymentMethodUsed'];
      detail['nonce'] = this.paymentDetail['nonce'];
      detail["sponsorshipCategoryId"] = null;
      detail["sponsorshipDiscount"] = true;
      detail['discountCode'] = null;
      let data = {
        path: "event/event/registration/",
        data: detail,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          if (response['data']['url'] == null) {
            localStorage.setItem('eventId', this.eventId);
            this.router.navigate(['/payment/event/payment-success']);
            this.spinner.hide();
            this.submitted = false;
            return false;
          } else {
            window.location.href = response['data']['url'];
            this.spinner.hide();
            this.submitted = false;
          }
        } else {
          this.submitted = false;
          this.spinner.hide();
          this.toastrService.error(response['status']['description']);
        }
      });
    } else {
      this.toastrService.error('All fields are required !');
    }
  }

  paymentNow() {

  }

  loginRedirect() {
    let url = this.router.url;
    localStorage.setItem('eventUrl', url);
    this.router.navigate(['/login'])
  }
}
