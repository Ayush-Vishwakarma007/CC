import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject, Subscription, Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {EMAIL_PATTERN} from "../../../../helpers/validations";
import { Location } from '@angular/common';
import {CommunityDetailsService} from "../../../../services/community-details.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-membership-plan-details-new',
  templateUrl: './membership-plan-details-new.component.html',
  styleUrls: ['./membership-plan-details-new.component.scss']
})
export class MembershipPlanDetailsNewComponent implements OnInit {
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() currentStepChange: EventEmitter<any> = new EventEmitter();
  @Output() checkoutArrayChange: EventEmitter<any> = new EventEmitter();
  @Input()countryPhoneCode = "";
  editUserDetail: boolean = false;

  userForm: FormGroup;
  autoRenew:boolean=false
  countryData = [];
  dropdownList = [];
  dropdownSettings = {};
  formatedAddress = '';
  location:any = [];
  filteredOptions: Observable<any[]>;
  new:any=[];
  maploc = {
    componentRestrictions: {country: 'US'}
  };
  constructor(private router:Router,private fb: FormBuilder,private toastrService: ToastrService,public apiService: ApiService, public communityService: CommunityDetailsService,public _location :Location) {
    this.userForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      middleName:[''],
      lastName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      phone:[''],
      email:  ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      autoRenew: [false,],
      countryPhoneCode:[''],
      addressLine1: [null, [Validators.required]],
      city: [null, [Validators.required]],
      zipCode: [null,],
      state: [null, [Validators.required]],

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
  checkbox_checked: boolean;

  state: number;

  ngOnInit() {
    console.log("ddd ",this.checkoutArray)
    this.get_country()
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
      autoRenew:this.checkoutArray['userDetail']['autoRenew']


    })
    console.log(this.userForm, this.checkoutArray['userDetail'])
  }

  changeStep(type) {
    if (type == 'next') {
      if (this.checkUserDetail()) {
        this.currentStep = 2;
      }
    }
    if (type == 'back') {
    
     this.currentStep=0
     console.log(this.currentStep)
    }
  }

  checkUserDetail() {
    if(this.userForm.value.phone){
      let phone =this.userForm.value.phone;
      if (this.userForm.value.phone.length >= 17) {
        phone = phone.slice(0, -1);
      }
      phone = phone.replace('(', '');
      phone = phone.replace(')', '');
      phone = phone.replace(' ', '');
      phone = phone.replace(/[^0-9\.]+/g, "");
      this.userForm.patchValue({
        phone : phone
      })
      console.log(this.userForm.value.phone);
    }
    if (this.userForm.valid) {
      this.checkoutArray['userDetail']['firstName'] = this.userForm.value.firstName;
      this.checkoutArray['userDetail']['lastName'] = this.userForm.value.lastName;
      this.checkoutArray['userDetail']['middleName'] = this.userForm.value.middleName;
      this.checkoutArray['userDetail']['email'] = this.userForm.value.email;
      this.checkoutArray['userDetail']['phone'] = this.userForm.value.phone;
      this.checkoutArray['userDetail']['autoRenew'] = this.userForm.value.autoRenew;
      this.checkoutArray['userDetail']['countryPhoneCode']=this.userForm.value.countryPhoneCode;
      this.checkoutArray['userDetail']['addressLine1']=this.userForm.value.addressLine1;
      this.checkoutArray['userDetail']['city']=this.userForm.value.city;
      this.checkoutArray['userDetail']['zipCode']=this.userForm.value.zipCode;
      this.checkoutArray['userDetail']['state']=this.userForm.value.state;
      this.completed.emit();
      return true;
    } else {
      this.toastrService.error('All * fields are required')
      return false;
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
  value:any
  click(){
    if( $("#chkbox1").is(':checked')){
      this.value = "True";
    }else{
      this.value= "False";
    }
  }
  get_country() {
    let contry_data = {
      path: "auth/country",
      isAuth: false
    };
    this.apiService.get(contry_data).subscribe(response => {
      this.countryData = response['data'];
      //this.dropdownList = response['data'];

      this.countryData.forEach((item, index) => {
        var tempArray = [];
        let codeArr = {
          id: item.phoneCode,
          itemName: '(' + item.phoneCode + ') ' + item.name
        };
        this.dropdownList.push(codeArr);
        //console.log(this.dropdownList)
      });

      this.dropdownSettings = {
        singleSelection: true,
        text: "Select Countries",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        classes: "myclass custom-class",
      };
      this.userForm.patchValue({
        countryPhoneCode : this.checkoutArray['userDetail']['countryPhoneCode'],
      })
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
    console.log("add: ",this.formatedAddress);
  }
  getCode() {
    this.filteredOptions = this.userForm.controls.countryPhoneCode.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value))
      );
  }

  filter(value: any): any {
    const filterValue = value.toLowerCase();

    return this.new.filter(option => option.toLowerCase().includes(filterValue));
  }

  onFocusEvent(event) {
    this.getCode();
  }

  
}
