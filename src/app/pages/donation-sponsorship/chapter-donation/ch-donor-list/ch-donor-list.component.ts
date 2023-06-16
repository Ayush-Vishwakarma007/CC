import {Component, Input, OnInit, Output, EventEmitter, TemplateRef} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../../services/api.service";
import {SpinnerService} from "../../../../services/spinner.service";
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {pagination} from "../../../../pagination";
import {EMAIL_PATTERN} from "../../../../helpers/validations";
import * as $ from "jquery";
import Swal from "sweetalert2";
import {CommunityDetailsService} from "../../../../services/community-details.service";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ch-donor-list',
  templateUrl: './ch-donor-list.component.html',
  styleUrls: ['./ch-donor-list.component.scss']
})
export class ChDonorListComponent implements OnInit {

  modalRef: BsModalRef;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;

  @Input()
  userPermisssion: any = [];

  @Input()
  currentTab = '';

  @Input()
  reqData: any = [];

  @Input()
  type = '';

  _donor:any;
  @Output()donorChange: EventEmitter<any> = new EventEmitter();
  @Output()completed: EventEmitter<any> = new EventEmitter();
  @Input()
  get donor(){
    return this._donor;
  }
  set donor(value){
    this._donor = value;
    this.donorChange.emit(value);
  }

  searchString: string = '';


  fieldName: any;
  filedValue: any;
  value: any;
  isHidden: boolean = true;
  memberId = '';
  memberList: any = [];

