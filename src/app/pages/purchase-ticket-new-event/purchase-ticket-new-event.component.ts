import { Component, OnInit, Output, EventEmitter, TemplateRef, Input, ChangeDetectorRef } from "@angular/core";
import { SpinnerService } from "../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../services/api.service";
import { ToastrService } from "ngx-toastr";
import { SeoService } from "../../services/seo.service";
import * as moment from "moment-timezone";
import { Subject } from "rxjs";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { isNumeric } from 'jquery';
import { MenuService } from "../../services/menu.service";
import { CommonService } from "../../services/common.service"
import { CommunityDetailsService } from "../../services/community-details.service";
import { EMAIL_PATTERN } from '../../helpers/validations';
import { UsernameValidator } from '../../helpers/whitespaceValidator';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-purchase-ticket-new-event',
  templateUrl: './purchase-ticket-new-event.component.html',
  styleUrls: ['./purchase-ticket-new-event.component.scss']
})
export class PurchaseTicketNewEventComponent implements OnInit {

  @Input()
  paymentType = '';
  publicKey = '';
  modalRef: BsModalRef;
  authDetail: any = [];
  eventDetail: any = [];
  eventId = "";
  timezone = "";
  step: any = [];
  ticketCategory: any = [];
  optionList: any = [];
  guestDetail: any = [];
  activeTabName = "";
  submitBasic: boolean = false;
  submitted: boolean = false;
  saveBtn: boolean = true;
  calculate: any = [];
  ageRules: any;
  totalYear: any = [];
  totalPrice = 0;
  numberOfTicket: any;
  currentYear: number = new Date().getFullYear();
  sponsorDetail: any = [];
  parkingDetail: any;
  fooddetails: any;
  reqData = {};
  summaryFood: any;
  summaryPark: any = [];
  food: any = [];
  parking: any = [];
  checkoutArray: any = [];
  type: any;
  summarySponsorship: any;
  summaryDonar: any;
  register: any = [];
  summaryStore: any;
  next: boolean = false;
  alertText = ''
  submitSubject: Subject<any> = new Subject();
  responseSubject: Subject<any> = new Subject();
  userStatus: boolean = true;
  guestShow: boolean = false;
  paymentDetail: any = [];
  userDetail: any = [];
  loginForm: FormGroup;
  isLogin: boolean = false;
  roleType: any;
  currentStep = 1;
  detailsponsor = []
  detaildonation = []
  userDataRequired: any
  eventRuleId: any
  response: any = []
  eventcategory: any = []
  userDetailsRequired: any
  registrationType: any
  userForm: FormGroup;
  registerForm: FormGroup;
  formatedAddress = '';
  maploc = {
    componentRestrictions: { country: 'US' }
  };
  communities: any = [];
  userDetailreqchange: any;
  ticket: any;
  ticketDetail: any = [];
  eventRuleIdchange: any
  rule: any;
  value: any
  finalRegistrationArray: any;
  noFreeTickets: any = [];
  freeTickets: any = [];
  paidTickets: any = [];
  zeroFreeTickets: any = [];
  paymentsSubject: Subject<any> = new Subject();
  acceptTerms: boolean = false;
  communityName = ""
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() currentStepChange: EventEmitter<any> = new EventEmitter();
  @Output() checkoutArrayChange: EventEmitter<any> = new EventEmitter();
  communitiess = [
    { name: "DFW", id: "1", },
    { name: "SLPS", id: "2", },
    { name: "SPCS", id: "3", },
    { name: "CLPS", id: "4", },
    { name: "N/A", id: "5", }
  ];
  constructor(private modalService: BsModalService, public spinner: SpinnerService, private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, private seo: SeoService, public menuService: MenuService, public cd: ChangeDetectorRef, public common: CommonService, public communityService: CommunityDetailsService) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, UsernameValidator.removeSpaces]],
      lastName: ['', [Validators.required, UsernameValidator.removeSpaces]],
      phone: ['', Validators.required],
      communityName: [''],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN), UsernameValidator.removeSpaces]]
    });
    this.loginForm = this.fb.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
      otp: [""],
    });
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    if (this.authDetail) {
      this.register["userDetail"] = this.authDetail;

    }

    this.route.params.subscribe((params) => (this.eventId = params["id"]));
    this.route.params.subscribe((params) => (this.roleType = params["type"]));
    this.route.params.subscribe((params) => { });
    //this.route.params.subscribe((params) => (this.communityName = params["community"]));
    // if(this.communityName==undefined){
    //   this.communityName= "dfw"
    // }
    this.register["id"] = this.eventId;
    let chapter = JSON.parse(localStorage.getItem("chapter"));
    if (chapter) {
      this.checkoutArray['chapterId'] = chapter['id'];
    }
  }


  ngOnInit() {
    this.getEventDetail().then((r) => {
      if (this.eventDetail.registrationTimeOver == true) {
        this.router.navigate(['/']);
      }
      if (this.authDetail) {
        this.register["userDetail"] = this.authDetail;
        if (this.eventDetail.eventConfigurations.allowNonMembers == false && this.authDetail.userState != 'MEMBER' && this.eventDetail.eventConfigurations.allowGuests == false) {
          this.toastrService.error('Tickets are only available for members');
          this.router.navigate(['/event-details/' + this.eventId])
        }
      } else {
        if (this.eventDetail.eventConfigurations.allowGuests == false) {
          let url = "/ticket-booking-new/" + this.eventId + '/USER'
          localStorage.setItem('eventUrl', url);
          this.router.navigate(['/login'])
        } else {
          this.guestShow = true;
          this.userStatus = true;
        }
      }
    });

    this.getCategory()
    this.getPaymentMethod()
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
    console.log(event.target.value)
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  onSearchChange(searchValue: string): void {
    console.log(searchValue);
    if (searchValue >= '25') {
      console.log("fdsf")
    }
  }

  getEventDetail() {
    this.spinner.show();
    let request = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe((response) => {
        if (response["status"]["code"] == "OK") {
          this.eventDetail = response["data"];
          this.registrationType = this.eventDetail['eventConfigurations']['registrationType']
          this.communities = this.eventDetail['communities']
          this.communities = this.communities.sort((a, b) => (b > a ? -1 : 1));

          let zone = moment.tz.guess();
          let abbr = moment.tz(zone).format("z");
          this.timezone = abbr;
        } else {
          this.toastrService.error(response["status"]["description"]);
        }
        resolve(null);
        this.spinner.hide();
      });
    });
  }

  getPaymentMethod() {
    let request = {
      path: 'event/paymentMethod?eventId=' + this.eventId + '&paymentType=ONLINE',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.register['paymentMethod'] = response['data'];
      this.register['paymentMethod'] = this.register['paymentMethod'].filter((data) => data.value != 'CLOVER_PAYMENT');
      if (this.register['paymentMethod'][0]) {
        this.paymentType = this.register['paymentMethod'][0]['value'];
        this.register['achPayment'] = this.register['paymentMethod'][0]['achPayment'];
      } else {
        this.paymentType = '';
      }
      this.register['paymentType'] = this.paymentType;
    });
  }

  calculteAmount() {

    this.reqData["eventId"] = this.eventId;
    this.reqData["registrations"] = this.finalRegistrationArray[0];
    this.reqData["role"] = this.roleType
    this.reqData['employeeCount'] = this.register['employeeCount']
    let req = {
      path: "event/calculateAmount",
      isAuth: true,
      data: this.reqData,
    };

    this.apiService.post(req).subscribe((response) => {
      if (
        response["status"]["code"] == "CREATED" ||
        response["status"]["code"] == "OK"
      ) {

        this.summaryStore = response["data"];

        this.register["summery"] = [];
        let amount = [];

        if (this.activeTabName == "DONATION") {
          amount["value"] = response["data"]["totalDonation"];
        } else {
          amount["value"] = response["data"]["totalSponsorship"];
        }

        amount["info"] = true;
        amount["description"] = "";
        let tax = [];
        tax["name"] = "Taxes";
        tax["value"] = response["data"]["tax"];
        tax["info"] = false;
        tax["description"] = "";
        this.register["summery"].push(amount);
        this.register["summery"].push(tax);
        if (response["data"]["discount"] != 0) {
          response["data"]["discountList"].map((data) => {
            let discount = [];
            discount["name"] = data["name"];
            discount["value"] = data["finalDiscount"];
            discount["info"] = false;
            this.register["summery"].push(discount);
          });
        }

        this.register["finalAmount"] = response["data"]["finalAmount"];
        this.register["summery"] = response["data"]["summery"];
        this.response["status"] = response["status"]["status"];
        this.register["status"] = response["status"]["status"];
        this.response["description"] = response["status"]["description"]
        this.cd.detectChanges()
        this.responseSubject.next(this.register)

        setTimeout(() => {
          this.getKey()
        }, 100);
      } else {
        this.toastrService.error(response["status"]["description"]);
        this.response["status"] = response["status"]["status"],
          this.register["status"] = response["status"]["status"];
        this.response["description"] = response["status"]["description"]
        this.cd.detectChanges()
        this.responseSubject.next(this.register)
      }
      this.common.publish("response", this.register["status"]);
    });
  }
  checkNonce() {
  }

  getKey() {

    this.getPaymentMethod()
    let path = ''
    if (this.checkoutArray['type'] == 'chapter') {
      path = 'event/chapter/publicPaymentConfig/' + this.checkoutArray['chapterDetail']['id'] + '/' + this.register['paymentType'] + '?achPayment=' + this.checkoutArray['achPayment'];
    }
    else {
      path = 'event/publicPaymentConfig/' + this.eventId + '/' + this.register['paymentType'] + '?achPayment=' + this.register['achPayment'];
    }
    let request = {
      path: path,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        if (this.paymentType == "CLOVER_PAYMENT") {
          this.publicKey = response['data']['apiAccessKey'];
        } else if (this.paymentType == "SQUARE_PAYMENT") {
          this.publicKey = response['data']['applicationId'];
        } else {
          this.publicKey = response['data']['merchantId'];
        }
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }
  submitRegister() {
    this.submitted = true;
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
    localStorage.removeItem('guestDetail');
    if (this.registerForm.valid) {
      this.register["guestDetail"] = registerFormValue;
      localStorage.setItem("guestDetail", JSON.stringify(this.register["guestDetail"]))
    } else {
      this.toastrService.error("please fill all reqired fields");
    }
  }

  finalPayment() {
    this.spinner.show();
    this.paymentsSubject.next('data');
    // if(this.register['finalAmount']>0){
    //   if (this.register['paymentType'] == 'CLOVER_PAYMENT' || this.register['paymentType'] == 'AFFINY_PAY') {
    //     if (!this.register['nonce']) {
    //       this.toastrService.error('Please Enter Valid Value');
    //       this.spinner.hide();
    //       return false;
    //     }
    //   } else {
    //     this.spinner.hide();
    //     delete this.register['nonce']
    //   }
    // }
    this.spinner.show();
    console.log(this.checkoutArray['square'])
    if (this.registerForm.valid) {
      if (this.finalRegistrationArray != "") {
        if (this.acceptTerms == false) {
          this.toastrService.error('Accept Terms & Conditions');
          this.spinner.hide()
          return false;
        } else {
          this.submitRegister()
          setTimeout(() => {
            this.submitted = true;
            let formdata = {};
            // formdata=this.register["userdetail"]
            formdata['achPayment'] = this.register['achPayment']
            formdata['discountCode'] = this.register['discountCode'];
            if (this.register['paymentType'] == 'SQUARE_PAYMENT') {
              formdata['nonce'] = this.checkoutArray['square'];
            }
            else {
              formdata['nonce'] = this.checkoutArray['square'];
            }
            console.log(this.checkoutArray['square'])
            formdata["amount"] = this.register['finalAmount'];
            formdata["eventId"] = this.eventId;
            formdata["paymentMethodUsed"] = this.register['paymentType'];
            formdata['discountCode'] = this.register['discountCode'];
            formdata["role"] = "USER"
            formdata["fieldValues"] = this.register["fieldValues"]
            //formdata["mainUserInfo"] = this.register["guestDetail"]
            formdata["mainUserInfo"] = this.registerForm.value
            formdata["registrations"] = this.finalRegistrationArray[0]
            if (this.registerForm.value['communityName'] == '') {
              this.registerForm.value['communityName'] = "dfw"
            }
            formdata['communityName'] = this.registerForm.value['communityName']
            let path = ''

            path = "event/event/registration";

            let data = {
              path: path,
              data: formdata,
              isAuth: true
            };

            this.apiService.post(data).subscribe(response => {
              if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
                this.toastrService.success(response['status']['description']);
                if (response['data']['url'] != null) {
                  localStorage.setItem('isNotEvent', 'true');
                  window.location.href = response['data']['url'];
                } else {
                  $('#openSuccessModel').click();
                }
                this.spinner.hide();
              } else {
                this.toastrService.error(response['status']['description']);
                this.spinner.hide();
              }
            });
          }, 2000);
        }
      } else {
        this.spinner.hide()
        this.toastrService.error('Please enter number of tickets')
        return false;
      }
    } else {
      this.spinner.hide()
      this.toastrService.error('All * fields are required')
      return false;
    }
  }

  getCategory() {

    if (this.registrationType != 'FREE') {
      let data = {
        path: "event/eventRules/" + this.eventId,
        isAuth: true,
      };

      this.apiService.get(data).subscribe((response) => {
        this.eventcategory = response["data"];
        this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
        if (this.authDetail) {

          if (this.authDetail.userState == 'MEMBER') {

            this.eventcategory = this.eventcategory.filter((t) =>

              (t.allowMember == true && t.allowNonMember == false) || t.allowMember == false && t.allowNonMember == true || t.allowMember == true && t.allowNonMember == true
            )

          }
          else {

            this.eventcategory = this.eventcategory.filter((t) =>
              t.allowNonMember == true
            )

          }
        }
        else {

          this.eventcategory = this.eventcategory.filter((t) =>

            t.allowNonMember == true || (t.allowNonMember == true && t.allowMember)
          )

        }


        this.eventcategory.forEach((element) => {
          this.userDetailsRequired = element.userDetailsRequired;
        });

        if (this.register["ticket"] != undefined) {

          this.eventcategory.forEach((element, index) => {
            this.rule = this.register["ticket"].filter(function (data) {
              return data.eventRuleId == element.id;
            });

            if (this.rule.length > 0) {
              element.value = this.rule.length;
            }
          });


        }
        this.eventcategory.forEach((element) => {
          // this.mychange(element)
        });
      });

    }
    else {
      if (this.register["ticket"] != undefined) {

        this.value = this.register['ticket'].length

        //this.mychange(this.register['ticket'].length)



      }
    }
  }

  mychange(category) {
    this.finalRegistrationArray = [];
    if (category.amountValue != 'Free') {
      //this.noFreeTickets = [];
      this.eventRuleId = category.id;
      this.userDetailsRequired = category.userDetailsRequired;
      //this.guestDetail = JSON.parse(localStorage.getItem("guestDetail"));
      this.guestDetail = this.registerForm.value
      if (category.value != undefined) {
        let array = this.noFreeTickets.filter((t) => {
          if (category.id == t.eventRuleId) {
            return t;
          }
        });
        if (array.length == 0) {
          this.noFreeTickets.push({
            id: category.id,
            type: category.name,
            value: category.value,
            eventRuleId: category.id,
            maxAge: category.maxAge,
            minAge: category.minAge,
            userDetailsRequired: category.userDetailsRequired,
          });
        } else {
          this.noFreeTickets.filter((t, i) => {
            if (category.id == t.eventRuleId) {
              this.noFreeTickets[i]["value"] = category.value;
            }
          });
        }
        this.paidTickets = []
        this.noFreeTickets.forEach((items, index) => {
          for (let i = 1; i <= items.value; i++) {
            // if(i==1){
            //   items['email'] = this.registerForm.value.email;
            //   items['firstName'] = this.registerForm.value.firstName;
            //   items['lastName'] = this.registerForm.value.lastName;
            // }else{
            //   items['email'] = "";
            //   items['firstName'] = "";
            //   items['lastName'] = "";
            // }
            items['email'] = "";
            items['firstName'] = "";
            items['lastName'] = "";
            this.paidTickets.push(items)
          }
        });
      }
    }
    if (category.amountValue == 'Free') {
      // this.freeTickets = [];   
      this.eventRuleId = category.id;
      this.guestDetail = this.registerForm.value
      let array = this.freeTickets.filter((t) => {
        if (category.id == t.eventRuleId) {
          return t;
        }
      });
      if (array.length == 0) {
        this.freeTickets.push({
          id: category.id,
          type: category.name,
          value: category.value,
          eventRuleId: category.id,
          maxAge: category.maxAge,
          minAge: category.minAge,
          userDetailsRequired: category.userDetailsRequired,
        });
      } else {
        this.freeTickets.filter((t, i) => {
          if (category.id == t.eventRuleId) {
            this.freeTickets[i]["value"] = category.value;
          }
        });
      }

      // for (let i = 1; i <= category.value; i++) {
      //   this.freeTickets.push({
      //     email:"",
      //     eventRuleId:this.eventRuleId,
      //     firstName:this.guestDetail['firstName'],
      //     lastName:this.guestDetail['lastName'],
      //     value: category.value,
      //     phone:""
      //   })
      // }
      this.zeroFreeTickets = []
      this.freeTickets.forEach((items, index) => {
        for (let i = 1; i <= items.value; i++) {
          // if(i==1){
          //   items['email'] = this.registerForm.value.email;
          //   items['firstName'] = this.registerForm.value.firstName;
          //   items['lastName'] = this.registerForm.value.lastName;
          // }else{
          //   items['email'] = "";
          //   items['firstName'] = "";
          //   items['lastName'] = "";
          // }
          items['email'] = "";
          items['firstName'] = "";
          items['lastName'] = "";
          this.zeroFreeTickets.push(items)
        }
      });
    }
    this.finalRegistrationArray.push(this.paidTickets.concat(this.zeroFreeTickets));
    console.log("Final Array: ", this.finalRegistrationArray)
    this.calculteAmount()
    setTimeout(() => {
      //this.paymentsSubject.next('data');
    }, 100);
  }

  openModalWithClass1(template1: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template1,
      { backdrop: 'static', ignoreBackdropClick: false, class: 'gray modal-md payment-success-new' }
    );
  }
  return() {
    this.modalRef.hide();
    localStorage.removeItem("eventUrl")
    this.router.navigate(['/event-details/' + this.eventId])
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
