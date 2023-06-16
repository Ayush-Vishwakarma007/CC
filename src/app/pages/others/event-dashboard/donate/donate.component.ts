import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {

  @Input()type = '';
  @Input() eventId = "";
  @Input() userDetail: any = [];
  eventDetail :any = [];
  sponsorId: any;
  showModal: boolean = false;
  sponsors: any = [];
  donors: any = [];
  categoryId: any;
  currTab = 'donor';
  modalOpen: boolean = false;
  detail :any = [];
  anonymous :boolean = false;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() skipDonation: EventEmitter<any> = new EventEmitter();

  _paymentDetail: any;
  @Output() paymentDetailChange: EventEmitter<any> = new EventEmitter();
  @Input()
  get paymentDetail() {
    return this._paymentDetail;
  }
  set paymentDetail(value) {
    this._paymentDetail = value;
    this.paymentDetailChange.emit(value);
  }

  @Output() sponsorDetailChange: EventEmitter<any> = new EventEmitter();
  _sponsorDetail: any;
  @Input()
  get sponsorDetail() {
    return this._sponsorDetail;
  }
  set sponsorDetail(value) {
    this._sponsorDetail = value;
    this.sponsorDetailChange.emit(value);
  }
  constructor(private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService) {
    this.eventDetail.eventConfigurations = [];
  }
  ngOnInit() {
    this.getEventDetail();

    this.getDetail();
    this.saveSubscription = this.save.subscribe(() => {
      $('#donateEvent').click();
      if(this.type == 'sponsor')
      {
        this.currTab = 'sponsor';
      }
      if(this.currTab =='donor')
      {
        this.donors[0]['checked'] = true;
        this.sponsorId = this.donors[0]['id'];
        this.categoryId = this.donors[0]['id'];
        this.donors[0]['amount'] = this.donors[0]['range']['min'];
      }
      if(this.currTab =='sponsor')
      {
        this.sponsors[0]['checked'] = true;
        this.sponsorId = this.sponsors[0]['id'];
        this.categoryId = this.sponsors[0]['id'];
        this.sponsors[0]['amount'] = this.sponsors[0]['range']['min'];
      }
    });
  }

  getDetail()
  {
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
    this.sponsorId = this.sponsors[index]['id'];
    this.sponsors[index]['amount'] = this.sponsors[index]['range']['min'];

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
    this.sponsorId = this.donors[index]['id'];
    this.donors[index]['amount'] = this.donors[index]['range']['min'];

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  onChange()
  {
  }
  changeTab(data) {
    this.currTab = data.tab.textLabel;

    if(this.currTab =='donor')
    {
      this.donors[0]['checked'] = true;
      this.donors[0]['amount'] = this.donors[0]['range']['min'];
      this.categoryId = this.donors[0]['id'];

    }
    if(this.currTab =='sponsor')
    {
      this.sponsors[0]['checked'] = true;
      this.categoryId = this.sponsors[0]['id'];

      this.sponsors[0]['amount'] = this.sponsors[0]['range']['min'];
    }
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
      if (this.currTab == 'donor') {
        postData['donationCategoryId'] = detail['id'];
        postData['donation'] = detail['amount'];
        postData['eventId'] = this.eventId;
        postData['registrations'] = [];
      } else {
        postData['sponsorshipCategoryId'] = detail['id'];
        postData['sponsorship'] = detail['amount'];
        postData['eventId'] = this.eventId;
        postData['registrations'] = [];
      }

      if (detail['amount'] != '' && detail['amount'] != 0) {

        let data = {
          path: "event/calculateAmount",
          data: postData,
          isAuth: true,
        };
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.detail['finalAmount'] = response['data']['finalAmount'];
            this.detail['eventId'] = response['data']['eventId'];
            this.detail['tax'] = response['data']['tax'];
            if (this.currTab == 'donor')
            {
              this.detail['amount'] = response['data']['totalDonation'];
            }else
            {
              this.detail['amount'] = response['data']['totalSponsorship'];
            }
            this.detail['successfulPayment'] = false;
            this.detail['type'] = 'donate';
            this.detail['category'] = detail;
            this.detail['keepAnonymous']  = this.anonymous;
            // this.toastrService.success(response['status']['description']);
            $('#close').click();
            this.sponsorDetailChange.emit(this.detail);
            this.completed.emit();
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
  donationSkip()
  {
    this.skipDonation.emit();
  }
}
