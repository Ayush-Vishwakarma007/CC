import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {EMAIL_PATTERN} from "../../../helpers/validations";
import {Location} from '@angular/common';
import {SpinnerService} from "../../../services/spinner.service";
import {ApiService} from "../../../services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { isNumeric } from 'jquery';


@Component({
  selector: 'app-sponsor-donor-plan-details-new',
  templateUrl: './sponsor-donor-plan-details-new.component.html',
  styleUrls: ['./sponsor-donor-plan-details-new.component.scss']
})
export class SponsorDonorPlanDetailsNewComponent implements OnInit {
  @Input() title = ''
  modalRef: BsModalRef;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() currentStepChange: EventEmitter<any> = new EventEmitter();
  @Output() checkoutArrayChange: EventEmitter<any> = new EventEmitter();
  editUserDetail: boolean = false;
  uploadUrl="notification/file/upload/file"
  userForm: FormGroup;
  loginForm :FormGroup;
  uploadedFlyer: any = [];
  uploadedLogo: any = [];
  validTypesImage = ['jpeg', 'jpg', 'png'];
  eventId:any;
  formatedAddress = '';
  location:any = [];
  authDetail:any
  isLogin: boolean = false;
  userData: any;
  maploc = {
    componentRestrictions: {country: 'US'}
  };
  constructor(private fb: FormBuilder, private toastrService: ToastrService, private route: ActivatedRoute,private apiService: ApiService, public spinner: SpinnerService, public _location: Location,public router:Router,private modalService: BsModalService) {
    this.userForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      middleName: [''],
      lastName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      phone: [''],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      addressLine1: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', ],
      amount: ['', [Validators.required]],
      companyName: [null],
      companyWebsite: [null],
      displayName: [null],
      stayAnonymous: [false],
      flyer: [null],
      logo: [null],
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
    this.route.params.subscribe(params =>
      this.eventId = params['id']
    );
    //this.checkoutArray['userDetail']['displayName'] = this.userForm.value.firstName[0].toUpperCase()+this.userForm.value.middleName[0].toUpperCase()+this.userForm.value.lastName.toUpperCase();
    console.log("ank",this.checkoutArray['userDetail']['displayName'])
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.authDetail=authDetail
    this.userForm.patchValue({
  
      firstName: this.checkoutArray['userDetail']['firstName'],
      email: this.checkoutArray['userDetail']['email'],
      phone: this.checkoutArray['userDetail']['phone'],
      middleName: this.checkoutArray['userDetail']['middleName'],
      lastName: this.checkoutArray['userDetail']['lastName'],
      addressLine1: this.checkoutArray['userDetail']['addressLine1'],
      city: this.checkoutArray['userDetail']['city'],
      state: this.checkoutArray['userDetail']['state'],
      zipCode: this.checkoutArray['userDetail']['zipCode'],
    
      //displayName:this.checkoutArray['userDetail']['firstName'] + ' '+this.checkoutArray['userDetail']['middleName'] + ' '+this.checkoutArray['userDetail']['lastName']
    })
    if(this.checkoutArray['userDetail']['middleName']==null)
    {
      this.userForm.patchValue({
        displayName:this.checkoutArray['userDetail']['firstName']  + ' '+this.checkoutArray['userDetail']['lastName']
      })
      
    }
    else{
      this.userForm.patchValue({
      displayName:this.checkoutArray['userDetail']['firstName'] + ' '+this.checkoutArray['userDetail']['middleName'] + ' '+this.checkoutArray['userDetail']['lastName']
      })
    }
    console.log(this.userForm.value)
  }

  changeStep(type) {
    if (type == 'next') {
      //this.currentStep = 3;
      if (this.checkUserDetail()) {
        this.currentStep = 2;
      }
    }
    //if (type == 'back') {
     // this.currentStep = 1;
    //}
  }

  checkUserDetail() {
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
    if (this.uploadedFlyer[0]) {
      this.userForm.patchValue({
        flyer: this.uploadedFlyer[0]['responseData']['data']['imageUrl']
      });
    } else {
      this.userForm.patchValue({
        flyer: null
      });
    }
    console.log(this.uploadedLogo)
    if (this.uploadedLogo[0]) {
      console.log("hello")
      this.userForm.patchValue({
        logo: this.uploadedLogo[0]['responseData']['data']['imageUrl']
      });
    } else {
      this.userForm.patchValue({
        logo: null
      });
    }

    if (this.userForm.valid) {
      this.checkoutArray['userDetail'] = {}
      this.checkoutArray['userDetail']['firstName'] = this.userForm.value.firstName;
      this.checkoutArray['userDetail']['lastName'] = this.userForm.value.lastName;
      this.checkoutArray['userDetail']['middleName'] = this.userForm.value.middleName;
      this.checkoutArray['userDetail']['email'] = this.userForm.value.email;
      this.checkoutArray['userDetail']['phone'] = this.userForm.value.phone;
      this.checkoutArray['userDetail']['companyName'] = this.userForm.value.companyName;
      this.checkoutArray['userDetail']['companyWebsite'] = this.userForm.value.companyWebsite;
      if(this.userForm.value.middleName!=null)
      {
        this.checkoutArray['userDetail']['displayName'] = this.userForm.value.firstName +' ' +this.userForm.value.middleName+' ' + this.userForm.value.lastName;
      }
      else{
        this.checkoutArray['userDetail']['displayName'] = this.userForm.value.firstName  + this.userForm.value.lastName;
      }
      this.checkoutArray['userDetail']['anonymousDonation'] = this.userForm.value.stayAnonymous;
      this.checkoutArray['userDetail']['flyer'] = this.userForm.value.flyer;
      this.checkoutArray['userDetail']['logo'] = this.userForm.value.logo;
      console.log(this.checkoutArray['userDetail'])
      this.completed.emit();
      return true;
    } else {
      this.toastrService.error('All field are required');
      return false;
    }
  }
  displayName(){
    this.userForm.patchValue({
      displayName: this.userForm.value.firstName
    });
  }
  displayName1()
  {
    this.userForm.patchValue({
      displayName: this.userForm.value.firstName+ ' ' +this.userForm.value.middleName
    });
  }
  displayName2(){
    this.userForm.patchValue({
      displayName: this.userForm.value.firstName+ ' ' +this.userForm.value.middleName + ' ' +this.userForm.value.lastName
    });
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  maxFileError() {
    this.spinner.hide();
    this.toastrService.error('Maximum 1 file is allowed');
  }

  invalidUploadFile() {
    this.spinner.hide();
    this.toastrService.error('Please upload only image file');
  }

  fileSizeError() {
    this.spinner.hide();
    let request = {
      path: 'community/configuration/publicInfo',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.toastrService.error('Maximum ' + response['data']['imageMaxSize'] + 'MB size is allowed');
    });

  }

  uploadStarted() {
    this.spinner.show();
    //this.isFileUploading=true;
  }

  queueCompleted() {
    this.spinner.hide();
  }

  queueCompleted1() {
    this.spinner.hide();
  }
  goBack()
  {
    if(this.checkoutArray['type'] == 'chapter') {
      this.router.navigate(['/']);
    }
    else {
      this.router.navigate(['/event-details/' + this.eventId]);
    }
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
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'gray modal-md login-modal-main'})
    );
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
  
}
