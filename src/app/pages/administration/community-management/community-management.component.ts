import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { SpinnerService } from "../../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { EMAIL_PATTERN } from "../../../helpers/validations";

@Component({
  selector: 'app-community-management',
  templateUrl: './community-management.component.html',
  styleUrls: ['./community-management.component.scss']
})
export class CommunityManagementComponent implements OnInit {
  modalRef: BsModalRef;
  mediaUploadUrl = "event/uploadPicture";
  submitBtn = true;
  mediaList = [];
  communityDetail: any = [];
  socialMediaList: any = [];
  communityBranding: any = [];
  fontList: any = [];
  colorList: any = [];
  widgetsList: any = [];
  selectedWidgetsList: any = [];
  editorConfig = {
    "editable": true,
    "spellcheck": true,
    "minHeight": "250px",
    "height": "250px",
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

  email = new FormControl('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]);
  phone = new FormControl('', [Validators.required, Validators.minLength(10)]);


  constructor(private modalService: BsModalService, private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.communityDetail.basicInformation = [];
    //this.communityDetail.aboutCommunity = [];

  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md commu-manage animated fadeinright' })
    );
  }

  async ngOnInit() {
    this.socialMediaList.push({ "icon": '', "link": '', "name": '', 'img': [] });
   /* this.mediaList['about'] = [];
    this.mediaList['about']['main'] = [];
    this.mediaList['about']['other'] = [];*/
    this.mediaList['seo'] = [];
    this.mediaList['logo'] = [];
    this.mediaList['logo2'] = [];
    this.mediaList['poweredByLogo'] = [];
    this.mediaList['thankYouImageLink'] = [];
    this.colorList = {
      "primaryColor": {
        "backgroundColorCode": "string",
        "foregroundColorCode": "string",
        "name": "string"
      },
      "secondaryColor": {
        "backgroundColorCode": "string",
        "foregroundColorCode": "string",
        "name": "string"
      }
    };
    await this.getWidgetsList();
    this.getFontDetail();
    this.getCommunityDetail();
  }

  getCommunityDetail() {
    let request = {
      path: '/community/community',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.communityDetail = response['data'];

      this.widgetsList.forEach((item, index) => {
        if (this.communityDetail[item.key] == null) {
          this.communityDetail[item.key] = false;
        }
        this.widgetsList[index]['check'] = this.communityDetail[item.key];
      });

      if (this.communityDetail['basicInformation'].socialMediaList != null) {
        this.socialMediaList = this.communityDetail['basicInformation'].socialMediaList;
      }
      this.socialMediaList.forEach((item, index) => {
        item['img'] = [];
        item['img'][0] = [];
        item['img'][0]['responseData'] = [];
        item['img'][0]['responseData']['data'] = [];
        item['img'][0]['responseData']['data']['imageUrl'] = item['icon'];
      });
      /*if (!this.communityDetail.aboutCommunity) {
        this.communityDetail.aboutCommunity = [];
      }*/
      let logo = [];
      if (this.communityDetail['basicInformation'].logo['url'] != '') {
        logo.push(this.communityDetail['basicInformation'].logo['url']);
      }
      logo.forEach((item, index) => {
        this.mediaList['logo'][index] = [];
        this.mediaList['logo'][index]['responseData'] = [];
        this.mediaList['logo'][index]['responseData']['data'] = [];
        this.mediaList['logo'][index]['responseData']['data']['imageUrl'] = item;
      });

      let logo2 = [];
      if (this.communityDetail['basicInformation'].logo2 != null) {
        if (this.communityDetail['basicInformation'].logo2['url'] != '') {
          logo2.push(this.communityDetail['basicInformation'].logo2['url']);
        }
        logo2.forEach((item, index) => {
          this.mediaList['logo2'][index] = [];
          this.mediaList['logo2'][index]['responseData'] = [];
          this.mediaList['logo2'][index]['responseData']['data'] = [];
          this.mediaList['logo2'][index]['responseData']['data']['imageUrl'] = item;
        });
      }

      let poweredByLogo = [];
      if (this.communityDetail['basicInformation'].poweredByLogo['url'] != '') {
        poweredByLogo.push(this.communityDetail['basicInformation'].poweredByLogo['url']);
      }
      poweredByLogo.forEach((item, index) => {
        this.mediaList['poweredByLogo'][index] = [];
        this.mediaList['poweredByLogo'][index]['responseData'] = [];
        this.mediaList['poweredByLogo'][index]['responseData']['data'] = [];
        this.mediaList['poweredByLogo'][index]['responseData']['data']['imageUrl'] = item;
      });
/*
      let aboutMain = [];
      if (this.communityDetail['aboutCommunity']['bannerUrl'] != '') {
        aboutMain.push(this.communityDetail['aboutCommunity']['bannerUrl']);
      }
      aboutMain.forEach((item, index) => {
        this.mediaList['about']['main'][index] = [];
        this.mediaList['about']['main'][index]['responseData'] = [];
        this.mediaList['about']['main'][index]['responseData']['data'] = [];
        this.mediaList['about']['main'][index]['responseData']['data']['imageUrl'] = item;
      });

      this.communityDetail['aboutCommunity']['imageUrls'].forEach((item, index) => {
        this.mediaList['about']['other'][index] = [];
        this.mediaList['about']['other'][index]['responseData'] = [];
        this.mediaList['about']['other'][index]['responseData']['data'] = [];
        this.mediaList['about']['other'][index]['responseData']['data']['imageUrl'] = item;
      });
*/

      let seo = [];
      if (this.communityDetail['basicInformation']['favIcon'] != '') {
        seo.push(this.communityDetail['basicInformation']['favIcon']);
      }
      seo.forEach((item, index) => {
        this.mediaList['seo'][index] = [];
        this.mediaList['seo'][index]['responseData'] = [];
        this.mediaList['seo'][index]['responseData']['data'] = [];
        this.mediaList['seo'][index]['responseData']['data']['imageUrl'] = item;
      });

      let thankYouImageLink = [];
      if (this.communityDetail['basicInformation']['thankYouImageLink'] != '') {
        thankYouImageLink.push(this.communityDetail['basicInformation']['thankYouImageLink']);
      }
      thankYouImageLink.forEach((item, index) => {
        this.mediaList['thankYouImageLink'][index] = [];
        this.mediaList['thankYouImageLink'][index]['responseData'] = [];
        this.mediaList['thankYouImageLink'][index]['responseData']['data'] = [];
        this.mediaList['thankYouImageLink'][index]['responseData']['data']['imageUrl'] = item;
      });

      this.colorList = {
        "primaryColor": this.communityDetail['basicInformation']['primaryColor'],
        "secondaryColor": this.communityDetail['basicInformation']['secondaryColor']
      };
      this.communityBranding['font'] = '';
      let font = '';
      if (this.communityDetail['basicInformation']['font']) {
        this.fontList.filter((item, index) => {

          if (item.id == this.communityDetail['basicInformation']['font'].id) {
            font = index;
          }
        });
      }

      this.communityBranding['font'] = font;
    });
  }

