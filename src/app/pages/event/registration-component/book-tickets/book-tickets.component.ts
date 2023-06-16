import {Component, EventEmitter, Input, OnInit, Output,ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators,FormGroupDirective} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {configuration} from "../../../../configration";
import {EMAIL_PATTERN} from "../../../../helpers/validations";
import {Subject, Subscription} from "rxjs";
import {UsernameValidator} from '../../../../helpers/whitespaceValidator';
import {CommunityDetailsService} from "../../../../services/community-details.service";
import { lstatSync } from 'fs';

@Component({
  selector: 'app-book-tickets',
  templateUrl: './book-tickets.component.html',
  styleUrls: ['./book-tickets.component.scss']
})
export class BookTicketsComponent implements OnInit {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @Input() eventId = "";
  response: any = [];
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() completeGuest: EventEmitter<any> = new EventEmitter();

  @Output() userDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() paymentDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() guestDetailChange: EventEmitter<any> = new EventEmitter();

  eventRules: any = [];
  checkedMember: any = [];
  registerForm: FormGroup;

  submitted: boolean = false;
  @Input()
  discount: Subject<any>;
  discountSubscription: Subscription;
  discountCode = '';

  constructor(private formBuilder: FormBuilder,public communityService:CommunityDetailsService ,public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.registerForm = this.formBuilder.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      birthYear: [''],
      email: [''],
    });
  }

  _userDetail: any;

  @Input()
  get userDetail() {
    return this._userDetail;
  }

  set userDetail(value) {
    this._userDetail = value;
    this.userDetailChange.emit(value);
  }

  _guestDetail: any;
  @Input()
  get guestDetail() {
    return this._guestDetail;
  }

  set guestDetail(value) {
    this._guestDetail = value;
    this.guestDetailChange.emit(value);
  }

  _paymentDetail: any;

  @Input()
  get paymentDetail() {
    return this._paymentDetail;
  }

  set paymentDetail(value) {
    this._paymentDetail = value;
    this.paymentDetailChange.emit(value);
  }

  ngOnInit() {
    this.discountSubscription = this.discount.subscribe((value) => {

      this.discountCode =  $.trim(value);
      this.calculateAmount();
    });
    this.getPriceList();
  }
  guestReset()
  {
    this.submitted = false;
    //this.registerForm.reset();
  }
  addGuest() {
   // this.submitted = true;

  if(this.registerForm.value.phone) {
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
    }
    let registerFormValue = this.registerForm.value;


    if (this.registerForm.valid) {
      this.submitted = true;


      $('#cloaseModal').trigger('click');

      this.guestDetail = registerFormValue;
      console.log()

      this.completeGuest.emit();


      //this.completed.emit();
      console.log(this.registerForm.value)

        this.registerForm.reset();
    } else {
      this.toastrService.error('All fields are required !');

    }

  }

  getPriceList() {
    let request = {
      path: "event/eventRules/" + this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.eventRules = response['data'];
      this.eventRules.forEach((item, index) => {
        item.checked = false;
      });
    });
  }

  calculateAge(list, i,) {
    list['age'] = configuration.calculateAge(list['birthYear']);
    let ageRules = this.eventRules.slice(0);
    ageRules.forEach((item, index) => {
      item.checked = false;
      item.ageRules.forEach((ageRule) => {
        let minAge = ageRule.minAge;
        let maxAge = ageRule.maxAge;
        if (list['age'] >= minAge && list['age'] <= maxAge)
          item['price_' + i] = ageRule['price'];
      })

    });
    list['ageRules'] = ageRules;
    console.log(list['ageRules']);
  }

  changeRule(value, list) {
    list['eventRuleId'] = value;
    let index = this.checkedMember.findIndex(item => item.id == list.id);
    list['eventRuleId'] = value;
    this.checkedMember[index]['eventRuleId'] = value;
    /**if (index != -1) {
      list['eventRuleId'] = value;
      this.checkedMember[index]['eventRuleId'] = value;
    }**/
    this.calculateAmount(list);
  }


  feesCalculation(event, list, guest = false) {
    if (event == true) {
      list['showDiv'] = true;
      let rule = list['eventRuleId'];
      if (this.eventRules.length != 0 && rule == undefined) {
        rule = list['ageRules'][0]['id'];
        list['ageRules'][0]['checked'] = true;
      } else if (this.eventRules.length == 0) {
        rule = null;
      }
      let self = 'GUEST';
      if (this.checkedMember.length == 0) {
        self = 'SELF';
      }
      this.checkedMember.push({
        "firstName": list['firstName'],
        "lastName": list['lastName'],
        "birthYear": list['birthYear'],
        "phone": list['phone'],
        "email": list['email'],
        "relation": self,
        'id': list['id'],
        'age': list['age'],
        'detail': list,
        'guest': guest,
        'selectedFoodNames': {},
        'selectedFoods': {},
        'eventRuleId': rule,
        'seatNumber': '',
        'seatingCategoryName': '',
        'seat': [],
        'seatCategoryId': null
      });
    } else {
      list['showDiv'] = false;
      this.checkedMember = this.checkedMember.filter(item => item.id != list['id']);
    }
    this.calculateAmount(list);

  }


  calculateAmount(list = []) {
    let tempArr = [];
    this.checkedMember.forEach((item,i)=> {
      if (item.guest == true) {
        tempArr.push({
          "age": item.age,
          "eventRuleId": item.eventRuleId,
          "selectedFoodNames": item.selectedFoodNames,
          "firstName": item.firstName,
          "lastName": item.lastName,
          "birthYear": item.birthYear,
          "phone": item.phone,
          "email": item.email,
          "relation": item.relation
        });
      } else {
        let relation = '';
        if( i == 0)
        {
          relation = 'SELF';
        }
        tempArr.push({
          'userId': item.id,
          "age": item.age,
          "phone": item.phone,
          "email": item.email,
          "eventRuleId": item.eventRuleId,
          "selectedFoodNames": item.selectedFoodNames,
          "relation": relation
        });
      }

    });
    let postData = {};
    postData['discountCode'] =  this.discountCode;
    postData['eventId'] = this.eventId;
    postData['type'] = 'USER';
    postData['registrations'] = tempArr;
    let paymentArray = [];
    let data = {
      path: "event/calculateAmount/",
      data: postData,
      isAuth: true
    };

    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        paymentArray['finalAmount'] = response['data']['finalAmount'];
        paymentArray['successfulPayment'] = false;
        paymentArray['registrations'] = tempArr;
        paymentArray['display'] = [];
        response['data']['userAgeFees'].map(data => {
          let group = [];
          group['name'] = data['name'];
          group['value'] = data['totalPrice'];
          group['info'] = false;
          group['description'] = '(1 * ' + data['members'] + ')';
          paymentArray['display'].push(group);
        });
        let tax = [];
        tax['name'] = 'Taxes';
        tax['value'] = response['data']['tax'];
        tax['info'] = false;
        tax['description'] = '';
        paymentArray['display'].push(tax);
        if(response['data']['discount'] != 0) {
          response['data']['discountList'].map(data => {
            let discount = [];
            discount['name'] = data['name'];
            discount['value'] = data['finalDiscount'];
            discount['info'] = false;
            paymentArray['display'].push(discount);
          });
        }
        this.paymentDetailChange.emit(paymentArray);
        this.completed.emit();
      } else {
        if(list['id']){
          this.checkedMember = this.checkedMember.filter(item => item.id !== list['id']);
          list['checked'] = false;
        }

        this.toastrService.error(response['status']['description']);
      }
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

}
