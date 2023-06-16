import {Component, EventEmitter, HostListener, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {SpinnerService} from "../../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {pagination} from 'src/app/pagination';
import Swal from "sweetalert2";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {CommunityDetailsService} from "../../../../services/community-details.service";
// import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';

@Component({
  selector: 'app-newsletter-list',
  templateUrl: './newsletter-list.component.html',
  styleUrls: ['./newsletter-list.component.scss']
})
export class NewsletterListComponent implements OnInit {
  modalRef: BsModalRef;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;

  @Input()
  reqData: any = [];
  newsletterList: any = [];
  totalPages: any = [];
  searchString: string = '';
  pagelimit1:any=[]
  search = '';
  chapterList: any = [];
  chapterId:any=[];
  @Output() newsletterDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() detailIdChange: EventEmitter<any> = new EventEmitter();

  _newsletterDetail: any;
  chapterIds: any = [];

  @Input()
  get newsletterDetail() {
    return this._newsletterDetail;
  }

  set newsletterDetail(value) {
    this._newsletterDetail = value;
    this.newsletterDetailChange.emit(value);
  }

  constructor(private modalService: BsModalService, private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService,
public communityService: CommunityDetailsService) {

  }

  async ngOnInit() {

    this.saveSubscription = this.save.subscribe(() => {
      this.search = '';

      this.reqData['page'] = {
       "pageLimit":this.communityService.pagelimit ,
        "pageNumber": 0

      };


      //console.log(this.communityService.pagelimit)
     // console.log("aaa",this.reqData)
      this.getNewsletterList();

    });
  }
  @HostListener('unloaded')
  ngOnDestroy() {
    this.saveSubscription.unsubscribe();
  }


  getNewsletterList(search = "") {

    this.spinner.show();
      if(this.search != '')
    {
      this.reqData['page']['pageNumber'] = 0
    }

    this.reqData['filter']['search'] = this.search;


    this.searchString = search;

    let request = {
      path: 'notification/newsLetter/getAll',
      data: this.reqData,
      isAuth: true,
    };
    //console.log("lol",request);
    this.apiService.post(request).subscribe(response => {


      if (response['status']['code'] == 'OK') {
        this.newsletterList = response['data'];
        //console.log("asd",this.newsletterList)
        let member_length = this.newsletterList['content'].length;
        //console.log("hello",member_length);
        let page_no = this.reqData.page.pageNumber;
        if (member_length == 0) {

          if (page_no != 0) {

            this.reqData.page.pageNumber = page_no - 1;
            this.getNewsletterList();
          }
        }
        this.totalPages = pagination.arrayTwo(this.newsletterList['totalPages'], this.reqData.page.pageNumber);
        this.spinner.hide();
      }
      else
      {
        this.toastrService.error(response['status']['description']);
        this.spinner.hide();
      }
    });

  }
  selected_pagelimit(event) {
    this.communityService.pagelimit=event.value

    this.reqData.page.pageLimit= this.communityService.pagelimit;

    this.getNewsletterList();

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
      window.scrollTo( 0 , 0);
      document.getElementById("news_form").scrollIntoView();
      this.getNewsletterList();
    }
  }

  sort(type) {
    if (type == 'name') {
      this.reqData['sort']['sortBy'] = 'NAME';
    } else if (type == 'date') {
      this.reqData['sort']['sortBy'] = 'DATE_TIME';
    }
    if (this.reqData['sort']['orderBy'] == 'ASC') {
      this.reqData['sort']['orderBy'] = 'DESC';
    } else if (this.reqData['sort']['orderBy'] == 'DESC') {
      this.reqData['sort']['orderBy'] = 'ASC';
    }
    this.getNewsletterList();
  }

  deleteNewsletter(id) {
    let message = '';
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this newsletter!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "notification/newsLetter/" + id,
          isAuth: true,
        };
        this.apiService.get(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Deleted!',
              'Newsletter has been deleted.',
              'success'
            );
            this.getNewsletterList();
          } else {
            Swal.fire(
              'Cancelled',
              response['status']['description'],
              'error'
            );
          }

        }, error => {

          Swal.fire(
            'Cancelled',
            'Newsletter has been safe.',
            'error'
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Newsletter has been safe.',
          'error'
        );
      }
    })
  }

  // getNewsletterDetail(id) {
  //   this.newsletterDetail['filter']["newsLetterId"] =id;
  //   this.detailIdChange.emit();
  // }
  getNewsletterDetail(id) {
    this.newsletterDetail['filter']["newsLetterId"] =id;
    this.detailIdChange.emit();
  }
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }
}