  getFontDetail() {
    let request = {
      path: '/community/font/getAll',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.fontList = response['data'];
    });
  }

  getWidgetsList() {
    let request = {
      path: 'community/configuration/getWidgets',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.widgetsList = response['data'];
      });
      resolve(null);
    });
  }

  onChange() {
    let wlist = [];
    this.widgetsList.map((item) => {
      if (item['check'] && item['check'] == true) {
        wlist[item['key']] = item['check'];
      } else {
        wlist[item['key']] = false;
      }
    });
    this.selectedWidgetsList = wlist;
  }

  submitChange() {
    let formData = JSON.stringify(Object.assign({}, this.selectedWidgetsList))
    let request = {
      path: 'community/community/update',
      data: formData,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.modalRef.hide();
        this.getCommunityDetail();
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  submit() {
    let phone = this.communityDetail.basicInformation.phone;
    if(phone) {
      if (phone.length === 0) {
        phone = '';
      } else if (phone.length <= 3) {
        phone = phone.replace(/^(\d{0,3})/, '($1)');
      } else if (phone.length <= 6) {
        phone = phone.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
      } else if (phone.length <= 10) {
        phone = phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
      } else {
        phone = phone.substring(0, 10);
        phone = phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
      }
    }
    console.log(phone)
    let list = {};
    list['basicInformation'] = {};

    let socialMediaList = [];
    socialMediaList = this.socialMediaList.filter(item => item.name !== '' && item.link !== '' &&
      item.img.length != 0);
    socialMediaList.map((item, index) => {
      item['icon'] = item['img'][0]['responseData']['data']['imageUrl'];
    });

    /*let aboutCommunity = {};
    aboutCommunity['imageUrls'] = [];
    aboutCommunity['bannerUrl'] = '';
    if (this.mediaList['about']['main'].length != 0) {
      aboutCommunity['bannerUrl'] = this.mediaList['about']['main'][0]['responseData']['data']['imageUrl'];
    }
    if (this.communityDetail.aboutCommunity.details) {
      aboutCommunity['details'] = this.communityDetail.aboutCommunity.details;
    }
    this.mediaList['about']['other'].map((item, index) => {
      aboutCommunity['imageUrls'].push(item['responseData']['data']['imageUrl']);
    });*/


    let logo = {};
    if (this.mediaList['logo'].length != 0) {
      logo['url'] = this.mediaList['logo'][0]['responseData']['data']['imageUrl'];
      logo['name'] = 'logo';
    }

    let logo2 = {};
    if (this.mediaList['logo2'].length != 0) {
      logo2['url'] = this.mediaList['logo2'][0]['responseData']['data']['imageUrl'];
      logo2['name'] = 'logo';
    }


    let seoImg = '';
    if (this.mediaList['seo'].length != 0) {
      seoImg = this.mediaList['seo'][0]['responseData']['data']['imageUrl'];
    }

    let thankYouImageLink = '';
    if (this.mediaList['thankYouImageLink'].length != 0) {
      thankYouImageLink = this.mediaList['thankYouImageLink'][0]['responseData']['data']['imageUrl'];
    }
    let poweredByLogo = {};
    if (this.mediaList['poweredByLogo'].length != 0) {
      poweredByLogo['url'] = this.mediaList['poweredByLogo'][0]['responseData']['data']['imageUrl'];
      poweredByLogo['name'] = 'Powered By Logo';
    }

    let font = this.fontList[this.communityBranding['font']];
    list['basicInformation'] = this.communityDetail.basicInformation;
    list['basicInformation']['name'] = this.communityDetail.basicInformation.name;
    list['basicInformation']['slogan'] = this.communityDetail.basicInformation.slogan;
    list['basicInformation']['description'] = this.communityDetail.basicInformation.description;
    list['basicInformation']['addressLine1'] = this.communityDetail.basicInformation.addressLine1;
    list['basicInformation']['addressLine2'] = this.communityDetail.basicInformation.addressLine2;
    list['basicInformation']['city'] = this.communityDetail.basicInformation.city;
    list['basicInformation']['state'] = this.communityDetail.basicInformation.state;
    list['basicInformation']['country'] = this.communityDetail.basicInformation.country;
    list['basicInformation']['zipcode'] = this.communityDetail.basicInformation.zipcode;
    list['basicInformation']['email'] = this.communityDetail.basicInformation.email;
    list['basicInformation']['phone'] = phone;
    list['basicInformation']['fax'] = this.communityDetail.basicInformation.fax;
    list['basicInformation']['socialMediaList'] = socialMediaList;
    list['basicInformation']['font'] = font;
    list['basicInformation']['logo'] = logo;
    list['basicInformation']['logo2'] = logo2;
    list['basicInformation']['poweredByLogo'] =poweredByLogo;
    list['basicInformation']['phone'] = phone;
    list['basicInformation']['primaryColor'] = this.colorList['primaryColor'];
    list['basicInformation']['secondaryColor'] = this.colorList['secondaryColor'];
    list['basicInformation']['favIcon'] = seoImg;
    list['basicInformation']['seoImage'] = seoImg;
    list['basicInformation']['thankYouImageLink'] = thankYouImageLink;
    list['basicInformation']['seoKeywords'] = this.communityDetail.basicInformation.seoKeywords;
    list['basicInformation']['seoDescription'] = this.communityDetail.basicInformation.seoDescription;
    list['basicInformation']['seoTitle'] = this.communityDetail.basicInformation.seoTitle;
    list['androidAppLink'] = this.communityDetail.androidAppLink;
    list['iosAppLink'] = this.communityDetail.iosAppLink;

    list['nonProfitRegistrationNo'] = this.communityDetail.nonProfitRegistrationNo;
    list['basicInformation']['menuName'] = this.communityDetail.basicInformation.menuName;

    //list['aboutCommunity'] = aboutCommunity;
    list['alias'] = this.communityDetail.alias;

    let request = {
      path: 'community/community/update',
      data: list,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.getCommunityDetail();
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  addSocialMedia() {
    this.socialMediaList.push({ "icon": '', "link": '', "name": '', 'img': [] });
  }

  removeSocialMedia(i) {
    this.socialMediaList.splice(i, 1);
  }

  maxFileError() {
    this.spinner.hide();
    //this.notify.notifyUserError('Maximum 4 files allowed');
  }

  invalidUploadFile() {
    this.spinner.hide();
    //this.notify.notifyUserError('Please upload vaild file');
  }

  fileSizeError() {
    this.spinner.hide();
    //this.notify.notifyUserError('Maximum 4MB size allowed');
  }

  uploadStarted() {
    this.spinner.show();
    //this.isFileUploading=true;
  }

  queueCompleted() {
    this.spinner.hide();
  }
}
