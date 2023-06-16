import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {Gallery} from "@ngx-gallery/core";
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {SeoService} from "../../../services/seo.service";
import {configuration} from "../../../configration";
import {CommunityDetailsService} from "../../../services/community-details.service";

@Component({
  selector: 'app-chapter-donation-sponsership',
  templateUrl: './chapter-donation-sponsership.component.html',
  styleUrls: ['./chapter-donation-sponsership.component.scss']
})
export class ChapterDonationSponsershipComponent implements OnInit {

  submitSubject: Subject<any> = new Subject();
  discountSubject: Subject<any> = new Subject();

  authDetail :any =[];
  chapterId ='';
  eventDetail:any = [];
  categoryList :any = [];
  paymentDetail :any = [];
  guestDetail:any = [];
  guestShow: boolean = false;
  type= '';
  discountCode = '';
  checkoutType = 'chapter';
  chapter:any= [];
  constructor(public gallery: Gallery, public spinner: SpinnerService,  private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService,private seo:SeoService, public communityService:CommunityDetailsService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.chapter = JSON.parse(localStorage.getItem('chapter'));
    this.route.params.subscribe(params =>{
        this.chapterId = params['id'];
        this.type = params['type'];
      });
    if (!this.authDetail) {
      this.guestShow = true;
    }
  }

  async ngOnInit() {

    //this.type = this.router.url.split('/')[1];
    console.log(this.type);
    document.querySelector("body").removeAttribute('class');
    //await this.getEventDetail();
    await this.getDetail();
  }
  getEventDetail() {
    this.spinner.show();
    let request = {
      path: "event/details/" + this.chapterId,
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        if(response['status']['code'] == 'OK')
        {
          this.eventDetail = response['data'];
        }else
        {
          this.toastrService.error(response['status']['description']);
        }
        resolve(null);
        this.spinner.hide();
      });
    });
  }
  getDetail() {
    let path = '';
    if(this.type == 'donor-checkout')
    {
      path = "event/chapter/sponsorshipCategory/getAll/DONATION/" + this.chapterId;
    }else {
      path = "event/chapter/sponsorshipCategory/getAll/SPONSOR/" + this.chapterId;
    }
    let data = {
      path: path,
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.categoryList = response['data'];
        this.categoryList.forEach((item, index) => {
          item['amount'] = 0
        });
      }
    });
  }
  paymentStep()
  {
    this.submitSubject.next(null);
  }
  paymentCheckout() {

    let details = this.categoryList.filter(t => t.checked == true)[0];
    if(details == undefined)
    {
      this.toastrService.error('Select Vaild Category');
    }else {
      if (this.paymentDetail['paymentMethodUsed'] == undefined || this.paymentDetail['paymentMethodUsed'] == '') {
        this.toastrService.error('Select Payment Method');
      }
      else {
        this.spinner.show();
        let tempArr = [];

        tempArr.push({
          "categoryId": details['id'],
          "count": 1,
        });
        let detail = {
          "amount": this.paymentDetail['finalAmount'],
          "categoryId": details['id'],
          "chapterId": this.chapterId,
          "nonce": this.paymentDetail['nonce'],
          "paymentMethodUsed": this.paymentDetail['paymentMethodUsed'],
          "displayName": this.paymentDetail['displayName'],
          'discountCode': this.discountCode
        };
        if(!this.authDetail) {
          detail['firstName'] =  this.guestDetail['firstName'];
          detail['lastName'] =  this.guestDetail['lastName'];
          detail['email'] =  this.guestDetail['email'];
        }

        detail['nonce'] =  this.paymentDetail['nonce'];


        let data = {
          path: "event/chapter/sponsorship/request",
          data: detail,
          isAuth: true
        };
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            localStorage.setItem('chapterId', this.chapterId);
            if(response['data']['url'] != null)
            {
              localStorage.setItem('isNotEvent', 'true');
              window.location.href = response['data']['url'];
            }else {
              this.router.navigate(['/payment/chapter/payment-success']);
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

  addDiscount() {
    if (this.discountCode == '') {
      this.discountSubject.next(null);
      this.discountSubject.next(null);
    } else {
      this.discountSubject.next(this.discountCode);
    }
  }
  addGuest()
  {
    if(this.guestDetail)
    {
      this.guestDetail['age'] = configuration.calculateAge(this.guestDetail['birthYear']);
      this.guestDetail['relation'] = 'SELF';
      this.guestShow = false;
    }

  }
}
