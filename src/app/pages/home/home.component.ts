import {Component, OnInit, Pipe, PipeTransform, ChangeDetectorRef} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {SeoService} from "../../services/seo.service";
import {ActivatedRoute, Router} from '@angular/router';
import {CommunityDetailsService} from "../../services/community-details.service";
import {DomSanitizer} from "@angular/platform-browser";
import { AuthImagesPipe } from '../../pipes/auth-images.pipe';
import { CommunityImagesPipe } from '../../pipes/community-images.pipe';
import { promises } from 'fs';
//import { HttpClient } from '@angular/common/http';

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers:[AuthImagesPipe,CommunityImagesPipe],
})
export class HomeComponent implements OnInit {

  eventList: any;
  upcommingEventList: any;
  pastEventList: any;
  eType: string = '';
  pagelimit: number = 6;
  selfCreated: string;
  newsList: any = [];
  pageNumber: number = 0;
  pageSize: number = 3;
  imagesData: any = [];
  bannerList: any;
  shrebaseLink: string;
  aboutUs: any;
  pastSelected = 0;
  sponsorList: any = [];
  chapter: any;
  imageData = [];
  memberDetail: any = [];
  eventDetail: any = [];
  userDetail: any = [];
  authDetail: any = [];
  scheduleTypeList: any;
  scheduleWiseEventList: any;
  currentTab = '';
  center: '';
  public communityDetail: any;
  markers: any = [];
  public chapterList: any;
  mainMemberCount: any = [];
  allMemberCount: any = [];
  nonListedEventList: any = [];
  eventId = '';
  rotationTime: any;
  showAboutUs: boolean;
  aboutUsDetails = "";
  selectedIndex = 0;
  backgroundImage:any;
  abc: any;

  constructor(private apiService: ApiService,public pipe:AuthImagesPipe,public pipe1:CommunityImagesPipe, public communityService: CommunityDetailsService, public seo: SeoService,
     public activate: ActivatedRoute, public router: Router,
     private change: ChangeDetectorRef) {      

      console.log(this.communityService.communityDetail)
    this.chapter = JSON.parse(localStorage.getItem('chapter'));
    if (this.chapter) {
      if (this.chapter.level != 0) {
        this.router.navigate(['chapter/' + this.chapter.name])
      }
    }
  }


  async ngOnInit() {    
    //this.getUpcommingEventList();  

        
    if(this.chapter){
      // console.log('123',this.chapter);
      this.getUpcommingEventList();
      
      await this.onLoad();
     
    }
      this.communityService.loadProviderData.subscribe(async () => {

        await this.onLoad();
      })
  }
  async onLoad() {
      await this.getChapterDetail();
    
                                 
    if (this.communityService.communityDetail.showWelcomeMessage) {
      if (localStorage.getItem('showPopup') == 'true') {
        $("#btnpopup").trigger("click");
        localStorage.setItem('showPopup', 'false');
      }
    }
    this.getUpcommingEventList();
    this.getNonlistedEvent();
    this.getImagesData();
    if (this.communityService.uiPermission['WHITELABEL']) {
      this.getsponsorList();
      this.getMemberDetail();
      this.getMainMemberDetail();
      this.getAllMemberDetail();
    }

    this.geEventDetail();
    this.getEventList();
    this.getScheduleType();
    this.shrebaseLink = location.origin;
    this.getMemberDetail();
    this.bannerInfo();
    this.getMainMemberDetail();
    this.getAllMemberDetail();
    this.getPastEventList();
    this.getsponsorList();
    this.authDetail = JSON.parse(localStorage.getItem("authDetail")); 
    if (this.authDetail) {
      this.getProfileDetail();
    }
    this.seo.generateTags({});
   

  }


  getChapterDetail() {
    this.chapter = JSON.parse(localStorage.getItem('chapter'));
    this.communityDetail = this.communityService['communityDetail'];    
    if (this.communityService['chapterList']) {      
      this.chapterList = this.communityService['chapterList'];
      this.chapter = this.chapterList[0];
      this.showAboutUs = this.chapter['allowAboutUs'];
      this.aboutUsDetails = this.chapter['aboutUs'];
    }
    localStorage.setItem('chapter', JSON.stringify(this.chapter));        
  }

  getNonlistedEvent() {
   
    let data = {
      "chapterIds": [this.chapter['id']]
    }

    let request = {
      path: "event/filter/chapter/events",
      data: data,
      isAuth: true
    }

    return new Promise((resolve) => {
      this.apiService.post(request).subscribe(response => {
        this.nonListedEventList = response['data'];
        if (this.nonListedEventList[0]) {
          this.eventId = this.nonListedEventList[0]['id']
        }
       
        resolve(null);
      });
    });
  }

