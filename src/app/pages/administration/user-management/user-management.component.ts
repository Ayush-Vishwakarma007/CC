import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {Subject} from "rxjs";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  chapterList: any = [];
  chapterDetail: any = [];
  paymentDetail: any = [];
  chapterId = '';
  userList:any = [];
  userPermission:any = [];
  roleList:any = [];
  reqData:any= [];
  userSubject: Subject<any> = new Subject();
  currentTab= '';
  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.reqData = {
      "filter": {
        "mainUser": true,
        "emailVerified": true,

      },
      "page": {
        "limit": 10,
        "page": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    };
  }

  ngOnInit() {
    this.getChapterList();
    this.getPermission();
    this.getRoleList();
      this.reqData['filter']['roles'] = ['ADMIN'];
  }

  getChapterList() {
    let request = {
      path: 'community/chapters/access',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.chapterList = response['data'];
      this.getChapterDetail(this.chapterList[0]['id']);
    });
  }
  getRoleList() {
    let request = {
      path: 'auth/roles',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      response['data'].forEach((item, index) => {
        if(item.specificRole =="USER" || item.specificRole =="MEMBER") {
          this.roleList.push(item);
        }
      });
    });
  }
  getChapterDetail(id)
  {
    this.reqData['filter']['chapterIds'] =[id];
    if(id =='')
    {
      this.reqData['filter']['chapterIds'] =null;
    }
    this.userSubject.next(null);
  }
  getPermission() {
    let req = {
      path: 'uiPermission/getPermissionByRole',
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.get(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.userPermission = [];
          response['data'].forEach((item, index) => {
            this.userPermission[item.name] = item;
          });
        } else {
        }

        resolve(null);
      });
    });
  }
  changeTab(data) {
    let tab = data.tab.textLabel;
    this.currentTab = tab;
    setTimeout(() => {
      if(tab!='CHAPTER_ADMIN') {
        this.reqData['filter']['userState'] = tab
      }
      this.reqData['filter']['roles'] = [tab]
      this.userSubject.next(null);
    }, 300);
  }
}
