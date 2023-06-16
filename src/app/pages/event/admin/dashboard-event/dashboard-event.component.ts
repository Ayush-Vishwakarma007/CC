import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ApiService } from "../../../../services/api.service";
import { SpinnerService } from "../../../../services/spinner.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { configuration } from "../../../../configration";
import * as moment from "moment-timezone";
import { Subject } from "rxjs";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { CommunityDetailsService } from "../../../../services/community-details.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-dashboard-event",
  templateUrl: "./dashboard-event.component.html",
  styleUrls: ["./dashboard-event.component.scss"],
})
export class DashboardEventComponent implements OnInit {
  events: any = [];
  authDetail: any = [];
  eventDetail: any = [];
  reqData: any = [];
  eventId: any = "";
  currentTab = "dashboard";
  modalRef: BsModalRef;
  memberSubject: Subject<any> = new Subject();
  participantSubject: Subject<any> = new Subject();
  statisticSubject: Subject<any> = new Subject();
  donationSubject: Subject<any> = new Subject();
  settingSubject: Subject<any> = new Subject();
  sessionSubject: Subject<any> = new Subject();
  performanceSubject: Subject<any> = new Subject();
  volunteerSubject: Subject<any> = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    public apiService: ApiService,
    public spinner: SpinnerService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    public router: Router,
    public _location: Location,

    public communityService: CommunityDetailsService
  ) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.route.params.subscribe((params) => (this.eventId = params["id"]));
  }
  async ngOnInit() {
    await this.getEventDetail();
    let data = [];
    data["tab"] = [];
    data["tab"]["textLabel"] = "dashboard";
    this.events = localStorage.getItem('eventselect')
  }
  getEventDetail() {
    let request = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };
    this.spinner.show();
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe((response) => {
        this.eventDetail = response["data"];
        this.eventDetail["dates"] = configuration.eventDateFormat(
          this.eventDetail["startDateTime"],
          this.eventDetail["endDateTime"]
        )[0];
        this.eventDetail["times"] = configuration.eventDateFormat(
          this.eventDetail["startDateTime"],
          this.eventDetail["endDateTime"]
        )[1];
        let zone = moment.tz.guess();
        this.eventDetail["timezones"] = moment.tz(zone).format("z");
        this.eventDetail["eventStatics"] = [];
        this.getEventStatics();

        resolve(null);
        this.spinner.hide();
      });
    });
  }
  getEventStatics() {
    let data = {
      path: "event/eventStatics/" + this.eventId,
      isAuth: true,
    };
    this.apiService.get(data).subscribe((response) => {
      if (response["status"]["code"] == "OK") {
        this.eventDetail["eventStatics"] = response["data"];
      }
    });
  }
  changeTab(data) {
    let tab = data.tab.textLabel;
    this.currentTab = tab;

    setTimeout(() => {
      if (this.currentTab == "dashboard") {
        console.log("tab");
        this.statisticSubject.next(null);
      }
      if (this.currentTab == "participant" || this.currentTab == "vendor") {
        this.participantSubject.next(null);
      }
      if (this.currentTab == "donor" || this.currentTab == "sponsor") {
        if (this.currentTab == "donor" && this.eventDetail["admin"] == false) {
          this.statisticSubject.next(null);
        }
        this.donationSubject.next(null);
      }
      if (this.currentTab == "session") {
        this.sessionSubject.next(null);
      }
      if (this.currentTab == "setting") {
        this.settingSubject.next(null);
      }
      if (this.currentTab == "performances") {
        this.performanceSubject.next(null);
      }
      if (this.currentTab == "volunteer") {
        this.volunteerSubject.next(null);
      }
    }, 300);
  }
  edit() {
    this.router.navigate(["edit-event-new/", this.eventId]);
  }

  publish() {
    this.spinner.show();
    let stateForm = { eventState: "PUBLISHED" };
    let data = {
      path: "event/changeState/" + this.eventId,
      data: stateForm,
      isAuth: true,
    };
    this.apiService.post(data).subscribe((response) => {
      if (response["status"]["code"] == "OK") {
        this.toastrService.success(response["status"]["description"]);
        this.getEventDetail();
        this.spinner.hide();
      }
    });
  }

  unPublish() {
    this.spinner.show();
    let stateForm = { eventState: "UNDER_REVIEW" };
    let data = {
      path: "event/changeState/" + this.eventId,
      data: stateForm,
      isAuth: true,
    };
    this.apiService.post(data).subscribe((response) => {
      if (response["status"]["code"] == "OK") {
        this.toastrService.success(response["status"]["description"]);
        this.getEventDetail();
        this.spinner.hide();
      }
    });
  }
  cancelEvent() {}
  cancel(sendMail) {
    this.spinner.show();
    let stateForm = { eventState: "CANCELED", sendMail: sendMail };
    let data = {
      path: "event/changeState/" + this.eventId,
      data: stateForm,
      isAuth: true,
    };
    this.apiService.post(data).subscribe((response) => {
      if (response["status"]["code"] == "OK") {
        this.toastrService.success(response["status"]["description"]);
        this.getEventDetail();
        this.spinner.hide();
        this.modalRef.hide();
        $("#modalCancelEvent").trigger("click");
      } else {
        $("#modalCancelEvent").trigger("click");
        this.toastrService.error(response["status"]["description"]);
        this.spinner.hide();
      }
    });
  }
  liveStream() {
    this.spinner.show();
    let data = {
      path: "event/liveStream/" + this.eventId,
      isAuth: true,
    };
    this.apiService.get(data).subscribe((response) => {
      if (response["status"]["code"] == "OK") {
        this.toastrService.success(response["status"]["description"]);
        this.getEventDetail();
        this.spinner.hide();
      } else {
        this.toastrService.error(response["status"]["description"]);
        this.spinner.hide();
      }
    });
  }
}
