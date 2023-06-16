import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {
  SocialAuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  // LinkedinLoginProvider
} from '@abacritt/angularx-social-login';
import {EMAIL_PATTERN} from "../../../../helpers/validations";
import {UsernameValidator} from '../../../../helpers/whitespaceValidator';
import { CommunityDetailsService } from 'src/app/services/community-details.service';

@Component({
  selector: 'app-new-user-register',
  templateUrl: './new-user-register.component.html',
  styleUrls: ['./new-user-register.component.scss']
})
export class NewUserRegisterComponent implements OnInit {

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() completePayment: EventEmitter<any> = new EventEmitter();
  detail: any = {};
  eventDetail : any = [];
  response: any = [];
  paymentType = '';
  authDetail :any =[];
  userDetail:any = [];
  submitBtn:boolean= true;
  registerForm :FormGroup;
  formatedAddress = '';
  maploc = {
    componentRestrictions: {country: 'US'}
  };
  fbUserData: any= [];
  membershipDetail :any= [];
  submitted:boolean= false;

  @Output() guestDetailChange: EventEmitter<any> = new EventEmitter();
  _guestDetail: any;
  @Input()
  get guestDetail() {
    return this._guestDetail;
  }
  set guestDetail(value) {
    this._guestDetail = value;
    this.guestDetailChange.emit(value);
  }

  constructor(private formBuilder: FormBuilder,public communityService:CommunityDetailsService, public router: Router, private authService: SocialAuthService, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.registerForm = this.formBuilder.group({
      id: [''],
      firstName: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      lastName: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      phone: ['', [Validators.minLength(10)]],
      birthYear: [''],
      email: [''],
    });
  }

  ngOnInit() {
    this.getMembershipList();
  }

  loginRedirect() {
    let url = this.router.url;
    localStorage.setItem('eventUrl', url);
    this.router.navigate(['/login'])
  }
  facebooklogin() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((userData) => {
      this.fbUserData = userData;
      this.Sociallogin('FACEBOOK');
    });
  }
  googlelogin() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData) => {
      this.fbUserData = userData;
      this.Sociallogin('GOOGLE');
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
  submitRegister() {
    this.submitted= true;
    let phone = this.registerForm.value.phone;
    if (this.registerForm.value.phone.length >= 17) {
      phone = phone.slice(0, -1);
    }
    phone = phone.replace('(', '');
    phone = phone.replace(')', '');
    phone = phone.replace(' ', '');
    phone = phone.replace(/[^0-9\.]+/g, "");

    this.registerForm.patchValue({
      phone: phone,
    });
    let registerFormValue = this.registerForm.value;


    if (this.registerForm.valid) {
      this.submitted= true;
      this.guestDetail = registerFormValue;
      this.registerForm.reset()
      this.completed.emit();
    } else {
      this.toastrService.error('All fields are required !');
    }
  }
  Sociallogin(loginType) {

    //======= social login ======  28-04-2020 | pradip kor ==========
    if (this.fbUserData) {
      let data = {
        path: "auth/user/login",
        data: {
          "socialAccessToken": this.fbUserData.token,
          "socialLoginType": loginType,
        },
        isAuth: false,
      }

      this.apiService.postWithoutToken(data).subscribe(response => {
        if (response['status']['status'] == "SUCCESS") {
          localStorage.setItem('authDetail', JSON.stringify( response['data']));
          localStorage.setItem('token', JSON.stringify( response['data'].apiInteraction));
          localStorage.setItem('login', JSON.stringify(true));
          this.guestDetail = response['data'];
          this.completed.emit();
        }

      });
    }
  }
  getMembershipList() {
    let request = {
      path: 'auth/membershipType/details/5e986780026cff005a1a740e',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.membershipDetail = response['data'];
    });
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
    });
  }
}
