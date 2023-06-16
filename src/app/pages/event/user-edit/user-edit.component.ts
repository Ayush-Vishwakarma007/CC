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
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  safeSrc: SafeResourceUrl;
  userId = '';
  galleryId = '';
  reqData: any = [];
  userMediaDetail: any = [];
  detail: any;
  checkedItemsIds: any = [];
  selectedAll: boolean = false;
  firstName = ''
  lastName = ''

  constructor(public spinner: SpinnerService, public formBuilder: FormBuilder, private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, private seo: SeoService, /*private embedService: EmbedVideoService*/ private sanitizer: DomSanitizer) {

    this.route.params.subscribe(params =>
      this.detail = params
    );
    this.userId = this.detail['id'];
    this.galleryId = this.detail['galleryId'];

    this.reqData = {
      "filter": {
        "userId": this.userId,
        "galleryId": this.galleryId,
        "status": "PENDING"
      },
      "page": {
        "pageLimit": 10,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "MEDIA_TYPE"
      }
    }
  }

  ngOnInit() {
    this.getUserMediaDetail();
  }

  getUserMediaDetail() {
    let request = {
      path: "gallery/medias",
      data: this.reqData,
      isAuth: true
    }

    return new Promise((resolve) => {
      this.apiService.post(request).subscribe(response => {
        this.userMediaDetail = response['data']['content'];
        if(this.userMediaDetail[0]){
          this.firstName = this.userMediaDetail[0].firstName;
          this.lastName = this.userMediaDetail[0].lastName
        }
        this.userMediaDetail.map((item) => {
          if(item['mediaType'] == 'YOUTUBE'){
              // item['youtube_iframe'] = this.embedService.embed(item.link);
              item['youtube_iframe'] = this.sanitizer.bypassSecurityTrustResourceUrl(item.link);
          }
        })
        console.log(this.userMediaDetail);
        resolve(null);
      });
    });
  }

  getCheckedItems(list) {
    if (list['checked']) {
      this.checkedItemsIds.push(list['id'])
    } else {
      this.checkedItemsIds.splice(list['id'], 1);
    }

    if (this.checkedItemsIds.length == this.userMediaDetail.length) {
      this.selectedAll = true;
    } else {
      this.selectedAll = false;
    }
  }

  selectAll() {
    this.userMediaDetail.forEach((item, index) => {
      if (this.selectedAll == true) {
        item['checked'] = true;
        this.checkedItemsIds.push(item['id']);
      } else {
        item['checked'] = false;
        this.checkedItemsIds.splice(item['id'], 1);
      }
    });
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

      this.apiService.post(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.checkedItemsIds = [];
          this.getUserMediaDetail();
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

}
