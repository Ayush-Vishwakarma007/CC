import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { SpinnerService } from '../../../services/spinner.service';
import { pagination } from 'src/app/pagination';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-notification-management',
  templateUrl: './notification-management.component.html',
  styleUrls: ['./notification-management.component.scss']
})
export class NotificationManagementComponent implements OnInit {

  reqData: any = [];
  reqDataPerId: any = [];
  notificationDetail: any = [];
  totalPagesPerId: any = [];
  notificationMessage = "";
  notificationSentDetail: any = [];
  totalPageForSent: any = [];
  scheduleDate: any;
  notificationSubject = "";
  search:'';
  index=0;
  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, public toastrService: ToastrService) {
    this.reqData = {
      "filter": {
        "search": "",
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

    this.reqDataPerId = {
      "filter": {
        "search": "",
        "viewed": true,
      },
      "page": {
        "pageLimit": 10,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    };
   }

  ngOnInit() {
  }

  getNotificationId() {
    this.reqDataPerId['filter']['viewed'] = true;
    this.getNotificationDetail();
  }

  getNotificationDetail(){
    this.spinner.show();
    let request = {
      path: "notification/notification/details/" + this.reqDataPerId['filter']['notificationId'],
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.spinner.hide();
        this.notificationDetail = response['data'];
        this.notificationMessage = this.notificationDetail['message'];
        this.notificationSubject = this.notificationDetail['subject'];
        this.getNotificationViewDetail();
        this.getNotificationSentDetail();
        $('#openModel').click();
      } else {
        this.toastrService.error(response['status']['description']);
        this.spinner.hide();
      }
    });
  }

  getNotificationViewDetail(){
    this.spinner.show();
    this.reqDataPerId['filter']['viewed']=true;
    let request = {
      path: 'notification/notification/getAll/viewer',
      data: this.reqDataPerId,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.notificationDetail = response['data'];
        this.notificationDetail['content'].forEach((item, index) => {
          item['profileShow'] = false;
          if (item.firstName) {
            if (item.profilePictureUrl == null || item.profilePictureUrl == '') {
              item['profileShow'] = false;
              item['profileUrl'] = item.firstName[0] + "" + item.lastName[0];
            } else {
              item['profileShow'] = true;
              item['profileUrl'] = item.profilePictureUrl;
            }
          }
        });
        this.totalPagesPerId = pagination.arrayTwo(this.notificationDetail['totalPages'], this.reqDataPerId.page.pageNumber);
        this.spinner.hide();
      } else {
        this.toastrService.error(response['status']['description']);
        this.spinner.hide();
      }
    });
  }

  getNotificationSentDetail(){
    this.spinner.show();
    delete this.reqDataPerId['filter']['viewed'];
    let request = {
      path: 'notification/notification/getAll/viewer',
      data: this.reqDataPerId,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.notificationSentDetail = response['data'];
        this.notificationSentDetail['content'].forEach((item, index) => {
          item['profileShow'] = false;
          if (item.firstName) {
            if (item.profilePictureUrl == null || item.profilePictureUrl == '') {
              item['profileShow'] = false;
              item['profileUrl'] = item.firstName[0] + "" + item.lastName[0];
            } else {
              item['profileShow'] = true;
              item['profileUrl'] = item.profilePictureUrl;
            }
          }
        });
        this.totalPageForSent = pagination.arrayTwo(this.notificationSentDetail['totalPages'], this.reqDataPerId.page.pageNumber);
        this.spinner.hide();
      } else {
        this.toastrService.error(response['status']['description']);
        this.spinner.hide();
      }
    });
  }

  pagination(type, data, current = null) {
    if (data == 'user') {
      if (type == 'prev') {
        this.reqDataPerId.page.pageNumber = this.reqDataPerId.page.pageNumber - 1;
      } else if (type == 'current') {
        this.reqDataPerId.page.pageNumber = current;
      } else {
        this.reqDataPerId.page.pageNumber = this.reqDataPerId.page.pageNumber + 1;
      }
      window.scroll(0, 0);
      if(this.index == 0){
        this.getNotificationViewDetail();
      }else{
        this.getNotificationSentDetail();
      }
    }
  }

  changeTabForDetail(event) {
    window.scroll(0, 0);
    this.reqDataPerId['page'] = {
      "pageLimit": 10,
      "pageNumber": 0
    };
    this.search = '';
    this.reqDataPerId['filter']['search'] = '';
    this.index=event;
    if (event == 1) {
     delete this.reqDataPerId['filter']['viewed'];
      this.getNotificationSentDetail();
    }
    if (event == 0) {
      this.reqDataPerId['filter']['viewed'] = true;
      this.getNotificationViewDetail();
    }

  }
  modelHide(){
    this.search = '';
    this.reqDataPerId['filter']['search'] = '';
    this.getNotificationViewDetail();
    this.getNotificationSentDetail();
  }

  getSerchaViewUser(value: any) {
    this.search = value;
    this.reqDataPerId['page']['pageNumber'] = 0
    this.reqDataPerId['filter']['search'] = this.search;
    this.getNotificationViewDetail();
  }
  getSerchaSendUser(value:any){
    this.search = value;
    this.reqDataPerId['page']['pageNumber'] = 0
    this.reqDataPerId['filter']['search'] = this.search;
    this.getNotificationSentDetail();
  }
}
