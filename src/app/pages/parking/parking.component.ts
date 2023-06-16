import { HttpClient } from '@angular/common/http';
import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {Subject, Subscription} from "rxjs";
import { ApiService } from 'src/app/services/api.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import {pagination} from "../../pagination";


@Component({
  selector: 'app-parking',
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.scss']
})
export class ParkingComponent implements OnInit {
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Input()
  eventId = '';

  @Input()
  eventDetail: any = [];
  listType = "card";
  parkingType = "vehicle";
  search:any='';
  @Input()
  currentTab = '';

  reqData: any = [];
  reqData1: any = [];
  parkingList:any=[];
  parkingUserList:any=[];
  parkingUserList1:any=[];
  totalPages:any=[];
  optionList:any=[];

  constructor(private modalService: BsModalService, public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute) {
    this.reqData = {
      "filter": {
        "eventId": this.eventId,
        "search" : this.search ,
      },
      "page": {
        "pageLimit": 5,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "PARKING_TITLE"
      }
    };



   
    this.reqData1={
      filter: {
        eventId:this.eventId,
        search:this.search
      },
      page: {
        pageLimit: 10,
        pageNumber:0 
      },
      sort: {
        orderBy: "ASC",
        sortBy: "FIRST_NAME"
      }
    }
  }

  ngOnInit() {


   


    this.getParking();
    this.getParkingUserList();
  }
  changeList(type) {
    this.listType = type;
    console.log("Listtype ",this.listType)
    // this.memberData(this.searchString);
  }

  
  changeFood(type) {
    this.parkingType = type;
    console.log("parkingtype ",this.parkingType)
    //
  }


  getParking() {
    this.reqData['filter']['eventId']=this.eventId
    let req = {
      path: "event/parkingList",
      data: this.reqData,
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.post(req).subscribe(response => {
      this.parkingList = response['data'];
      console.log("parking ",this.parkingList)
  })


  }

  getParkingUserList() {
    
    this.reqData1['filter']['eventId']=this.eventId
    this.reqData1['filter']['search']=this.search
    let data = {
      path: "event/parking" ,
      isAuth: true,
      data: this.reqData1
    };
    this.apiService.post(data).subscribe((response) => {
      this.parkingUserList=response['data'];
      this.optionList = response['data']['content'];

      console.log("list ",this.parkingUserList);
      console.log("Optionlist ",this.optionList);
      this.totalPages = pagination.arrayTwo(
        this.parkingUserList["totalPages"],
        this.reqData1.page.pageNumber
      );
    });
  }


  

  listBySearch(){
  this.reqData['filter']['eventId']=this.eventId
  this.reqData['filter']['search']=this.search;
  let req = {
    path: "event/parkingList",
    data: this.reqData,
    isAuth: true,
  };
  this.apiService.post(req).subscribe((response) => {
  this.parkingList=response['data']
  console.log(this.parkingList)
  this.totalPages = pagination.arrayTwo(
  this.parkingList["totalPages"],
  this.parkingList.page.pageNumber
        );
      });
  
    }

    pagination(type, data, current = null) {
      if (data == 'user') {
        if (type == 'prev') {
  
          this.reqData1.page.pageNumber = this.reqData1.page.pageNumber - 1;
  
        } else if (type == 'current') {
  
          this.reqData1.page.pageNumber = current;
        } else {
  
          this.reqData1.page.pageNumber = this.reqData1.page.pageNumber + 1;
        }
        this.getParkingUserList();
        document.getElementById("user_form").scrollIntoView();
  
      }
    }
}
