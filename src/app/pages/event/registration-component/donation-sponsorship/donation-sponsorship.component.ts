import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-donation-sponsorship',
  templateUrl: './donation-sponsorship.component.html',
  styleUrls: ['./donation-sponsorship.component.scss']
})
export class DonationSponsorshipComponent implements OnInit {
  @Input() eventId = "";
  @Input() type = "";
  response: any = [];
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() categoryDetailChange: EventEmitter<any> = new EventEmitter();
  sponsors: any = [];
  donors: any = [];
  categoryId: any;
  currTab = 'donor';
  eventDetail: any = [];
  details: any = [] = [];
  postData: any = {};

  constructor(private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

  }

  _categoryDetail: any;

  @Input()
  get categoryDetail() {
    return this._categoryDetail;
  }

  set categoryDetail(value) {
    this._categoryDetail = value;
    this.categoryDetailChange.emit(value);
  }

  ngOnInit() {
    this.getEventDetail();

    this.getDetail();
    this.saveSubscription = this.save.subscribe(() => {
      $('#donateEvent').click();
      if ($.isEmptyObject(this.categoryDetail) == true) {
        if (this.currTab == 'donor') {
          this.donors[0]['checked'] = true;
          this.categoryId = this.donors[0]['id'];
          this.donors[0]['amount'] = this.donors[0]['range']['min'];
        }
        if (this.currTab == 'sponsor') {
          this.sponsors[0]['checked'] = true;
          this.categoryId = this.sponsors[0]['id'];
          this.sponsors[0]['amount'] = this.sponsors[0]['range']['min'];
        }
      }

    });
  }

  getDetail() {
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

  changeTab(data) {
    this.currTab = data.tab.textLabel;
    if ($.isEmptyObject(this.categoryDetail) == true) {
      if (this.currTab == 'donor') {
        this.donors.map(t => {
          t.amount = 0;
          t.checked = false;
          return t
        });
        this.donors[0]['checked'] = true;
        this.donors[0]['amount'] = this.donors[0]['range']['min'];
        this.categoryId = this.donors[0]['id'];

      }
      if (this.currTab == 'sponsor') {
        this.sponsors.map(t => {
          t.amount = 0;
          t.checked = false;
          return t
        });
        this.sponsors[0]['checked'] = true;
        this.sponsors[0]['amount'] = this.sponsors[0]['range']['min'];
        this.categoryId = this.sponsors[0]['id'];
      }
    }
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
    this.donors[index]['amount'] = this.donors[index]['range']['min'];

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  calculateAmount() {
    let detail = [];
    if (this.currTab == 'donor') {
      detail = this.donors.filter(t => t.checked == true)[0];
    } else {
      detail = this.sponsors.filter(t => t.checked == true)[0];
    }
    if (detail != undefined) {

      if (this.currTab == 'donor') {
        this.postData['donationCategoryId'] = detail['id'];
        this.postData['donation'] = detail['amount'];
        this.postData['donationName'] = detail['categoryName'];
        if (detail['amount'] == 0) {
          delete this.postData['donationCategoryId'];
          delete this.postData['donation'];
          delete this.postData['donationName'];
        }
      } else {
        this.postData['sponsorshipCategoryId'] = detail['id'];
        this.postData['sponsorship'] = detail['amount'];
        this.postData['sponsorName'] = detail['categoryName'];
        if (detail['amount'] == 0) {
          delete this.postData['sponsorshipCategoryId'];
          delete this.postData['sponsorship'];
          delete this.postData['sponsorName'];
        }
      }
      this.categoryDetail = this.postData;
      this.completed.emit();
      this.categoryDetailChange.emit(this.categoryDetail);
      $('#closeDonate').trigger('click');

    } else {
      this.toastrService.error('Please select Valid Category ')
    }

  }
}
