

// ********** Currently Not In Use *********** //


import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {SpinnerService} from "../../../services/spinner.service";
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {CommunityDetailsService} from "../../../services/community-details.service";

@Component({
  selector: 'app-membership-dashboard',
  templateUrl: './membership-dashboard.component.html',
  styleUrls: ['./membership-dashboard.component.scss']
})
export class MembershipDashboardComponent implements OnInit {

  memberDetail: any = [];
  eventDetail: any = [];
  userDetail: any = []; 
  authDetail: any = [];
  membershipDetail: any = [];
  durationTypeList: any = [];
  upcommingEventList: any= [];
  newsList:any =[];
  reqData:any={};
  shareBaseLink: string;
  shareTitle: string;
  renewDetail: any = [];
  showRenew: any;
  showJoinMembership: any;
  constructor(public Http: HttpClient, public communityService:CommunityDetailsService,private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {

    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
  }

  async ngOnInit() {
    let date = new Date();
    let n = date.toISOString();
    this.reqData = {
      "filter": {},
      "page": {
        "pageLimit": 10,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "DATE_TIME"
      }
    };

    this.communityService.loadPermissionProviderData.subscribe(() => {
      this.communityService.getPermission();
    });
      document.querySelector("body").removeAttribute('class'); ///remove body class after modal
    await this.geEventDetail();
    await this.getUserDetail();
    await this.getDurationType();
    this.getUpcommingEventList();
    this.getCurrentNews();
    this.getCurrentMembership();
    await this.getMemberDetail();
    this.getProfileDetail();
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

  geEventDetail() {
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
        }
        resolve(null);

      });
      this.spinner.hide();
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

  getCurrentMembership() {
    if(this.userDetail['member'])
    {
      let request = {
        path: 'auth/membershipType/details/plan/' + this.userDetail['member']['planId'],
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
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
      });
    }

  }
  getUpcommingEventList() {

    this.reqData['filter'] = {'eventTiming':'UPCOMING'};
    let request = {
      path: "event/myRegistered",
      data: this.reqData,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      this.upcommingEventList = response['data']['content'];
      let part = this.chunkArray(this.upcommingEventList, 3)
      this.upcommingEventList = part;
    });
  }
  getCurrentNews() {
    let request = {
      path: "news/current/news?pageNumber=0&pageSize=9",
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.newsList = response['data']['content'];
    //   let part = this.chunkArray(this.newsList, 3)
    //   this.newsList = part;
    });
  }
  chunkArray(myArray, chunk_size) {
    let results = [];

    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }

    return results;
  }

  getProfileDetail() {
    let data = {
      path: "auth/user/getUserDetail",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.renewDetail = response['data']['user'];
      if(this.renewDetail['showRenew']){
        this.showRenew = true;
        this.showJoinMembership = false;
      }
      else if (this.renewDetail['showJoinMembership']){
        this.showJoinMembership = true;
        this.showRenew = false;
      }
      else if (this.renewDetail['shoeRenew'] && this.renewDetail['showJoinMembership']){
        this.showRenew = true;
        this.showJoinMembership = false;
      }
    });
  }

}
