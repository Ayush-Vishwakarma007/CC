import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Gallery} from "@ngx-gallery/core";
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {SeoService} from "../../../services/seo.service";
import {configuration} from "../../../configration";

@Component({
  selector: 'app-ticket-checkout',
  templateUrl: './ticket-checkout.component.html',
  styleUrls: ['./ticket-checkout.component.scss']
})
export class TicketCheckoutComponent implements OnInit {

  submitSubject: Subject<any> = new Subject();
  discountSubject: Subject<any> = new Subject();
  authDetail: any = [];
  eventId = '';
  eventDetail: any = [];
  ageGroupDetail: any = [];
  paymentDetail: any = [];
  userDetail: any = [];
  userStatus: boolean = false;
  eventRules: any = [];
  checkedMembers: any = [];
  guestDetail: any = [];
  guestArray: any = [];
  guestShow: boolean = false;
  discountCode = '';
  constructor(public gallery: Gallery, public spinner: SpinnerService, private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, private seo: SeoService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.route.params.subscribe(params =>
      this.eventId = params['id']
    );
  }

  async ngOnInit() {
    document.querySelector("body").removeAttribute('class');
    await this.getEventDetail();
    await this.getPriceList();
    this.userDetail['members'] = [];
    this.userDetail['guests'] = [];
    if (this.authDetail) {
      await this.getUserDetail();
    } else {

      this.guestShow = true;
      this.userStatus = true;
    }
  }

