import {Component, OnInit,  } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {Options} from '@angular-slider/ngx-slider';
import {SpinnerService} from '../../../services/spinner.service';
import {HttpClient} from '@angular/common/http';
import {Location} from '@angular/common';
import {CommonService} from "../../../services/common.service";
import { animate, state, style, transition, trigger } from '@angular/animations';
import {EventImagesPipe} from "../../../pipes/event-images.pipe";
import { pagination } from 'src/app/pagination';


@Component({
  selector: 'app-eventlist',
  templateUrl: './eventlist.component.html',
  styleUrls: ['./eventlist.component.scss'],
  providers:[EventImagesPipe],
  animations: [
    trigger('flyInOut', [
      transition(':enter', [
        style({transform: 'translateX(-100%)', color:'red'}),
        animate('1s')
      ]),
      transition(':leave', [
        style({transform: 'translateX(100%)', color:'red'}),
        animate('1s')
      ])
    ])
  ]
})
export class EventlistComponent implements OnInit {

  backgroundImage:any='';
  eventList: any = [];
  eventListHeader: any[];
  filterStartDate: any;
  filterEndDate: any;
  eventTypes: any[];
  timeDuration: any;
  sortingType: any;
  eType = '';
  sorting: boolean = true;
  pagelimit: number = 6;
  status: boolean = false;
  sDate: any = null;
  eDate: any = null;
  showDiv: boolean = true;
  shareBaseLink: string;
  selfCreated: string;
  scheduleTypeList: any[];
  sType = '';
  eventTimingList: any[];
  timing = '';
  selectedSort = "DATE_TIME";
  chapterList:any=[];
  imagesData: any = [];
  itemList: any = [];
  settings = {};
  reqData: any = [];
  communityList :any =[];
  chapter:any;
  ChapterId:any;
  ChapterName:any;
  community='';
  userPermisssion:any=  [];
  minValue: number = 50;
  nearMeRequest:any = {};
  rotationTime: any;
  searchEvent:any;
  search=""
  totalPages:any=[];
  totalPage : number;
  options: Options = {
    floor: 0,
    ceil: 100,
    translate: (distanceValue: number): string => {
      return distanceValue + 'KM';
    }
  };

  toggleDiv(){
    this.showDiv = this.showDiv ? false : true;
  }

  constructor(private http: HttpClient,public pipe:EventImagesPipe, public location: Location,public commonService :CommonService, private route: ActivatedRoute, public router: Router, public spinner: SpinnerService, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService) {
    this.route.params.subscribe(params =>{
      this.chapter = JSON.parse(localStorage.getItem('chapter'));
      this.ChapterId = this.chapter.id;
      this.ChapterName = this.chapter.name;
    });
  }