  rejectDetails: any = [];
  totalMember = 0;
  memberDetail: any = [];
  addMember: boolean = false;
  addMemberForm: FormGroup;
  submitBtn: boolean = true;
  rejectedData: any = [];
  notificationData: any = [];
  isMemberFormSubmitted = false;
  editMemberForm: FormGroup;
  validation: any;
  search = '';
  checkedfield: any = [];
  totalPages: any = [];
  refundReqData:any=[]
  refundreason=''
  pagelimit1:any=[]
  donarid:any
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
      ["link"]

    ]
  };
  notificationForm: FormGroup;
  listType = 'card';
  urlPattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;


  constructor(private modalService: BsModalService, public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location,public communityService: CommunityDetailsService) {
    this.addMemberForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      city: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    });
    this.notificationForm = this.formBuilder.group({
      message: ['', Validators.required],
      subject: ['', Validators.required],
    });
    this.editMemberForm = this.formBuilder.group({});
  }

  ngOnInit() {

    this.saveSubscription = this.save.subscribe(() => {
      this.search = '';

      this.reqData['page'] = {
        "pageLimit": this.communityService.pagelimit,
        "pageNumber": 0
      };
      this.memberData();
    });
    this.refundReqData={
      "refundReason": this.refundreason
    }

  }

  // ====================== export to excel ============================
  getCurrentDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //because January is 0!
    let yyyy = today.getFullYear();

    let date = '';
    let mon = '';

    if (dd < 10) {
      date = '0' + dd;
    }
    if (mm < 10) {
      mon = '0' + mm;
    }
    return (date + mon + yyyy);
  }

  exportToExport() {

    let memberStatus = "";
    let fileName = this.currentTab + "_";

    let req = {
      path: "event/chapter/sponsors/excel",
      data: this.reqData,
      isAuth: true,
    };

    let currentDate = this.getCurrentDate();

    let Exportfilename = fileName + currentDate;

    this.apiService.ExportReqBody(req, Exportfilename);
  }

  edit(list) {
    this.donor =list;
    this.completed.emit();
  }

  //====================================================================
  memberData(search = "") {
    this.reqData['filter']['search'] = this.search;
    this.searchString = search;
    if(search != ""){
      this.reqData['page']['pageNumber'] = 0
    }

    let req = {
      path: 'event/chapter/sponsor/getAll',
      data: this.reqData,
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.post(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.memberList = response['data'];
        // let member_length = this.memberList['content'].length;
        // let page_no = this.reqData.page.pageNumber;
        // if (member_length == 0) {
        //   if (page_no != 0) {
        //     this.reqData.page.pageNumber = page_no - 1;
        //     this.memberData();
        //   }
        // }
        this.totalPages = pagination.arrayTwo(this.memberList['totalPages'], this.reqData.page.pageNumber);
        this.memberList['content'].forEach((item, index) => {
          item['sub'] = false;
          item['submembers'] = [];
          item['profileShow'] = false;
          //this.subMembers(item.id, index);
          if (item.firstName) {
            if (item.profilePictureUrl == null || item.profilePictureUrl == '') {
              item['profileShow'] = false;
              item['profileUrl'] = item.firstName[0] + "" + item.lastName[0];
            } else {
              item['profileShow'] = true;
              item['profileUrl'] = item.profilePictureUrl;
            }
          }

        });
        this.totalMember = response['data']['totalElements'];
      }
      this.spinner.hide();

    });
  }

  viewNotificationReceipt(id){
    this.spinner.show();
    let req = {
      path: "event/chapter/sponsorship/getReceipt/"+id,
      isAuth: true,
    };
    this.apiService.getPDF(req);
  }
  getNotificationReceipt(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want send receipt!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Send it!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        let req = {
          path: "event/chapter/sponsorship/sendReceipt/" + id,
          isAuth: true,
        };
        this.apiService.get(req).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Success!',
              //response['status']['description'],
              response['status']['description'],
              'success'
            );
          } else {
            Swal.fire(
              'Cancelled',
              'Receipt not send.',
              'error'
            );
          }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Receipt not send.',
          'error'
        )
      }
    })
  }

  editMember(id) {

    if (this.currentTab == 'member') {
      this.isHidden = true;

    }
    if (this.currentTab == 'new-member') {
      this.isHidden = false;
    }
    this.memberId = id;
    this.editMemberForm = this.formBuilder.group({});
    let req = {
      path: "auth/formSteps/" + id,
      isAuth: true,
    };
    this.apiService.get(req).subscribe(response => {

      this.memberDetail = response['data'];
      this.memberDetail.forEach((item, index) => {
        this.editMemberForm.addControl('id', new FormControl(id, Validators.required));
        item.fieldValues.forEach((value, index1) => {
          let fieldName = value.fieldName;
          this.filedValue = value.value;
          if (this.filedValue == null) {
            this.filedValue = '';
          }
          if (value.type == 'CHECK_BOX') {
            value.optionList = [];
            value.options.filter((op) => {
              value.optionList.push({'value': op, 'check': false});
            });
            let filedValue = this.filedValue.split(',');
            value.optionList.filter((list) => {
              filedValue.filter((op) => {
                if (op == list['value']) {
                  list['check'] = true;
                }
              });
            });
          }
          //this.editMemberForm.controls[fieldName].clearValidators();\
          if (value.required == true) {
            if (value.type == 'URL') {
              this.validation = [Validators.required, Validators.pattern(this.urlPattern)];
            } else {
              this.validation = [Validators.required];
            }
          } else {
            if (value.type == 'URL') {
              this.validation = [Validators.pattern(this.urlPattern)];
            } else {
              this.validation = [];
            }
          }
          this.editMemberForm.addControl(fieldName, new FormControl(this.filedValue, this.validation));
        });
      });
      //console.log(this.editMemberForm.value);
      this.isMemberFormSubmitted = true;
    });
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
      document.getElementById("page_form").scrollIntoView();
      this.memberData();
    }
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }

  editMemberFormSubmit() {
    this.memberDetail.forEach((item, index) => {
      item.fieldValues.forEach((value, index1) => {
        let fieldName = value.fieldName;
        if (value.type == 'CHECK_BOX') {
          let checked = '';
          value['optionList'].filter((list) => {
            if (list['check'] == true) {
              checked += list['value'] + ',';
            }
          });
          if (value.required == true) {
            this.validation = [Validators.required];
          } else {
            this.validation = [];
          }
          this.editMemberForm.patchValue({
            fieldName: checked
          });
          this.editMemberForm.removeControl(fieldName);
          this.editMemberForm.addControl(fieldName, new FormControl(checked, this.validation));
          value.value = checked;
        }
      });
    });
    if (this.editMemberForm.valid) {
      let formdata = {"fieldValues": this.editMemberForm.value}
      let data = {
        path: "auth/member/update/" + this.editMemberForm.value.id,
        data: formdata,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.addMember = false;
          this.isMemberFormSubmitted = false;
          $("#delete_btn").trigger("click");
          this.memberData();
          this.toastrService.success(response['status']['description']);
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    } else {
      this.toastrService.error('All * fields are required');
    }
  }

  changeList(type) {
    this.listType = type;
    this.memberData();
  }

  NotificationClear() {
    this.notificationData['message'] = "";
  }

  submitNotification() {
    if ($.trim(this.notificationData['message']) != '' && this.notificationData['message'] != undefined) {
      let postData = {
        'message': this.notificationData['message']
      };
      let req = {
        path: "event/chapter/sponsorship/sendEmail/" + this.notificationData['id'],
        data: postData,
        isAuth: true,
      };
      this.apiService.post(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          $('#deleEmail').trigger("click");
          this.toastrService.success(response['status']['description']);
          this.memberData();

          this.notificationData['id'] = '';
          this.notificationData['message'] = '';
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    } else {
      this.toastrService.error('Add vaild reason');
    }
  }

  sort(type) {
    if (type == 'name') {
      this.reqData['sort']['sortBy'] = 'FIRST_NAME';
    } else if (type == 'address') {
      this.reqData['sort']['sortBy'] = 'ADDRESS';
    } else if (type == 'email') {
      this.reqData['sort']['sortBy'] = 'EMAIL';
    } else if (type == 'phone') {
      this.reqData['sort']['sortBy'] = 'PHONE';
    } else if (type == 'amount') {
      this.reqData['sort']['sortBy'] = 'TOTAL_PAYMENT';
    } else if (type == 'paymentStatus') {
      this.reqData['sort']['sortBy'] = 'PAYMENT';
    } else if (type == 'date') {
      this.reqData['sort']['sortBy'] = 'DATE';
    }
    if (this.reqData['sort']['orderBy'] == 'ASC') {
      this.reqData['sort']['orderBy'] = 'DESC';
    } else if (this.reqData['sort']['orderBy'] == 'DESC') {
      this.reqData['sort']['orderBy'] = 'ASC';
    }
    this.memberData();
  }
  selected_pagelimit(event) {
    this.pagelimit1=event.value
    console.log(this.pagelimit1)
    this.reqData.page.pageLimit= this.pagelimit1;
    console.log(this.reqData.page.pageLimit)
    this.memberData();

  }

  notificationMember(id) {
    this.notificationData['id'] = id;
  }
  deleteDonor(id) {
    $("#delete_btn").click();
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this donor!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "event/chapter/sponsor/delete/" + id,
          isAuth: true,
        }
        this.apiService.get(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Success!',
              //response['status']['description'],
              'Donor has been deleted.',
              'success'
            );
            this.search = '';
            this.memberData();
          } else {
            Swal.fire(
              'Cancelled',
              'Donor is safe.',
              'error'
            );
          }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Donor is safe.',
          'error'
        )
      }
    })
  }

  // deleteDonor(id){
  //   let request = {
  //     path : "event/chapter/sponsor/delete/" + id,
  //     isAuth: true
  //   }
  //
  //   this.apiService.get(request).subscribe(response => {
  //     if (response['status']['code'] == 'OK') {
  //       this.toastrService.success(response['status']['description']);
  //       this.memberData();
  //     }else
  //     {
  //       this.toastrService.error(response['status']['description']);
  //     }
  //   });
  // }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  alredyRefund(){
    this.toastrService.error('You already refunded');
  }
  openModalWithClass2(template: TemplateRef<any>,id) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg editdonor popop-common-center' })
    );
    this.donarid=id
  }
  closeModel(){
    this.modalRef.hide();
    this.refundreason='';
  }
  refundReason(){
    if(this.refundreason!='') {

      this.refundReqData['refundReason'] = this.refundreason
      let req = {
        path: "event/sponsorship/refund/" + this.donarid,
        data: this.refundReqData,
        isAuth: true,
      };

      this.apiService.post(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.refundreason='';
        this.modalRef.hide();
        this.memberData();
      }
      });
    }else{
      this.toastrService.error('Please enter valid reason');

    }
  }

}
