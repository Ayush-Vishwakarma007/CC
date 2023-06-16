import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {SpinnerService} from "../../services/spinner.service";
import {configuration} from "../../configration";

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss']
})
export class DonationListComponent implements OnInit {

  @Input() allDonors: any = [];
  @Input() donorList:any=[];
  @Input() topDonorList: any = [];
  @Input() eventId='';
  @Input() isShowDonateButton : boolean;
  reqData:any=[];
  topDonors: any = [];
  eventDetail: any = [];

  constructor(private router: Router,public apiService: ApiService, public spinner: SpinnerService,) { }

  ngOnInit(): void {
    this.getEventDetail();
    this.reqData = {
      "filter": {
        "donationType": 'DONATION',
        "eventId": this.eventId,
        "successfulPayment": true
      },
      "page": {
        "pageLimit": 10,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "DESC",
        "sortBy": "DATE"
      }
    };
  }
  getEventDetail()
  {
    let request = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };
    this.spinner.show();
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.eventDetail = response['data'];
        resolve(null);
        this.spinner.hide();
      });
    });
  }
  readMore(news) {
    this.router.navigate(['/news-Details/news/', news.id]);
  }
  onScroll() {
    this.reqData['filter']['donationType'] = 'DONATION';
    this.reqData.page.pageNumber = this.reqData.page.pageNumber + 1;
    this.reqData['sort']['orderBy'] = 'DESC';
    this.reqData['sort']['sortBy'] = 'DATE';

    let req = {
      path: "event/sponsors",
      data: this.reqData,
      isAuth: true,
    };
    this.apiService.post(req).subscribe(response => {
      if (response['data']) {
        this.donorList = response['data'];
        response['data']['content'].map((item)=>{
          this.allDonors.push(item);
        });
      }
    });
  }

  onScrollTopDonor(){

    this.reqData['filter']['donationType'] = 'DONATION';
    this.reqData.page.pageNumber = this.reqData.page.pageNumber + 1;
    this.reqData['sort']['orderBy'] = 'DESC';
    this.reqData['sort']['sortBy'] = 'TOTAL_PAYMENT';

    let req = {
      path: 'event/sponsors',
      data: this.reqData,
      isAuth: true,
    };
    this.apiService.post(req).subscribe(response => {
      if (response['data']) {
        this.topDonors = response['data']['content'];
        this.topDonors.map((item) =>{
          this.topDonorList.push(item);
        })
      }
    });
  }
}
