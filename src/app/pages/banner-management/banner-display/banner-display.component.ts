import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { SpinnerService } from "../../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, Subscription } from "rxjs";
import { startWith } from "rxjs/internal/operators/startWith";
import { map } from "rxjs/operators";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthImagesPipe } from '../../../pipes/auth-images.pipe';

@Component({
  selector: 'app-banner-display',
  templateUrl: './banner-display.component.html',
  styleUrls: ['./banner-display.component.scss'],
  providers:[AuthImagesPipe],
})
export class BannerDisplayComponent implements OnInit {
  modalRef: BsModalRef;
  chapterList: any = [];
  colorList: any = [];
  bannerDataForm: FormGroup;
  bannerTypes: any = [];
  bannerDetail: any = [];
  imageList: any = [];
  mediaUploadUrl = "community/file/upload/file";
  bannerList: any = [];
  mediaType: any = [];
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  imageUrl = '';
  thumbnailUrl = '';
  isEdit: boolean = false;
  isSubmit: boolean = false;
  bannerId = '';
  banner: any = [];
  validTypes = ['jpeg', 'jpg', 'png', 'mp4', 'wmv', 'avi', 'mkv']
  maxFileSize = 20;
  isImage: boolean = false;
  isVideo: boolean = false;
  deletedUrls: any = [];

  selectAllChapter: boolean = false;
  myselectchapter = [];
  backgroundImage:any;
  constructor(private pipe: AuthImagesPipe,private modalService: BsModalService, private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

    this.route.params.subscribe(params =>
      this.bannerId = params['id']
    );

    this.bannerDataForm = this.formBuilder.group({
      chapterId: ['', Validators.required],
      bannerType: ['', Validators.required],
      details: [''],
      intervalTime: ['', Validators.required]
    })

    this.colorList = {
      "buttonColor": {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      },
      "buttonTextColor": {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      },
      "nameColor": {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      },
      "textColor": {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      }
    };
  }

