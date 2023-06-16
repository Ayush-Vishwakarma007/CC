import {Component, OnDestroy, OnInit,Pipe, PipeTransform} from '@angular/core';
import {Gallery} from "@ngx-gallery/core";
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {SeoService} from "../../../services/seo.service";
import * as moment from 'moment-timezone';
import {configuration} from "../../../configration";
import {CommunityDetailsService} from "../../../services/community-details.service";
import {Location} from "@angular/common";
import Swal from "sweetalert2";
import {EventImagesPipe} from "../../../pipes/event-images.pipe";
import {SafePipe} from "../../../pipes/safe.pipe"
import {DomSanitizer} from "@angular/platform-browser";
import {

  GalleryItem,
  ImageItem,
  ImageSize,
  ThumbnailsPosition,
  VideoItem,
  YoutubeItem
} from "@ngx-gallery/core";

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  providers:[EventImagesPipe],

})

export class EventDetailComponent implements OnInit, OnDestroy {
  authDetail: any = [];
  eventId = '';
  backgroundImage:any='';
  eventDetail: any = [];
  imageArray: any = [];
  documentArray: any = [];
  shareBaseLink: string;
  shareTitle: string;
  registerType = '';
  bookmarked: boolean = false;
  session_list: any = [];
  imageData = [];
  reqData: any = [];
  centerComponent: any = [];
  eventSponsorList: any = [];
  allDonors: any = [];
  donorList: any = [];
  topDonorList: any = [];
  timer: any;
  liveTimer = 0;
  showLive:boolean = false;
  endLive:boolean = false;
  isShowDonateButton: boolean
  totalDonorcollection: any;
  width = 0;
  items: GalleryItem[];
  constructor(public gallery: Gallery, public pipe:EventImagesPipe,public spinner: SpinnerService, public communityService: CommunityDetailsService, public _location: Location, private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, private seo: SeoService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.route.params.subscribe(params =>
      this.eventId = params['id']
    );
    this.reqData = {
      "filter": {
        "donationType": 'DONATION',
        "eventId": this.eventId,
        "successfulPayment": true
      },
      "page": {
        "pageLimit": 10,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "DESC",
        "sortBy": "DATE"
      }
    };
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  async ngOnInit() {
    document.querySelector("body").removeAttribute('class');
    await this.getEventDetail();
    this.sessionList();
    this.getGallery();
    this.getDonors();
    this.sponsorList();
    this.customGalleryConfig();

  }

  getEventDetail() {
    this.spinner.show();
    let request = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.eventDetail = response['data'];
          this.bookmarked = this.eventDetail['bookmarked'];

          if(this.eventDetail['eventConfigurations']['allowDonor']){
            this.isShowDonateButton = this.eventDetail['eventConfigurations']['allowDonor'];
          }
          this.eventDetail['dates'] = configuration.eventDateFormat(this.eventDetail['startDateTime'], this.eventDetail['endDateTime'])[0];
          this.eventDetail['times'] = configuration.eventDateFormat(this.eventDetail['startDateTime'], this.eventDetail['endDateTime'])[1];
          let zone = moment.tz.guess();
          this.eventDetail['timezones'] = moment.tz(zone).format("z");
          if (this.communityService.communityDetail['basicInformation']) {
            let config = {
              title: this.communityService.communityDetail['basicInformation']['seoKeywords'] + ' | ' + this.eventDetail.name,
              image: this.eventDetail.profilePicture,
            };
            this.seo.generateTags(config);

          }
          var a = moment(this.eventDetail['startDateTime']);
          var c = moment(this.eventDetail['endDateTime']);
          var b = moment();

          this.liveTimer = a.diff(b, 'seconds');
          if (this.timer == undefined){
            this.timer = setInterval(() => {
              b = moment();
              if(a.diff(b, 'seconds') < 0){
                this.showLive = true;
              }
              if(c.diff(b, 'seconds') < 0){
                this.endLive = true;
              }

              if(a.diff(b, 'hours') >= this.eventDetail['showCountDownBeforeHours']){
                this.eventDetail['showDetail'] = false;
              }else{
                this.eventDetail['showDetail'] = true;
              }
            }, 1000)
          }

          this.imageArray.push({'src': this.eventDetail.profilePicture, 'thumb': this.eventDetail.profilePicture});
          this.eventDetail['otherPictures'].forEach((item) => {
            this.imageArray.push({'src': item, 'thumb': item});
          });

          this.imageArray.forEach((element,index) => {
            this.backgroundImage = this.pipe.transform(element.thumb);
            console.log(this.backgroundImage)
            if (element.thumb.indexOf(element.thumb) != -1) {
              this.imageArray[index]['thumb'] = this.backgroundImage;
            } else {
              this.imageArray[index]['thumb'] = element.thumb;
            }
          });
          this.items = this.imageArray.map(item => {
           return   new ImageItem({src: encodeURI(item.src), thumb: item.thumb})
          })
          this.eventDetail['otherDocuments'].forEach((item) => {
            let iamge=this.pipe.transform(item);
            this.documentArray.push({'src': iamge});
          });
          console.log(this.documentArray)

        } else {
          if (response['status']['code'] == 'NOT_FOUND') {
            this.router.navigate(['/event-not-found']);
          }
          this.toastrService.error(response['status']['description']);
        }
        resolve(null);
        this.spinner.hide();
      });
    });
  }
  goToPoll(list){

    window.open(list['link'], "_blank");
  }
  sponsorList() {
    let data = {
      "eventId": this.eventId
    }

    let req = {
      path: "event/sponsors/active/getAll",
      data: data,
      isAuth: true,
    };

    this.apiService.post(req).subscribe(response => {
      this.eventSponsorList = response['data'];
      this.eventSponsorList.forEach((item) => {
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

  shareEvent(id) {
    this.shareBaseLink = location.origin + '/event-details/' + id;
    //console.log(this.shareBaseLink);
    this.shareTitle = this.eventDetail['name'];
    //
  }

  getDonors() {
    this.reqData['filter']['donationType'] = 'DONATION';

    let req = {
      path: "event/sponsors",
      data: this.reqData,
      isAuth: true,
    };
    this.apiService.post(req).subscribe(response => {
      if (response['data']) {
        this.donorList = response['data'];
        response['data']['content'].map((item) => {
          this.allDonors.push(item);
        });
      }
    });
    let reqData = this.reqData;
    reqData['sort']['orderBy'] = 'DESC';
    reqData['sort']['sortBy'] = 'TOTAL_PAYMENT';
    let req1 = {
      path: "event/sponsors",
      data: reqData,
      isAuth: true,
    };
    this.apiService.post(req1).subscribe(response => {
      if (response['data']) {
        this.topDonorList = response['data'];
      }
    })
    let req2 = {
      path: "event/sponsor/total/DONATION/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(req2).subscribe(response => {
      this.totalDonorcollection = 0;
      if (response['data']) {
        this.totalDonorcollection = response['data']['payment'];
        this.width = this.totalDonorcollection * 100 / this.eventDetail['eventConfigurations']['donationGoal'];
      }
    });
  }

  registrationOrPayment() {
    if (this.registerType == 'register') {
      this.eventRegistration();
    }
    if (this.registerType == 'payment') {
      this.paymentData();
    }
    $('#closePaypalId').trigger('click');
  }

  eventRegistration() {
    let checkedMember = [];
    let age = configuration.calculateAge(this.authDetail['birthYear']);

    checkedMember.push({
      'userId': this.authDetail['id'],
      'age': age,
      'selectedFoods': {},
      'eventRuleId': null,
      'relation': 'SELF'
    });
    this.spinner.show();
    let detail = {};
    detail['eventId'] = this.eventId;
    detail['registrations'] = checkedMember;
    detail['role'] = 'USER';
    detail['paymentMethodUsed'] = 'PAYPAL';
    detail["sponsorshipCategoryId"] = null;
    detail["sponsorshipDiscount"] = true;
    detail['discountCode'] = null;
    let data = {
      path: "event/event/registration/",
      data: detail,
      isAuth: true
    };


    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        if (response['data']['url'] == null) {
          localStorage.setItem('eventId', this.eventId);
          this.router.navigate(['/payment/event/payment-success']);
          this.spinner.hide();
          return false;
        } else {
          window.location.href = response['data']['url'];
          this.spinner.hide();
        }
      } else {
        this.spinner.hide();
        this.toastrService.error(response['status']['description']);
      }
    });

  }

  paymentData() {
    this.spinner.show();
    let request = {
      path: 'event/registration/createPayment/' + this.eventId,
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.get(request).subscribe(response => {
      if (response['status']['status'] == 'OK') {
        //console.log(response['data']);
        if (response['data']['url'] != null) {
          localStorage.setItem('eventId', this.eventId);
          window.location.href = response['data']['url'];
        }
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  /*
    getTimezoneDates(startDate,endDate){
      let start = moment(startDate).zone('-06:00').format('YYYY-MM-DD hh:mm a z')
      let end =   moment(endDate).zone('-06:00').format('YYYY-MM-DD hh:mm a z')

      let start1 = moment(startDate).zone('+4:00').format('z')
      let end1 =   moment(endDate).zone('+4:00').format('z')
    }
  */

  interestedEvent(id) {
    let request = {
      path: "/event/interested/" + id,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      if (response['status']['status'] == 'SUCCESS' || response['status']['status'] == 'DELETED') {
        this.toastrService.success(response['status']['description']);

        if (response['status']['status'] == 'SUCCESS') {
          this.bookmarked = true;
        } else {
          this.bookmarked = false;
        }
        this.eventDetail = response['data'];
        this.getEventDetail();
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  loginRedirect() {
    let url = '/participate-checkout/' + this.eventId;
    localStorage.setItem('eventUrl', url);
    this.router.navigate(['/login'])
  }

  sessionList() {
    let request = {
      path: "event/getAllSessions/" + this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.session_list = response['data'];
    });
  }


  getGallery() {
    let data = {
      "filter": {
        "eventId": this.eventId,
        "galleryLocation": 'EVENT'
      },
      "page": {
        "pageLimit": 100,
        "pageNumber": 0
      }
    };
    let request = {
      path: "gallery/galleries",
      data: data,
      isAuth: false,
    };
    this.spinner.show();
    return new Promise((resolve) => {
      this.apiService.post(request).subscribe(response => {
        response['data']['content'].forEach((item, index) => {
          this.getMedias(item.id);
        });
        this.spinner.hide();
        resolve(null);
      });
    });
  }

  getMedias(gallaryId) {
    let data = {
      "filter": {
        "galleryId": gallaryId,
        "status": "APPROVED"
      },
      "page": {
        "pageLimit": 10,
        "pageNumber": 0
      }
    };

    let request = {
      path: "/gallery/medias",
      data: data,
      isAuth: false,
    };
    this.spinner.show();
    return new Promise((resolve) => {
      this.apiService.post(request).subscribe(response => {
        this.centerComponent = response['data']['content'];
        this.imageData = [];
        this.centerComponent.forEach((item, index) => {

          if (item.mediaType == 'YOUTUBE') {
            var videoId = item.link.split('v=')[1].split('&')[0];
            this.imageData.push({src: videoId, thumb: item.link, mediaType: item.mediaType});
          } else {
            this.imageData.push({src: item.link, thumb: item.link, mediaType: item.mediaType});
          }

        });


        this.spinner.hide();
        resolve(null);
      });
    });
  }

  completed() {

  }
  goLive(){
    if(this.eventDetail['allowToSeeLiveStreaming'] && this.eventDetail['eventCode']){
      this.router.navigate(['/live-streaming/'+this.eventDetail['eventCode']]);
    }else{
      this.toastrService.error(this.eventDetail['liveStreamingErrorMessage'])
    }
  }

  goBack(){
    this.router.navigate(['/eventlist/all'])
  }
  confirmationEventRegister(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You have already registered to this event. Do you want to register it again ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {


           /* Swal.fire(
              'Deleted!',
              'Notification has been deleted.',
              'success'
            );*/


            this.router.navigate(['/ticket-booking-new/'+this.eventId+'/USER'])




      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(

          'Re-registration has been cancelled',

        );
      }
    })

  }
  navigate() {
    let url=this.eventDetail['eventConfigurations']['registrationRedirectUrl']
    window.open(url, '_blank');
   // window.location.href=(this.eventDetail['eventConfigurations']['registrationRedirectUrl'], '_blank')

 }
 navigateVendor(){
  let url=this.eventDetail['eventConfigurations']['vendorRedirectUrl']
  window.open(url, '_blank');
 }
 customGalleryConfig() {

  const lightboxGalleryRef = this.gallery.ref('lightBox');

  lightboxGalleryRef.setConfig({
    imageSize: ImageSize.Contain,
    thumbPosition: ThumbnailsPosition.Bottom,
    dots: true
  });

  lightboxGalleryRef.load(this.items);
}
}
