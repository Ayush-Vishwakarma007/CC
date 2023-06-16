import { Component, OnInit, Output, EventEmitter, TemplateRef, ChangeDetectorRef} from "@angular/core";
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
import {CommonService} from "../../services/common.service"
import { text } from "@fortawesome/fontawesome-svg-core";
@Component({
  selector: "app-ticket-booking-new",
  templateUrl: "./ticket-booking-new.component.html",
  styleUrls: ["./ticket-booking-new.component.scss"],
})
export class TicketBookingNewComponent implements OnInit {
  errortext:any;
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
  type: any;
  summarySponsorship: any;
  summaryDonar: any;
  register: any = [];
  summaryStore: any;
  next: boolean = false;
  paymentType = '';
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
  soldOut: boolean = true
  constructor( private modalService: BsModalService, public spinner: SpinnerService, private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, private seo: SeoService, public menuService: MenuService, public cd:ChangeDetectorRef, public common:CommonService ) {
    
    this.loginForm = this.fb.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
      otp: [""],
    });
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    if (this.authDetail) {
      this.register["userDetail"] = this.authDetail;

    }
    this.route.params.subscribe((params) => { });

    this.route.params.subscribe((params) => (this.eventId = params["id"]));
    this.route.params.subscribe((params) => (this.roleType = params["type"]));
    this.register["id"] = this.eventId;
  }

  ngOnInit() {
    this.getStep().then((r) => { });
    this.getEventDetail().then((r) => {
      if (this.authDetail) {
        this.register["userDetail"] = this.authDetail;
        if(this.eventDetail.eventConfigurations.allowNonMembers ==false && this.authDetail.userState !='MEMBER' && this.eventDetail.eventConfigurations.allowGuests==false){
          this.toastrService.error('Tickets are only available for members');
          this.router.navigate(['/event-details/'+this.eventId])
        }
      } else {
        if(this.eventDetail.eventConfigurations.allowGuests==false){
          console.log("else exexccvc")
          let url = "/ticket-booking-new/"+this.eventId+'/USER'
          localStorage.setItem('eventUrl', url);
          this.router.navigate(['/login'])
        }else {
          this.guestShow = true;
          this.userStatus = true;
        }
      }
    });
    this.getCategory()
    this.getPaymentMethod()




    localStorage.removeItem("formDetails");
    localStorage.removeItem("mediaFile");
    localStorage.removeItem("videoFile");
    localStorage.removeItem("formDetails1")
    this.getStep(true);
    console.log(this.activeTabName)
  }

  getStep(status = false) {
    let request = {
      path:
        "event/eventRegistrationSteps?eventId=" + this.eventId + "&role=" + this.roleType,
      isAuth: true,
    };
    return new Promise<void>((resolve) => {
      this.apiService.get(request).subscribe((response) => {
        this.step = response["data"];
        //  this.step.push({ name: "Additional Information", step: "ADDITIONAL" });
        if (status == false) {
          this.step.forEach((item, index) => {

            this.step[index]["active"] = true;
          });
          this.activeTabName = this.step[0]["step"];

        }
        resolve();
      });
    });
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
          console.log(this.eventDetail)
          this.registrationType = this.eventDetail['eventConfigurations']['registrationType']


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

  getPriceList() {
    let request = {
      path: "event/eventRules/" + this.eventId,
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe((response) => {
        resolve(null);
      });
    });
  }

  nextBackActiveTab(currentTabName, type) {
    this.guestShow = false;
    setTimeout(() => {
      let step;
      this.step.filter(function (entry, index) {
        if (entry.step == currentTabName) {
          step = index;

        }
      });

      if (type == "next") {
        step = step + 1;



      } else if (type == "back") {
        step = step - 1;
      } else {
        this.step.forEach((item, index) => {
          if (this.activeTabName == item["step"]) {
            this.step[index]["active"] = true;
          }
        });
      }

      let tab;

      if (step >= 0 && step < this.step.length) {
        tab = this.step[step]["step"];
        this.activeTabName = tab;

      }
      if (step == this.step.length) {
        this.currentStep = 2;
      }
    }, 1000);
    this.getStep(true);
    window.scrollTo(0, 0);
  }

  parkingdetails(data) {
    this.parkingDetail = data;
  }

  summaryParkAmounts(data) {
    let store = [];
    var parkingindex;

    this.summaryPark.push(data["data"]["userParkingFees"]);

    store = data["data"]["userParkingFees"];

    store.forEach((element, index) => {


      var isPresent = this.parking.some(function (el, i) {
        return el.name === element.name;
      });


      if (isPresent) {
        parkingindex = this.parking.findIndex((el) => el.name == element.name);

        this.parking[parkingindex] = element;
        return;
      } else {


        this.parking.push(element);
      }
    });

  }

  summaryFoodAmounts(data) {
    this.summaryFood = data["data"]["userFoodFees"];

    let store = data["data"]["userFoodFees"];

    store.forEach((element, index) => {


      var isPresent = this.food.some(function (el, i) {
        return el.name === element.name;
      });


      if (isPresent) {
        var foodindex = this.food.findIndex((el) => el.name == element.name);

        this.parking[foodindex] = element;
        return;
      } else {


        this.food.push(element);
      }
    });

  }

  summarySponsor(data) {
    this.summarySponsorship = data;
    this.summarySponsorship.splice(1);

  }

  summaryDonation(data) {
    this.summaryDonar = data;
    this.summaryDonar.splice(1);

  }
  getCategory() {
    let data = {
      path: "event/eventRules/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(data).subscribe((response) => {
      this.eventcategory = response["data"];
      let eventcategorydata = response["data"];
      if(eventcategorydata != []){
        let RegStartDate = localStorage.getItem('RegStartDate');
        this.errortext = 'The Registration is Not Started Yet ! Registration will start from ' + moment(this.eventDetail.startDate).format('DD/MM/YYYY')
      }
        else{
          this.errortext = ''
          let capacity = eventcategorydata[0]['allocated']+eventcategorydata[0]['registered']
          if(eventcategorydata[0]['capacity']==capacity){
            this.soldOut=false
          }else{
            this.soldOut=true
          }
          this.eventcategory.forEach(element => {
            this.userDetailsRequired = element.userDetailsRequired
          });
      }
    })
  }

  skip() {
    this.nextBackActiveTab(this.activeTabName, "next");
  }
  userDetailsRequiredCheck(event) {

    this.userDataRequired = event
  }
  checkEventRuleId($event) {
    this.eventRuleId = event
  }

  calculteAmount() {

    if (this.activeTabName == "SPONSOR") {
      this.detailsponsor = this.register["sponsor"];
    }
    if (this.activeTabName == "DONATION") {
      this.detaildonation = this.register["dontation"];
    }

    this.reqData["eventId"] = this.eventId;


    this.reqData["registrations"] = this.register["ticket"];



    if (this.activeTabName == 'BOOTH')
      this.reqData["registrations"] = this.register["registrations"]


    this.reqData["role"] = this.roleType
    if (this.activeTabName == 'PARKING') {

      this.reqData["parkingOptions"] = this.register["parking"];
    }
    this.reqData["expoCategories"] = this.register["expoCategories"];
    this.reqData["selectedFoods"] = this.register["food"];
    this.reqData["performance"] = this.register["participate"];

    if (this.activeTabName == "SPONSOR") {

      this.reqData["sponsorshipCategoryId"] = this.detailsponsor["id"];
      this.reqData["sponsorship"] = this.detailsponsor["amount"];
      this.reqData["sponsorshipDiscount"]=true;

    }

    if (this.activeTabName == "DONATION") {
      this.reqData["donationCategoryId"] = this.detaildonation["id"];
      this.reqData["donation"] = this.detaildonation["amount"];
    }
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

      } else {

        this.toastrService.error(response["status"]["description"]);
        this.response["status"] = response["status"]["status"],
        this.register["status"] = response["status"]["status"];
        this.response["description"] = response["status"]["description"]
        this.cd.detectChanges()
        this.responseSubject.next(this.register)

        // this.register["ticket"]=[]
      }
      this.common.publish("response",this.register["status"]);
      console.log("response");
    });
  }

  goBack() {
    localStorage.removeItem("eventUrl")
    this.router.navigate(["/event-details/" + this.eventId]);
  }

  save() {
    this.submitSubject.next(null);

  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign(
        {},
        {
          class:
            "gray modal-md modal-dialog-centered newsletter-modal loginregister",
        }
      )
    );
  }

  ticketPaymentCheckout() { }

  addGuest() {
    if (this.register["guestDetail"]) {
      if (this.eventDetail["venueType"] == "ONLINE") {
        delete this.register["guestDetail"]["id"];
        this.register["guestDetail"]["relation"] = "SELF";
        this.paymentDetail["registrations"] = [this.register["guestDetail"]];
        this.paymentDetail["paymentMethodUsed"] = "PAYPAL";

        this.ticketPaymentCheckout();
      } else {
        this.register["guestDetail"]["profileShow"] = false;
        this.register["guestDetail"]["profileUrl"] =
          // this.register["guestDetail"].firstName[0] +
          // "" +
          // this.guestDetail.lastName[0];
        // this.guestDetail['age'] = configuration.calculateAge(this.guestDetail['birthYear']);
        // console.log("sass",this.guestDetail['age'])
        // let ageRules = this.eventRules.slice(0);
        // ageRules.forEach((data, index) => {
        //   data.checked = false;
        //   data.ageRules.forEach((ageRule) => {
        //     let minAge = ageRule.minAge;
        //     let maxAge = ageRule.maxAge;
        //     if (this.guestDetail['age'] >= minAge && this.guestDetail['age'] <= maxAge  )
        //       data['price_' + this.userDetail['guests'].length] = ageRule['price'];
        //
        //   })
        // });
        //this.guestDetail['ageRules'] = ageRules;
        //console.log(this.guestDetail["ageRules"]);
        this.register["userDetail"] = this.guestDetail;

        this.guestDetail = [];

      }
    }
  }

  login() {
    let email = null;
    let mobile = null;

    if (this.loginForm.invalid) {
      this.toastrService.error("Fill all fields");
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
          email: email,
          latestRequestSource: "WEB",
          password: btoa(loginData.password),
          phone: mobile,
        },
        isAuth: false,
      };

      this.apiService.postWithoutToken(data).subscribe((response) => {
        this.register["userDetail"] = response["data"];
        if (response["status"]["status"] == "VERIFY") {
          localStorage.setItem(
            "token",
            JSON.stringify(this.register["userDetail"].apiInteraction)
          );
        } else if (response["status"]["status"] == "SUCCESS") {
          this.guestShow = false;
          this.isLogin = true;
          this.modalRef.hide();
          localStorage.setItem(
            "authDetail",
            JSON.stringify(this.register["userDetail"])
          );
          localStorage.setItem(
            "token",
            JSON.stringify(this.register["userDetail"].apiInteraction)
          );
          localStorage.setItem(
            "login",
            JSON.stringify(true)
          );
          localStorage.setItem("showPopup", "true");
          this.menuService.getMenus();
          this.menuService.setProfile();
          this.toastrService.success(response["status"]["description"]);
          let redirect = localStorage.getItem("eventUrl");
        } else {
          this.toastrService.error(response["status"]["description"]);
        }
      });
    }
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


  finalPayment() {
    this.spinner.show();

    if(this.register['finalAmount']>0){
      if (this.register['paymentType'] == 'CLOVER_PAYMENT' || this.register['paymentType'] == 'AFFINY_PAY') {
        if (!this.register['nonce']) {
          this.toastrService.error('Please Enter Valid Value');
          this.spinner.hide();
          return false;
        }
      } else {
        this.spinner.hide();
        delete this.register['nonce']
      }
    }
    
    this.spinner.show();


    this.submitted = true;
    let formdata = {};
    console.log(this.register['square']);
    // formdata=this.register["userdetail"]
    formdata['achPayment'] = this.register['achPayment']
    formdata['discountCode'] = this.register['discountCode'];
    if(this.register['paymentType']=='SQUARE_PAYMENT'){
      formdata['nonce'] = this.register['square'];
    }
    else{
      formdata['nonce'] = this.register['square'];
    }
    formdata["amount"] = this.register['finalAmount'];
    formdata["eventId"] = this.eventId;
    formdata["paymentMethodUsed"] = this.register['paymentType'];
    formdata['discountCode'] = this.register['discountCode'];
    formdata["parkingOptions"] = this.register['parking']
    formdata["selectedFoods"] = this.register['food']
    formdata["sponsorshipCategoryId"] = this.detailsponsor['id'];
    formdata["sponsorship"] = this.detailsponsor["amount"];
    formdata["donation"] = this.detaildonation["amount"]
    formdata["donationCategoryId"] = this.detaildonation["id"]
    formdata["expoCategories"] = this.register["expoCategories"]
    formdata["accommodationsRequest"] = this.register["accommodationsRequest"]
    formdata["role"] = this.roleType
    formdata["advertisementRequest"] = this.register["advertisment"]
    formdata["advertisementRequestOfDonor"] = this.register['advertismentDonation']
    formdata["fieldValues"] = this.register["fieldValues"]
    // formdata["performance"]=this.register["participate"]
    if (this.authDetail) {
      formdata["role"] = this.roleType
      formdata["mainUserInfo"] = this.authDetail
    }
    else {
      formdata["role"] = this.roleType
      formdata["mainUserInfo"] = this.register["guestDetail"]
    }
    formdata["registrations"] = this.register["registrations"]
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
  skipstep(){
    if (this.activeTabName == "SPONSOR") {
      this.register["sponsor"]=[]
      this.calculteAmount()
      this.skip()
    }
    if (this.activeTabName == "DONATION") {
      this.register["dontation"] = []
      this.calculteAmount()
      this.skip()
    }
    if (this.activeTabName == "PARKING") {
      this.register["parking"]={}
      this.calculteAmount()
      this.skip()
    }
    if (this.activeTabName == "FOOD") {
      this.register["food"]={}
      this.calculteAmount()
      this.skip()
    }
    if (this.activeTabName == "PARTICIPATION") {
      this.register["participate"]=[]
      this.calculteAmount()
      this.skip()
    }
    if (this.activeTabName == "ACCOMMODATION") {
      this.register["accommodationsRequest"]=[]
      this.calculteAmount()
      this.skip()
    }
    if(this.activeTabName == 'ADDITIONAL_INFORMATION'){
      this.register["fieldValues"]={}
      this.calculteAmount()
      this.skip()
    }

  }

}
