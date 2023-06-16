import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition} from '@ngx-gallery/core';
import {Lightbox} from 'ngx-lightbox';
import {SpinnerService} from '../../../services/spinner.service';
import {EMAIL_PATTERN} from "../../../helpers/validations";
import {Subject} from "rxjs";
import {configuration} from "../../../configration";
import {SeoService} from "../../../services/seo.service";
import * as moment from 'moment-timezone';
import {CommunityDetailsService} from "../../../services/community-details.service";

@Component({
  selector: 'app-event-list-detail',
  templateUrl: './event-list-detail.component.html',
  styleUrls: ['./event-list-detail.component.scss']
})
export class EventListDetailComponent implements OnInit {

  items: GalleryItem[];
  imageData = [];
  imageDataLoad: boolean = false;
  eventData: any = [];
  paymentArray: any = [];
  eData: any;
  additionalInfo: any;
  minPrice: any;
  maxPrice: any;
  eventId: string;
  eventRules: any[];
  donation_list: any = [];
  vendor_list: any = [];
  totalAmount: any = [];
  sponsor_list: any = [];
  userDetail: any = [];
  payment_list: any = [];
  type = "";
  shareBaseLink: string;
  shareTitle: string;
  authDetail: any = [];
  addGuestMemberForm: FormGroup;
  submitBtn = true;
  paymentUrl = '';
  PaymentToken: any;
  typeForDonation = "";
  submitSubject: Subject<any> = new Subject();
  donateSubject: Subject<any> = new Subject();
  timezone = '';

  constructor(public gallery: Gallery,public communityService: CommunityDetailsService, public spinner: SpinnerService, private _lightbox: Lightbox, private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, private seo: SeoService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.addGuestMemberForm = this.fb.group({
      id: [''],
      allowedLogin: [true],
      email: ['', [Validators.pattern(EMAIL_PATTERN), Validators.required]],
      firstName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      lastName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      relation: ['GUEST'],
    });
    localStorage.removeItem('eventUrl');
    this.eventData.eventConfigurations = [];
  }

  async ngOnInit() {

    document.querySelector("body").removeAttribute('class');
    //console.log(this.authDetail);
    this.route.params.subscribe(params =>
      this.eventId = params['string']
    );
    await this.paymentUrlData();
    await this.onLoad();

    //console.log(this.imageData);
    this.shareBaseLink = location.origin;
    this.priceList();
    this.donationList();
    this.vendorList();
    this.sponsorList();
    if (this.authDetail != null) {
      this.getUserDetail();
    }
  }

  customGalleryConfig() {

    const lightboxGalleryRef = this.gallery.ref('lightBox');

    lightboxGalleryRef.setConfig({
      imageSize: ImageSize.Contain,
      thumbPosition: ThumbnailsPosition.Bottom,
      dots: true
    });

    lightboxGalleryRef.load(this.items);
  }


