import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  TemplateRef,
  ChangeDetectorRef,
} from "@angular/core";
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
import {CommunityDetailsService} from "../../services/community-details.service";
import { EMAIL_PATTERN } from '../../helpers/validations';
import { UsernameValidator } from '../../helpers/whitespaceValidator';

@Component({
  selector: 'app-purchase-ticket-without-step',
  templateUrl: './purchase-ticket-without-step.component.html',
  styleUrls: ['./purchase-ticket-without-step.component.scss']
})
export class PurchaseTicketWithoutStepComponent implements OnInit {
  
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
  userForm: FormGroup;
  registerForm :FormGroup;
  formatedAddress = '';
  maploc = {
    componentRestrictions: {country: 'US'}
  };
  constructor(
    private modalService: BsModalService,
    public spinner: SpinnerService,
    private route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    public apiService: ApiService,
    private toastrService: ToastrService,
    private seo: SeoService,
    public menuService: MenuService,
    public cd:ChangeDetectorRef,
    public common:CommonService,
    public communityService:CommunityDetailsService
  ) {
    this.registerForm = this.fb.group({

      firstName: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      lastName: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      phone: [''],

      email: ['', [Validators.required,Validators.pattern(EMAIL_PATTERN)]],
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
    this.route.params.subscribe((params) => { });

    this.route.params.subscribe((params) => (this.eventId = params["id"]));
    this.route.params.subscribe((params) => (this.roleType = params["type"]));
    this.register["id"] = this.eventId;
  }


  ngOnInit() {
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
}
