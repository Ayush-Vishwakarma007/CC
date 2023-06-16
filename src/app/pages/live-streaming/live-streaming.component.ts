import {Component, OnInit} from '@angular/core';
import {Gallery} from "@ngx-gallery/core";
import {SpinnerService} from "../../services/spinner.service";
import {CommunityDetailsService} from "../../services/community-details.service";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {ToastrService} from "ngx-toastr";
import {SeoService} from "../../services/seo.service";
import {configuration} from "../../configration";
import * as moment from "moment-timezone";
// import {EmbedVideoService} from "ngx-embed-video/dist";

@Component({
  selector: 'app-live-streaming',
  templateUrl: './live-streaming.component.html',
  styleUrls: ['./live-streaming.component.scss']
})
export class LiveStreamingComponent implements OnInit {
  authDetail: any = [];
  eventId = '';
  eventCode = '';
  eventDetail: any = [];
  session_list: any = [];
  bookmarked: boolean = false;
  shareBaseLink: string;
  shareTitle: string;
  valid = false;
  constructor(public gallery: Gallery, /*private embedService: EmbedVideoService*/ public spinner: SpinnerService, public communityService: CommunityDetailsService, public _location: Location, private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, private seo: SeoService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.route.params.subscribe(params => {
      this.eventCode = params['code']
    });
  }

  async ngOnInit() {
    await this.getEventDetail();
    this.sessionList()
  }

  getEventDetail() {
    this.spinner.show();
    let request = {
      path: "event/details/live/" + this.eventCode,
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.eventDetail = response['data'];
          this.eventId = this.eventDetail['id']
          this.bookmarked = this.eventDetail['bookmarked'];
          if(this.eventDetail['allowToSeeLiveStreaming'] == false){
            this.router.navigate(['/live-streaming-not-allowed/'+this.eventId]);
          }
          if(this.eventDetail['meetingUrl'] !=null && configuration.isValidUrl(this.eventDetail['meetingUrl'])){
            this.valid = true
          /*  this.eventDetail['meetingUrl'] = this.embedService.embed(
              this.eventDetail['meetingUrl'], {
                query: {portrait: 0, color: '333'},
                attr: {style:"top:0;left:0;"}
              });*/
            console.log(this.eventDetail['meetingUrl'],this.valid);

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

  interestedEvent(id) {
    let request = {
      path: "/event/interested/" + id,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      if (response['status']['status'] == 'SUCCESS' || response['status']['status'] == 'DELETED') {
        this.toastrService.success(response['status']['description']);

        if(response['status']['status'] == 'SUCCESS') {
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

  sessionList() {
    let request = {
      path: "event/getAllSessions/" + this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.session_list = response['data'];
    });
  }

  shareEvent(id) {
    this.shareBaseLink = location.origin + '/event-details/' + id;
    //console.log(this.shareBaseLink);
    this.shareTitle = this.eventDetail['name'];
    //
  }
  goToPoll(list){
      console.log(list)
    window.open(list['link'], "_blank");
  }
}