  async ngOnInit() {
    document.querySelector("body").removeAttribute('class'); ///remove body class after modal
    this.route.params.subscribe(params =>
      this.selfCreated = params['string']
    );
    this.getAllEventList();
    this.getPermission();
    this.getChapterList();
    this.getCommunityList();
    this.filterStartDate = null;
    this.filterEndDate = null;
    this.eType = '';
    this.sType = '';
    this.timing = '';
    this.reqData = {
      "pageLimit": this.pagelimit,
      "pageNumber": 0
    };
    this.shareBaseLink = location.origin;
    this.getEventType();
    this.getScheduleType();
    this.getEventTiming();
    await this.getImagesData();
    this.settings = {
      text: "Select Countries",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      primaryKey: "alpha3Code",
      labelKey: "name",
      noDataLabel: "Search Countries...",
      enableSearchFilter: true,
      searchBy: ['country']
    };
  }
  getChapterList() {
    let request = {
      path: 'community/chapters',
      isAuth: true,
    };
    this.spinner.show();
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.chapterList = response['data'];
        resolve(null);
        this.spinner.hide();
      });
    });
  }
  getPermission() {
    let req = {
      path: 'uiPermission/getPermissionByRole',
      isAuth: true,
    };
    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.userPermisssion = [];
        response['data'].forEach((item, index) => {
          this.userPermisssion[item.name] = item;
        });
         //this.getEventList();

      } else {
      }
    });
  }
  shareEvent(id) {
    this.shareBaseLink = location.origin + '/event-details/' + id;
   // this.shareTitle = this.eventData['name']; //TODO change eventDate to currnt event object

  }

  onSearch(evt: any) {
    //console.log(evt.target.value);
    this.itemList = [];
    this.http.get('https://restcountries.eu/rest/v2/name/' + evt.target.value + '?fulltext=true')
      .subscribe(res => {
        this.itemList = res;
      }, error => {

      });
  }

  onItemSelect(item: any) {
  }

  OnItemDeSelect(item: any) {
  }

  onSelectAll(items: any) {
  }

  onDeSelectAll(items: any) {
  }

  changeCommunity(name)
  {
    this.community = name;
    this.getEventList();
  }
  changeChapter(name)
  {
    this.ChapterId = name;
    this.reqData = {
      "pageLimit": this.pagelimit,
      "pageNumber": 0
    };
    this.getEventList();
  }
  sortingChange(value) {
    if (value == '') {
      value = 'DATE_TIME';
    }
    this.selectedSort = value.toString();
    this.getEventList();
  }

  eventChange(value) {
    this.eType = value;
    console.log(this.eType)
    this.getEventList();
  }

  // arrayTwo(n: number) {
  //   return Array(n).fill(0).map((x, i) => i);
  // }
  arrayTwo(allPage: number,currentPage: number) {
    let mainPage = currentPage;
    let prePage = mainPage -5;
    let nextPage = mainPage +5;
    if(prePage <0){ prePage = 0;}
    if(nextPage >allPage){ nextPage = allPage;}
    let array = Array(nextPage).fill(prePage).map((x, i) => { if(prePage<=i){  return  i}});
    this.totalPages=array
    console.log("array",array)
    return array.filter((i)=> {return i != null});  
  }
   

  pagination(type, data, current = null) {
    if (type == 'prev') {
      this.reqData.pageNumber = this.reqData.pageNumber - 1;
    } else if (type == 'current') {
      this.reqData.pageNumber = current;
    } else {
      this.reqData.pageNumber = this.reqData.pageNumber + 1;
    }
    this.getEventList();
    document.getElementById("event_form").scrollIntoView();

  }

  clickEvent(){
    this.status = !this.status;
}
  getAllEventList() {

    let data = {
      "filter": {
        "eventState": "PUBLISHED",
      },
      "page": {
        "pageLimit": this.pagelimit,
        "pageNumber": 0
      },

      "sort": {
        "orderBy": "ASC",
        "sortBy": "DATE_TIME"
      }
    };
    if (this.chapter['id']) {
      data['filter']['chapterId'] = "";
    }
    let request = {
      path: "event/find",
      data: data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      this.eventList = response['data'];
      this.totalPage = this.eventList['totalPages'];
      this.totalPages = pagination.arrayTwo(this.eventList['totalPages'], data['page']['pageNumber']);
    });
  }

  getEventList() {
    this.spinner.show();
    var d = new Date();
    var n = d.toISOString();

    let data;
    let selfCreatedevent = false;
    if (this.selfCreated == 'my-hosted-event') {
      selfCreatedevent = true;
    }
    //  this.reqData['filter']['eventType'] = this.eType;
    let eType = null;
    if (this.eType != null && this.eType != '') {
      eType = [];
      eType.push(this.eType);
    }



    let sType = null;
    if (this.sType != null && this.sType != '') {
      sType = this.sType;
    }

    let timing = null;
    if (this.timing != null && this.timing != '') {
      timing = this.timing;
    }

    let searching = null;
    if (this.searchEvent != null && this.searchEvent != '') {
      searching = this.searchEvent;
    }

    let sortBy = {};

    sortBy =  {
      "orderBy": "DESC",
      "sortBy": this.selectedSort
    };

    if(this.selectedSort == 'NAME'){
      sortBy =  {
        "orderBy": "ASC",
        "sortBy": this.selectedSort
      };
    }

    data = {
      "filter": {
        "startDate": this.sDate,
        "endDate": this.eDate,
        "eventType": eType,
        "communityName": this.community,
        "eventState": "PUBLISHED",
        "chapterId": this.chapter.id,
        "scheduleType": sType,
        "eventTiming": timing,
        "search":searching
      },
      "page": this.reqData,
      "sort": sortBy
    };
    if(this.nearMeRequest['defaultNearMeRequest'])
    {
      data['filter']["nearMeRequest"]=this.nearMeRequest;
    }else{
      delete data['filter']["nearMeRequest"];
    }

    if(this.ChapterId != '')
    {
      data['filter']["chapterId"]=this.ChapterId;
    }else{
      delete  data['filter']["chapterId"];
    }
    if(this.community == ''){
      delete data['filter']['communityName'];
    }
    if(this.userPermisssion['PLATFORM'])
    {
      delete data['filter']["chapterId"];
    }
  console.log(this.ChapterId)
  console.log("foram")
    let request = {
      path: "event/find",
      data: data,
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.post(request).subscribe(response => {
        console.log("pagination response: ", response);
        this.spinner.hide();
        this.eventList = response['data']['content'];
        console.log("Event List: ",this.eventList)
        // this.totalPages = pagination.arrayTwo(this.eventList['totalPages'], data['page']['pageNumber']); //Creates unwanted number of blank pages 
         console.log("total event list",this.eventList)
        this.eventList.forEach((element,index) => {

            this.eventList[index]['profilePicture'] = element.profilePicture;

        });
        // console.log(this.eventList);
        if (response['data'] != null) {
          if (response['data']['content'] ==  null) {
            this.toastrService.error("No event found !");
            //this.eventList = [];
            this.reqData = {
              "pageLimit": this.pagelimit,
              "pageNumber": 0
            };
          } else {
            // this.eventList = response['data']['content'];
            this.eventList = response['data'];
            this.eventListHeader = response['data']['content'].slice(0, 3);
            this.eventList['content'].map((item)=>{
             // item['profilePicture'] = encodeURI(item['profilePicture'])
            });


          }
        }

        resolve(null);
      });

    });
  }

  bookmark(eventId) {
    let request = {
      path: "/event/interested/" + eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      if (response['status']['status'] == 'SUCCESS') {
        this.toastrService.success(response['status']['description']);
        this.getEventList();
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  getEventType() {
    let request = {
      path: "event/eventType",
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.eventTypes = response['data'];
      //console.log(this.eventTypes);
    });

    //timeDuration
    let request2 = {
      path: "event/timeDurationType",
      isAuth: true,
    };

    this.apiService.get(request2).subscribe(response => {
      this.timeDuration = response['data'];
      //console.log(this.timeDuration);
    });

    // sorting type
    let request3 = {
      path: "event/sortingFields",
      isAuth: true,
    };

    this.apiService.get(request3).subscribe(response => {
      this.sortingType = response['data'];
      this.sortingType.forEach((item) => {
        item['selected'] =  false;
        if(item.value == 'DATE_TIME')
        {
          item['selected'] =  true;
        }
      });
      //console.log(this.sortingType);
    });


  }

  Logout() {
    this.toastrService.success("Logout Successfull");
    localStorage.removeItem('authDetail');
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    this.router.navigate(['/']);
  }

  eventDetail(data) {
    this.router.navigate(['event-detail/', data.id]);
  }

  edit(id) {
    this.router.navigate(['edit-event-new/', id]);
  }

  getImagesData() {
    let data = {
      "filter": {
        "status": "APPROVED",
       "ChapterId":  this.ChapterId
      },
      "page": {
        "pageLimit": 9,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "MEDIA_TYPE"
      }
    };
    let request = {
      path: "community/banner/detail/"+ this.ChapterId+"/EVENT",
      data: data,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        if(response['data']!=null) {
          this.imagesData = response['data']['bannerList'];
          this.imagesData.forEach((item, index) => {
            this.backgroundImage = this.pipe.transform(item.bannerUrl);

            if (item.bannerUrl.indexOf(item.bannerUrl) !== -1) {
              this.imagesData[index]['bannerUrl'] = this.backgroundImage;
            } else {
              this.imagesData[index]['bannerUrl'] = item.bannerUrl;
            }
          })
          this.rotationTime = response['data']['intervalTime'] * 1000
          //console.log(this.imageData);
        }
        resolve(null);
      });
    });
  }
  getCommunityList() {
    let request = {
      path: "event/eventCommunities",
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.communityList = response['data'];
        resolve(null);
      });
    });

  }
  checkNearMe(event)
  {
    if(event.checked == true)
    {
      this.commonService.getPosition().then(pos=>
      {
        this.nearMeRequest= {
          "defaultNearMeRequest": true,
          "latitude": `${pos.lat}`,
          "longitude": `${pos.lng}`,
        };
        this.getEventList();

      });
    }else{
      this.nearMeRequest= {};
      this.getEventList();

    }

  }

  getScheduleType(){
    let req = {
      path: 'event/cronScheduleType',
      isAuth: true,
    };

    this.apiService.get(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.scheduleTypeList = response['data'];
        }
    });
  }

  scheduleChange(value) {
    this.sType = value;
    console.log(this.sType)
    this.getEventList();
  }

  getEventTiming(){
    let req = {
      path: 'event/eventTiming',
      isAuth: true,
    };

    this.apiService.get(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.eventTimingList = response['data'];
        }
    });
  }

  eventTimingChange(value) {
    this.timing = value;
    this.getEventList();
  }

  clearSearch(){
    this.search=""
    console.log("asd",this.search)
    this.searchEvent=""
    this.getEventList();

  }
  eventSearch(value){

    console.log(value)
    console.log("search",this.search)
    this.searchEvent=value;
    this.getEventList();
  }
  keyDownFunction(event) {
    console.log(event)
    if (event.keyCode === 13) {
      alert('you just pressed the enter key');
      // rest of your code
    }
  }

}
