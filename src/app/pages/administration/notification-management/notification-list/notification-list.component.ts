import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from '../../../../services/spinner.service';
import { pagination } from 'src/app/pagination';
import Swal from "sweetalert2";
import { Subject, Subscription } from "rxjs";
import {CommunityDetailsService} from "../../../../services/community-details.service";

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {

  @Input()
  reqData: any = [];

  notificationList: any = [];
  totalPages: any = [];
  search = '';
  isShow: boolean = false;
  chapterList: any = [];
  chapterIds: any = [];
  selectAllChapter: boolean = false;

  @Output() notificationDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() detailIdChange: EventEmitter<any> = new EventEmitter();
  @Output() scheduleDateChange: EventEmitter<any> = new EventEmitter();

  _notificationDetail: any;

  @Input()
  get notificationDetail() {
    return this._notificationDetail;
  }

  set notificationDetail(value) {
    this._notificationDetail = value;
    this.notificationDetailChange.emit(value);
  }

  _scheduleDate: any;

  @Input()
  get scheduleDate() {
    return this._scheduleDate;
  }

  set scheduleDate(value) {
    this._scheduleDate = value;
    this.scheduleDateChange.emit(value);
  }

  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, public toastrService: ToastrService,
    public communityService: CommunityDetailsService) { }

  async ngOnInit() {
    this.reqData['page'] = {
      "pageLimit": this.communityService.pagelimit ,
      "pageNumber": 0
    };
    await this.getChapterList();
   // this.getNotificationList();
  }

  getNotificationList(search = "") {

    console.log(this.chapterIds);
    this.reqData['filter']['search'] = this.search;
    this.reqData['filter']['chapterIds'] = this.chapterIds;

    if (search != "") {
      this.reqData['page']['pageNumber'] = 0;
    }
    let request = {
      path: "notification/notification/getAll",
      data: this.reqData,
      isAuth: true
    }

    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.notificationList = response['data'];
        this.notificationList['content'].forEach((item) => {
          item['isShow'] = false;
        })
        //this.chapterIds.length = 0;
        this.totalPages = pagination.arrayTwo(this.notificationList['totalPages'], this.reqData.page.pageNumber);
        console.log(response);
      }
      else {
        this.toastrService.error(response['status']['description']);
      }
    })
  }
  searchClick(){
    this.getNotificationList(this.search);
  }
  selected_pagelimit(event) {
    this.communityService.pagelimit=event.value
  
    this.reqData.page.pageLimit= this.communityService.pagelimit;
    console.log(this.reqData.page.pageLimit)
    this.getNotificationList();

  }
  getChapterList() {
    let request = {
      path: 'community/chapters/access',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.chapterList = response['data'];
        if (this.chapterList.length != 0) {
          let id = [];
          this.chapterList.map((item) => {
            id.push(item['id']);
          })
          console.log("id",id)
          this.getChapterDetail(id);
        }
      });
      resolve(null);
    });
  }

  getChapterDetail(ids) {
    if(ids.length == 0){
      this.chapterIds = [this.chapterList[0]['id']];
      this.toastrService.error('At least one chapter must be selected.')
    }
    if (ids.length == this.chapterList.length) {
      this.selectAllChapter = true;
    }
    else {
      this.selectAllChapter = false;
    }

    ids.forEach((item) => {
      this.chapterIds.push(item);
    })
    console.log("fdrgdfg",this.chapterIds);
    this.getNotificationList();
  }

  selectAllChange(event) {
    if (event.checked) {
      this.selectAllChapter = true;
      let array = [];
      this.chapterList.forEach((item, index) => {
        array.push(item.id);
      });
      this.chapterIds = array
    } else {
      this.chapterIds = [this.chapterList[0]['id']];
      this.selectAllChapter = false;
    }
    this.getNotificationList();
  }
  copyNotification(id){
    let request = {
      path: 'notification/notification/copy/'+id,
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.router.navigate(['/management/edit-notification/'+response.data['id']]);
      });
  })
}
  pagination(type, data, current = null) {
    console.log(this.chapterIds);
    this.reqData['filter']['chapterIds'] = this.chapterIds;
    if (data == 'user') {
      if (type == 'prev') {
        this.reqData.page.pageNumber = this.reqData.page.pageNumber - 1;
      } else if (type == 'current') {
        this.reqData.page.pageNumber = current;
      } else {
        this.reqData.page.pageNumber = this.reqData.page.pageNumber + 1;
      }
      this.getNotificationList();
      document.getElementById("noti_form").scrollIntoView();

    }
  }

  deleteNotification(id) {
    let message = '';
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Notification!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "notification/notification/" + id,
          isAuth: true,
        };
        this.apiService.get(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Deleted!',
              'Notification has been deleted.',
              'success'
            );
            this.getNotificationList();
          } else {
            Swal.fire(
              'Cancelled',
              response['status']['description'],
              'error'
            );
          }

        }, error => {

          Swal.fire(
            'Cancelled',
            'Notification has been safe.',
            'error'
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Notification has been safe.',
          'error'
        );
      }
    })
  }

  getNotificationDetail(notificationId, scheduleId, scheduleDate) {
    this.notificationDetail['filter']['notificationId'] = notificationId;
    this.notificationDetail['filter']['scheduleId'] = scheduleId;
    this.scheduleDate = scheduleDate;
    this.detailIdChange.emit();
  }

  getSchedule(list, index) {
    if (list['isShow'] == false) {
      list['isShow'] = true
    }
    else {
      list['isShow'] = false
    }
  }

  cancelNotification(notificationId, scheduleId) {
    let request = {
      path: "notification/notification/" + notificationId + '/' + scheduleId,
      isAuth: true
    }

    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.getNotificationList();
      }
      else {
        this.toastrService.error(response['status']['description']);
      }
    })
  }

}
