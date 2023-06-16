import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {SocialAuthService} from "@abacritt/angularx-social-login";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {EMAIL_PATTERN} from "../../../../helpers/validations";
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-membership-donation',
  templateUrl: './membership-donation.component.html',
  styleUrls: ['./membership-donation.component.scss']
})
export class MembershipDonationComponent implements OnInit {
  authDetail: any = [];
  registerForm: FormGroup;
  maploc = {
    componentRestrictions: {country: 'US'}
  };
  formatedAddress = '';
  fbUserData: any = [];

  submitted: boolean = false;

  currTab = 'donor';
  donors: any = [];
  sponsors: any = [];
  categoryId: any;
  chapterId: any = '';

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() completePayment: EventEmitter<any> = new EventEmitter();
  @Output() changePayment: EventEmitter<any> = new EventEmitter();

  @Output() userDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() paymentMethodChange: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder, public router: Router, private authService: SocialAuthService, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.registerForm = this.formBuilder.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      chapterId: ['', Validators.required],
      phone: ['', [ Validators.minLength(16)]],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      addressLine1: [null, Validators.required],
      city: [null, Validators.required],
      country: [null, Validators.required],
      state: [null, Validators.required],
      zipCode: [null, Validators.required],
    });
  }

  _userDetail: any;
  chapterList:any =[];
  @Input()
  get userDetail() {
    return this._userDetail;
  }

  set userDetail(value) {
    this._userDetail = value;
    this.userDetailChange.emit(value);
  }

  _paymentMethod: any;
  @Input()
  get paymentMethod() {
    return this._paymentMethod;
  }

  set paymentMethod(value) {
    this._paymentMethod = value;
    this.paymentMethodChange.emit(value);
  }

  ngOnInit() {
    this.donors = [
      {
        "id": "5ec3c4c5b0aa2a23a87b69d6",
        "eventId": "5ec0162c4ec0f240cf44aa40",
        "donationType": "DONATION",
        "categoryName": "gold",
        "range": {"min": 1.0, "max": 100.0},
        "discountType": null,
        "discount": 0.0,
        "maxDiscount": 0.0,
        "description": "Donation"
      }];
    this.sponsors = [
      {
        "id": "5ec3c4deb0aa2a23a87b69d7",
        "eventId": "5ec0162c4ec0f240cf44aa40",
        "donationType": "SPONSOR",
        "categoryName": "Gold",
        "range": {"min": 1.0, "max": 100.0},
        "discountType": null,
        "discount": 0.0,
        "maxDiscount": 0.0,
        "description": "Sponsors"
      }];
console.log(this.userDetail)
    if (this.userDetail.length != 0) {
      let phone =  this.formatPhoneNumber(this.userDetail['phone']);
      this.registerForm.patchValue({
        id: this.userDetail['id'],
        firstName: this.userDetail['firstName'],
        lastName: this.userDetail['lastName'],
        chapterId: this.userDetail['chapterId'],
        phone: phone,
        email: this.userDetail['email'],
        addressLine1: this.userDetail['addressLine1'],
        city: this.userDetail['city'],
        state: this.userDetail['state'],
        country: this.userDetail['country'],
        zipCode: this.userDetail['zipCode']
      });
      this.chapterId = this.userDetail['chapterId'];
      this.getPaymentMethod();
    }
    this.getChapterList();
    this.onChanges();
    this.saveSubscription = this.save.subscribe((value) => {
      if (this.registerForm.valid) {
        this.completed.emit();
      } else {
        this.submitted = true;
      }

    });
  }
  getChapterList() {
    let request = {
      path: 'community/chapters',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.chapterList = response['data'];
      if(!this.userDetail['chapterId']) {
        this.chapterId = this.chapterList[0]['id']
        this.getPaymentMethod();
      }

    });
  }
  loginRedirect() {
    let url = this.router.url;
    localStorage.setItem('eventUrl', url);
    this.router.navigate(['/login'])
  }

  onChanges(): void {
    this.registerForm.valueChanges.subscribe(val => {
      this.userDetail = val;
    });

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
  formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return '(' + match[1] + ') ' + '(' +match[2] +')'+ '-' + match[3]
    }
    return null
  }
  public handleAddressChange(address: any) {
    this.formatedAddress = address.formatted_address;
    let city = '';
    let region = '';
    let country = '';
    let zipCode = '';
    for (let i = 0; i < address.address_components.length; i++) {
      if (address.address_components[i].types[0] == "locality") {
        city = address.address_components[i].long_name;
      }
      if (address.address_components[i].types[0] == "administrative_area_level_1") {
        region = address.address_components[i].long_name;
      }
      if (address.address_components[i].types[0] == "country") {
        country = address.address_components[i].long_name;
      }
      if (address.address_components[i].types[0] == "postal_code") {
        zipCode = address.address_components[i].long_name;
      }
    }
    this.registerForm.patchValue({
      addressLine1: this.formatedAddress,
      city: city,
      state: region,
      country: country,
      zipCode: zipCode
    });
  }


  changeTab(data) {
    this.currTab = data.tab.textLabel;
    if (this.currTab == 'donor') {
      this.donors.map(t => {
        t.amount = 0;
        t.checked = false;
        return t
      });
      this.donors[0]['checked'] = true;
      this.donors[0]['amount'] = this.donors[0]['range']['min'];
      this.categoryId = this.donors[0]['id'];

    }
    if (this.currTab == 'sponsor') {
      this.sponsors.map(t => {
        t.amount = 0;
        t.checked = false;
        return t
      });
      this.sponsors[0]['checked'] = true;
      this.sponsors[0]['amount'] = this.sponsors[0]['range']['min'];
      this.categoryId = this.sponsors[0]['id'];
    }

  }
  sponsorChange(check, index, onload = false) {
    if (onload == false) {
      this.sponsors.map(t => {
        t.amount = 0;
        t.checked = false;
        return t
      });
    }
    this.sponsors[index]['checked'] = check;
    this.categoryId = this.sponsors[index]['id'];
    this.sponsors[index]['amount'] = this.sponsors[index]['range']['min'];
  }

  donationChange(check, index, onload = false) {
    if (onload == false) {
      this.donors.map(t => {
        t.amount = 0;
        t.checked = false;
        return t
      });
    }
    this.donors[index]['checked'] = check;
    this.categoryId = this.donors[index]['id'];
    this.donors[index]['amount'] = this.donors[index]['range']['min'];

  }

  getPaymentMethod(){
    let request = {
      path: '/auth/configuration/paymentMethod/' + this.chapterId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.paymentMethod = response['data'];
      this.changePayment.emit();
    });
  }

}
