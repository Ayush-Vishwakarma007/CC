import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../services/api.service";
import {SpinnerService} from "../../../services/spinner.service";
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-members-directory',
  templateUrl: './members-directory.component.html',
  styleUrls: ['./members-directory.component.scss']
})
export class MembersDirectoryComponent implements OnInit {

  fieldName: any;
  value: any;
  reqData: any = [];
  addMemberForm: FormGroup;
  submitBtn: boolean = true;
  currentTab = 'member';
  editMemberForm: FormGroup;
  editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "auto",
    "minHeight": "250px",
    "width": "auto",
    "minWidth": "0",
    "translate": "yes",
    "enableToolbar": true,
    "showToolbar": true,
    "placeholder": "Enter text here...",
    "imageEndPoint": "",
    "toolbar": [
      ["bold", "italic", "underline"],
      [{ 'header': 1 }, { 'header': 2 }],
      ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
      ["link"]

    ]
  };
  userPermisssion: any = [];
  notificationForm: FormGroup;
  chapterList: any = [];
  memberSubject: Subject<any> = new Subject();
  statisticSubject: Subject<any> = new Subject();
  chapterIds:any=[];
  chapterId='';
  constructor(public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {
    this.reqData = {
      "filter": {
        "roles": [
          "USER",
          "GUEST"
        ],
        "showInDirectory": true,
        "chapterIds": [
          this.chapterIds
        ],
        "approved": true,
        "mainUser": true,
        "userState": "MEMBER",
        "search": ""
      },
      "page": {
        "limit": 8,
        "page": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    };
  }
  async ngOnInit() {
    console.log(this.reqData)
    document.querySelector("body").removeAttribute('class'); ///remove body class after modal
    this.getChapterList();
    await this.getPermission();
    this.memberSubject.next(null);
  }
  getChapterList() {
    let request = {
      path: 'community/chapters',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.chapterList = response['data'];
      this.chapterId = this.chapterList[0]['id'];
      let array = [];
      this.chapterList.forEach((item, index) => {
        array.push(item.id);
      });
      this.chapterIds = array;
      this.reqData['filter']['chapterIds'] = this.chapterIds;
    });
  }
  getPermission() {
    let req = {
      path: 'uiPermission/getPermissionByRole',
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.get(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.userPermisssion = [];
          response['data'].forEach((item, index) => {
            this.userPermisssion[item.name] = item;
          });
        } else {
        }
        resolve(null);
      });
    });
  }
  changeTab(data) {

    let tab = data;

    this.currentTab = tab;
    setTimeout(() => {
      if(tab == 'dashboard')
      {
        this.statisticSubject.next(null);
      }else{
        this.memberSubject.next(null);
      }
    },300);

  }
}