  async ngOnInit() {
    await this.getChapterList();
    await this.getBannerType();
    await this.getMediaType();

    if (this.bannerId != undefined) {
      await this.getBannerDetail();
      if (this.banner != null) {
        this.bannerDataForm.patchValue({
          chapterId: this.banner.chapterId,
          bannerType: this.banner.bannerType,
          details: this.banner.details,
          intervalTime: this.banner.intervalTime
        })
        if (this.banner['bannerList'] != null) {
          this.banner['bannerList'].forEach((item,index) => {
          console.log(item)

          this.bannerList.push(item);


          })



        }
      }
    }

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );


  }

  getChapterList() {
    let request = {
      path: "community/chapters/access",
      isAuth: true,
    };
    this.apiService.get(request).subscribe((response) => {
      this.chapterList = response["data"];
      if (this.chapterList[0]) {
        this.myselectchapter = this.chapterList["0"]["id"];
      }
      if (this.chapterList.length == 1) {
        this.bannerDataForm.patchValue({
          chapterId: [this.myselectchapter]
        });
      }
    });
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getBannerType() {
    let request = {
      path: 'community/bannerType/getAll',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.bannerTypes = response['data'];
        this.options = [];
        this.bannerTypes.forEach((item, index) => {
          this.options.push(item.name);
        });
        resolve(null);
      });
    });
  }

  getMediaType() {
    let request = {
      path: 'community/mediaType',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.mediaType = response['data'];
        resolve(null);
      });
    });
  }

  getBannerDetail() {
    let request = {
      path: "community/banner/details/" + this.bannerId,
      isAuth: true
    }

    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.banner = response['data'];

        resolve(null);
      });
    });
  }

  saveBanner() {
    this.isSubmit = true
    if (this.bannerDataForm.valid) {
      let data = {};
      data = this.bannerDataForm.value;
      if (this.bannerDataForm.value.intervalTime != 0) {
        data['bannerList'] = this.bannerList;

        if (this.deletedUrls.length != 0) {
          data['deletedBannerList'] = this.deletedUrls;
        }

        let request = {}
        if (this.bannerId != '' && this.bannerId != undefined) {
          request = {
            path: "community/banner/" + this.bannerId,
            data: data,
            isAuth: true
          }
        }
        else {
          request = {
            path: "community/banner",
            data: data,
            isAuth: true
          }
        }

        this.apiService.post(request).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            this.isSubmit = false;
            this.modalRef.hide();
            this.bannerDataForm.reset();
            this.router.navigate(['/banner-management-list']);
          }
          else {
            this.toastrService.error(response['status']['description']);
            this.isSubmit = false;
          }
        });
      }
      else {
        this.toastrService.error("Please enter valid rotation time")
      }
    }
    else {
      this.toastrService.error("Please fill all required fields!");
    }
  }

  saveBannerDetail() {

    if (this.imageList[0] != undefined) {
      if (this.bannerDetail.bannerType != undefined) {
        if (!this.isEdit) {
          let list = {};

          let image = '';
          if (this.imageList[0] != undefined) {
            image = this.imageList[0]['responseData']['data']['url'];
          }

          list['bannerDisplayText'] = this.bannerDetail.bannerDisplayText;
          list['bannerName'] = this.bannerDetail.bannerName;
          list['bannerType'] = this.bannerDetail.bannerType;
          list['bannerUrl'] = image;
          list['buttonAction'] = this.bannerDetail.buttonAction;
          list['buttonText'] = this.bannerDetail.buttonText;
          list['buttonColor'] = this.colorList['buttonColor'];
          list['buttonTextColor'] = this.colorList['buttonTextColor'];
          list['nameColor'] = this.colorList['nameColor'];
          list['textColor'] = this.colorList['textColor'];
          list['disable'] = false;

          this.bannerList.push(list);


          this.bannerDetail = [];
          this.imageList = [];
          $('#closeModal').click();
        }
        else {
          let image = '';
          if (this.imageList[0] != undefined) {
            image = this.imageList[0]['responseData']['data']['url'];
            this.bannerDetail['bannerUrl'] = image;
          }

          this.bannerList.map((item, index) => {
            if (this.bannerDetail['index'] == index) {
              item = this.bannerDetail;
            }
          })
          this.banner['bannerList'].forEach((item,index) => {
            console.log(item)
            this.backgroundImage = this.pipe.transform(item.bannerUrl);

            if (item.bannerUrl.indexOf(item.bannerUrl) !== -1) {
              this.banner['bannerList'][index]['bannerUrl'] = this.backgroundImage;
            } else {
              this.banner['bannerList'][index]['bannerUrl'] = item.bannerUrl;
            }


            })

          this.bannerDetail = [];
          this.isEdit = false;
          this.modalRef.hide();
          $('#closeModal').click();
        }
      }
      else {
        this.toastrService.error("Media Type is required");
      }
    }
    else {
      this.toastrService.error("Please upload banner!");
    }
  }

  editBanner(bannerDetail, index) {

    this.colorList = {
      "buttonColor": {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      },
      "buttonTextColor": {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      },
      "nameColor": {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      },
      "textColor": {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      }
    };
    this.isEdit = true;

    if (bannerDetail['bannerType'] == 'IMAGE') {
      this.isImage = true;
      this.isVideo = false;
    }
    else if (bannerDetail['bannerType'] == 'VIDEO') {
      this.isImage = false;
      this.isVideo = true;
    }

    this.bannerDetail = bannerDetail;
    this.bannerDetail['index'] = index;
    this.imageUrl = bannerDetail.bannerUrl;
    this.thumbnailUrl = bannerDetail.bannerThumbnailUrl;
    if (bannerDetail['buttonColor'] != null) {
      this.colorList['buttonColor'] = bannerDetail['buttonColor']
    } else {
      bannerDetail['buttonColor'] = {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      }
    }
    if (bannerDetail['buttonTextColor'] != null) {
      this.colorList['buttonTextColor'] = bannerDetail['buttonTextColor'];
    } else {
      bannerDetail['buttonTextColor'] = {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      }
    }
    if (bannerDetail['nameColor'] != null) {
      this.colorList['nameColor'] = bannerDetail['nameColor'];
    } else {
      bannerDetail['nameColor'] = {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      }
    }
    if (bannerDetail['textColor'] != null) {
      this.colorList['textColor'] = bannerDetail['textColor'];
    } else {
      bannerDetail['textColor'] = {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      }
    }

    let image = [];
    if (bannerDetail.bannerUrl != '') {
      image.push(bannerDetail.bannerUrl);
    }

    image.forEach((item, index) => {
      this.imageList[index] = [];
      this.imageList[index]['responseData'] = [];
      this.imageList[index]['responseData']['data'] = [];
      this.imageList[index]['responseData']['data']['url'] = item;
    });
    $('#openModel').click();
  }

  deleteBanner(index) {
    this.bannerList.splice(index, 1);
  }

  removeBanner() {
    this.deletedUrls.push({link: this.imageUrl, thumbnailLink: this.thumbnailUrl});
    this.imageList = [];
    this.imageUrl = '';
    this.thumbnailUrl = '';
  }

  onChange(event, index) {
    this.bannerList.map((item, i) => {
      if (index == i) {
        item['disable'] = !event;
      }
    })
  }

  onSelectionChange(value) {
    if (value == 'IMAGE') {
      this.isImage = true;
      this.isVideo = false;
    } else if (value == 'VIDEO') {
      this.isImage = false;
      this.isVideo = true;
    }
  }

  resetForm() {

    this.bannerDetail = [];
    this.imageUrl = '';
    this.thumbnailUrl = '';
    this.imageList = [];
    this.colorList = {
      "buttonColor": {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      },
      "buttonTextColor": {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      },
      "nameColor": {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      },
      "textColor": {
        "backgroundColorCode": "",
        "foregroundColorCode": "",
        "name": ""
      }
    };
  }

  invalidUploadFile() {
    this.toastrService.error('Please upload vaild file');
  }

  maxFileError() {
    this.toastrService.error('Maximum 1 file is allowed');
  }

  fileSizeError() {
    this.toastrService.error('Maximum 20MB size allowed');
  }

  uploadStarted() {
    this.spinner.show();
  }

  queueCompleted() {

  }

  imageQueueCompleted() {
    if (this.imageList[0] != undefined) {
      this.imageUrl = this.imageList[0]['responseData']['data']['url'];
      this.thumbnailUrl = this.imageList[0]['responseData']['data']['thumbnailUrl']
    }
    this.spinner.hide();
  }

  uploadedFilesChange() {
    //this.imageUrl = '';
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  openModalWithClass1(template1: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template1,
      Object.assign({}, { class: 'modal-lg bannerpopup-right bannerdisply' })
    );
  }

  changeChapterSelection(list) {
    if (list.length == this.chapterList.length) {
      this.selectAllChapter = true;
    } else {
      this.selectAllChapter = false;
    }
  }

  // selectAllChange(event) {
  //   if (event.checked) {
  //     this.selectAllChapter = true;
  //     let array = [];
  //     this.chapterList.forEach((item, index) => {
  //       array.push(item.id);
  //     });
  //     this.bannerDataForm.patchValue({
  //       chapterId: array,
  //     });
  //   } else {
  //     this.selectAllChapter = false;
  //     this.bannerDataForm.patchValue({
  //       chapterId: null,
  //     });
  //   }
  // }
}
