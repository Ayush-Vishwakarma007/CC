import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SpinnerService } from "../../../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../../services/api.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gallery-all',
  templateUrl: './gallery-all.component.html',
  styleUrls: ['./gallery-all.component.scss']
})
export class GalleryAllComponent implements OnInit {

  @Input()
  imageData = [];

  @Input()
  galleryName = ''

  @Input()
  galleryId = ''

  mediaForm: FormGroup;
  modalRef: BsModalRef;
  validTypesImage = ['jpeg', 'jpg', 'png'];
  validTypesVideo = ['mp4'];
  mediaTypeList: any = [];
  imageList: any = [];
  videoList: any = [];
  uploadedImageList: any = [];
  uploadedVideoList: any = [];
  deletedIds: any = [];
  mediaUploadUrl = "gallery/uploadMedia";
  isSubmit: boolean = false;
  isShow: boolean = false;
  youTubeLink = '';
  isLink: boolean = false;
  authDetail: any = [];

  constructor(private modalService: BsModalService, public formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.mediaForm = this.formBuilder.group({
      mediaType: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.getMediaType()
  }

  getMediaType() {
    let request = {
      path: 'gallery/mediaType',
      isAuth: true
    }

    this.apiService.get(request).subscribe(response => {
      this.mediaTypeList = response['data']
    });
  }

  submit() {
    this.isSubmit = true
    if (this.mediaForm.valid) {

      for(var j=0;j<this.imageList.length;j++) {

      let formData = this.mediaForm.value

      if (this.imageList[j] != undefined && this.mediaForm.value.mediaType == 'IMAGE') {

      
        formData['link'] = this.uploadedImageList[j]['link'];
        formData['thumbnailLink'] = this.uploadedImageList[j]['thumbnailLink'];
       
      }

      else if (this.videoList[j] != undefined && this.mediaForm.value.mediaType == 'VIDEO') {
        formData['link'] = this.uploadedVideoList[j]['link'];
      }
      else if (this.youTubeLink != '' && this.mediaForm.value.mediaType == 'YOUTUBE') {
        formData['link'] = this.youTubeLink;
      }
      else {
        if (this.mediaForm.value.mediaType == 'IMAGE' || this.mediaForm.value.mediaType == 'VIDEO') {
          this.toastrService.error('Please upload the file')
        }
        else {
          this.toastrService.error('Please enter youtube link')
        }
        return false;
      }

      formData['highPriority'] = false;
      formData['galleryId'] = this.galleryId;
      
     let request:any = [];
      // for(var i = 0; i<this.imageList.length; i++) {
        request = {
          path: 'gallery/media',
          data: formData,
          isAuth: true,

      }
      //  request = {
      //   path: 'gallery/media',
      //   data: formData,
      //   isAuth: true
        // }
      // }
      console.log(this.imageList.length);
      // for(var i = 0; i<this.imageList.length; i++) {
      this.apiService.post(request).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.isSubmit = false;
          this.isLink = false;
          this.isShow = false;
          this.imageList = [];
          this.videoList = [];
          this.uploadedImageList = [];
          this.uploadedVideoList = [];
          this.mediaForm.reset();
          this.modalRef.hide();
        }
        else {
          this.isSubmit = false;
          this.toastrService.error(response['status']['description']);
        }
      });
    // }
  }
    }
    else {
      this.toastrService.error('Please fill all required fields')
    }
    
  }

  removeImage(index, list) {
    this.imageList.splice(index, 1);
    this.uploadedImageList.splice(index, 1);
    if (list.id) {
      this.deletedIds.push(list.id);
     
    }
    else {
      this.removeMedia(list.link, list.thumbnailLink);
     
    }
    console.log("removed");
  }

  removeVideo(index, list) {
    this.videoList.splice(index, 1);
    this.uploadedVideoList.splice(index, 1);
    console.log(this.uploadedVideoList);
    if (list.id) {
      this.deletedIds.push(list.id);
    } else {
      this.removeMedia(list.link, list.thumbnailLink);
    }
  }
  removeMedia(list, type = '') {
    console.log("del ",list);
    let data = {}
    if (type == 'IMAGE') {
      data = {
        "link": list.link,
        "thumbnailLink":list.thumbnailLink
      }
    } else {
      data = {
        "link": list.link,
        "thumbnailLink": list.thumbnailLink
      }
    }

    console.log('data',data);
    let request = {
      path: 'gallery/deleteMedia',
      data: data,
      isAuth: true
    }

    this.apiService.post(request).subscribe(response => {
      console.log('response',response)
    });
  }

  onSelectionChange(mediaType) {
    if (mediaType == 'IMAGE') {
      this.isShow = false;
      this.isLink = false;
    }
    else if (mediaType == 'VIDEO') {
      this.isShow = true;
      this.isLink = false;
    }
    else if (mediaType == 'YOUTUBE') {
      this.isShow = false;
      this.isLink = true;
    }
  }

  loginRedirect() {
    let url = '/gallery';
    localStorage.setItem('eventUrl', url);
    this.router.navigate(['/login'])
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg modal-dialog-centered popop-common-center' })
    );
  }

  invalidUploadFile() {
    this.toastrService.error('Please upload only image file');
  }

  invalidVideoUploadFile() {
    this.toastrService.error('Please upload only video file');
  }
  maxFileErrorImage(){
    this.toastrService.error('Maximum 5 file is allowed');

  }
  maxFileError() {
    this.toastrService.error('Maximum 3 file is allowed');
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

  imageQueueCompleted() {
    let last = [];
    last.push(this.imageList);
    this.uploadedImageList = [];
    this.imageList.map((item) => {
      this.uploadedImageList.push({ link: item['responseData']['data']['url'], thumbnailLink: item['responseData']['data']['thumbnailUrl'] });
    });
    this.spinner.hide();
  }

  videoQueueCompleted() {
    let last = [];
    last.push(this.videoList[this.videoList.length - 1]);
    this.uploadedVideoList = [];
    this.videoList.map((item) => {
      this.uploadedVideoList.push({ link: item['responseData']['data']['url'] });
    });
    this.spinner.hide();
  }


  uploadedFilesChange() {
  }

  formReset() {
    this.isSubmit = false;
    this.isLink = false;
    this.isShow = false;
    this.imageList = [];
    this.videoList = [];
    this.uploadedImageList = [];
    this.uploadedVideoList = [];
    this.mediaForm.reset();
  }

  

}
