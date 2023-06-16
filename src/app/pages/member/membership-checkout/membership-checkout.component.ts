import {Component, OnInit} from '@angular/core';
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {SeoService} from "../../../services/seo.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-membership-checkout',
  templateUrl: './membership-checkout.component.html',
  styleUrls: ['./membership-checkout.component.scss']
})
export class MembershipCheckoutComponent implements OnInit {

  authDetail: any = [];
  paymentDetail: any = [];
  planId = '';
  type = ''
  membershipDetail: any = [];
  durationTypeList: any = [];
  currentMembershipDetail: any = [];
  userDetail: any = {};
  membershipTypeId = '';
  status: boolean = false;
  submitSubject: Subject<any> = new Subject();
  discountCode = '';
  allMemberShip: any = [];
  paymentMethod: any = [];
  paymentType = '';

  constructor(public spinner: SpinnerService, private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, private seo: SeoService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.route.params.subscribe(params => {
        this.planId = params['id'];
        this.type = params['type'];
      }
    );
  }

  async ngOnInit() {
    if (!this.authDetail) {
      this.status = true;
    } else {
      await this.getUserDetail();
    }
    await this.getDurationType();

    this.getMembershipList();
    this.getCurrentMembership();
  }

  getMembershipList() {
    this.spinner.show();
    let request = {
      path: 'auth/membershipType/getAll',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.membershipDetail = response['data'];
      let array = [];
      this.durationTypeList.map((type, index) => {
        let main = [];
        main['name'] = type['name'];
        main['plan'] = [];
        this.membershipDetail.map((list, i) => {
          list['plans'].map((plan, i) => {
            if (type['value'] == plan['durationType']) {
              plan['name'] = list['name'];
              main['plan'].push(plan);
            }
          });
        });
        if (main['plan'].length != 0) {
          array.push(main);

        }
      })
      this.allMemberShip = array;
      this.spinner.hide();
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
          this.userDetail = response['data']['user'];
        }
        this.status = true;
      });
      this.spinner.hide();
      resolve(null);
    });
  }

  getCurrentMembership() {
    let request = {
      path: 'auth/membershipType/details/plan/' + this.planId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.currentMembershipDetail = response['data'];
    });
  }

  getDurationType() {
    let request = {
      path: 'auth/durationType',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.durationTypeList = response['data'];
        resolve(null);
      });
    });
  }

  paymentCheckout(): void {
    this.submitSubject.next(this.userDetail);
  }

  submitMemberRegister() {
    if (this.type == 'renew' && this.paymentDetail['planId'] == this.planId) {
      this.renewMembership();
      return false
    }
    let phone = this.userDetail['phone'];
    if (this.userDetail['phone'].length >= 17) {
      phone = phone.slice(0, -1);
    }
    phone = phone.replace('(', '');
    phone = phone.replace(')', '');
    phone = phone.replace(' ', '');
    phone = phone.replace(/[^0-9\.]+/g, "");
    this.spinner.show();
    this.userDetail['phone'] = phone;
    let formdata = {};
    formdata['discountCode'] = this.paymentDetail['discountCode'];
    formdata['nonce'] = this.paymentDetail['nonce'];
    formdata['signUpRequest'] = this.userDetail;
    formdata['signUpRequest']['relation'] = 'SELF';
    formdata['membershipTypeId'] = this.paymentDetail['membershipTypeId'];
    formdata['paymentMethod'] = this.paymentDetail['paymentMethodUsed'];
    formdata['planId'] = this.paymentDetail['planId'];
    formdata['showInDirectory'] = true;
    let request = {

      path: 'auth/member/register',
      data: formdata,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK' || response['status']['code'] == 'CREATED') {
        this.toastrService.success(response['status']['description']);
        if (response['data']['url'] != null) {
          window.location.href = response['data']['url'];
        } else {
          this.router.navigate(['/payment/auth/payment-success']);
        }
      } else {
        this.toastrService.error(response['status']['description']);
      }
      this.spinner.hide();
    });

  }

  renewMembership() {
    let formdata = {
      "autoRenew": true,
      "discountCode": this.paymentDetail['discountCode'],
      "extensionGivenBy": "",
      "extensionReason": "",
      "nonce": this.paymentDetail['nonce'],
      "paymentMethod": this.paymentDetail['paymentMethodUsed']
    };
    let request = {

      path: 'auth/member/renew',
      data: formdata,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK' || response['status']['code'] == 'CREATED') {
        this.toastrService.success(response['status']['description']);
        if (response['data']['url'] != null) {
          window.location.href = response['data']['url'];
        } else {
          this.router.navigate(['/payment/auth/payment-success']);
        }
      } else {
        this.toastrService.error(response['status']['description']);
      }
      this.spinner.hide();
    });

  }
  getPaymentDetail()
  {
    if(this.paymentMethod.length != 0){
      this.paymentType = this.paymentMethod[0]['value'];
    }
    console.log(this.paymentMethod,this.paymentType);
  }

}
