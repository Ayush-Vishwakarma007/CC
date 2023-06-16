import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {Subject} from "rxjs";
import {SeoService} from "../../../services/seo.service";

@Component({
  selector: 'app-become-sponsor',
  templateUrl: './become-sponsor.component.html',
  styleUrls: ['./become-sponsor.component.scss']
})
export class BecomeSponsorComponent implements OnInit {

  step: any = [
    {stepNo: 1, name: "Vendor Plans", step: "VENDOR_PLAN", class:"addticket-icon"},
    {stepNo: 3, name: "Payment & Summary", step: "PAYMENT", class:"payment-summary-icon"}
  ];
  submitBasic: boolean = false;
  activeTabName = '';
  eventId = '';
  lastStep = '';
  type = 'Sponsor';
  typeDisplay = '';
  sponsorDetail: any = [];
  paymentDetail: any = [];
  submitSubject: Subject<any> = new Subject();
  sponsor_list: any = [];
  eventDetail: any = [];
  paymentArray: any = [];
  detail: any;
  sponsorId: any;
  showModal: boolean = false;
  sponsors: any = [];
  donors: any = [];
  categoryId: any;
  currTab = 'donor';
  modalOpen: boolean = false;

  constructor(private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService , private seo:SeoService) {

    this.activeTabName = this.step[0]['step'];
    let s = this.step.length;
    this.lastStep = this.step[s - 1]['step'];
    this.route.params.subscribe(params =>
      this.detail = params
    );
    //console.log(this.detail);
    this.sponsorId = this.detail['id'];
    this.eventId = this.detail['eventId'];
    this.type = this.detail['type'];
    this.typeDisplay = this.type;
    if (this.typeDisplay == 'donation') {
      this.typeDisplay = 'Donor';
    }

  }

  ngOnInit() {
    if (this.type == 'vendor') {
      this.showModal = true;
      this.vendorList();
    } else {
      this.sponsorList();
    }
    this.getEventDetail();
    this.seo.generateTags({});

  }

