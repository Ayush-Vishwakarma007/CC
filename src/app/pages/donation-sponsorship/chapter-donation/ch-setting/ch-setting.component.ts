import {Component, Input, OnInit} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../../services/api.service";
import {SpinnerService} from "../../../../services/spinner.service";
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import Swal from "sweetalert2";

@Component({
  selector: 'app-ch-setting',
  templateUrl: './ch-setting.component.html',
  styleUrls: ['./ch-setting.component.scss']
})
export class ChSettingComponent implements OnInit {
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Input()
  eventId = '';

  @Input()
  eventDetail :any= [];

  @Input()
  currentTab = '';
  userNotificationId = '';
  notificationForm:FormGroup;
  submitBtn:boolean= true;
  notificationAudience :any = [];
  editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "auto",
    "minHeight": "250px",
    "width": "auto",
    "minWidth": "0",
    "translate": "yes",
    "enableToolbar": true,
    "showToolbar": true,
    "placeholder": "Enter text here...",
    "imageEndPoint": "",
    "toolbar": [
      ["bold", "italic", "underline"],
      [{'header': 1}, {'header': 2}],

      ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
      // ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
      // ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
      ["link"]

    ]
  };
  constructor(public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {

    this.notificationForm = this.formBuilder.group({
      message: ['', Validators.required],
      subject: ['', Validators.required],
      notificationAudiences: ['DONORS'],
    });
  }

  ngOnInit() {
    this.getNotificationAudience();
  }
  userNoti(id) {
    //console.log(id);
    this.userNotificationId = id;
    this.notificationForm.reset();

  }
  edit() {
    this.router.navigate(['edit-event-new/', this.eventId]);
  }
  getNotificationAudience() {
    let request = {
      path: "event/notificationAudience",
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.notificationAudience = response['data'];
    });
  }

  submitAllNotification() {
    //console.log(this.userNotificationId);
    if (this.notificationForm.valid) {
      this.submitBtn = true;
      let data = {};
      let formData = this.notificationForm.value;
      if (formData.notificationAudiences == null) {
        formData.notificationAudiences = ['ALL'];
      }
      formData['onlyMainUsers'] = true;
      data = {
        path: "event/sendEmail/" + this.eventId,
        data: formData,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.userNotificationId = '';
          $('#deletesNoti').click();
        } else {
          this.toastrService.error(response['status']['description']);
          this.submitBtn = false;
        }
      });
    } else {
      this.submitBtn = false;
    }
  }
  delete() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this event!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "event/delete/" + this.eventId,
          isAuth: true,
        };
        this.apiService.get(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Deleted!',
              'Event has been deleted.',
              'success'
            );
            this._location.back();
          }


        }, error => {
          Swal.fire(
            'Cancelled',
            'Event has been safe.',
            'error'
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Event has been safe.',
          'error'
        );
      }
    })
  }
}
