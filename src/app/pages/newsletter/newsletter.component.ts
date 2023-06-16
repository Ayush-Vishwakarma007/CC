import {Component, OnInit, TemplateRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import {SpinnerService} from "../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {pagination} from "../../pagination";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {EMAIL_PATTERN} from "../../helpers/validations";

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {
  modalRef: BsModalRef;
  newsletterList:any = [];
  reqData: any = [];
  chapterId='';
  chapterList:any = [];
  totalPages :any= [];
  search = '';
  newsLetterform : FormGroup;
  isSubmit: boolean = false;
  constructor(private modalService: BsModalService,  private fb: FormBuilder,private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.newsLetterform = this.fb.group({
      firstName: [''],
      lastName: [''],
      phone: ['', Validators.minLength(10)],
      email: ['', [Validators.required, Validators.email, Validators.pattern(EMAIL_PATTERN)]],
    });

    this.reqData = {
      "filter": {
        "search": "",
        "publish":true,
        "chapterId" :this.chapterId
      },
      "page": {
        "pageLimit": 10,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "DESC",
        "sortBy": "DATE_TIME"
      }
    };
  }


  ngOnInit() {
    this.getChapterList();
    this.getNewsletterList();
  }

  getChapterList() {
    let request = {
      path: 'community/chapters/access',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.chapterList = response['data'];
      if(this.chapterList[0])
      {
        this.chapterId = this.chapterList[0]['id'];
      }

    });
  }

  getNewsletterList() {
    this.spinner.show();
    this.reqData['filter']['search'] = this.search;
    let request = {
      path: 'notification/newsLetter/getAll',
      data: this.reqData,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.newsletterList = response['data'];
        let member_length = this.newsletterList['content'].length;
        let page_no = this.reqData.page.pageNumber;
        if (member_length == 0) {
          if (page_no != 0) {
            this.reqData.page.page = page_no - 1;
            this.getNewsletterList();
          }
        }
        this.totalPages = pagination.arrayTwo(this.newsletterList['totalPages'], this.reqData.page.pageNumber);
        this.spinner.hide();
      } else {
        this.toastrService.error(response['status']['description']);
        this.spinner.hide();
      }
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
      this.getNewsletterList();
    }
  }

  newsletterChanges() {
    this.isSubmit = true;
    if(this.newsLetterform.valid){

      let data = this.newsLetterform.value;

      let request = {
        path: "auth/subscribe",
        data: data,
        isAuth: true
      }

      this.apiService.post(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.newsLetterform.reset();
          this.modalRef.hide();
          this.isSubmit = false;
        } else {
          this.toastrService.error(response['status']['description']);
          this.isSubmit = false;
        }
      });
    }
    else{
      this.toastrService.error('Fill required fields.!');
    }

  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md modal-dialog-centered newsletter-modal' })
    );
  }


}
