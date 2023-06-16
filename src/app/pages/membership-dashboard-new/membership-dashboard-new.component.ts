import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CommunityDetailsService} from "../../services/community-details.service";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {SpinnerService} from "../../services/spinner.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {pagination} from "../../pagination";
import * as $ from "jquery";


@Component({
  selector: 'app-membership-dashboard-new',
  templateUrl: './membership-dashboard-new.component.html',
  styleUrls: ['./membership-dashboard-new.component.scss']
})
export class MembershipDashboardNewComponent implements OnInit {
  test:any = 123.21;
  memberDetail: any = [];
  historyDetail: any = [];
  eventDetail: any = [];
  authDetail: any = [];
  userDetail: any = [];
  durationTypeList: any = [];
  membershipDetail: any = [];
  publicInfo:any=[];
  req:any =[];
  chapterList: any=[];
  totalSettingPages:any =[];
  chapterId='';
  memberSettingHistory: any = [];
  reqData1: any = [];
  startDate=null;
  endDate=null;
  tags :any =[];
  constructor(public Http: HttpClient, 
              public communityService:CommunityDetailsService,
              private formBuilder: FormBuilder, 
              public apiService: ApiService, 
              public spinner: SpinnerService, 
              private toastrService: ToastrService, 
              private route: ActivatedRoute, 
              public router: Router, 
              public _location: Location){
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.req  ={
      "filter": {
        "userId": this.authDetail['id']
      },
      "page": {
        "limit": 8,
        "page": 0
      },
      "sort": {
        "orderBy": "DESC",
        "sortBy": "START_DATE"
      }
    }
    this.reqData1 = {
      "filter": {
        "userId": this.authDetail['id']
      },
      "page": {
        "limit": 8,
        "page": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "START_DATE"
      }
    }
  }
  async ngOnInit() {
    await this.getUserDetail();
    this.getPublicInfo();
    this.getChapterList();
    this.getMemberDetail();
    this.getCurrentMembership();
    this.getEventDetail();
    this.getHistoryDetail();
    this.getNotificationSettingMember();
  }
  getMemberDetail() {
    let req = {
      path: 'auth/dashboard/registrationInsight',
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.get(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.memberDetail = response['data'];
          this.memberDetail['totalMembers'] = this.memberDetail.filter((item) => {
            if (item['status'] == 'Members') {
              return item;
            }
            else {
              this.memberDetail['totalMembers'] = 0;
            }
          })[0]['totalRegistered'];
        }
        resolve(null);
      });
    });
  }
  becomeMember(){
    this.router.navigate(['membership-checkout-new']);
  }
  getUserDetail() {
    this.spinner.show();
    let request = {
      path: "auth/user/getUser/" + this.authDetail['id'],
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {

        if (response['status']['code'] == 'OK') {
          if (response['data'].profilePictureUrl == null || response['data'].profilePictureUrl == '') {
            response['data']['profileShow'] = false;
            response['data']['profileUrl'] = response['data'].firstName[0] + "" + response['data'].lastName[0];
          } else {
            response['data']['profileShow'] = true;
            response['data']['profileUrl'] = response['data'].profilePictureUrl;
          }
          this.userDetail = response['data'];
          console.log('123456',this.userDetail);
          
          this.chapterId = this.userDetail['chapterId'];
        }
        resolve(null);

      });
      this.spinner.hide();
    });
  }
  clickPayNowBtn(){
    let req = {
      path: "auth/member/paymentLink/get",
      isAuth: true,
    }
    this.apiService.get(req).subscribe(response => {
      window.location.href=response['data']['url'];
    });
  }
  getEventDetail() {
    let req = {
      path: 'event/eventStatics',
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.get(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.eventDetail = response['data'];
        }
        resolve(null);
      });
    });
  }
  noReceipt(){
    this.toastrService.error('Receipt not available');
  }
  viewReceipt(id){
    this.spinner.show();
    let req = {
      path: "auth/memberHistory/viewReceipt/"+id,
      isAuth: true,
    };
    this.apiService.getPDF(req);
  }
  getHistoryDetail() {
    this.req['filter']['minDate'] = this.startDate;
    this.req['filter']['maxDate'] = this.endDate;
    this.req['filter']['userId'] = this.authDetail['id'];

    let req = {
      path: 'auth/memberHistory/getAll',
      data: this.req,
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.post(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.historyDetail = response['data'];
          this.totalSettingPages = pagination.arrayTwo(this.historyDetail['totalPages'], this.req.page.page);
          this.historyDetail['content'].map((data,index)=>{
            this.historyDetail['content'][index]['active']= false;
            if(index == 0 && (data['expirationDate'] ==null || data['expirationDate'] < new Date())){
              this.historyDetail['content'][index]['active']= true;
            }
          })

        }
        resolve(null);
      });
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
  getChapterList() {
    let request = {
      path: 'community/chapters/access',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.chapterList = response['data'];
    });
  }
  changeChapter(value) {
    let request = {
      path: 'auth/user/chapter/'+value,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
          this.chapterId = value;
        this.toastrService.success(response['status']['description'])

      }else{
        this.toastrService.error(response['status']['description'])

      }
    });
  }
  getCurrentMembership() {
    // console.log('123',this.userDetail);

    if(this.userDetail['member'])
    {
      let request = {
        path: 'auth/membershipType/details/plan/' + this.userDetail['member']['planId'],
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        if(response['data']){
          this.membershipDetail = response['data'];
          this.membershipDetail['plans'].forEach((i, j) => {
            if (i['id'] == this.userDetail['member']['planId']) {
              this.membershipDetail['currentPlan'] = i;
              this.membershipDetail['planName'] = this.durationTypeList.filter((item) => {
                if (item['value'] == i['durationType']) {
                  return item;
                }
              })[0];
            }
          });
        }
      });
    }

  }
  getPublicInfo() {
      let request = {
        path: 'auth/configuration/publicInfo',
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        this.publicInfo = response['data'];
      });
    }
  getNotificationSettingMember(){
    this.reqData1['filter']['minDate'] = this.startDate;
    this.reqData1['filter']['maxDate'] = this.endDate;
    this.reqData1['filter']['userId'] = this.authDetail['id'];
    let data = {
      path: "auth/memberHistory/getAll",
      data: this.reqData1,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {
      this.memberSettingHistory = response['data'];
      //this.totalSettingPages = pagination.arrayTwo(this.memberSettingHistory['totalPages'], this.reqData1.page.page);
    });
  }
  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }

  pagination1(type, data, current = null) {
    if (data == 'user') {
      if (type == 'prev') {
        this.req.page.page = this.req.page.page - 1;
      } else if (type == 'current') {
        this.req.page.page = current;
      } else {
        this.req.page.page = this.req.page.page + 1;
      }
      this.getHistoryDetail();
    }
  }
  changeDate(){
    this.getHistoryDetail();
  }
  clearFilter(){
    this.startDate=null;
    this.endDate=null;
    this.getHistoryDetail();
  }
  addTag(e) {
    if ($.trim(e.value) != '') {
      this.tags.push($.trim(e.value));
      $('.mat-chip-input').val('');
    }

  }
  remove(i) {
    this.tags.splice(i, 1);
  }
  sendRecipt(id){
    let req = {}
    req['cc'] = this.tags;
    let data = {
      path: "auth/memberHistory/sendReceipt/"+id,
      data: req,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {
      if(response['status']['status'] !='ERROR'){
        this.tags=[];
        this.toastrService.success(response['status']['description']);
      }else{
        this.toastrService.error(response['status']['description']);
      }
    });
  }
  renewMembership() {
    let data = {
      path: "auth/member/renew/paymentLink?userId=" + this.authDetail['id'],
      isAuth: true
    };
    this.spinner.show();
    this.apiService.get(data).subscribe(response => {
      this.spinner.hide();
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        if (response['data']['url'] != null) {
          window.location.href = response['data']['url'];
        }else {
          this.spinner.hide();
        }
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }
}
