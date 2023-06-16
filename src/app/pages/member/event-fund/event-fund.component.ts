import { Component, OnInit } from '@angular/core';

import { request } from 'express';
import { ApiService } from '../../../services/api.service';
import {pagination} from "../../../pagination";
import {SpinnerService} from "../../../services/spinner.service";
@Component({
  selector: 'app-event-fund',
  templateUrl: './event-fund.component.html',
  styleUrls: ['./event-fund.component.scss']
})
export class EventFundComponent implements OnInit {
    fundlist :any[];
    fundlist1 :any=[]
    tabchanged:any
    activetab ='DONTAION'
    reqData: any = [];
    reqData1 :any =[];
    totalPages: any = [];
    total:any = [];
    search="";
  totalMember = 0;
  chapterList: any = [];
  totaldonation:any
  constructor(private apiService:ApiService,public spinner: SpinnerService) {

  this.reqData=
  {

    "filter": {
      "activeSponsor": true,
      "donationType": "DONATION",
      "search":this.search

    },
    "page": {
      "pageLimit": 10,
      "page": 0
    },
    "sort": {
      "orderBy": "ASC",
      "sortBy": "FIRST_NAME"
    }

  }

   }



  ngOnInit() {
    this.changetab(this.activetab)
    //this.totalMemberType()
    //this.fundraising()
    this.search="";
    this.getChapterList();

  }
  getChapterList() {
    let request = {
      path: 'community/chapters',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.chapterList = response['data'];
    });
  }
  fundraising(search = ""){
    this.spinner.show();
    if(this.activetab == 'DONTAION') {
      this.reqData['filter']['donationType'] = "DONATION"
    }else  if(this.activetab=='SPONSOR') {
      this.reqData['filter']['donationType']="SPONSOR"
    }
    this.reqData['filter']['search'] = this.search;
      let request = {
        path: 'event/eventStatics/getAll',
        isAuth: true,
        data:this.reqData

      };
      return new Promise((resolve) => {
        this.apiService.post(request).subscribe(response => {
          this.spinner.hide();
          this.fundlist=response['data']['content']
          this.fundlist1 = response['data'];
          this.totalPages = pagination.arrayTwo(this.fundlist1['totalPages'], this.reqData.page.page);
        });
    })
  }
  changetab(currenttab){
    let tab = currenttab
    console.log('dfds',tab);
    if(tab=='DONTAION')
    {
      this.activetab= tab
   //   console.log("d",this.activetab)

    }
    if(tab=='SPONSOR'){
      this.activetab=tab
    //  console.log("s",this.activetab)


  }
  this.totalMemberType()
  this.fundraising()



  }
  pagination(type, data, current = null) {
    if(data == 'user')
    {
      if (type == 'prev') {
        this.reqData.page.pageNumber = this.reqData.page.pageNumber - 1;
      } else if (type == 'current') {
        this.reqData.page.pageNumber = current;
      } else {
        this.reqData.page.pageNumber = this.reqData.page.pageNumber + 1;
      }
      document.getElementById("page_form").scrollIntoView();
      //this.sponsorData();
      this.fundraising();

    }

  }
  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }
  searchClick() {
    this.fundraising(this.search);
  }
  totalMemberType() {
   // this.changetab(this.activetab)
   console.log("total",this.activetab)
    let req = {
      path: 'event/eventStatics',
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.get(req).subscribe(response => {

          this.total = response['data'];
         // console.log(this.total)
          //console.log(this.activetab)




        resolve(null);

      });
    });
  }
}
