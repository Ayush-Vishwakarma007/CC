import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../../../services/api.service";
import { SpinnerService } from "../../../../../services/spinner.service";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { Subject, Subscription } from "rxjs";
import Swal from "sweetalert2";
import { EMAIL_PATTERN } from "../../../../../helpers/validations";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { pagination } from "../../../../../pagination";

@Component({
  selector: 'app-donation-sponsor-detail',
  templateUrl: './donation-sponsor-detail.component.html',
  styleUrls: ['./donation-sponsor-detail.component.scss']
})
export class DonationSponsorDetailComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  modalRef2: BsModalRef;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Input()
  eventId = '';

  @Input()
  eventDetail: any = [];

  @Input()
  currentTab = '';

  submitBtn: boolean = true;
  notificationForm: FormGroup;
  userNotificationId = '';
  listType = 'table';
  reqData: any = [];
  search = '';
  searchString = '';
  userList: any = [];
  totalUser = 0;
  selfCreated: boolean = false;
  addSponsorForm: FormGroup;
  mediaUploadUrl = "event/uploadPicture";
  logoList: any = [];
  isSubmit: boolean = false;
  editId = '';
  paymentType_list: any = [];
  plan_list: any = [];
  plan_list_donation: any = [];
  search_Member = '';
  reqNewData: any = [];
  memberList: any = [];
  paymentMethod = '';
  isEditable: boolean = false;
  totalPages: any = [];
  totalPages1: any =[];
  totalMember: any = [];
  validTypesImage = ['jpeg', 'jpg', 'png'];
  refundReqData:any=[]
  sponsorid:any
  refundreason=''
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
      [{ 'header': 1 }, { 'header': 2 }],

      ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
      // ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
      // ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
      ["link"]

    ]
  };
  constructor(private modalService: BsModalService, public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {
    this.notificationForm = this.formBuilder.group({
      message: ['', Validators.required],
      subject: ['', Validators.required],
      notificationAudiences: [''],
    });

    this.addSponsorForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.pattern(EMAIL_PATTERN)]],
      paymentMethodUsed: ['', [Validators.required]],
      phone: ['', [Validators.minLength(10)]],
      categoryId: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      websiteUrl: [''],
      displayName: [''],
      addressLine1: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      companyName: [''],
      sendMail: [true],
      anonymousDonation: [false],
      successfulPayment: [false],
      expiryDate: [''],
    });

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
    this.refundReqData={
      "refundReason": this.refundreason
    }

  }


  ngOnInit() {
    this.reqData = {
      "filter": {
        "donationType": 'DONATION',
        "eventId": this.eventId,
        //"successfulPayment": true
      },
      "page": {
        "pageLimit": 8,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "DESC",
        "sortBy": "DATE"
      }
    };
    this.saveSubscription = this.save.subscribe(() => {
      this.search = '';
      this.reqData['page'] = {
        "pageLimit": 8,
        "pageNumber": 0
      };
      this.memberData(this.searchString);
    });

    this.planList();
    this.paymentType();
    this.donationPlanList();
  }

  memberData(search = "") {
    if (this.currentTab == 'donor') {
      this.searchString = search;
      this.reqData['filter']['donationType'] = 'DONATION';
      this.reqData['filter']['search'] = search;
    } else {
      this.searchString = search;
      this.reqData['filter']['donationType'] = 'SPONSOR';
      this.reqData['filter']['search'] = search;
    }

    let req = {
      path: "event/sponsors",
      data: this.reqData,
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.post(req).subscribe(response => {
      this.userList = response['data'];
      this.totalPages1 = pagination.arrayTwo(this.userList['totalPages'], this.reqData.page.pageNumber);
      let member_length = this.userList['content'].length;
      let page_no = this.reqData.page.pageNumber;
      if (member_length == 0) {
        if (page_no != 0) {
          this.reqData.page.pageNumber = page_no - 1;
          this.memberData(this.searchString);
        }
      }
      this.userList['content'].forEach((item, index) => {
        if (item.firstName) {
          if (item.profilePictureUrl == null || item.profilePictureUrl == '') {
            item['profileShow'] = false;
            item['profileUrl'] = item.firstName[0] + "";
            if (item.lastName != null) { item['profileUrl'] += item.lastName[0] }
          } else {
            item['profileShow'] = true;
            item['profileUrl'] = item.profilePictureUrl;
          }
        } else {
          item['profileShow'] = false;
          item['profileUrl'] = '';
        }

      });
      this.totalUser = response['data']['totalElements'];
      this.spinner.hide();

    });
  }
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
  export() {
    let req = {
      path: "event/sponsors/excel",
      data: this.reqData,
      isAuth: true,
    };

    let currentDate = this.getCurrentDate();
    let filename = '';
    if (this.currentTab == 'donor') {
      filename = 'Donors_' + currentDate + '_' + this.eventDetail.name;
    } else {
      filename = 'Sponsors_' + currentDate + '_' + this.eventDetail.name;
    }
    this.apiService.ExportReqBody(req, filename);

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
      this.memberData(this.searchString);
    }    //console.log(this.reqData.page);

  }
  viewNotificationReceipt(id){
    this.spinner.show();
    let req = {
      path: "event/sponsorship/getReceipt/"+id,
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
          path: "event/sponsorship/sendReceipt/" + id,
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

  planList() {
    let request = {
      path: 'event/getAllSponsorshipCategories/SPONSOR/' + this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.plan_list = response['data'];
    });
  }

  donationPlanList() {
    let request = {
      path: 'event/getAllSponsorshipCategories/DONATION/' + this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.plan_list_donation = response['data'];
    });
  }

  paymentType() {
    let request = {
      path: "event/eventPaymentMethod/OFFLINE/",
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.paymentType_list = response['data'];
    });
  }

  submit(type) {
    this.isSubmit = true;
    if (this.addSponsorForm.valid) {
      let formData = this.addSponsorForm.value;
      if (type == 'donor') {
        formData["donationType"] = "DONATION";
      } else if (type == 'sponsor') {
        formData["donationType"] = "SPONSOR";
      }
      formData["eventId"] = this.eventId;
      if (this.logoList[0]) {
        formData['logo'] = this.logoList[0]['responseData']['data']['imageUrl'];
      }

      if (type == 'sponsor') {
        if ((formData['displayName'] == '' || formData['displayName'] == null) && (formData['logo'] == '' || formData['logo'] == null)) {
          this.toastrService.error("Please Select logo or fill Display Name!");
          return false;
        }
      }

      let data = {};
      if (this.editId != '' && type == 'sponsor') {
        if (formData['expiryDate'] == null) {
          formData['infiniteExpiryDate'] = true;
        }
        else {
          formData['infiniteExpiryDate'] = false;
        }
        formData['finalAmount'] = Number(formData['amount'])
        data = {
          path: "event/sponsorship/update/" + this.editId,
          data: formData,
          isAuth: true
        };
      }
      else if (this.editId != '' && type == 'donor') {
        formData['finalAmount'] = Number(formData['amount'])
        data = {
          path: "event/sponsorship/update/" + this.editId,
          data: formData,
          isAuth: true
        };
      }
      else {
        data = {
          path: "event/sponsorship/",
          data: formData,
          isAuth: true
        };
      }

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.memberData();
          this.addSponsorForm.reset();
          this.isSubmit = false;
          this.modalRef.hide();
          this.editId = '';
          //this.paymentMethod = '';
          this.isEditable = false;
        } else {
          this.toastrService.error(response['status']['description']);
          this.isSubmit = false;
        }
      });
    }
    else {
      this.toastrService.error("Please fill all required fields!");
    }
  }

  edit(editList, template: TemplateRef<any>) {
   // this.paymentMethod = '';
    this.isEditable = false
    this.editId = editList.id;
    let array = [];
    this.logoList = [];
    if (editList.logo != '' && editList.logo != null) {
      array.push(editList.logo);
    }
    array.forEach((item, index) => {
      this.logoList[index] = [];
      this.logoList[index]['responseData'] = [];
      this.logoList[index]['responseData']['data'] = [];
      this.logoList[index]['responseData']['data']['imageUrl'] = item;
    });

    if (editList.paymentMethodUsed != null && editList.paymentMethodUsed != '') {
      let data = this.paymentType_list.filter(ob => ob.value == editList.paymentMethodUsed)[0]
      if (data == undefined) {
        this.paymentType_list.push({value:editList.paymentMethodUsed,name:editList.paymentMethodUsed});
      }
    }

    if (editList.paymentMethodUsed == null || editList.paymentMethodUsed == '') {
      this.isEditable = true
    }
    this.addSponsorForm.patchValue({
      firstName: editList.firstName,
      lastName: editList.lastName,
      email: editList.email,
      paymentMethodUsed: editList.paymentMethodUsed,
      phone: editList.phone,
      categoryId: editList.categoryId,
      websiteUrl: editList.websiteUrl,
      amount: editList.finalAmount,
      displayName: editList.displayName,
      companyName: editList.companyName,
      addressLine1: editList.addressLine1,
      city: editList.city,
      state: editList.state,
      zipCode: editList.zipCode,
      anonymousDonation: editList.anonymousDonation,
      successfulPayment: editList.successfulPayment,
      expiryDate: editList.expiryDate,
    });

    if (this.currentTab == 'donor') {
      this.openModalWithClass(template);

    } else if (this.currentTab == 'sponsor') {
      this.openModalWithClass2(template)
    }
  }

  deleteSponsorDonor(id){
    let request = {
      path: "event/sponsor/delete/" + id,
      isAuth: true
    }
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.memberData();
        this.toastrService.success(response['status']['description']);
      }
      else{
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  addMember(list) {
    this.addSponsorForm.patchValue({
      firstName: list.firstName,
      lastName: list.lastName,
      email: list.email,
      phone: list.phone,
      addressLine1: list.addressLine1,
      city: list.city,
      state: list.state,
      zipCode: list.zipCode,
    })
    this.modalRef1.hide();
  }

  memberSearchData() {
    this.reqNewData['filter']['search'] = this.search_Member;
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
      this.memberSearchData();
    }
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }
  changeList(type) {
    this.listType = type;
    this.memberData(this.searchString);
  }
  sort(type) {
    if (type == 'name') {
      this.reqData['sort']['sortBy'] = 'FIRST_NAME';
    } else if (type == 'address') {
      this.reqData['sort']['sortBy'] = 'FIRST_NAME';
    } else if (type == 'email') {
      this.reqData['sort']['sortBy'] = 'EMAIL';
    } else if (type == 'phone') {
      this.reqData['sort']['sortBy'] = 'PHONE';
    } else if (type == 'totalPayment') {
      this.reqData['sort']['sortBy'] = 'TOTAL_PAYMENT';
    } else if (type == 'paymentStatus') {
      this.reqData['sort']['sortBy'] = 'PAYMENT';
    }
    if (this.reqData['sort']['orderBy'] == 'ASC') {
      this.reqData['sort']['orderBy'] = 'DESC';
    } else if (this.reqData['sort']['orderBy'] == 'DESC') {
      this.reqData['sort']['orderBy'] = 'ASC';
    }
    this.memberData(this.searchString);
  }

  userNoti(id) {
    //console.log(id);
    this.userNotificationId = id;
    this.notificationForm.reset();

  }
  alredyRefund(){
    this.toastrService.error('You already refunded');
  }
  submitNotification() {
    //console.log(this.userNotificationId);
    if (this.notificationForm.valid) {
      this.submitBtn = true;
      let data = {};
      let formData = this.notificationForm.value;
      delete formData.notificationAudiences;
      formData['onlyMainUsers'] = true;
      data = {
        path: "event/sponsorship/sendEmail/" + this.eventId + '/' + this.userNotificationId,
        data: formData,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.userNotificationId = '';
          $('#deleteNoti').click();
        } else {
          this.toastrService.error(response['status']['description']);
          this.submitBtn = false;
        }
      });
    } else {
      this.submitBtn = false;
    }
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  onBlur(event){
    if(event.target.value !== '')
     event.target.value = parseFloat(event.target.value).toFixed(2)
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

  invalidUploadFile() {
    this.toastrService.error('Please upload only image file');
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
  }

  uploadStarted() {
    //this.isFileUploading=true;
  }

  queueCompleted() {

  }

  formReset() {
    this.addSponsorForm.reset();
    this.editId = '';
    this.logoList = [];
    //this.paymentMethod = '';
    this.isEditable = false;
    this.addSponsorForm.patchValue({
      sendMail: true,
      anonymousDonation: false,
    })
  }
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg modal-dialog-centered' })
    );
  }

  openModalWithClass2(template1: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template1,
      Object.assign({}, { class: 'modal-lg modal-dialog-centered adddonar addsponsor ' })
    );
  }

  openModalWithClass3(template2: TemplateRef<any>) {
    this.modalRef1 = this.modalService.show(
      template2,
      Object.assign({}, { class: 'committee-member-donation' })
    );
  }
  openModalWithNotif(template2: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(
      template2,
      Object.assign({}, { class: 'committee-member-donation' })
    );
  }
  closeModel(){
    this.modalRef.hide();
    this.refundreason='';
  }
  openModalWithClassRefund(template: TemplateRef<any>,id) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg editdonor popop-common-center' })
    );
    this.sponsorid=id
  }
  refundReason(){
    if(this.refundreason!=''){
    this.refundReqData['refundReason']=this.refundreason
    let req = {
      path: "event/sponsorship/refund/"+this.sponsorid,
      data: this.refundReqData,
      isAuth: true,
    };

    this.apiService.post(req).subscribe(response => {
     // this.refundmemberList=response['data']['content']
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