  onLoad() {
    //this.eventData = this.eData;
    this.spinner.show();
    let request = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };
    return new Promise((resolve) => {

      this.apiService.get(request).subscribe(response => {
        this.eventData = response['data'];

        let zone = moment.tz.guess();
        let abbr = moment.tz(zone).format("z");

        this.timezone = abbr;

        let config = {
          title:this.communityService.communityDetail['basicInformation']['seoKeywords']+ '| ' + this.eventData.name,
          image: this.eventData.profilePicture,
        };

        this.seo.generateTags(config);

        this.imageData.push({'src': this.eventData.profilePicture, 'thumb': this.eventData.profilePicture});
        this.eventData['otherPictures'].forEach((item) => {
          this.imageData.push({'src': item, 'thumb': item});
        });
        if (this.eventData.bannerPicture == null) {
          this.eventData.bannerPicture = '';
        }

        this.items = this.imageData.map(item =>
          new ImageItem({src: item.src, thumb: item.thumb})
        );
        this.imageDataLoad = true;
        //console.log(this.eventData);
        this.customGalleryConfig();
        resolve(null);
        this.spinner.hide();

      });
    });
  }


  guestFormReset() {
    this.addGuestMemberForm.reset();
    this.submitBtn = true;
  }

  priceList() {
    let request = {
      path: "event/eventRules/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.eventRules = response['data'];

      this.minPrice = 0;
      this.maxPrice = 0;
      let i = 0;

      this.eventRules.forEach((event) => {
        event.ageRules.forEach((ageRule) => {
          if (i == 0) {
            i++;
            this.minPrice = ageRule.price;
          }
          if (ageRule.price > this.maxPrice) {
            this.maxPrice = ageRule.price;
          }
          if (this.minPrice > ageRule.price) {
            this.minPrice = ageRule.price;
          }
        })
      })
    });
  }

  donationList() {
    let request = {
      path: 'event/getAllSponsorshipCategories/DONATION/' + this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.donation_list = response['data'];
    });
  }

  vendorList() {
    let request = {
      path: 'event/getAllVendorExpo/' + this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.vendor_list = response['data'];
    });

  }

  sponsorList() {
    let request = {
      path: 'event/getAllSponsorshipCategories/SPONSOR/' + this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.sponsor_list = response['data'];
    });
  }

  getUserDetail() {
    let data = {
      path: "auth/user/getUserDetail",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.userDetail = response['data']['user'];
    });
  }

  shareEvent(id) {
    this.shareBaseLink = location.origin + '/event-details/' + id;
    //console.log(this.shareBaseLink);
    this.shareTitle = this.eventData['name'];
    // console.log(this.shareTitle);
  }

  setBooking() {
    //console.log('setBooking');
    if (this.eventData.eventConfigurations.fundRaisingEvent == true) {
      this.donateSubject.next(null);
    } else {
      this.booktickit();
    }
  }

  booktickit() {
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    let isLogin = JSON.parse(localStorage.getItem("login"));
    if (!authDetail) {
      this.router.navigate(['/login']);
      return false;
    }
    let checkedMember = [];
    let age = configuration.calculateAge(this.userDetail['birthYear']);
    let rule = this.userDetail['eventRuleId'];
    if (rule == undefined) {
      rule = null;
    }
    checkedMember.push({
      'userId': this.userDetail['id'],
      'age': age,
      'selectedFoods': {},
      'eventRuleId': null,
      'relation': 'SELF'
    });
    this.spinner.show();
    //console.log(authDetail, checkedMember);
    //console.log(this.userDetail);
    let detail = {};
    detail['eventId'] = this.eventId;
    detail['registrations'] = checkedMember;
    detail['role'] = 'USER';
    detail['paymentMethodUsed'] = 'PAYPAL';
    detail["sponsorshipCategoryId"] = null;
    detail["sponsorshipDiscount"] = true;
    if (this.PaymentToken != null) {
      detail['nonce'] = this.PaymentToken;
    }
    let data = {
      path: "event/event/registration",
      data: detail,
      isAuth: true
    };
    $('#closePaypalId').click();
    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        if (response['status']['code'] != 'CONTINUE') {
          this.toastrService.success(response['status']['description']);
        }
        if (response['data']['url'] != null) {
          localStorage.setItem('eventId', this.eventId);
          window.location.href = response['data']['url'];
        }
        localStorage.setItem('eventId', this.eventId);
        this.onLoad();
        // console.log(response);
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.toastrService.error(response['status']['description']);
        this.onLoad();
      }
    });

  }

  sponsorNow(data) {
    this.router.navigate(['/become/sponsor/' + this.eventId + '/' + data.id]);
  }

  donateNow(data) {
    this.router.navigate(['/become/donation/' + this.eventId + '/' + data.id]);
  }

  vendorNow(data) {
    this.router.navigate(['/become/vendor/' + this.eventId + '/' + data.id]);
  }

  paymentUrlData() {
    let request = {
      path: 'payment/configuration/PAYPAL',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.paymentUrl = response['data']['clientId'];
        }
        resolve(null);
      });
    });
  }

  paymentData() {
    this.spinner.show();
    let request = {
      path: 'event/registration/createPayment/' + this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      if (response['status']['status'] == 'OK') {
        this.payment_list = response['data'];
        //console.log(response['data']);
        if (this.payment_list.url != null) {
          localStorage.setItem('eventId', this.eventId);
          window.location.href = this.payment_list.url;
        }
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  Logout() {
    this.toastrService.success("Logout Successfull");
    localStorage.removeItem('authDetail');
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    this.router.navigate(['/']);
  }

  clickType(type) {
    // console.log('clickType');

    this.type = type;
    if (this.type != 'donate' && this.type != 'donation') {
      this.typeForDonation = '';
    }
  }

  setDonationType(type) {
    // console.log('setDonationType');

    this.typeForDonation = type;
    // console.log(this.typeForDonation);
    setTimeout(() => {
      this.donateSubject.next(null);
    }, 300);
  }

  addPayment() {
    // console.log('addPayment');
  }

  skipDonation() {
    //console.log('skipDonation');
    $('#close').trigger('click');
    this.donationWithZero();
  }

  donationWithZero() {
    this.spinner.show();
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    let detail = {
      "amount": 0,
      "categoryId": null,
      "eventId": this.eventId,
      "donationType": 'DONATION',
      "allowLogin": true,
      "nonce": null,
    };
    if (authDetail == null) {
      let guestDetail = this.addGuestMemberForm.value;
      detail['email'] = guestDetail['email'];
      detail['firstName'] = guestDetail['firstName'];
      detail['lastName'] = guestDetail['lastName'];
    }
    detail['paymentMethodUsed'] = 'PAYPAL';
    detail['anonymousDonation'] = this.paymentArray['keepAnonymous'];
    let data = {
      path: "event/sponsorship/request",
      data: detail,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
        if (response['status']['code'] != 'CONTINUE') {
          //  this.toastrService.success(response['status']['description']);
        }
        localStorage.setItem('eventId', this.eventId);
        this.router.navigate(['/payment/register/success']);
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  addGuest() {
    //console.log('addGuest');
    this.spinner.show();
    // console.log(this.addGuestMemberForm.value);
    if (this.addGuestMemberForm.valid) {
      this.type = 'guest';
      if (this.eventData.eventConfigurations.registrationFees == 0) {
        if (this.eventData.eventConfigurations.fundRaisingEvent == true) {
          this.donateSubject.next(null);
        } else {
          this.bookAsGuest(this.addGuestMemberForm.value);
        }
      } else {
        this.submitSubject.next(null);
      }
      $('#guestClose').trigger('click');
      $('#guestClosed').trigger('click');
      this.spinner.hide();
    } else {
      this.toastrService.error("Please fill all required fields!");
      this.submitBtn = false;
      this.spinner.hide();
    }
  }

  loginRedirect() {
    let url = 'event-detail/' + this.eventId;
    //console.log(url);

    localStorage.setItem('eventUrl', url);
    this.router.navigate(['/login'])
  }

  bookAsGuest(guestDetail) {

    // console.log('bookAsGuest');
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));

    let checkedMember = [];

    checkedMember.push({
      'email': guestDetail.email,
      'firstName': guestDetail.firstName,
      'lastName': guestDetail.lastName,
      'selectedFoods': {},
      'eventRuleId': null,
      'relation': 'SELF'
    });
    this.spinner.show();
    let detail = {};
    detail['eventId'] = this.eventId;
    detail['registrations'] = checkedMember;
    detail['role'] = 'USER';
    detail["sponsorshipCategoryId"] = null;
    detail['paymentMethodUsed'] = 'PAYPAL';
    detail["sponsorshipDiscount"] = true;
    if (this.PaymentToken != null) {
      detail['nonce'] = this.PaymentToken;
    }
    let data = {
      path: "event/event/registration",
      data: detail,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
        this.onLoad();
        if (this.eventData.eventConfigurations.fundRaisingEvent == true) {
          this.donateSubject.next(null);
        }
        if (response['data']['url'] != null) {
          localStorage.setItem('eventId', this.eventId);
          window.location.href = response['data']['url'];
        } else {
          localStorage.setItem('eventId', this.eventId);
          this.router.navigate(['/payment/register/success']);
        }

        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.toastrService.error(response['status']['description']);
        this.onLoad();
      }
    });
  }

  getPaymentToken() {
    if (this.type == 'Register') {
      this.booktickit();
    } else if (this.type == 'pay') {
      this.paymentData();
    } else if (this.type == 'guest') {
      this.bookAsGuest(this.addGuestMemberForm.value);
    } else if (this.type == 'donate') {
      this.submitDonation();
    }
    //console.log('getPaymentToken');
  }

  completepayment() {

    this.paymentArray['finalAmount'] = this.totalAmount['finalAmount'];
    this.paymentArray['successfulPayment'] = this.totalAmount['successfulPayment'];
    this.paymentArray['display'] = [];

    let tax = [];
    tax['name'] = 'Taxes';
    tax['value'] = this.totalAmount['tax'];
    tax['info'] = false;
    tax['description'] = '';

    let amount = [];
    this.type = 'donate';
    if (this.totalAmount['type'] == 'donate') {
      amount['name'] = this.totalAmount['category']['categoryName'];
      amount['value'] = this.totalAmount['amount'];
      amount['info'] = true;
      amount['description'] = '';
    }
    this.paymentArray['display'].push(amount);
    this.paymentArray['display'].push(tax);
    this.paymentArray['type'] = this.totalAmount['type'];
    this.paymentArray['category'] = this.totalAmount['category'];
    this.paymentArray['amount'] = this.totalAmount['amount'];
    this.paymentArray['keepAnonymous'] = this.totalAmount['keepAnonymous'];
    //console.log(this.paymentArray);
    //console.log('completepayment');
    this.submitSubject.next(null);
  }

  submitDonation() {
    this.spinner.show();
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    let detail = {
      "amount": this.paymentArray['finalAmount'],
      "categoryId": this.paymentArray['category']['id'],
      "eventId": this.eventId,
    };
    if (authDetail == null) {
      let guestDetail = this.addGuestMemberForm.value;
      detail['email'] = guestDetail['email'];
      detail['firstName'] = guestDetail['firstName'];
      detail['lastName'] = guestDetail['lastName'];
    }
    detail['paymentMethodUsed'] = 'PAYPAL';
    detail['anonymousDonation'] = this.paymentArray['keepAnonymous'];
    let data = {
      path: "event/sponsorship/request",
      data: detail,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {

      if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
        if (response['status']['code'] != 'CONTINUE') {
          //this.toastrService.success(response['status']['description']);
        }
        if (response['data']['url'] != null) {
          localStorage.setItem('eventId', this.eventId);
          window.location.href = response['data']['url'];
        }
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.toastrService.error(response['status']['description']);
      }
    });
  }
}

