import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommunityDetailsService} from "../../../services/community-details.service";
import {EventImagesPipe} from '../../../pipes/event-images.pipe'
@Component({
  selector: 'app-chapter-home',
  templateUrl: './chapter-home.component.html',
  styleUrls: ['./chapter-home.component.css'],
  providers:[EventImagesPipe],
})

export class ChapterHomeComponent implements OnInit {
  aboutUs: any;
  eventList: any;
  upcommingEventList: any;
  pastEventList: any;
  eType: string = '';
  pagelimit: number = 6;
  selfCreated: string;
  newsList: any = [];
  pageNumber: number = 0;
  pageSize: number = 3;
  chapterName: any;
  chapter: any;
  timer: any = {'day': 1, 'hour': 9, 'min': 20, 'sec': 10};
  bannerList: any;
  sponsorList: any;
  pastSelected = 0;
  imageData = [];
  eventDetail: any = [];
  memberDetail: any = [];
  scheduleTypeList: any;
  scheduleWiseEventList: any;
  currentTab = '';
  mainMemberCount: any = [];
  allMemberCount: any = [];
  imagesData: any = [];
  nonListedEventList: any = [];
  eventId = '';
  rotationTime: any;
  userDetail: any = [];
  authDetail: any = [];
  showAboutUs:boolean;
  backgroundImage:any
  aboutUsDetails ="";
  // slideConfig = {"slidesToShow": 6, "slidesToScroll": 2 ,"autoplay":true,"arrows":true};
  slideConfig = {
    'slidesToShow': 6, 'slidesToScroll': 1,
    'autoplay': true, 'autoplaySpeed': 3500, 'infinite': true,
    'mobileFirst': false, 'respondTo': 'window',
    'rows': 1,
    'responsive': [{
      'breakpoint': 991,
      'settings': {
        'slidesToShow': 2,
        'slidesToScroll': 2,
        'arrows': true,
        'dots': true
      },
    },
    ],
  };

  constructor(public pipe:EventImagesPipe,private route: ActivatedRoute, private apiService: ApiService, public communityService: CommunityDetailsService, public router: Router, public activate: ActivatedRoute) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));

  }

  ngOnInit(): void {
    
    setTimeout(() => {
      this.route.params.subscribe((params) => {
        this.chapter = JSON.parse(localStorage.getItem('chapter'));


        let details = this.communityService.chapterList.filter(t => t.name == params['string']);
        if (details[0] && this.chapter['id'] !=details[0]['id']) {
          localStorage.setItem('chapter', JSON.stringify(details[0]));
          location.reload();
          return false;
          //this.router.navigateByUrl('chapter/'+details[0].name)
        }
        this.activate.params.subscribe(data => {
          setTimeout(() => {
            this.chapter = JSON.parse(localStorage.getItem('chapter'));
            this.getChapterDetail();
            this.getNonlistedEvent();
            this.getEventList();
            this.getUpcommingEventList();
            this.getPastEventList();
            this.getCurrentNews();
            this.timer_cal();
            this.getAboutUs();
            this.bannerInfo();
            this.getsponsorList();
            this.getEventDetail();
            this.getMemberDetail();
            this.getMainMemberDetail();
            this.getAllMemberDetail();
            this.getScheduleType();
          }, 1);
        });
      });
    }, 700);
  }

  ngOnDestroy() {
    //localStorage.removeItem('chapter');
  }

  getChapterDetail() {
    let data = {
      "id": "5e6f5b9e03ff0003acf982fa"
    };
    let request = {
      path: "community/chapterDetails/" + this.chapter.id,
      isAuth: false,
    };

    this.apiService.get(request).subscribe(response => {
      this.chapter = response['data'];
      localStorage.setItem('chapter', JSON.stringify(this.chapter));
      this.chapterName = response['data']['name'];
      this.showAboutUs = response['data']['allowAboutUs'];
      this.aboutUsDetails = response['data']['aboutUs'];
    });
    console.log(this.chapter)
  }

  bannerInfo() {
    let request = {
      path: "community/banner/detail/" + this.chapter.id + "/HOME",
      isAuth: false,
    };

    this.apiService.get(request).subscribe(response => {
      this.bannerList = response['data']['bannerList'];
      this.bannerList.forEach((item,index) => {
        console.log(item)
     
        })
      this.rotationTime = response['data']['intervalTime'] * 1000
    });
    console.log(this.bannerList);
  }

  getNonlistedEvent() {
    let data = {
      "chapterIds": [this.chapter.id]
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
        this.getGallaryImage();
        console.log(this.nonListedEventList);
        resolve(null);
      });
    });
  }

  getGallaryImage() {
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
          this.imageData.push({src: item.link, thumb: item.thumbnailLink, mediaType: item.mediaType});
        });
      }
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
            } else {
              s['profileShow'] = true;
            }
        })
      })
    });
  }


  timer_cal() {
    let sec = this.timer.sec;
    setTimeout(() => {
      sec = sec - 1;
      this.timer.sec = sec;
      if (sec == 0) {
        this.timer.min = this.timer.min - 1;
        this.timer.sec = 59;
      }
      this.timer_cal();
    }, 1000);
  }


  getAboutUs() {
    let data = {
      "name": "ABOUT_US"
    };
    let request = {
      path: "uiPermission/content",
      data: data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      this.aboutUs = response['data'][0]['content'];
    });
  }

  getEventList() {
    let data = {
      "filter": {
        "chapterId": this.chapter.id,
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

    let request = {

      path: "event/getAll",
      data: data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      this.eventList = response['data']['content'];
      // console.log('123456' ,this.eventList);
      
    });
  }

  getUpcommingEventList() {
    let data = {
      "filter": {
        "chapterId": this.chapter.id,
        "eventTiming": "UPCOMING",
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


    let request = {
      path: "event/find",
      data: data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      this.upcommingEventList = response['data']['content'];
      if (this.upcommingEventList == "") {
        this.pastSelected = 3
      } else {
        this.pastSelected = 0;
      }
    });
  }

  getPastEventList() {
    let data = {
      "filter": {
        "chapterId": this.chapter.id,
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

    let request = {
      path: "event/find",
      data: data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      this.pastEventList = response['data']['content'];
    });
  }

  getCurrentNews() {
    let request = {
      path: "news/current/news?pageNumber=" + this.pageNumber + "&pageSize=" + this.pageSize + "&chapterId=" + this.chapter.id,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.newsList = response['data']['content'];
    });
  }

  getEventDetail() {
    let req = {
      path: 'event/eventStatics?chapterId=' + this.chapter.id,
      isAuth: true,
    };

    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.eventDetail = response['data'];
      }
    });
  }

  getMemberDetail() {
    let req = {
      path: 'auth/dashboard/registrationInsight?chapterId=' + this.chapter.id,
      isAuth: true,
    };

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
    });
  }

  getScheduleType() {
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

  changeTab(tabdata) {
    let tab = tabdata.tab.textLabel;
    this.currentTab = tab;

    if (this.currentTab == 'DAILY' || this.currentTab == 'WEEKLY' || this.currentTab == 'MONTHLY') {
      let data = {
        "filter": {
          "scheduleType": this.currentTab,
          "eventTiming": "ONGOING",
          "chapterId": this.chapter.id,
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
      "chapterId": this.chapter.id,
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
    let data = {
      "chapterId": this.chapter.id,
    };
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

