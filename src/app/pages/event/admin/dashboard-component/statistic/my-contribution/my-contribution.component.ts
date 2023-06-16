import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../../../../services/api.service";
import { SpinnerService } from "../../../../../../services/spinner.service";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { Subject, Subscription } from "rxjs";
import { EMAIL_PATTERN } from "../../../../../../helpers/validations";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-my-contribution',
  templateUrl: './my-contribution.component.html',
  styleUrls: ['./my-contribution.component.scss']
})
export class MyContributionComponent implements OnInit {

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Input()
  eventId = '';

  @Input()
  eventDetail: any = [];

  @Input()
  currentTab = '';

  reqData: any = [];
  userList: any = [];
  totalUser = 0;
  modalRef: BsModalRef;
  addSponsorForm: FormGroup;
  editId = ''
  plan_list_donation: any = [];
  paymentType_list: any = [];
  isSubmit: boolean = false;

  constructor(private modalService: BsModalService, public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {
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
  }

  ngOnInit() {
    this.reqData = {
      "filter": {
        "donationType": 'DONATION',
        "eventId": this.eventId,
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
    this.saveSubscription = this.save.subscribe(async () => {
      this.reqData['page'] = {
        "pageLimit": 8,
        "pageNumber": 0
      };
      this.memberData();
      this.donationPlanList();
      this.paymentType();
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


  memberData() {
    if (this.currentTab == 'donation') {
      this.reqData['filter']['donationType'] = 'DONATION';
    } else {
      this.reqData['filter']['donationType'] = 'SPONSOR';
    }

    let req = {
      path: "event/sponsorship/self",
      data: this.reqData,
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.post(req).subscribe(response => {
      this.userList = response['data'];
      this.totalUser = response['data']['totalElements'];
      this.spinner.hide();

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
        path: "event/sponsorship/edit/" + this.editId,
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

  editSponsorship(id){
    this.router.navigate(['/my-sponsorship/edit/', this.eventId , id]);
  }

  edit(editList) {
    this.editId = editList.id;
    let array = [];

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
    }
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg modal-dialog-centered' })
    );
  }

}
