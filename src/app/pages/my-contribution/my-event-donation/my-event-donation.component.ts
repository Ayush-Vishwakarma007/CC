import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { SpinnerService } from "../../../services/spinner.service";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { EMAIL_PATTERN } from "../../../helpers/validations";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {CommunityDetailsService} from "../../../services/community-details.service";

@Component({
  selector: 'app-my-event-donation',
  templateUrl: './my-event-donation.component.html',
  styleUrls: ['./my-event-donation.component.scss']
})
export class MyEventDonationComponent implements OnInit {

  reqData: any = [];
  userList: any = [];
  totalUser = 0;
  modalRef: BsModalRef;
  addSponsorForm: FormGroup;
  editId = ''
  isSubmit: boolean = false;
  listType = 'table';
  eventId = '';
  categoryName = '';
  minRange : any;
  maxRange : any;
  chapterList: any = [];
  selectAllChapter: boolean = false;
  chapterIds: any = [];
  search = ''
  pagelimit1:any=[];

  constructor(private modalService: BsModalService, public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location,public communityService: CommunityDetailsService) {

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

    this.reqData = {
      "filter": {
        "donationType": 'DONATION',
      },
      "page": {
        "pageLimit": this.communityService.pagelimit,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "DESC",
        "sortBy": "DATE"
      }
    };
   }

  async ngOnInit() {
    await this.getChapterList();
  }

  getChapterList() {
    let request = {
      path: 'community/chapters',
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
          this.getChapterDetail(id);
        }
      });
      resolve(null);
    });
  }

  getChapterDetail(ids) {
    this.chapterIds = [];
    if (ids.length == 0) {
      this.chapterIds = [this.chapterList[0]['id']];
      this.toastrService.error('At least one chapter must be selected.')
      return false;
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
    this.memberData();
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
    this.memberData();
  }

  memberData(search = '') {
    this.reqData['filter']['chapterIds'] = this.chapterIds;
    this.reqData['filter']['search'] = this.search
    if(search != ''){
      this.reqData['page']['pageNumber'] = 0
    }

    let req = {
      path: "event/sponsorship/self",
      data: this.reqData,
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.post(req).subscribe(response => {
      this.userList = response['data'];
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
  searchClick(){
    this.memberData(this.search);
  }
  selected_pagelimit(event) {
    this.pagelimit1=event.value
    console.log(this.pagelimit1)
    this.reqData.page.pageLimit= this.pagelimit1;
    console.log(this.reqData.page.pageLimit)
    this.memberData();

  }
  getNotificationReceipt(id) {
    let req = {
      path: "event/sponsorship/sendReceipt/" + id,
      isAuth: true,
    };

    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }
  edit(editList) {
    this.editId = editList.id;
    this.eventId = editList.eventId;

    this.categoryName = editList['sponsorshipCategory']['categoryName'],
    this.minRange = editList['sponsorshipCategory']['range']['min'],
    this.maxRange = editList['sponsorshipCategory']['range']['max']

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
  }

  submit() {
    this.isSubmit = true;
    if (this.addSponsorForm.valid) {
      let formData = this.addSponsorForm.value;
      formData["donationType"] = "DONATION";
      formData["eventId"] = this.eventId;
      formData['finalAmount'] = Number(formData['amount'])

      let data = {
        path: "event/chapter/sponsorship/edit/" + this.editId,
        data: formData,
        isAuth: true
      };

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.addSponsorForm.reset();
          this.isSubmit = false;
          this.modalRef.hide();
          this.editId = '';
          this.memberData();
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
    this.memberData();
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
      this.memberData();
      document.getElementById("page_form").scrollIntoView();

    }
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }

  changeList(type) {
    this.listType = type;
    this.memberData();
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg editdonor popop-common-center' })
    );
  }

}
