import { Component, OnInit, Input } from '@angular/core';
import { CommunityDetailsService } from "../../services/community-details.service";
import { EventImagesPipe } from "../../pipes/event-images.pipe";
import { PipesModule } from "../../pipes/pipes.module";
import { Subject } from 'rxjs';
import { Router } from "@angular/router";
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  providers: [EventImagesPipe], 
})
export class EventComponent implements OnInit {

  shrebaseLink: string;
  shareTitle: string;
  backgroundImage: any
  liveTime: any = ''
  counter: any = []
  @Input() eventList: any = [];
  display: boolean = false
  submitSubject: Subject<any> = new Subject();
  constructor(public communityService: CommunityDetailsService, private pipe: EventImagesPipe, public router: Router) {
  }

  ngOnInit(): void {
    if (this.eventList) {
      this.eventList.forEach((element, index) => {
        var countDownDate = new Date(element.startDateTime).getTime();
        let days
        let hours
        let minutes
        let seconds
        let now
        let timeleft
        let counter
        var myfunc = setInterval(() => {
          now = new Date().getTime();
          timeleft = countDownDate - now;
          days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
          hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
          seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
          this.liveTime = days + 'DAYS' + ' : ' + hours + 'H' + ' : ' + minutes + 'M ' + ' : ' + seconds + 'S'
          if (days >= 1) {
            this.counter = [{ "days": days, "title_days": 'DAY', "hours": hours, "title_hours": 'H', "minutes": minutes, "title_min": 'M', "sec": seconds, "title_sec": 'S' }]
          }
          else {
            if (days < 1 && hours < 1) {
              this.counter = [{ "minutes": minutes, "title_min": 'M', "sec": seconds, "title_sec": 'S' }]
            }
            else {
              this.counter = [{ "hours": hours, "title_hours": 'H', "minutes": minutes, "title_min": 'M', "sec": seconds, "title_sec": 'S' }]
            }

          }

          this.eventList[index]['timer'] = this.counter

        }, 1000)
      });
    }
  }

  shareEvent(id, title) {
    this.shrebaseLink = location.origin + '/event-details/' + id;
    this.shareTitle = title;
  }
  redirectTicket(id, date, configuration) {
    console.log('eventConfig',configuration.allowSingleTicketCheckout)
    if (date == "Upcoming") {
      if (configuration.allowSingleTicketCheckout == false) {
        this.router.navigate(['/ticket-booking-new/' + id + '/USER'])
      }
      else {
        this.router.navigate(['/purchase-ticket-new-event/' + id + '/USER'])
      }
    } else {
      this.router.navigate(['/event-details/' + id])
    }

  }

}