  getEventList() {

    let data = {
      "filter": {
        //"all": true,
        "eventState": "PUBLISHED",
      },
      "page": {
        "pageLimit": this.pagelimit,
        "pageNumber": 0
      },

      "sort": {
        "orderBy": "DESC",
        "sortBy": "DATE_TIME"
      }
    };
    if (this.chapter['id']) {
      data['filter']['chapterId'] = "";
    }

    let request = {
      path: "event/getAll",
      data: data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      this.eventList = response['data']['content'];          
      this.eventList.map((item:any) => {
        //  item['profilePicture'] = encodeURI(item['profilePicture'])
      });
    });
  }
 
  shareEvent(id) {
    this.shrebaseLink = location.origin + '/event-details/' + id;
  }

  getUpcommingEventList() {
    let data = {
      "filter": {
        "eventTiming": "UPCOMING",
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
      data['filter']['chapterId'] = this.chapter['id'];
    }

    let request = {
      path: "event/find",
      data: data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      this.upcommingEventList = response['data']['content'];
      
      if (this.upcommingEventList == "") {               
        this.selectedIndex = 2;
        this.pastSelected = 3
      } else {        
        this.pastSelected = 0;
        this.selectedIndex =0;
      }
     
      this.upcommingEventList.map((item) => {
        //   item['profilePicture'] = encodeURI(item['profilePicture'])
      });
    });
  }

  getPastEventList() {
    let data = {
      "filter": {
        "eventTiming": "PAST",
        "eventState": "PUBLISHED",
      },
      "page": {
        "pageLimit": this.pagelimit,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "DESC",
        "sortBy": "DATE_TIME"
      }
    };
    if (this.chapter['id']) {
      data['filter']['chapterId'] = this.chapter['id'];
    }

    let request = {
      path: "event/find",
      data: data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      this.pastEventList = response['data']['content'];
      this.pastEventList.map((item) => {
        //item['profilePicture'] = encodeURI(item['profilePicture'])
      });
    });
  }

  bannerInfo() {
    let request = {
      path: "community/banner/detail/" + this.chapter['id'] + "/HOME",
      isAuth: false,
    };

    this.apiService.get(request).subscribe(response => {
      this.bannerList = response['data']['bannerList'];
      this.bannerList.forEach((item,index) => {
        console.log(item);       
        })
      this.rotationTime = response['data']['intervalTime'] * 1000
    });
  }

  getCurrentNews() {
    let request = {
      path: "news/current/news?pageNumber=" + this.pageNumber + "&pageSize=" + this.pageSize + "&chapterId=" + this.chapter['id'],
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.newsList = response['data']['content'];
      // console.log(this.newsList);
    });
  }

  getImagesData() {
    let data = {
      "filter": {
        "eventId": this.eventId,
        "status": "APPROVED",
        "highPriority": true
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
      path: "gallery/gallery/details/home/" + this.chapter.id,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      if (response['data']) {
        this.imagesData = response['data']['mediaList'];
        this.imagesData.map(item => {

          if(item.mediaType == 'YOUTUBE'){
           
            var videoId = item.link.split('v=')[1];
          
            this.imageData.push({ src: videoId, thumb: item.link, mediaType: item.mediaType });
            // console.log("v ",videoId)
            // console.log("Gallery Component",videoId);
            
          }else{
            // console.log("Gallery Component");
            this.imageData.push({ src: item.link, thumb: item.link, mediaType: item.mediaType });
          }



          // this.imageData.push({src: item.link, thumb: item.thumbnailLink, mediaType: item.mediaType});
        });
      }
      // console.log("response ",response);
    });
  }

  getsponsorList() {
    let data = {
      "chapterId": this.chapter.id
    }

    let request = {
      path: "event/chapter/sponsors/active/getAll",
      data: data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      this.sponsorList = response['data'];
      this.sponsorList.forEach((item) => {
        item.sponsors.forEach((s) => {
         
          if (s.logo == null || s.logo == '') {
            s['profileShow'] = false;
            s['logo'] = s.displayName;
          } else {
            s['profileShow'] = true;
            s['logo'] = s.logo;
          }
          
        })
      })
    });
  }

  getMemberDetail() {
    let req = {
      path: 'auth/dashboard/registrationInsight',
      isAuth: true,
    };

    //return new Promise((resolve) => {
    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.memberDetail = response['data'];
        this.memberDetail['totalMembers'] = this.memberDetail.filter((item) => {
          if (item['status'] == 'Members') {
            return item;
          } else {
            this.memberDetail['totalMembers'] = 0;
          }
        })[0]['totalRegistered'];
      }
      // resolve();
    });
    // });
  }

  geEventDetail() {
    let req = {
      path: 'event/eventStatics',
      isAuth: true,
    };

    // return new Promise((resolve) => {
    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.eventDetail = response['data'];
      }
      //resolve();
    });
    //});
  }

  getScheduleType() {
    let req = {
      path: 'event/cronScheduleType',
      isAuth: true,
    };

    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.scheduleTypeList = response['data'];
        //this.selectedIndex = 0;
        this.change.markForCheck();
      }
    });
  }

  changeTab(tabdata) {
    let tab = tabdata.tab.textLabel;
    this.currentTab = tab;

    if (this.currentTab == 'DAILY' || this.currentTab == 'WEEKLY' || this.currentTab == 'MONTHLY') {
      let data = {
        "filter": {
          "scheduleType": this.currentTab,
          "eventTiming": "ONGOING_AND_UPCOMING",
          "chapterId": this.chapter['id'],
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

      let request = {
        path: "event/find",
        data: data,
        isAuth: true,
      };

      this.apiService.post(request).subscribe(response => {
        this.scheduleWiseEventList = response['data']['content'];
      });
    }
  }

  getMainMemberDetail() {
    let data = {
      "mainUser": true
    };
    let request = {
      path: "auth/dashboard/registration/count",
      data: data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      this.mainMemberCount = response['data'];

    });
  }

  getAllMemberDetail() {
    let data = {};
    let request = {
      path: "auth/dashboard/registration/count",
      data: data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      this.allMemberCount = response['data'];
     
    });

  }

  getProfileDetail() {
    let data = {
      path: "auth/user/getUserDetail",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.userDetail = response['data']['user'];
    });
  }
}
