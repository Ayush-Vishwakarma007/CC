import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../../../../services/api.service";
import {SpinnerService} from "../../../../../services/spinner.service";
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import Swal from "sweetalert2";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
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
  userNotificationId = '';
  notificationForm:FormGroup;
  submitBtn:boolean= true;
  notificationAudience :any = [];
  selectAll: boolean = false;
  userIds: any = [];
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '25rem',
    maxHeight: 'auto',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
  };
  constructor(private modalService: BsModalService, public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {

    this.notificationForm = this.formBuilder.group({
      message: ['', Validators.required],
      subject: ['', Validators.required],
      notificationAudiences: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getNotificationAudience();
  }
  userNoti(id) {
    //console.log(id);
    this.userNotificationId = id;
    this.submitBtn = true;
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
          this.modalRef.hide();
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

  copy()
  {
    let request = {
      path: "event/copy/"+this.eventId,
      data:{},
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
     if( response['status']['code'] == 'CREATED')
     {
       this.toastrService.success(response['status']['description']);
       this.router.navigate(['edit-event-new/'+response['data']['id']]);
     }else{
       this.toastrService.error(response['status']['description']);
     }
     console.log(response)
    });
  }

  selectAllChange(event){
    if (event.checked) {
      this.selectAll = true;
      let array = [];
      this.notificationAudience.forEach((item, index) => {
        array.push(item.value);
      });
      this.notificationForm.patchValue({
        notificationAudiences: array
      })
    } else {
      this.selectAll = false;
      this.notificationForm.patchValue({
        notificationAudiences: null
      })
    }
  }

  changeNotificationAudience(list)
  {
    if (list.length == this.notificationAudience.length) {
      this.selectAll = true;
    }
    else {
      this.selectAll = false;
    }
  }
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'setting-mod popop-common-center' })
    );
  }
}
