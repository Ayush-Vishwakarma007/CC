import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../../../../services/api.service";
import {SpinnerService} from "../../../../../services/spinner.service";
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Subject, Subscription} from "rxjs";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {pagination} from "../../../../../pagination";
import {EMAIL_PATTERN} from "../../../../../helpers/validations";


@Component({
  selector: 'app-event-performance',
  templateUrl: './event-performance.component.html',
  styleUrls: ['./event-performance.component.scss']
})
export class EventPerformanceComponent implements OnInit {

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Input()
  eventId = '';
  @Input()
  eventDetail: any = [];
  @Input()
  type = ''

  submitBtn = true;
  performanceList: any = [];
  performanceDetail: any = [];
  userNotificationId = '';
  notificationForm: FormGroup;
  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  modalRef2: BsModalRef;
  modalRef3: BsModalRef;
  performanceForm: FormGroup;
  participantForm: FormGroup;
  businessDetailForm: FormGroup;
  isSubmit: boolean = false;
  startDate = new Date();
  endDate = new Date();
  isSubmitted: boolean = false;
  participantList: any = [];
  isEdit: boolean = false;
  index: any;
  activeIndex = 0;
  mediaUploadUrl = "event/file/upload";
  imageList: any = [];
  uploadedImageList: any = [];
  reqNewData: any = [];
  memberList: any = [];
  search=""
  totalPages: any = [];
  totalMember: any = [];
  editId = '';
  authDetail: any = [];

  @Input()
  currentTab = '';

  reqData: any = [];
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

