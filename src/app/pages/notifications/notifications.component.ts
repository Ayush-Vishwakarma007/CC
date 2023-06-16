import { Component, OnInit ,ViewChild ,ElementRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import { SpinnerService } from '../../services/spinner.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  eventType:any;
  avtiveType:string = "EMAIL";
  notificationData:any;
  pagelimit : number =5;
  scheduleList: any[] = [{ name: '' }];
  addNotificationForm: FormGroup;
  notificationImg : string = '';

  dynamicFieldIconMapping = {
    "EMAIL": "icon-black-back-closed-envelope-shape",
    "PHONE": "icon-capitalize",
    "PUSH_NOTIFICATION": "icon-login",
  };


  @ViewChild('notificationPic') notificationPic: ElementRef;

  constructor(private route: ActivatedRoute, public router: Router,private formBuilder: FormBuilder,public spinner: SpinnerService, public apiService: ApiService, private toastrService: ToastrService) {

    this.addNotificationForm = this.formBuilder.group({
      subject: ['', Validators.required],
      message:['', Validators.required],
      cities:['', Validators.required],
    });

  }

  ngOnInit() {
    this.onload();
    this.getNotificationList();
  }

  onload(){
    let request = {
      path: "notification/notificationTypes",
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.eventType = response['data'];
    });
  }

  uploadphotoclick(){
    $('#notificationFile').trigger('click');
  }

  updateImage(){
      let file = this.notificationPic.nativeElement.files;
      let formData = new FormData();
      formData.append("file", file[0]);

      let data = {
        path: "notification//uploadFile",
        data: formData,
        isAuth: true
      };
      this.apiService.postImage(data).subscribe(response => {
        this.notificationImg = response['data']['fileUrl'];
      });
  }

  readmore(){
    this.pagelimit = this.pagelimit+5;
    this.getNotificationList();
    //console.log(this.pageNo);
  }

  addNewScheduled(){
    this.scheduleList.push({ name: '' });
  }


  addNotificationSubmit(){
    if (this.addNotificationForm.invalid) {
        let input = this.addNotificationForm.value;

        let formData = {
                    "dateSchedules": [
                      {
                        "scheduleDate": "2019-12-17T04:55:24.260Z"
                      }
                    ],
                    "filter": {
                      "approved": true,
                      "cities": [
                        ""
                      ],
                      "countries": [
                        ""
                      ],
                      "eventId": "",
                      "maxAge": 0,
                      "maxRegistrationDate": "2019-12-17T04:55:24.260Z",
                      "minAge": 0,
                      "minRegistrationDate": "2019-12-17T04:55:24.260Z",
                      "states": [
                        ""
                      ]
                    },
                    "imageUrl": this.notificationImg,
                    "message": input['message'],
                    "notificationTypes": [
                      "EMAIL"
                    ],
                    "subject": input['subject']
                  };

        let data = {
          path: "notification//sendNotification",
          data: formData,
          isAuth: true
        };
        this.apiService.post(data).subscribe(response => {
            if(response['status']['code']=="OK"){
              this.toastrService.success(response['status']['description']);
            }else{
              this.toastrService.error(response['status']['description']);
            }
        });

    }
  }

  deleteSchudule(nId,sId){
          Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Schedule!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "notification/cancelNotification/"+nId+"/"+sId,
          isAuth: true,
        }
        this.apiService.get(request).subscribe(response => {

          Swal.fire(
            'Deleted!',
            'Schedule has been deleted.',
            'success'
          )
          this.getNotificationList();

        }, error => {
          Swal.fire(
            'Cancelled',
            'Schedule is safe.',
            'error'
          )
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Schedule is safe.',
          'error'
        )
      }
    })
  }

  deleteNotification(id){
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
          path: "notification/deleteSchedule/" + id,
          isAuth: true,
        }
        this.apiService.get(request).subscribe(response => {

          Swal.fire(
            'Deleted!',
            'Notification has been deleted.',
            'success'
          )
          this.getNotificationList();

        }, error => {
          Swal.fire(
            'Cancelled',
            'Notification is safe.',
            'error'
          )
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Notification is safe.',
          'error'
        )
      }
    })
  }

  getNotificationList(){
    this.spinner.show();
    let data = {
      "pageLimit": this.pagelimit,
      "pageNumber": 0
    };
    let request = {
      path: "notification/find",
      data: data,
      isAuth: true,
    };


    this.apiService.post(request).subscribe(response => {
      this.spinner.hide();
      if(response['data']['content']){
        this.notificationData = response['data']['content'];
      }
    });
  }

  ActiveType(type){
    this.avtiveType = type;
  }

  options = [
    { value: 'This is value 1', label: 'Option 1' },
    { value: 'This is value 2', label: 'Option 2' },
    { value: 'This is value 3', label: 'Option 3' },
    { value: 'This is value 4', label: 'Option 4' },
  ];
  option;
}
