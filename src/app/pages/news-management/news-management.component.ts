import { Component, OnInit, TemplateRef  } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {SpinnerService} from "../../services/spinner.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {ToastrService} from "ngx-toastr";
import {SeoService} from "../../services/seo.service";
import {Location, DatePipe} from '@angular/common';
import Swal from "sweetalert2";
import {pagination} from "../../pagination";
import {CommunityDetailsService} from "../../services/community-details.service";

@Component({
  selector: 'app-news-management',
  templateUrl: './news-management.component.html',
  styleUrls: ['./news-management.component.scss']
})
export class NewsManagementComponent implements OnInit {
  modalRef: BsModalRef;
  myselectchapter:[];
  totalNews:any;
  newsDetails :any=[];
  newsList :any=[];
  totalPages:any;
  deletedIds: any = [];
  chapterDetail:any =[];
  chapterId:any;
  newsForm:FormGroup;
  chapterIds: any = [];
  isSubmit: boolean = false;
  validTypesImage = ['jpeg', 'jpg', 'png'];
  maxFileSize = 25;
  mediaUploadUrl = "gallery/file/upload/file";
  imageList: any = [];
  newsId:any;
  reqData:any=[];
  btnName:any ="Add News";
  pagelimit:any=[];
  uploadedImageList: any = [];
  editorConfig = {
    "editable": true,
    "spellcheck": true,
    "minHeight": "200px",
    "height": "200px",
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

  constructor(public spinner: SpinnerService, private datePipe: DatePipe,private modalService: BsModalService, public formBuilder: FormBuilder, private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, private seo: SeoService,
    public communityService: CommunityDetailsService) {

    this.newsForm = this.formBuilder.group({
      newsId: [''],
      title: ['', Validators.required],
      sortDescription: ['',Validators.required],
      chapterId: ['', Validators.required],
      fullDescription: ['',Validators.required],
      date: ['',Validators.required],
      displayTill: ['', Validators.required],

    })
  }

  ngOnInit() {
    this.reqData = {
      "filter": {
      },
      "page": {
        "pageSize": this.communityService.pagelimit,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "START_DATE"
      }
    }
    this.getChapters();
  }

  saveNews(){
    this.isSubmit = true;
    this.spinner.show();
    console.log(this.newsForm.value,this.newsForm.valid)
    if (this.newsForm.valid) {
      let formValue = this.newsForm.value;
    let startDate = this.datePipe.transform(formValue['date'], 'yyyy-MM-dd');
    let endDate = this.datePipe.transform(formValue['displayTill'], 'yyyy-MM-dd');
    if (endDate < startDate) {
      this.spinner.hide();
      this.toastrService.error("Start date should be less than or equal to end date ");
      this.isSubmit = false;
    }else {
      console.log(this.imageList)

      console.log(this.imageList)
      if (this.imageList != '') {

        formValue['imageUrl'] = this.imageList[0]['responseData']['data']['url'];
        this.imageList.splice(0)
        console.log( formValue['imageUrl'])
      } if(this.uploadedImageList =='') {

       formValue['imageUrl'] = '';
      // console.log( formValue['imageUrl'])
      }
      let request = {}
      console.log(this.newsId);
      if (this.newsId != "" && this.newsId !=undefined) {
        request = {
          path: 'news/update/' + this.newsId,
          data: formValue,
          isAuth: true
        }
      } else {
        request = {
          path: 'news/create',
          data: formValue,
          isAuth: true
        }
      }
        console.log(request)
        this.apiService.post(request).subscribe(response => {
          this.isSubmit = false;
          this.spinner.hide();
          this.newsForm.reset();
          this.modalRef.hide();
          this.newsId='';
          this.getAllNewsList();
         this.uploadedImageList=[];
          this.btnName = "Add News";
        });
      }
    }else{
      this.toastrService.error('Please fill required field');
      this.spinner.hide();
    }
  }
  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }
  getChapters() {
    let request = {
      path: 'community/chapters/access',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.chapterDetail = response['data'];
        if (this.chapterDetail[0]) {
          this.myselectchapter = this.chapterDetail["0"]["id"];
        }
        if (this.chapterDetail.length == 1) {
          this.newsForm.patchValue({
            chapterIds: [this.myselectchapter],
            chapterId: this.myselectchapter,
          });
        }
        this.chapterDetail.forEach((item) => {
          this.chapterIds.push(item.id);
        })
        this.getNewsDetails(this.chapterDetail[0]['id']);

        resolve(null);
      });

    });
  }
  selected_pagelimit(event) {
    this.pagelimit=event.value
    console.log(this.pagelimit)
    this.reqData.page.pageLimit= this.pagelimit;
    console.log(this.reqData.page.pageLimit)
    this. getAllNewsList();

  }
  getNewsDetails(id){
    this.chapterId =id;
    this.getAllNewsList();
  }
  getAllNewsList(){
    this.reqData['filter']['chapterId'] = this.chapterId;
      let request = {
      path: "news/getNews",
      data: this.reqData,
      isAuth: true
    }

    return new Promise((resolve) => {
      this.apiService.post(request).subscribe(response => {
        this.newsList = response['data'];
        this.totalNews = response['data']['totalElements'];
        this.totalPages = pagination.arrayTwo(this.newsList['totalPages'], this.reqData.page.pageNumber);
        resolve(null);
      });
    });
  }
  editNews(id){
    this.newsId = id
    let request = {
      path: "news/details/" + id,
      isAuth: true
    }

    console.log(this.uploadedImageList)
    this.apiService.get(request).subscribe(response => {
      let newsDetails = response['data'];
      console.log(response)
      this.btnName = "Edit News";
      if(newsDetails['imageUrl']!="") {
        this.uploadedImageList.push({
          link: newsDetails['imageUrl'],
          thumbnailLink: newsDetails['imageUrl']

        });
        console.log(this.uploadedImageList)
        this.uploadedImageList =  this.uploadedImageList.filter((v,i) => this.uploadedImageList.findIndex(item => item.link == v.link) === i);
       // this.imageList=this.uploadedImageList
       console.log("check",this.uploadedImageList)
      }
      else{
        this.uploadedImageList=[]
        this.imageList=this.uploadedImageList
        console.log("asd")
      }
        this.newsForm.patchValue({
        title: newsDetails.title,
        chapterId: newsDetails.chapterId,
        sortDescription: newsDetails.sortDescription,
        date: newsDetails.date,
        fullDescription: newsDetails.fullDescription,
        displayTill: newsDetails.displayTill,


      })
      $('#openEditModel').click();
    });
  }
  deleteNews(id) {
    let message = '';
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this News!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "news/delete/" + id,
          isAuth: true,
        };
        this.apiService.get(request).subscribe(response => {
          console.log(response);
          if (response['response']['code'] == 'OK') {
            Swal.fire(
              'Deleted!',
              'News has been deleted.',
              'success'
            );
            this.getAllNewsList();
          } else {
            Swal.fire(
              'Cancelled',
              response['response']['description'],
              'error'
            );
          }

        }, error => {

          Swal.fire(
            'Cancelled',
            'News has been safe.',
            'error'
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'News has been safe.',
          'error'
        );
      }
    })
  }
  resetForm() {
    this.isSubmit = false;
    this.imageList = [];
    this.uploadedImageList = [];
    this.newsForm.reset();
    this.btnName ="Add News";
    this.modalRef.hide();
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
      this.getAllNewsList();
    }
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

  max1FileError() {
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
    this.spinner.show();
  }

  queueCompleted() {
  }
  removeImage(index, list) {
    this.imageList.splice(index, 1);
    this.uploadedImageList.splice(index, 1);
    console.log(this.uploadedImageList)


    if (list.id) {
      this.deletedIds.push(list.id);
    } else {
      this.removeUploadMedia(list.link, list.thumbnailLink);
    }
  }
  removeUploadMedia(link, thumbnailLink) {

    let data = {
      "link": link,
      "thumbnailLink": thumbnailLink
    }

    let request = {
      path: 'gallery/deleteMedia',
      data: data,
      isAuth: true
    }

    this.apiService.post(request).subscribe(response => {
    });
  }
  imageQueueCompleted() {
    console.log(this.imageList);
    let last = [];
    last.push(this.imageList[this.imageList.length - 1]);
    this.uploadedImageList = [];

    this.imageList.map((item, index) => {
      if (item['responseData']['data']['thumbnailUrl']) {
        this.uploadedImageList.push({
          link: item['responseData']['data']['url'],
          thumbnailLink: item['responseData']['data']['thumbnailUrl']
        });
      } else {
        this.uploadedImageList.push({
          link: item['responseData']['data']['url'],
          thumbnailLink: item['responseData']['data']['thumbnailLink'],
          id: item['responseData']['data']['id']
        });
      }
    });
    this.spinner.hide();
  }

  uploadedFilesChange() {
  }
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg edit-news' })
    );
  }

  openModalWithClassAdd(templateadd: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      templateadd,
      Object.assign({}, { class: 'gray modal-lg edit-news' })
    );
  }

}