  sponsorList() {
    let request = {
      path: 'event/getAllSponsorshipCategories/' + this.type.toUpperCase() + '/' + this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.sponsor_list = response['data'];
    });

  }

  vendorList() {
    let request = {
      path: 'event/getAllVendorExpo/' + this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.sponsor_list = response['data'];
    });
    let request1 = {
      path: 'event/getAllSponsorshipCategories/SPONSOR/' + this.eventId,
      isAuth: true,
    };
    this.apiService.get(request1).subscribe(response => {
      this.sponsors = response['data'];
    });
    let request2 = {
      path: 'event/getAllSponsorshipCategories/DONATION/' + this.eventId,
      isAuth: true,
    };
    this.apiService.get(request2).subscribe(response => {
      this.donors = response['data'];
    });

  }

  getEventDetail() {
    let data = {
      path: "event/details/" + this.eventId,
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.eventDetail = response['data'];
      }
    });
  }

  openActiveTab(tabName) {
    this.nextBackActiveTab(tabName, 'current');
  }

  nextBackActiveTab(currentTabName, type) {

    if(this.step[0]['step'] == currentTabName && type =='back')
    {
      this.router.navigate(['event-detail/' + this.eventId]);
      return false;
    }
    if (!this.sponsorDetail['finalAmount']) {
      this.toastrService.error('Complete Your Pending Form First!');
    } else {
      let step;
      this.step.filter(function (entry, index) {
        if (entry.step == currentTabName) {
          step = index;
        }
      });
      if (type == 'next') {
        step = step + 1;
      } else if (type == 'back') {
        step = step - 1;
      }
      this.step.forEach((item, index) => {
        if (this.activeTabName == item['step']) {
          this.step[index]['active'] = true;
        }
      });
      if (step >= 0 && step < this.step.length) {
        let tab;
        tab = this.step[step]['step'];
        this.activeTabName = tab;
      }

      if (type == 'finish') {
        if (this.type == 'donation' || this.type == 'sponsor' ||  this.sponsorDetail.type == 'donate') {
          if (this.paymentDetail['paymentMethodUsed'] == undefined || this.paymentDetail['paymentMethodUsed'] == '') {
            this.toastrService.error('Select Payment Method');
          } else {
            let id = this.categoryId;
            if (this.modalOpen != true) {
              id = this.sponsorId;
            }
            let detail = {
              "amount": this.sponsorDetail['finalAmount'],
              "categoryId": this.sponsorDetail['category']['id'],
              "eventId": this.eventId
            };
            let data = {
              path: "event/sponsorship/request",
              data: detail,
              isAuth: true
            };
            this.apiService.post(data).subscribe(response => {
              if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
                this.toastrService.success(response['status']['description']);
                if (this.sponsorDetail.type != 'donate') {
                  this.router.navigate(['event-detail/' + this.eventId]);
                } else {
                  this.nextBackActiveTab(this.activeTabName, 'back');
                  this.modalOpen = false;
                  this.paymentDetail['paymentMethodUsed'] = '';
                }
              } else {
                this.toastrService.error(response['status']['description']);
              }
            });
          }
        } else
          {
          if (this.paymentDetail['paymentMethodUsed'] == undefined || this.paymentDetail['paymentMethodUsed'] == '') {
            this.toastrService.error('Select Payment Method');
          } else {
            let tempArr = [];
            tempArr.push({
              "categoryId": this.sponsorDetail['category']['id'],
              "count": 1,
            });
            let detail = {};
            detail['expoCategories'] = tempArr;
            detail['eventId'] = this.eventId;
            detail['registrations'] = [];
            detail['role'] = 'VENDOR';
            detail['paymentMethodUsed'] = this.paymentDetail['paymentMethodUsed'];
            detail["sponsorshipCategoryId"] = null;
            detail["sponsorshipDiscount"] = true;
            let data = {
              path: "event/event/registration/",
              data: detail,
              isAuth: true
            };
            this.apiService.post(data).subscribe(response => {
              if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
                this.toastrService.success(response['status']['description']);
                window.location.href = response['data']['url'];
              } else {
                this.toastrService.error(response['status']['description']);
              }
            });
          }
        }
      }
    }
  }


  completeStep() {
    this.paymentArray['finalAmount'] = this.sponsorDetail['finalAmount'];
    this.paymentArray['successfulPayment'] = this.sponsorDetail['successfulPayment'];
    this.paymentArray['display'] = [];

    let tax = [];
    tax['name'] = 'Taxes';
    tax['value'] = this.sponsorDetail['tax'];
    tax['info'] = false;
    tax['description'] = '';

    let amount = [];
    if (this.type == 'vendor') {
      amount['name'] = this.sponsorDetail['category']['name'];
      amount['value'] = this.sponsorDetail['amount'];
      amount['info'] = false;
      amount['description'] = '';
    } else {
      amount['name'] = this.sponsorDetail['category']['categoryName'];
      amount['value'] = this.sponsorDetail['amount'];
      amount['info'] = true;
      amount['description'] = '';
    }
    if( this.sponsorDetail['type'] == 'donate')
    {
      amount['name'] = this.sponsorDetail['category']['categoryName'];
      amount['value'] = this.sponsorDetail['amount'];
      amount['info'] = true;
      amount['description'] = '';
    }
    this.paymentArray['display'].push(amount);
    this.paymentArray['display'].push(tax);

    this.paymentArray['category'] = this.sponsorDetail['category'];
    this.paymentArray['amount'] = this.sponsorDetail['amount'];

    this.nextBackActiveTab(this.activeTabName, 'next');
  }

  changeId() {
  }

  sponsorChange(check, index, onload = false) {
    if (onload == false) {
      this.sponsors.map(t => {
        t.amount = 0;
        t.checked = false;
        return t
      });
    }
    this.sponsors[index]['checked'] = check;
    this.categoryId = this.sponsors[index]['id'];
  }

  donationChange(check, index, onload = false) {
    if (onload == false) {
      this.donors.map(t => {
        t.amount = 0;
        t.checked = false;
        return t
      });
    }
    this.donors[index]['checked'] = check;
    this.categoryId = this.donors[index]['id'];
    // this.sponsorId = this.donors[index]['id'];
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  changeTab(data) {
    this.currTab = data.tab.textLabel;
  }

  eventDonation() {
    let detail = [];
    if (this.currTab == 'donor') {
      detail = this.donors.filter(t => t.id == this.categoryId)[0];
    } else {
      detail = this.sponsors.filter(t => t.id == this.categoryId)[0];
    }


    if (detail != undefined) {
      let postData = {};
      postData['sponsorshipCategoryId'] = detail['id'];
      postData['sponsorship'] = detail['amount'];
      postData['eventId'] = this.eventId;
      postData['registrations'] = [];
      if (detail['amount'] != '' && detail['amount'] != 0) {

        let data = {
          path: "event/calculateAmount",
          data: postData,
          isAuth: true,
        };
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.paymentArray['finalAmount'] = response['data']['finalAmount'];
            this.paymentArray['successfulPayment'] = response['data']['successfulPayment'];
            this.paymentArray['display'] = [];

            let tax = [];
            tax['name'] = 'Taxes';
            tax['value'] = response['data']['tax'];
            tax['info'] = false;
            tax['description'] = '';

            let amount = [];
            amount['name'] = detail['categoryName'];
            amount['value'] = response['data']['totalSponsorship'];
            amount['info'] = true;
            amount['description'] = '';

            this.sponsorDetail['finalAmount'] = response['data']['finalAmount'];
            this.paymentArray['display'].push(amount);
            this.paymentArray['display'].push(tax);

            this.paymentArray['category'] = detail;
            this.paymentArray['amount'] = response['data']['amount'];
            let tab;
            let s = this.step.length - 1;
            tab = this.step[s]['step'];
            this.activeTabName = tab;
            $('#close').click();
            this.modalOpen = true;
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });
      } else {
        this.toastrService.error("Please Add Valid Amount !");
      }
    } else {
      this.toastrService.error("Please Select Valid Sponsor  !");
    }
  }
}
