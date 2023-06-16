import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { EMAIL_PATTERN } from 'src/app/helpers/validations';
import { UsernameValidator } from 'src/app/helpers/whitespaceValidator';
import { ApiService } from 'src/app/services/api.service';
import { CommunityDetailsService } from 'src/app/services/community-details.service';

@Component({
  selector: 'app-buy-items-guest-login',
  templateUrl: './buy-items-guest-login.component.html',
  styleUrls: ['./buy-items-guest-login.component.scss']
})
export class BuyItemsGuestLoginComponent implements OnInit {

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() completePayment: EventEmitter<any> = new EventEmitter();
  @Output() guestDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() completenext: EventEmitter<any> = new EventEmitter();
   @Output() registerArraychange: EventEmitter<any> = new EventEmitter();
  _guestDetail: any;
 /* @Input()
  get guestDetail() {
    return this._guestDetail;
  }
  set guestDetail(value) {
    this._guestDetail = value;
    this.guestDetailChange.emit(value);
  }*/
  _register: any = {};
  @Input()
  get register() {
    return this._register;
  }

  set register(value) {
    this._register = value;
    this.registerArraychange.emit(value);
  }
  registerForm :FormGroup;
  formatedAddress = '';
  maploc = {
    componentRestrictions: {country: 'US'}
  };
  fbUserData: any= [];
  membershipDetail :any= [];
  submitted:boolean= false;
  skipEmailwithLogin:boolean =false;
  showSkipDiv:boolean =false;
  constructor(private formBuilder: FormBuilder,public communityService:CommunityDetailsService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.registerForm = this.formBuilder.group({

      firstName: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      lastName: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      phone: [''],

      email: ['', [Validators.required,Validators.pattern(EMAIL_PATTERN)]],
    });  }
  ngOnInit() {
    this.getMembershipList();
    this.saveSubscription = this.save.subscribe(() => {
      this.submitRegister()
      // if (
      //   this.register["guestDetail"] == undefined ||
      //   (this.register["guestDetail"]).length == 0 ||
      //   this.register["guestDetail"] == null
      // ) {
      //   this.toastrService.error("please fill all reqired fields");
      // } else {
      //   console.log("else part executed")
      //   this.submitRegister();
      //   //this.completenext.emit();
      // }
    });
  }
  loginRedirect() {
    let url = this.router.url;
    localStorage.setItem('eventUrl', url);
    this.router.navigate(['/login'])
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
  skipEmailLogin(){
    this.skipEmailwithLogin =true;
    this.submitRegister();
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
      if(this.skipEmailwithLogin == false) {
        let detail = {};
        detail = {"email": this.registerForm.value.email}
        let request = {
          path: "auth/user/check",
          data: detail,
          isAuth: true,
        };
        return new Promise((resolve) => {
          this.apiService.post(request).subscribe(response => {
            if (response['status']['code'] == 'OK') {
              if (response['data']['email']) {
                this.showSkipDiv = true;
                this.toastrService.error("Your account is already exists with this email. Please login or you can skip this by below link.");
              } else {
                this.register["guestDetail"] = registerFormValue;
                localStorage.setItem("guestDetail",JSON.stringify(this.register["guestDetail"]))
                this.submitted= true;
                this.completenext.emit();
                this.skipEmailwithLogin =false;
                //this.registerForm.reset()
              }
            }
          });
        });
      }else{
        this.register["guestDetail"] = registerFormValue;
        localStorage.setItem("guestDetail",JSON.stringify(this.register["guestDetail"]))
        this.completenext.emit();
        this.skipEmailwithLogin =false;
      }

      //this.registerForm.reset()
    } else {
      this.toastrService.error("please fill all reqired fields");
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
          this.register["guestDetail"] = response['data'];
          console.log(this.register["guestDetail"])
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
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }

}
