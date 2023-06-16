import {Component, Input, OnInit} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import { ApiService } from "../../services/api.service";
import {pagination} from "../../pagination";
@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit {
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Input()
  eventId = '';

  @Input()
  eventDetail: any = [];
  listType = "card";
  foodType = "food";
  @Input()
  currentTab = '';
  reqData:any=[]
  reqDataUser:any=[]
  foodList:any=[]
  foodListUser:any=[]
  search:any=''
  totalPages:any=[]
  constructor(public apiService: ApiService) {
    this.reqData = {
      filter: {
        eventId:this.eventId
       
      },
     
      sort: {
        orderBy: "ASC",
        sortBy: "FOOD_NAME",
      },
    };
    this.reqDataUser={
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
    this.listOfFood()
    this.listofFoodByUser()
    console.log(this.eventId)
  }

  changeList(type) {
    this.listType = type;
    // this.memberData(this.searchString);
  }
  changeFood(type) {
    this.foodType = type;
    console.log(type)
    // this.memberData(this.searchString);
  }
  listOfFood(){
    this.reqData['filter']['eventId']=this.eventId
    let data = {
      path: "event/foodList" ,
      isAuth: true,
      data: this.reqData
    };

    this.apiService.post(data).subscribe((response) => {
      this.foodList=response['data']
      console.log(response)
    });

  }
  listofFoodByUser(){
    this.reqDataUser['filter']['eventId']=this.eventId
    this.reqDataUser['filter']['search']=this.search
    let data = {
      path: "event/food" ,
      isAuth: true,
      data: this.reqDataUser
    };
    this.apiService.post(data).subscribe((response) => {
      this.foodListUser=response['data']
      console.log(this.foodListUser)
      this.totalPages = pagination.arrayTwo(
        this.foodListUser["totalPages"],
        this.reqDataUser.page.pageNumber
      );
    });
  

  }
  pagination(type, data, current = null) {
    if (data == 'user') {
      if (type == 'prev') {

        this.reqDataUser.page.pageNumber = this.reqDataUser.page.pageNumber - 1;

      } else if (type == 'current') {

        this.reqDataUser.page.pageNumber = current;
      } else {

        this.reqDataUser.page.pageNumber = this.reqDataUser.page.pageNumber + 1;
      }
      this.listofFoodByUser();
      document.getElementById("user_form").scrollIntoView();

    }
  }

  
}