  getEventDetail() {
    this.spinner.show();
    let request = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.eventDetail = response['data'];
          this.paymentDetail['finalAmount'] = this.eventDetail['eventConfigurations']['registrationFees'];
          if(this.eventDetail['ageTicketRules'] != null)
          {
            this.ageGroupDetail = this.eventDetail['ageTicketRules']['ageRulePriceList'];
            this.ageGroupDetail.forEach((item) => {
              item['count'] = 0;
            });
          }

        } else {
          this.toastrService.error(response['status']['description']);
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

      this.apiService.get(request).subscribe(response => {
        this.eventRules = response['data'];
        console.log("asd",this.eventRules)
        this.eventRules.forEach((item, index) => {
          item.checked = false;
        });
        resolve(null);
      });
    });
  }

  getUserDetail() {
    this.spinner.show();
    let request = {
      path: "auth/user/getUserDetail",
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {

        if (response['status']['code'] == 'OK') {
          let user = [];
          response['data']['user']['showDiv'] = false;
          if (response['data']['user'].profilePictureUrl == null || response['data']['user'].profilePictureUrl == '') {
            response['data']['user']['profileShow'] = false;
            response['data']['user']['profileUrl'] = response['data']['user'].firstName[0] + "" + response['data']['user'].lastName[0];
          } else {
            response['data']['user']['profileShow'] = true;
            response['data']['user']['profileUrl'] = response['data']['user'].profilePictureUrl;
          }
          user.push(response['data']['user']);
          response['data']['familyMembers'].forEach((item, i) => {
            item['showDiv'] = false;
            if (item.profilePictureUrl == null || item.profilePictureUrl == '') {
              item['profileShow'] = false;
              item['profileUrl'] = item.firstName[0] + "" + item.lastName[0];
            } else {
              item['profileShow'] = true;
              item['profileUrl'] = item.profilePictureUrl;
            }
            let age = configuration.calculateAge(item['birthYear']);
            console.log("aaa",age)
            let ageRules = this.eventRules.slice(0);
            ageRules.forEach((data, index) => {
              data.checked = false;
              data.ageRules.forEach((ageRule) => {
                let minAge = ageRule.minAge;
                let maxAge = ageRule.maxAge;
                if (age >= minAge && age <= maxAge)
                  data['prices_' + i] = ageRule['price'];
              })
            });
            item['ageRules'] = ageRules;
            user.push(item);
          });
          response['data']['guests'].forEach((item, i) => {
            item['showDiv'] = false;
            if (item.profilePictureUrl == null || item.profilePictureUrl == '') {
              item['profileShow'] = false;
              item['profileUrl'] = item.firstName[0] + "" + item.lastName[0];
            } else {
              item['profileShow'] = true;
              item['profileUrl'] = item.profilePictureUrl;
            }
            item['age'] = configuration.calculateAge(item['birthYear']);
            let ageRules = this.eventRules.slice(0);
            ageRules.forEach((data, index) => {
              data.checked = false;
              data.ageRules.forEach((ageRule) => {
                let minAge = ageRule.minAge;
                let maxAge = ageRule.maxAge;
                if (item['age'] >= minAge && item['age'] <= maxAge)
                  data['prices_' + i] = ageRule['price'];
              })
            });
            item['ageRules'] = ageRules;
          });
          user.forEach((item, i) => {
            item['age'] = configuration.calculateAge(item['birthYear']);
            let ageRules = this.eventRules.slice(0);
            ageRules.forEach((data, index) => {
              data.checked = false;
              data.ageRules.forEach((ageRule) => {
                let minAge = ageRule.minAge;
                let maxAge = ageRule.maxAge;
                if (item['age'] >= minAge && item['age'] <= maxAge)
                  data['prices_' + i] = ageRule['price'];
                  console.log("lol",data['price_' + i])
              })
            });
            item['ageRules'] = ageRules;
          });
          this.userDetail['members'] = user;
          this.userDetail['guests'] = response['data']['guests'];
          console.log("dfg",this.userDetail);
          this.userStatus = true;
        }
        resolve(null);

      });
      this.spinner.hide();
    });
  }

  paymentStep() {
    this.submitSubject.next(null);
  }

  ageGroupPaymentCheckout() {
    let details = this.ageGroupDetail.filter(t => t.count != 0);
    if (details == undefined) {
      this.toastrService.error('Select Vaild Age Group');
    } else {
      if (this.paymentDetail['paymentMethodUsed'] == undefined || this.paymentDetail['paymentMethodUsed'] == '') {
        this.toastrService.error('Select Payment Method');
      } else {
        this.spinner.show();
        let tempArr = [];
        details.map(list => {
          tempArr.push({
            "name": list['name'],
            "count": list['count'],
          });
        });

        let detail = {
          "ageRequests": details,
          "role": "USER",
          "nonce": this.paymentDetail['nonce'],
          "paymentMethodUsed": this.paymentDetail['paymentMethodUsed'],
          'discountCode': this.discountCode
        };
        let data = {
          path: "event/ageRegistration/" + this.eventId,
          data: detail,
          isAuth: true
        };
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            localStorage.setItem('eventId', this.eventId);
            if (response['data']['url'] != null) {
              window.location.href = response['data']['url'];
            } else {
              this.router.navigate(['/payment/event/payment-success']);
            }

            this.spinner.hide();
          } else {
            this.toastrService.error(response['status']['description']);
            this.spinner.hide();
          }
        });

      }
    }
  }

  ticketPaymentCheckout() {
    if (!this.paymentDetail['registrations']) {
      this.toastrService.error('Select Any Member');
    } else {
      if (this.paymentDetail['registrations'].length == 0) {
        this.toastrService.error('Select Any Member');
      } else if (this.paymentDetail['paymentMethodUsed'] == undefined || this.paymentDetail['paymentMethodUsed'] == '') {
        this.toastrService.error('Select Payment Method');
      } else {
        this.spinner.show();
        let detail = {};
        detail['eventId'] = this.eventId;
        detail['registrations'] = this.paymentDetail['registrations'];
        detail['role'] = 'USER';
        detail['paymentMethodUsed'] = this.paymentDetail['paymentMethodUsed'];
        detail['nonce'] = this.paymentDetail['nonce'];
        detail["sponsorshipCategoryId"] = null;
        detail["sponsorshipDiscount"] = true;
        detail['discountCode'] =  this.discountCode;
        let data = {
          path: "event/event/registration/",
          data: detail,
          isAuth: true
        };
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            localStorage.setItem('eventId', this.eventId);
            if (response['data']['url'] == null) {
              this.router.navigate(['/payment/event/payment-success']);
              this.spinner.hide();
              return false;
            } else {
              window.location.href = response['data']['url'];
              this.spinner.hide();
            }
          } else {
            this.spinner.hide();
            this.toastrService.error(response['status']['description']);
          }
        });
      }
    }

  }

  addGuest()
  {
    if(this.guestDetail)
    {

      if(this.eventDetail['venueType'] == 'ONLINE')
      {
        delete this.guestDetail["id"];
        this.guestDetail["relation"]=  'SELF';
        this.paymentDetail['registrations'] = [this.guestDetail];
        this.paymentDetail['paymentMethodUsed'] = 'PAYPAL';

        this.ticketPaymentCheckout();
      }else {
        this.guestDetail['profileShow'] = false;
        this.guestDetail['profileUrl'] = this.guestDetail.firstName[0] + "" + this.guestDetail.lastName[0];
        this.guestDetail['age'] = configuration.calculateAge(this.guestDetail['birthYear']);
        console.log("sass",this.guestDetail['age'])
        let ageRules = this.eventRules.slice(0);
        ageRules.forEach((data, index) => {
          data.checked = false;
          data.ageRules.forEach((ageRule) => {
            let minAge = ageRule.minAge;
            let maxAge = ageRule.maxAge;
            if (this.guestDetail['age'] >= minAge && this.guestDetail['age'] <= maxAge  )
              data['price_' + this.userDetail['guests'].length] = ageRule['price'];
        
          })
        });
        this.guestDetail['ageRules'] = ageRules;
        console.log(this.guestDetail['ageRules'] )
        this.userDetail['guests'].push(this.guestDetail);
        console.log(this.guestDetail)
        this.guestShow = false;
        this.guestDetail = [];
        console.log("k",this.userDetail['members']);
      }

    }

  }
  addDiscount()
  {
    if(this.discountCode =='')
    {
      this.discountSubject.next(null);
      this.discountSubject.next(null);
    }else{
      this.discountSubject.next(this.discountCode);
    }
  }
}
