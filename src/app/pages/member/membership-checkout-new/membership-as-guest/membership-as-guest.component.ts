import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Observable, Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {EMAIL_PATTERN} from "../../../../helpers/validations";
import {Location} from '@angular/common';
import { isNumeric } from 'jquery';
import {ApiService} from "../../../../services/api.service";
import {Router} from "@angular/router";
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-membership-as-guest',
  templateUrl: './membership-as-guest.component.html',
  styleUrls: ['./membership-as-guest.component.scss']
})
export class MembershipAsGuestComponent implements OnInit {
  modalRef: BsModalRef;
  @Input()
  title = ''

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() currentStepChange: EventEmitter<any> = new EventEmitter();
  @Output() checkoutArrayChange: EventEmitter<any> = new EventEmitter();
  editUserDetail: boolean = false;
  countryData = [];
  dropdownList = [];
  dropdownSettings = {};
  userForm: FormGroup;
  loginForm: FormGroup;
  isLogin: boolean = false;
  userData: any;
  selectedOption:any;
  selected:any;
  new:any=[];
  country:any=[];
  filteredOptions: Observable<any[]>;
  formatedAddress = '';
  location:any = [];
  maploc = {
    componentRestrictions: {country: 'US'}
  };

  constructor(private modalService: BsModalService, public router: Router, public apiService: ApiService, public _location: Location, private fb: FormBuilder, private toastrService: ToastrService) {
    this.userForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      lastName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      phone: [''],
      countryPhoneCode:[''],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      middleName:[''],
      city:['',[Validators.required]],
      addressLine1:['',[Validators.required]],
      zipCode:[''],
      state:['',[Validators.required]]
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  _currentStep: any;
  @Input()
  get currentStep() {
    return this._currentStep;
  }

  set currentStep(value) {
    this._currentStep = value;
    this.currentStepChange.emit(value);
  }

  _checkoutArray: any;
  @Input()
  get checkoutArray() {
    return this._checkoutArray;
  }

  set checkoutArray(value) {
    this._checkoutArray = value;
    this.checkoutArrayChange.emit(value);
  }

  ngOnInit() {
    console.log("title",this.title)
    this.get_country();
    this. getCode();
    this.userForm.patchValue({
      firstName: this.checkoutArray['userDetail']['firstName'],
      email: this.checkoutArray['userDetail']['email'],
      phone: this.checkoutArray['userDetail']['phone'],
      lastName: this.checkoutArray['userDetail']['lastName'],
      middleName: this.checkoutArray['userDetail']['middleName'],
      countryPhoneCode : this.checkoutArray['userDetail']['countryPhoneCode'],
      state:this.checkoutArray['userDetail']['state'],
      city:this.checkoutArray['userDetail']['city'],
      addressLine1:this.checkoutArray['userDetail']['addressLine1'],
      zipCode:this.checkoutArray['userDetail']['zipCode'],
    })
  }
  
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'gray modal-md login-modal-main'})
    );
  }

  checkUserDetail() {
  

    console.log(this.userForm.value,this.title);
    if (this.userForm.value.phone) {
      let phone = this.userForm.value.phone;
      if (this.userForm.value.phone.length >= 17) {
        phone = phone.slice(0, -1);
      }
      phone = phone.replace('(', '');
      phone = phone.replace(')', '');
      phone = phone.replace(' ', '');
      phone = phone.replace(/[^0-9\.]+/g, "");
      this.userForm.patchValue({
        phone: phone
      })
    }
    if (this.userForm.valid) {
      let userCheckValue = {};
      userCheckValue['userName'] = this.userForm.value.firstName+" "+this.userForm.value.lastName;
      userCheckValue['email'] = this.userForm.value.email;
      userCheckValue['phone'] = this.userForm.value.phone;
      let regData = {
        path: "auth/user/check",
        data: userCheckValue,
        isAuth: false
      };
      this.apiService.postWithoutToken(regData).subscribe(response => {
        if(response['data'].phone == true && this.title =="Member"){
          this.toastrService.error('Phone number is already exists');
          return false;
        }else if(response['data'].email == true && this.title =="Member"){
          this.toastrService.error('Email address is already exists ');
          return false;
        }else{
          this.checkoutArray['userDetail'] = {}
          this.checkoutArray['userDetail']['firstName'] = this.userForm.value.firstName;
          this.checkoutArray['userDetail']['middleName'] = this.userForm.value.middleName;
          this.checkoutArray['userDetail']['lastName'] = this.userForm.value.lastName;
          this.checkoutArray['userDetail']['email'] = this.userForm.value.email;
          this.checkoutArray['userDetail']['phone'] = this.userForm.value.phone;
          this.checkoutArray['userDetail']['countryPhoneCode'] = this.userForm.value.countryPhoneCode;
          this.checkoutArray['userDetail']['addressLine1'] = this.userForm.value.addressLine1;
          this.checkoutArray['userDetail']['city'] = this.userForm.value.city;
          this.checkoutArray['userDetail']['state'] = this.userForm.value.state;
          this.checkoutArray['userDetail']['zipCode'] = this.userForm.value.zipCode;

          this.completed.emit();
          let authDetail = JSON.parse(localStorage.getItem("authDetail"));
          if (authDetail) {
            this.currentStep=1
          }
          else
          {
            if(this.title=='Sponsor' || this.title == 'Donor')
            {
              this.currentStep=1
            }
            if(this.title=='Member')
            {
              this.currentStep=2
            }
            
          }
          
          return true;
        }
      });
    } else {
      this.toastrService.error('All * fields are required')
      return false;
    }
  }

  login() {

    let email = null;
    let mobile = null;

    if (this.loginForm.invalid) {
      this.toastrService.error('Fill all fields');
    } else {

      let loginData = this.loginForm.value;
      if (isNumeric(loginData.email)) {
        mobile = loginData.email.trim();
      } else {
        email = loginData.email.trim();
      }

      let data = {
        path: "auth/user/login",
        data: {
          "email": email,
          "latestRequestSource": "WEB",
          "password": btoa(loginData.password),
          "phone": mobile
        },
        isAuth: false,
      }

      this.apiService.postWithoutToken(data).subscribe(response => {

        this.userData = response['data'];
        if (response['status']['status'] == "VERIFY") {

          localStorage.setItem('token', JSON.stringify(this.userData.apiInteraction));
        } else if (response['status']['status'] == "SUCCESS") {
          this.isLogin = true;
          localStorage.setItem('authDetail', JSON.stringify(this.userData));
          localStorage.setItem('token', JSON.stringify(this.userData.apiInteraction));
          localStorage.setItem('login', JSON.stringify(this.isLogin));
          localStorage.setItem('showPopup', 'true');
          this.toastrService.success(response['status']['description']);
          location.reload();

        } else {
          this.toastrService.error(response['status']['description']);
        }

      });
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  goBack()
  {
    this.router.navigate(['/']);
  }
  get_country() {
    let contry_data = {
      path: "auth/country",
      isAuth: false
    };
    this.apiService.get(contry_data).subscribe(response => {
      this.countryData = response['data'];
      //this.dropdownList = response['data']['id'];
     
      this.countryData.forEach((item, index) => {
        var tempArray = [];
        let codeArr = {
          id: item.phoneCode,
          itemName: '(' + item.phoneCode + ') ' + item.name
        };
        this.dropdownList.push(codeArr);
        this.new.push(codeArr['itemName'])
        
      },
     
      console.log("country code ", this.new));

      this.dropdownSettings = {
        singleSelection: true,
        text: "Select Countries",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        classes: "myclass custom-class",
      };
      

    });

  }

  get regFormCon() {
    return this.userForm.controls;
  }

  getCode() {
    this.filteredOptions = this.userForm.controls.countryPhoneCode.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value))
      );
      this.country = this.filteredOptions;
  }
  filter(value: any): any {
    const filterValue = value.toLowerCase();

    return this.new.filter(option => option.toLowerCase().includes(filterValue));
  }

  onFocusEvent(event) {
    this.getCode();
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
    this.location= [];
    this.location.push( address.geometry.location.lat());
    this.location.push( address.geometry.location.lng());
    address.geometry.location.lat();
    this.userForm.patchValue({
      addressLine1: this.formatedAddress,
      city: city,
      state: region,
      country: country,
      zipCode: zipCode,
    });
  }
}
