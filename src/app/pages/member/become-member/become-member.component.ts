import {Component, OnInit} from '@angular/core';
import {map} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";
import {ApiService} from "../../../services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from 'ngx-toastr';
import {SeoService} from "../../../services/seo.service";

@Component({
  selector: 'app-become-member',
  templateUrl: './become-member.component.html',
  styleUrls: ['./become-member.component.scss']
})
export class BecomeMemberComponent implements OnInit {

  typeId = '5e986780026cff005a1a740e';
  userId = '';

  showPayment = false;
  membershipDetail: any = [];
  price = 0;
  otherData = [];
  constructor(private toastrService: ToastrService,public apiService: ApiService, public router: Router, private route: ActivatedRoute,private seo:SeoService) {
    this.route.params.subscribe(params =>
      this.userId = params['id']
    );
  }

  ngOnInit() {
    this.getMembershipList();
    this.seo.generateTags({});
    if (this.userId != undefined) {
      this.showPayment = true;
      this.getMembershipByUser();
    }

  }

  getMembershipByUser() {
    let request = {
      path: 'auth/member/membershipInfo/' + this.userId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      if(response['status']['code'] == 'OK')
        {
          this.membershipDetail = response['data']['membershipType'];
          this.otherData =  response['data']['plan'];
          this.price = response['data']['plan']['price'];
        }else {
        this.toastrService.error(response['status']['description']);
      }


    });
  }

  getMembershipList() {
    let request = {
      path: 'auth/membershipType/details/' + this.typeId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.membershipDetail = response['data'];
      this.membershipDetail['plans'].forEach((i, j) => {
        if (i['durationType'] == 'LIFETIME') {
          this.price = i['price'];
        }
      });
    });
  }

  onPaymentStatus(response): void {
    let data = {
        'nonce' :response,
        'paymentMethod' : 'PAYPAL'
    };

    let request = {
      path: 'auth/member/createPayment/'+this.userId,
      data : data,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if(response['status']['code'] == 'OK' || response['status']['code'] == 'CREATED')
      {
        this.toastrService.success(response['status']['description']);
        this.router.navigate(['/payment/auth/payment-success']);
      }else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  getClientToken() {
    return () => {
      let request = {
        path: 'payment/configuration/PAYPAL_PAYMENT',
        isAuth: true,
      };
      return this.apiService.get(request).pipe(map(response => {
        if (response['status']['code'] == 'OK') {
          return response['data']['clientId'];
        }
      }));
    }
  }

  createPurchase() {
    return (nonce) => {
      return new BehaviorSubject(nonce);
    }

  }
}
