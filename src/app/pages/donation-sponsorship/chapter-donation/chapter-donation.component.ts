import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SpinnerService } from "../../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { Subject } from "rxjs";
import { EMAIL_PATTERN } from "../../../helpers/validations";
import { pagination } from "../../../pagination";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-chapter-donation',
  templateUrl: './chapter-donation.component.html',
  styleUrls: ['./chapter-donation.component.scss']
})
export class ChapterDonationComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  chapterDetail: any = [];
  chapterList: any = [];
  configList: any = [];
  chapterId = '';
  reqData: any = [];
  currentTab = 'dashboard';
  statisticSubject: Subject<any> = new Subject();
  donorSubject: Subject<any> = new Subject();
  donationSubject: Subject<any> = new Subject();
  settingSubject: Subject<any> = new Subject();
  addSponsorForm: FormGroup;
  paymentType_list: any = [];
  editId = '';
  editList: any = [];
  plan_list: any = [];
  isSubmit: boolean = false;
  eventId = '';
  search = '';
  reqNewData: any = [];
  memberList: any = [];
  paymentMethod = '';
  isEditable: boolean = false;
  totalPages: any = [];
  totalMember: any = [];
  constructor(private modalService: BsModalService, private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.reqData = {
      "filter": {
        "donationType": "DONATION",
        "successfulPayment": true,
      },
      "page": {
        "pageLimit": 8,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    };

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

    this.addSponsorForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.pattern(EMAIL_PATTERN)]],
      paymentMethodUsed: ['', [Validators.required]],
      phone: ['', [Validators.minLength(10)]],
      categoryId: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      addressLine1: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      displayName: [''],
      sendMail: [true],
      anonymousDonation: [false],
      successfulPayment: [false],
    });
  }

  async ngOnInit() {
    await this.getChapterList();
    await this.getConfigList();
    this.planList();
    this.paymentType();

  }
  getChapterList() {
    let request = {
      path: 'community/chapters/access',
      isAuth: true,
    };
    this.spinner.show();
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.chapterList = response['data'];
        if (this.chapterList[0]) {
          this.getChapterDetail(this.chapterList[0]['id']);
        }
        resolve(null);
        this.spinner.hide();
      });
    });
  }

  getConfigList() {
    let request = {
      path: 'community/configuration/publicInfo',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.configList = response['data'];
    });
  }
  planList() {
    let request = {
      path: 'event/chapter/sponsorshipCategory/getAll/DONATION/' + this.chapterId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.plan_list = response['data'];
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
  edit() {
    this.editId = this.editList.id;
    this.eventId = this.editList.eventId;
    this.paymentMethod = '';
    this.isEditable = false;

    if (this.editList.paymentMethodUsed != null && this.editList.paymentMethodUsed != '') {
      let data = this.paymentType_list.filter(ob => ob.value == this.editList.paymentMethodUsed)[0]
      if (data == undefined) {
        this.paymentMethod = this.editList.paymentMethodUsed;
      }
    }

    if (this.editList.paymentMethodUsed == null || this.editList.paymentMethodUsed == '') {
      this.isEditable = true
    }

    this.addSponsorForm.patchValue({
      firstName: this.editList.firstName,
      lastName: this.editList.lastName,
      email: this.editList.email,
      paymentMethodUsed: this.editList.paymentMethodUsed,
      phone: this.editList.phone,
      categoryId: this.editList.categoryId,
      amount: this.editList.amount,
      addressLine1: this.editList.addressLine1,
      city: this.editList.city,
      state: this.editList.state,
      zipCode: this.editList.zipCode,
      displayName: this.editList.displayName,
      anonymousDonation: this.editList.anonymousDonation,
      successfulPayment: this.editList.successfulPayment,
    });

  }
  submit() {
    this.isSubmit = true;
    if (this.addSponsorForm.valid) {
      let formData = this.addSponsorForm.value;
      formData['chapterId'] = this.chapterId;
      formData["donationType"] = "DONATION";
      let data = {};
      if (this.editId != '') {
        formData['eventId'] = this.eventId;
        data = {
          path: "event/chapter/sponsorship/update/" + this.editId,
          data: formData,
          isAuth: true
        };
      }
      else {
        data = {
          path: "event/chapter/sponsorship/",
          data: formData,
          isAuth: true
        };
      }

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.addSponsorForm.reset();
          this.isSubmit = false;
          this.donorSubject.next(null);
          this.modalRef.hide();
          this.editId = '';
          this.eventId = '';
          this.paymentMethod = '';
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

  addMember(list){
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
      this.memberData()
      document.getElementById("page_form").scrollIntoView();

    }
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
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

  getChapterDetail(id) {
    this.chapterId = id;
    this.reqData['filter']["chapterId"] = this.chapterId;
    this.planList();
    this.changeTab(this.currentTab);
  }


  changeTab(data) {
    let tab = data;
    this.currentTab = tab;
    setTimeout(() => {
      if (this.currentTab == 'dashboard') {
        this.statisticSubject.next(null);
      }
      if (this.currentTab == 'donor') {
        this.donorSubject.next(null);
      }
      if (this.currentTab == 'donation') {
        this.donationSubject.next(null);
      }
      if (this.currentTab == 'setting') {
        this.settingSubject.next(null);
      }
    }, 300);
  }
  formReset() {
    this.addSponsorForm.reset();
    this.editId = '';
    this.paymentMethod = '';
    this.isEditable = false;
    this.addSponsorForm.patchValue({
      sendMail:true,
      anonymousDonation: false,
    })
  }
  openModalWithClass2(template1: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template1,
      Object.assign({}, { class: 'modal-lg modal-dialog-centered popop-common-center' })
    );
  }
  openModalWithClass3(template2: TemplateRef<any>) {
    this.modalRef1 = this.modalService.show(
      template2,
      Object.assign({}, { class: 'modal-lg modal-dialog-centered committee-member-donation' })
    );
  }
}
