import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';
import * as  Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import * as Highchart from "highcharts/highmaps";
import Swal from 'sweetalert2';
import { SpinnerService } from '../../../services/spinner.service';
import {ToastrService} from 'ngx-toastr';
import { EMAIL_PATTERN } from "../../../helpers/validations";
import * as $ from 'jquery';
import {Subject} from "rxjs";

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  fieldName: any;
  value: any;
  resetbtn:any='';

  reseFilter=''
  reqData: any = [];
  reqDataAll :any =[];
  addMemberForm: FormGroup;
  submitBtn: boolean = true;
  currentTab = 'member';
  currentActiveTab = 'All';
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
  chapterId : any =[];
  chapterIds:any=[]
  memberState:any = [];
  selectAllChapter: boolean = false;
  selectedIndex = 1;
  tab = 'ALL';
  userDetailArray:any=[]
  constructor(public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {

    this.reqData = {
      "filter": {
        "roles": [
          "USER",
          "GUEST"
        ],
        "chapterIds": [
          this.chapterId
        ],
        "emailVerified": true,
        "mainUser": true,
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

    //this.getPermission();

  }


  async ngOnInit() {
    document.querySelector("body").removeAttribute('class'); ///remove body class after modal
    this.getChapterList();
    this.getMemberState();
    await this.getPermission();
    console.log("AA",this.userDetailArray)
   /*if(this.userPermisssion['VIEW_DASHBOARD']) {
        this.statisticSubject.next(null);
    }*/


    this.memberSubject.next(null);
  }

  getChapterList() {
    let request = {
      path: 'community/chapters/access',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.chapterList = response['data'];
      this.selectAllChapter = true;
      let array = [];
      this.chapterList.forEach((item, index) => {
        array.push(item.id);
      });
      this.chapterId = array;
      this.reqData['filter']['chapterIds'] = this.chapterId;
    });
  }
  getMemberState() {
    let request = {
      path: 'auth/userState',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.memberState = response['data'];
      let array=[];
      response['data'].map((item) => {
        if (item.showInMemberDirectory == true) {
          array.push(item);
        }
      });
      this.memberState =array;
      this.memberState.splice(0, 0, {'name':'All',"showInMemberDirectory" : true,
        "type" : "member", value:'ALL',}
      );

    });
  }
  getChapterDetail(ids)
  {
    this.chapterId= [];
    if(ids.length == 0){
    this.chapterId = [this.chapterList[0]['id']];
    this.toastrService.error('At least one chapter must be selected.')
  }
    ids.forEach((item) => {
      this.chapterId.push(item);
    })
   this.changeTab(this.currentTab);
  }

  activeTab(e){
    console.log(e);
    //this.currentActiveTab = '';
  }

  changeTab(data,reset=false) {
    let tab = data;
    let t = this.memberState.filter((op)=>
      op.value == data
    )[0];

    if(t){
      this.currentActiveTab = t.name;
    }

    if(tab == 'dashboard') {
      this.currentActiveTab = 'Dashboard';
    }
    //console.log(this.chapterId);
    this.reqData['filter']['chapterIds'] = this.chapterId
    this.currentTab = tab;
    localStorage.setItem("tab",this.currentTab)
    //console.log(this.currentTab)
    delete this.reqData['approved'];
    if (this.currentTab == 'member') {
      this.reqData['approved'] =true;
    }
  else{
    this.reqData['approved'] =true;
  }
    if(data =='member' ){
      this.currentTab ='MEMBER';
    }
    if(data =='ALL'  ) {
      this.reqData = {
        "filter": {
          "roles": [
            "USER",
            "GUEST",
            "MEMBER"
          ],
          "chapterIds": this.chapterId,
         
          "mainUser": true,
          "search": "",
          "emailVerified": true,
        },
         "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
      }
      }else{
      this.reqData['filter']['userState'] = this.userDetailArray['userState'];
      console.log(this.currentTab)

    }
    setTimeout(() => {
      if(tab == 'dashboard')
      {
        this.statisticSubject.next(null);
      }else{

        this.memberSubject.next(reset);
      }
    },300);

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
  selectAllChange(event) {
    if (event.checked) {
      this.selectAllChapter = true;
      let array = [];
      this.chapterList.forEach((item, index) => {
        array.push(item.id);
      });
      this.chapterId = array
    } else {
      this.chapterId = [this.chapterList[0]['id']];
      this.selectAllChapter = false;
    }
    this.changeTab(this.currentTab);
  }


  reset(){
    this.resetbtn = 'resetFilter';

    this.changeTab('ALL',true);
    this.tab ='ALL';
    localStorage.removeItem("search");
    //localStorage.removeItem("memberType")

  }

}
