import { Component, OnInit } from '@angular/core';
import { SpinnerService } from "../../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { SeoService } from "../../../services/seo.service";
// import { EmbedVideoService } from 'ngx-embed-video';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-gallery-media-detail',
  templateUrl: './gallery-media-detail.component.html',
  styleUrls: ['./gallery-media-detail.component.scss']
})
export class GalleryMediaDetailComponent implements OnInit {

  galleryDetailId = '';
  galleryDetail: any = [];
  imageList: any = [];
  videoList: any = [];
  reqData: any = [];
  galleryMedia: any = [];
  checkedItemsIds: any = [];
  selectedAllTrace: boolean = false;
  selectedAllRestore: boolean = false;
  approvedMediaList: any = [];
  rejectedMediaList: any = [];
  userMediaDetail: any = [];

  constructor(public spinner: SpinnerService, public formBuilder: FormBuilder, private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, private seo: SeoService, private sanitizer: DomSanitizer, 
    // private embedService: EmbedVideoService
    ) {
    this.route.params.subscribe(params =>
      this.galleryDetailId = params['id']
    );

    this.reqData = {
      "filter": {
        "galleryId": this.galleryDetailId
      },
      "page": {
        "pageLimit":8,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "MEDIA_TYPE"
      }
    }
  }

  ngOnInit() {
    this.getGalleryDetail();
    this.getGalleryMedia();
    this.getUserMediaDetail();
  }

  getGalleryDetail() {
    let request = {
      path: "gallery/gallery/detail/" + this.galleryDetailId,
      isAuth: true
    }

    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.galleryDetail = response['data'];
        //console.log(this.galleryDetail);
        resolve(null);
      });
    });
  }

  getGalleryMedia() {
    let request = {
      path: "gallery/medias",
      data: this.reqData,
      isAuth: true
    }

    return new Promise((resolve) => {
      this.apiService.post(request).subscribe(response => {
        this.galleryMedia = response['data']['content'];
        console.log(this.galleryMedia)
        this.galleryMedia.map((item) => {
          
          if (item['status'] == 'APPROVED') {
            if(item['mediaType'] == 'YOUTUBE'){
              // item['youtube_iframe'] = this.embedService.embed(item.link);
              item['youtube_iframe'] = this.sanitizer.bypassSecurityTrustResourceUrl(item.link);

           
              // console.log(this.embedService.embed(item.link))
              console.log(this.sanitizer.bypassSecurityTrustResourceUrl(item.link))
            }
            this.approvedMediaList.push(item);
           
          } else if (item['status'] == 'REJECTED') {
            if(item['mediaType'] == 'YOUTUBE'){
              // item['youtube_iframe'] = this.embedService.embed(item.link);
              item['youtube_iframe'] = this.sanitizer.bypassSecurityTrustResourceUrl(item.link);
            }
            this.rejectedMediaList.push(item);
          }
        })
        console.log(this.approvedMediaList);
        resolve(null);
      });
    });
  }
  getShortName(fullName) {
    return fullName.split(' ').map(n => n[0]).join('');
  }
  getCheckedItems(list, type) {
    if (list['checked']) {
      this.checkedItemsIds.push(list['id'])
    } else {
      let index = this.checkedItemsIds.indexOf(list['id']);
      this.checkedItemsIds.splice(index,1);
    }

    if (type == 'APPROVED') {
      if (this.checkedItemsIds.length == this.approvedMediaList.length) {
        this.selectedAllTrace = true;
      } else {
        this.selectedAllTrace = false;
      }
    } else if (type == 'REJECTED') {
      if (this.checkedItemsIds.length == this.rejectedMediaList.length) {
        this.selectedAllRestore = true;
      } else {
        this.selectedAllRestore = false;
      }
    }
  }

  selectAll(type) {
    if (type == 'TRACE') {
      this.approvedMediaList.forEach((item, index) => {
        if (this.selectedAllTrace == true) {
          item['checked'] = true;
          this.checkedItemsIds.push(item['id']);
        } else {
          item['checked'] = false;
          this.checkedItemsIds.splice(item['id'], 1);
        }
      });
    }
    else if (type == 'RESTORE') {
      this.rejectedMediaList.forEach((item, index) => {
        if (this.selectedAllRestore == true) {
          item['checked'] = true;
          this.checkedItemsIds.push(item['id']);
        } else {
          item['checked'] = false;
          this.checkedItemsIds.splice(item['id'], 1);
        }
      });
    }
  }
  onScroll(){
    this.reqData.page.pageNumber = this.reqData.page.pageNumber + 1;
    this.getGalleryMedia();

  }

  moveToTraceAndRestore(type) {
    if (this.checkedItemsIds.length != 0) {
      let data = {
        "ids": this.checkedItemsIds
      }

      let request = {};

      if (type == 'REJECTED') {
        request = {
          path: 'gallery/media/status/REJECTED',
          data: data,
          isAuth: true
        }
      } else if (type == 'APPROVED') {
        request = {
          path: 'gallery/media/status/APPROVED',
          data: data,
          isAuth: true
        }
      }
      else if (type == 'DELETE') {
        request = {
          path: 'gallery/media/delete',
          data: data,
          isAuth: true
        }
      }

      this.apiService.post(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.checkedItemsIds = [];
          this.approvedMediaList = [];
          this.reqData.page.pageNumber = 0;
          this.rejectedMediaList = [];
          this.selectedAllTrace = false;
          this.selectedAllRestore = false;
          this.getGalleryMedia();
        }
        else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
    else {
      this.toastrService.error('Select any media first');
    }
  }
  resetTab(){
    this.checkedItemsIds = [];
    this.approvedMediaList = [];
    this.reqData.page.pageNumber = 0;
    this.rejectedMediaList = [];
    this.selectedAllTrace = false;
    this.selectedAllRestore = false;
    this.getGalleryMedia();
  }
  getUserMediaDetail() {
    let request = {
      path: 'gallery/media/user/' + this.galleryDetailId,
      isAuth: true
    }

    this.apiService.get(request).subscribe(response => {
      this.userMediaDetail = response['data'];
    });
  }
}
