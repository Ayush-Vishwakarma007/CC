import {Component, OnInit, Pipe, PipeTransform, TemplateRef} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {Subject} from "rxjs";
import {pagination} from 'src/app/pagination';
import {DomSanitizer} from "@angular/platform-browser";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Search } from 'angular2-multiselect-dropdown/lib/menu-item';

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
@Component({
  selector: 'app-newsletter-management',
  templateUrl: './newsletter-management.component.html',
  styleUrls: ['./newsletter-management.component.scss']
})
export class NewsletterManagementComponent implements OnInit {

  modalRef: BsModalRef;
  chapterList: any = [];
  chapterDetail: any = [];
  reqData: any = [];
  reqDataPerId: any = [];
  totalPagesPerId: any = [];
  newsletterDetail: any = [];
  totalViewNewsMember: any = '';
  userReqData: any = [];
  userunScubReqData:any =[];
  editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "auto",
    "minHeight": "650px",
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
      ["link", "image",]

    ]
  };
  paymentDetail: any = [];
  configList: any = [];
  chapterId ='';
  currentTab = 'newsletters-list';
  dashboardSubject: Subject<any> = new Subject();
  newsletterListSubject: Subject<any> = new Subject();
  newSubscriberSubject: Subject<any> = new Subject();
  peopleSubject: Subject<any> = new Subject();
  userPermisssion: any = [];
  newsLetterDetail: any = [];
  viewSearch:any='';
  rewDataViewTotal:any =[];
  totalNewsLetterViewMember:any;
  constructor( private modalService: BsModalService, private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.getChapterList()
    this.reqData = {
      "filter": {
        "search": "",
        "chapterIds": [
          //this.chapterId
        ],
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

    this.reqDataPerId = {
      "filter": {
        "search": "",
      },
      "page": {
        "pageLimit": 10,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    };
    this.rewDataViewTotal = {
      "filter": {
        "search": "",
      },
      "page": {
        "pageLimit": 10,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    };
    this.userunScubReqData={
      "filter": {
        "subscribeNewsLetter": false,
        "checkInvalidEmail":true,
        "emailVerified": true,
        "chapterIds": [
          this.chapterId
        ],
        "approved": true,
        "search": ""
      },
      "page": {
        "limit": 8,
        "page": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    };

    this.userReqData = {
      "filter": {
        "subscribeNewsLetter": true,
        "checkInvalidEmail":true,
        "emailVerified": true,
        "chapterIds": [
          this.chapterId
        ],
        "approved": true,
        "search": ""
      },
      "page": {
        "limit": 8,
        "page": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    };

  }

  async ngOnInit() {
    await this.getPermission();

    this.changeTab('newsletters-list');
    this.newsletterListSubject.next(null);
    await this.getChapterList();
    //this.getChapterList();
    this.getConfigList();


  }

  getPermission() {
    let req = {
      path: 'uiPermission/getPermissionByRole',
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.get(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.userPermisssion = [];
          response['data'].forEach((item, index) => {
            this.userPermisssion[item.name] = item;
          });
        } else {
        }

        resolve(null);

      });
    });
  }

  getChapterList() {
    let request = {
      path: 'community/chapters/access',
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.chapterList = response['data'];

      if (this.chapterList[0]) {
        this.chapterId = this.chapterList[0]['id'];
      }
      this.userReqData['filter']['chapterIds'] = [this.chapterId];
      this.userunScubReqData['filter']['chapterIds'] = [this.chapterId];
      this.reqData['filter']['chapterIds'] = [this.chapterId];

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
  readUnread(value){
    if(value =='all'){
      delete( this.reqDataPerId['filter']['viewed']);
    }else {
      this.reqDataPerId['filter']['viewed'] = value;
    }
    this.reqDataPerId['page']['page'] = 0;
    this.getNewsletterViewDetail();
  }
  viewSearchfunction(search){
    // if(this.currentTab=='news-subscribers'){
    //   search='';
    // }
    console.log(this.viewSearch)
    this.viewSearch =search;
    if(search!='') {
      this.reqDataPerId['filter']['search'] = this.viewSearch;
    }else{
      this.reqDataPerId['filter']['search'] ='';
    }
    this.reqDataPerId['page']['pageNumber'] = 0;
    this.getNewsletterViewDetail();
  }
  searchClick() {
    this.reqData['filter']['search'] = this.viewSearch;
    if(this.viewSearch ==''){
      this.reqData['page']['page'] = 0;
    }
    this.getNewsletterViewDetail()
  }
  getChapterDetail(id) {
    this.chapterId = id;
    this.changeTab(this.currentTab);
  }

  changeTab(data) {

    let tab =data

    this.userReqData['filter']['chapterIds'] = [this.chapterId];
    this.userunScubReqData['filter']['chapterIds'] = [this.chapterId];
    console.log(this.chapterId)
    this.reqData['filter']['chapterIds'] = [this.chapterId];

    this.currentTab = tab;
    //this.reqData['filter']['chapterIds'] = [this.chapterId];

    console.log("tab",this.currentTab)
    if (this.currentTab == 'dashboard') {
      setTimeout(() =>  {
        this.dashboardSubject.next(null);
      },400);
    }
    if (this.currentTab == 'newsletters-list') {

      this.newsletterListSubject.next(null);
    }
    if (this.currentTab == 'news-subscribers') {
      this.newSubscriberSubject.next(null);
    }
    if (this.currentTab == 'people') {
      this.peopleSubject.next(null);
    }
  }

  getNewsletterId() {
    //this.reqDataPerId['filter']['viewed'] = true;
    this.getNewsLetterDetail();

  }
  getNewsLetterDetail() {
    this.spinner.show();
    let request = {
      path: "notification/newsLetter/details/" + this.reqDataPerId['filter']['newsLetterId'],
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.spinner.hide();
        this.newsLetterDetail = response['data'];
        this.getNewsletterViewDetail();
        this.getNewsletterViewTotalDetail();
        $('#openModel').click();
        this.modalRef.hide();
      } else {
        this.toastrService.error(response['status']['description']);
        this.spinner.hide();
      }
    });
  }

  getNewsletterViewDetail() {
    this.spinner.show();
    let request = {
      path: 'notification/notification/getAll/viewer',
      data: this.reqDataPerId,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.newsletterDetail = response['data'];
        let member_length = this.newsletterDetail['content'].length;
        let page_no = this.reqDataPerId.page.pageNumber;
        if (member_length == 0) {
          if (page_no != 0) {
            this.reqDataPerId.page.pageNumber = page_no - 1;
            this.getNewsletterViewDetail();
          }
        }
        this.newsletterDetail['content'].forEach((item, index) => {
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
        this.totalPagesPerId = pagination.arrayTwo(this.newsletterDetail['totalPages'], this.reqDataPerId.page.pageNumber);
        this.totalNewsLetterViewMember =response['data']['totalElements'];
        console.log("sdfdf",this.totalNewsLetterViewMember);
        this.spinner.hide();
      } else {
        this.toastrService.error(response['status']['description']);
        this.spinner.hide();
      }
    });
  }
  closeModel(){
    this.viewSearch=""
    delete(this.reqDataPerId['filter']['viewed'])
    this.reqDataPerId['page']['pageNumber'] =0;
    this.reqDataPerId['filter']['search'] = this.viewSearch;
    this.modalRef.hide();

  }

  getNewsletterViewTotalDetail() {
    this.rewDataViewTotal['filter']['newsLetterId']=this.reqDataPerId['filter']['newsLetterId'];
    this.rewDataViewTotal['filter']['viewed'] = true;
    let request = {
      path: 'notification/notification/getAll/viewer',
      data: this.rewDataViewTotal,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
      this.totalViewNewsMember = response['data']['totalElements'];
      }
    });
  }

  pagination(type, data, current = null) {
    if (data == 'user') {
      if (type == 'prev') {
        this.reqDataPerId.page.pageNumber = this.reqDataPerId.page.pageNumber - 1;
      } else if (type == 'current') {
        this.reqDataPerId.page.pageNumber = current;
      } else {
        this.reqDataPerId.page.pageNumber = this.reqDataPerId.page.pageNumber + 1;
      }
      this.getNewsletterViewDetail();
      document.getElementById("page_form").scrollIntoView();

    }
  }

  changeTabForDetail(event) {
    this.reqDataPerId['page'] = {
      "pageLimit": 10,
      "pageNumber": 0
    };
    // if (event == 1) {
    //  delete this.reqDataPerId['filter']['viewed'];
    //   this.getNewsletterViewDetail();
    // }
    // if (event == 0) {
    //   this.reqDataPerId['filter']['viewed'] = true;
    //   this.getNewsletterViewDetail();
    // }
    this.getNewsletterViewDetail();

  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'performance-newsletter modal-lg' })
    );
  }
}
