import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../../../../services/api.service";
import {SpinnerService} from "../../../../../services/spinner.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-event-session',
  templateUrl: './event-session.component.html',
  styleUrls: ['./event-session.component.scss']
})
export class EventSessionComponent implements OnInit {
  modalRef: BsModalRef;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Input()
  eventId = '';

  @Input()
  eventDetail :any= [];

  @Input()
  currentTab = '';

  sessionList:any = [];
  sessionDetail :any =[];
  constructor(private modalService: BsModalService, public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {

  }

  ngOnInit() {
    this.saveSubscription = this.save.subscribe(() => {
      this.getSessionList();
    });
  }
  getSessionList()
  {
    let req = {
      path: "event/getAllSessions/"+this.eventId,
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.get(req).subscribe(response => {
      this.sessionList = response['data'];
      this.spinner.hide();
      this.modalRef.hide();
    });
  }
  getSessionDetail(list){
    this.sessionDetail =list;
    let req = {
      path: "event/session/attendees/"+list['id'],
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.get(req).subscribe(response => {
      this.sessionDetail['attendees'] = response['data'];
      this.spinner.hide();
    });
  }
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg session-pop' })
    );
  }
}