  constructor(public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location, private modalService: BsModalService) {
    this.notificationForm = this.formBuilder.group({
      message: ['', Validators.required],
      subject: ['', Validators.required],
      notificationAudiences: [''],
    });
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));

    this.performanceForm = this.formBuilder.group({
      endDateTime: ['', Validators.required],
      startDateTime: ['', Validators.required],
      performanceDuration: ['', Validators.required],
      contactFirstName: ['', Validators.required],
      contactLastName: ['', Validators.required],
      description: ['', Validators.required],
      choreographeremail: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      name: ['', Validators.required],
      phone: ['', Validators.minLength(10)],
    })

    this.participantForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    })

    this.businessDetailForm = this.formBuilder.group({
      address: [''],
      businessDetail: [''],
      businessName: [''],
      website: [''],
    })

  }

  ngOnInit() {
    this.reqData = {
      "filter": {
        "eventId": this.eventId,
        "search": "",
        // "status": "PENDING"
      },
      "page": {
        "pageLimit": 10,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "NAME"
      }
    }
    this.reqNewData = {
      "filter": {
        "roles": [
          "USER"
        ],
        "approved": true,
        "search": ''
      },
      "page": {
        "limit": 5,
        "page": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    };
    this.saveSubscription = this.save.subscribe(() => {
      this.reqData['page'] = {
        "pageLimit": 10,
        "pageNumber": 0
      };
      this.getPerformance();
    });
  }

  getPerformance() {
    if(this.type =='self'){
      this.reqData['filter'] = {
          "userId": this.authDetail.id,
          "search": "",
        }
    }
    let req = {
      path: "event/performance/getAll",
      data: this.reqData,
      isAuth: true,
    };
    if(this.type =='self'){
      req['path'] = "event/performance/getAll/self";
    }
    this.apiService.post(req).subscribe(response => {
      this.performanceList = response['data'];
      console.log(this.performanceList);
    });
  }

  participantDetail(list) {
    this.performanceDetail = list;
    console.log(this.performanceDetail);
  }

  approveRejectPerformance(list, status = '') {
    let req = {
      path: "event/participation/" + status + "/" + list.id,
      data: this.reqData,
      isAuth: true,
    };

    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.getPerformance();
        this.toastrService.success(response['status']['description']);
        this.modalRef.hide();
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  deletePerformance(id) {
    let request = {
      path: "event/participation/" + id,
      isAuth: true
    }
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.getPerformance();
        this.toastrService.success(response['status']['description']);

      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  changeTab(event) {
    this.activeIndex = event;
    if (this.activeIndex == 0) {
      this.isSubmit = true;
      if (this.performanceForm.valid) {
        this.isSubmit = false;
      } else {
        this.toastrService.error('Please fill all required fields.')
      }
    }
  }

  next() {
    this.isSubmit = true;
    if (this.performanceForm.valid) {
      this.activeIndex = this.activeIndex + 1;
      this.isSubmit = false;
    } else {
      this.toastrService.error('Please fill all required fields.')
    }
  }

  savePerformance() {
    this.isSubmit = true
    if (this.performanceForm.valid) {
      if (this.participantList.length != 0) {

        let formData = this.performanceForm.value
        let tempArr = {
          "eventId": this.eventId,
          "eventPerformance": {
            "contactFirstName": formData['contactFirstName'],
            "contactLastName": formData['contactLastName'],
            "description": formData['description'],
            "email": formData['choreographeremail'],
            "name": formData['name'],
            "phone": formData['phone']
          },
          "performanceDuration": formData['performanceDuration'],
          "endDateTime": formData['endDateTime'],
          "startDateTime": formData['startDateTime']
        };

        tempArr['businessInfo'] = this.businessDetailForm.value

        let participantArr = [];
        this.participantList.forEach(item => {
          participantArr.push({
            "age": item.age,
            "email": item.email,
            "firstName": item.firstName,
            "lastName": item.lastName
          })
        });

        tempArr['participants'] = participantArr;

        if (this.uploadedImageList.length != 0) {
          let imageArr = [];
          this.uploadedImageList.forEach((item) => {
            imageArr.push(item);
          })
          tempArr['mediaFiles'] = imageArr
        }

        let data = {}

        if (this.editId != '') {
          data = {
            path: "event/participation/" + this.editId,
            data: tempArr,
            isAuth: true
          };
        } else {
          data = {
            path: "event/participation",
            data: tempArr,
            isAuth: true
          };
        }

        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            this.isSubmit = false;
            this.imageList = [];
            this.uploadedImageList = [];
            this.participantList = [];
            this.modalRef.hide();
            this.imageList = [];
            this.editId = '';
            this.getPerformance();
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });
      } else {
        this.toastrService.error("Add Participant detail")
      }
    } else {
      this.toastrService.error('Please fill all required fields.')
    }
  }

  editPerformance(list) {
    this.activeIndex = 0;
    this.editId = list.id

    this.performanceForm.patchValue({
      contactFirstName: list['eventPerformance']['contactFirstName'],
      contactLastName: list['eventPerformance']['contactLastName'],
      description: list['eventPerformance']['description'],
      choreographeremail: list['eventPerformance']['email'],
      name: list['eventPerformance']['name'],
      phone: list['eventPerformance']['phone'],
      endDateTime: list.endDateTime,
      startDateTime: list.startDateTime,
      performanceDuration: list.performanceDuration,
    })

    this.businessDetailForm.patchValue({
      address: list['businessInfo']['address'],
      businessDetail: list['businessInfo']['businessDetail'],
      businessName: list['businessInfo']['businessName'],
      website: list['businessInfo']['website'],
    })

    list.participants.forEach((item) => {
      this.participantList.push(item)
    })

    if (list.mediaFiles.lenght != 0) {
      let array = [];
      list.mediaFiles.forEach((item) => {
        array.push(item)
      })

      array.forEach((item, index) => {
        this.imageList[index] = [];
        this.imageList[index]['responseData'] = [];
        this.imageList[index]['responseData']['data'] = [];
        this.imageList[index]['responseData']['data']['url'] = item;
      })

      this.imageList.forEach((item, index) => {
        this.uploadedImageList.push(item['responseData']['data']['url']);
      });
    }
  }

  addParticipant() {
    this.isSubmitted = true;

    if (this.participantForm.valid) {

      let minAge = this.eventDetail['participationConfig']['allowedAge']['min']
      let maxAge = this.eventDetail['participationConfig']['allowedAge']['max']

      if (this.participantForm.value.age < minAge || this.participantForm.value.age > maxAge) {
        this.toastrService.error("Participant's age should be between " + minAge + " to " + maxAge + " years");
      } else {
        let formData = this.participantForm.value
        if (this.isEdit) {
          this.participantList.map((item, index) => {
            if (index == this.index) {
              this.participantList[index] = formData
            }
          })
        } else {
          let maxParticipant = this.eventDetail['participationConfig']['participation']['max'];
          if (this.participantList.length >= maxParticipant) {
            this.toastrService.error("Maximum " + maxParticipant + " Participants are allowed");
          } else {
            this.participantList.push(formData);
          }
        }
        this.isEdit = false;
        this.isSubmitted = false;
        this.modalRef1.hide();
        this.participantForm.reset();
      }
    } else {
      this.toastrService.error('Please fill all required fields.')
    }
  }

  editParticipant(list, index) {
    this.isEdit = true
    this.index = index
    this.participantForm.patchValue({
      firstName: list.firstName,
      lastName: list.lastName,
      age: list.age,
      email: list.email,
    })
  }

  deleteParticipant(index) {
    this.participantList.splice(index, 1)
  }

  removeMedia(imageLink, index) {
    this.imageList.splice(index, 1);
    this.uploadedImageList.splice(index, 1);

    let data = {
      "link": imageLink,
    }

    let request = {
      path: 'event/file/delete',
      data: data,
      isAuth: true
    }

    this.apiService.post(request).subscribe(response => {
    });

  }

  addMember(list) {
    this.performanceForm.patchValue({
      contactFirstName: list.firstName,
      contactLastName: list.lastName,
      choreographeremail: list.email,
      phone: list.phone
    })
    this.modalRef2.hide();
  }

  memberData() {
    this.reqNewData['filter']['search'] = this.search;
    let req = {
      path: "auth/user/getUsers",
      data: this.reqNewData,
      isAuth: true,
    };
    this.apiService.post(req).subscribe(response => {
      this.memberList = response['data'];
      this.totalMember = response['data']['totalElements'];
      this.totalPages = pagination.arrayTwo(this.memberList['totalPages'], this.reqNewData.page.page);
      this.memberList['content'].map((item, index) => {
        if (item.profilePictureUrl == null || item.profilePictureUrl == '') {
          item['profileShow'] = false;
          item['profileUrl'] = item.firstName[0] + "" + item.lastName[0];


        } else {
          item['profileShow'] = true;
          item['profileUrl'] = item.profilePictureUrl;
        }
      });
    });
  }

  searchNewData() {
    this.paginationNewMember('current', 'user', 0);
  }

  paginationNewMember(type, data, current = null) {
    if (data == 'user') {
      if (type == 'prev') {
        this.reqNewData.page.page = this.reqNewData.page.page - 1;
      } else if (type == 'current') {
        this.reqNewData.page.page = current;
      } else {
        this.reqNewData.page.page = this.reqNewData.page.page + 1;
      }
      this.memberData();
    }
  }

  userNoti(id) {
    this.userNotificationId = id;
    this.notificationForm.reset();
  }

  pagination(type, data, current = null) {
    if (data == 'user') {
      if (type == 'prev') {
        this.reqData.page.pageNumber = this.reqData.page.pageNumber - 1;
      } else if (type == 'current') {
        this.reqData.page.pageNumber = current;
      } else {
        this.reqData.page.pageNumber = this.reqData.page.pageNumber + 1;
      }
      this.getPerformance();
    }
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }

  submitNotification() {

  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'modal-lg add-media gallerycenter-popup addperfomancepop'})
    );

  }

  openModalWithClass1(template1: TemplateRef<any>) {
    this.modalRef1 = this.modalService.show(
      template1,
      Object.assign({}, {class: 'modal-lg modal-dialog-centered addmem-model'})
    );
  }

  openModalWithClass2(template2: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(
      template2,
      Object.assign({}, {class: 'modal-lg modal-dialog-centered committee-member-donation'})
    );
      this.memberData()
  }

  charOnly(evt): boolean {
    var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode :
      ((evt.which) ? evt.which : 0));
    if (charCode > 32 && (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  formReset() {
    this.activeIndex = 0;
    this.isSubmit = false;
    this.imageList = [];
    this.uploadedImageList = [];
    this.participantList = [];
    this.performanceForm.reset();
    this.businessDetailForm.reset();
  }

  participantFormReset() {
    this.isSubmitted = false;
    this.participantForm.reset();
  }

  invalidUploadFile() {
    this.toastrService.error('Please upload only image file');
  }

  invalidVideoUploadFile() {
    this.toastrService.error('Please upload only video file');
  }

  maxFileError() {
    this.toastrService.error('Maximum 1 file is allowed');
  }

  fileSizeError() {
    let request = {
      path: 'community/configuration/publicInfo',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.toastrService.error('Maximum ' + response['data']['imageMaxSize'] + 'MB size is allowed');
    });
    //this.toastrService.error('Maximum 4MB size allowed');
  }

  uploadStarted() {
    this.spinner.show();
  }

  imageQueueCompleted() {
    this.uploadedImageList = [];
    this.imageList.map((item, index) => {
      this.uploadedImageList.push(item['responseData']['data']['url']);
    });
    this.spinner.hide();
  }

  openModalWithClass3(template3: TemplateRef<any>) {
    this.modalRef3 = this.modalService.show(
      template3,
      Object.assign({}, {class: 'modal-lg performance-moddle performance-guest'})
    );
  }
}
