import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { SpinnerService } from "../../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { EMAIL_PATTERN } from "../../../helpers/validations";
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-chapter-management-edit',
  templateUrl: './chapter-management-edit.component.html',
  styleUrls: ['./chapter-management-edit.component.scss']
})
export class ChapterManagementEditComponent implements OnInit, OnDestroy {
  chapterId:any;
  mediaUploadUrl = "event/file/upload/file";
  chapterDetails =[];
  submitBtn = true;
  mediaList = [];
  communityDetail: any = [];
  socialMediaList: any = [];
  chapterBranding: any = [];
  fontList: any = [];
  colorList: any = [];
  widgetsList: any = [];
  selectedWidgetsList: any = [];
  details :any =[];
  about:any =[];
  editor : Editor

  // toolbar: Toolbar = [
  //   ['bold', 'italic'],
  //   ['underline', 'strike'],
  //   ['code', 'blockquote'],
  //   ['ordered_list', 'bullet_list'],
  //   [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5'] }],
  //   ['link', 'image'],
  //   ['text_color', 'background_color'],
  //   ['align_left', 'align_center', 'align_right', 'align_justify'],
  // ];

  // editorConfig = {
  //   "editable": true,
  //   "spellcheck": true,
  //   "minHeight": "250px",
  //   "height": "250px",
  //   "width": "auto",
  //   "minWidth": "0",
  //   "translate": "yes",
  //   "enableToolbar": true,
  //   "showToolbar": true,
  //   "placeholder": "Enter text here...",
  //   "imageEndPoint": "",
  //   "toolbar": [
  //     ["bold", "italic", "underline"],
  //     [{ 'header': 1 }, { 'header': 2 }],

  //     ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
  //     // ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
  //     // ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
  //     ["link"]

  //   ]
  // };
  constructor(private modalService: BsModalService, private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
     }

  ngOnInit() {
    this.editor = new Editor();

    this.mediaList['about'] = [];
    this.mediaList['about']['main'] = [];
    this.mediaList['about']['other'] = [];
    this.mediaList['seo'] = [];
    this.mediaList['logo'] = [];
    this.mediaList['logo2'] = [];
    this.mediaList['chapterCommityimage'] = [];
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
    this.socialMediaList.push({ "icon": '', "link": '', "name": '', 'img': [] });
    this.route.params.subscribe((params) => {
      this.chapterId = params['id'];
    })

    this.getchapterDetails()
    this.getFontDetail();

  }
  ngOnDestroy() {
    this.editor.destroy();
  }
  getchapterDetails(){

    let request = {
      path: "community/chapter/details/" + this.chapterId,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.chapterDetails = response['data'];
      this.details['slogan'] = this.chapterDetails['basicInformation'].slogan;
      if(this.chapterDetails['basicInformation'].slogan == null){
        this.details['slogan'] ="";
      }
      this.details['addressLine1'] = this.chapterDetails['basicInformation'].addressLine1;
      if(this.chapterDetails['basicInformation'].addressLine1 == null){
        this.details['addressLine1'] ="";
      }
      this.details['addressLine2'] = this.chapterDetails['basicInformation'].addressLine2;
      if(this.chapterDetails['basicInformation'].addressLine2 == null){
        this.details['addressLine2'] ="";
      }
      this.details['city'] = this.chapterDetails['basicInformation'].city;
      if(this.chapterDetails['basicInformation'].city == null){
        this.details['city'] ="";
      }
      this.details['state'] =this.chapterDetails['basicInformation'].state;
      if(this.chapterDetails['basicInformation'].state == null){
        this.details['state'] ="";
      }
      this.details['zipcode'] = this.chapterDetails['basicInformation'].zipcode;1
      if(this.chapterDetails['basicInformation'].zipcode == null){
        this.details['zipcode'] ="";
      }
      this.details['fax'] = this.chapterDetails['basicInformation'].fax;
      if(this.chapterDetails['basicInformation'].fax == null){
        this.details['fax'] ="";
      }
      this.details['phone'] = this.chapterDetails['basicInformation'].phone;
      if(this.chapterDetails['basicInformation'].phone == null){
        this.details['phone'] ="";
      }
      this.details['email'] = this.chapterDetails['basicInformation'].email;
      if(this.chapterDetails['basicInformation'].email == null){
        this.details['email'] ="";
      }
      this.details['country'] =this.chapterDetails['basicInformation'].country;
      if(this.chapterDetails['basicInformation'].country == null){
        this.details['country'] ="";
      }
      this.details['seoDescription'] =this.chapterDetails['basicInformation'].seoDescription;
      if(this.chapterDetails['basicInformation'].seoDescription == null){
        this.details['seoDescription'] ="";
      }
      this.details['seoKeywords'] =this.chapterDetails['basicInformation'].seoKeywords;
      if(this.chapterDetails['basicInformation'].seoKeywords == null){
        this.details['seoKeywords'] ="";
      }
      this.details['seoTitle'] =this.chapterDetails['basicInformation'].seoTitle;
      if(this.chapterDetails['basicInformation'].seoTitle == null){
        this.details['seoTitle'] ="";
      }
      this.details['comTitle'] =this.chapterDetails['committeePageDetails'].title;
      if(this.chapterDetails['committeePageDetails'].title == null){
        this.details['comTitle'] ="";
      }
      this.details['comDesc'] =this.chapterDetails['committeePageDetails'].description;
      if(this.chapterDetails['committeePageDetails'].description == null){
        this.details['comDesc'] ="";
      }
      if (this.chapterDetails['basicInformation'].socialMediaList != null) {
        this.socialMediaList = this.chapterDetails['basicInformation'].socialMediaList;
      }
      this.socialMediaList.forEach((item, index) => {
        item['img'] = [];
        item['img'][0] = [];
        item['img'][0]['responseData'] = [];
        item['img'][0]['responseData']['data'] = [];
        item['img'][0]['responseData']['data']['imageUrl'] = item['icon'];
      });


    let logo = [];
    if (this.chapterDetails['basicInformation'].logo['url'] == '' || this.chapterDetails['basicInformation'].logo['url'] ==null) {
    }else{
      logo.push(this.chapterDetails['basicInformation'].logo['url']);
    }
    logo.forEach((item, index) => {
      this.mediaList['logo'][index] = [];
      this.mediaList['logo'][index]['responseData'] = [];
      this.mediaList['logo'][index]['responseData']['data'] = [];
      this.mediaList['logo'][index]['responseData']['data']['imageUrl'] = item;
    });
    if (this.chapterDetails['aboutUs'] ==null) {
      this.chapterDetails['aboutUs'] = [];
      this.about['details']="";
    }else{
      this.about['details']=this.chapterDetails['aboutUs']['details'];
    }
    let logo2 = [];
    if (this.chapterDetails['basicInformation'].logo2 != null) {
      if (this.chapterDetails['basicInformation'].logo2['url'] == '' || this.chapterDetails['basicInformation'].logo2['url'] ==null) {
      }else{
        logo2.push(this.chapterDetails['basicInformation'].logo2['url']);
      }
      logo2.forEach((item, index) => {
        this.mediaList['logo2'][index] = [];
        this.mediaList['logo2'][index]['responseData'] = [];
        this.mediaList['logo2'][index]['responseData']['data'] = [];
        this.mediaList['logo2'][index]['responseData']['data']['imageUrl'] = item;
      });
    }
    if(this.chapterDetails['aboutUs'] ==null){}else{
    let aboutMain = [];
    if (this.chapterDetails['aboutUs']['bannerUrl'] ==null||this.chapterDetails['aboutUs']['bannerUrl'] =="") {
      console.log("dfff");
    }else{
      aboutMain.push(this.chapterDetails['aboutUs']['bannerUrl']);
    }
    aboutMain.forEach((item, index) => {
      this.mediaList['about']['main'][index] = [];
      this.mediaList['about']['main'][index]['responseData'] = [];
      this.mediaList['about']['main'][index]['responseData']['data'] = [];
      this.mediaList['about']['main'][index]['responseData']['data']['imageUrl'] = item;
    });

    this.chapterDetails['aboutUs']['imageUrls'].forEach((item, index) => {
      this.mediaList['about']['other'][index] = [];
      this.mediaList['about']['other'][index]['responseData'] = [];
      this.mediaList['about']['other'][index]['responseData']['data'] = [];
      this.mediaList['about']['other'][index]['responseData']['data']['imageUrl'] = item;
    });
  }
    let seo = [];
      if (this.chapterDetails['basicInformation']['favIcon'] != '') {
        seo.push(this.chapterDetails['basicInformation']['favIcon']);
      }
      seo.forEach((item, index) => {
        this.mediaList['seo'][index] = [];
        this.mediaList['seo'][index]['responseData'] = [];
        this.mediaList['seo'][index]['responseData']['data'] = [];
        this.mediaList['seo'][index]['responseData']['data']['imageUrl'] = item;
      });
      let chapterCommityimage = [];
      if (this.chapterDetails['committeePageDetails']['imageUrl'] != '') {
        chapterCommityimage.push(this.chapterDetails['committeePageDetails']['imageUrl']);
      }
      chapterCommityimage.forEach((item, index) => {
        this.mediaList['chapterCommityimage'][index] = [];
        this.mediaList['chapterCommityimage'][index]['responseData'] = [];
        this.mediaList['chapterCommityimage'][index]['responseData']['data'] = [];
        this.mediaList['chapterCommityimage'][index]['responseData']['data']['imageUrl'] = item;
      });

      let thankYouImageLink = [];
      if (this.chapterDetails['basicInformation']['thankYouImageLink'] != '') {
        thankYouImageLink.push(this.chapterDetails['basicInformation']['thankYouImageLink']);
      }
      thankYouImageLink.forEach((item, index) => {
        this.mediaList['thankYouImageLink'][index] = [];
        this.mediaList['thankYouImageLink'][index]['responseData'] = [];
        this.mediaList['thankYouImageLink'][index]['responseData']['data'] = [];
        this.mediaList['thankYouImageLink'][index]['responseData']['data']['imageUrl'] = item;
      });

      this.colorList = {
        "primaryColor": this.chapterDetails['basicInformation']['primaryColor'],
        "secondaryColor": this.chapterDetails['basicInformation']['secondaryColor']
      };

    // this.chapterBranding['font'] = '';
    // let font = '';
    //   if (this.chapterDetails['basicInformation']['font']) {
    //     this.fontList.filter((item, index) => {
    //
    //       if (item.id == this.chapterDetails['basicInformation']['font'].id) {
    //         font = index;
    //       }
    //     });
    //   }
    //
    //   this.chapterBranding['font'] = font;
    });
  }
  submit(){
    let list = {};
    list['basicInformation'] = {};

    let socialMediaList = [];
    socialMediaList = this.socialMediaList.filter(item => item.name !== '' && item.link !== '' &&
      item.img.length != 0);
    socialMediaList.map((item, index) => {
      item['icon'] = item['img'][0]['responseData']['data']['imageUrl'];
    });

    let aboutUs = {};
    aboutUs['imageUrls'] = [];
    aboutUs['bannerUrl'] = '';
    let allowAboutUs =false;
    if (this.mediaList['about']['main'].length != 0) {
      aboutUs['bannerUrl'] = this.mediaList['about']['main'][0]['responseData']['data']['imageUrl'];
    }
    console.log(this.about.details);
    if (this.about.details !="") {
      aboutUs['details'] = this.about.details;
      allowAboutUs = true;
    }else{
      aboutUs['details'] = "";
      allowAboutUs = false
    }
    if(aboutUs['imageUrls']!=""){
      allowAboutUs = true;
    }
    if(aboutUs['bannerUrl']!= ""){
      allowAboutUs = true;
    }
    this.mediaList['about']['other'].map((item, index) => {
      aboutUs['imageUrls'].push(item['responseData']['data']['imageUrl']);
    });

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
    let committeeImg = '';
    if (this.mediaList['chapterCommityimage'].length != 0) {
      committeeImg = this.mediaList['chapterCommityimage'][0]['responseData']['data']['imageUrl'];
    }
    //let font = this.fontList[this.chapterBranding['font']];
    list['basicInformation'] = this.chapterDetails['basicInformation'];
    list['description'] = this.chapterDetails['description'];
    list['name'] = this.chapterDetails['name'];
    list['alias'] = this.chapterDetails['alias'];
    list['level'] = this.chapterDetails['level'];
    list['onClickRedirect'] = this.chapterDetails['onClickRedirect'];
    list['displayPriority'] = this.chapterDetails['displayPriority'];
    list['redirectUrl'] = this.chapterDetails['redirectUrl'];
    list['nonProfitRegistrationNo'] =this.chapterDetails['nonProfitRegistrationNo'];
    list['basicInformation']['name'] = this.chapterDetails['name'];
    list['basicInformation']['slogan'] = this.details.slogan;
    list['basicInformation']['description'] = this.chapterDetails['description'];
    list['basicInformation']['addressLine1'] = this.details.addressLine1;
    list['basicInformation']['addressLine2'] = this.details.addressLine2;
    list['basicInformation']['city'] = this.details.city;
    list['basicInformation']['state'] = this.details.state;
    list['basicInformation']['country'] = this.details.country;
    list['basicInformation']['zipcode'] = this.details.zipcode;
    list['basicInformation']['email'] = this.details.email;
    list['basicInformation']['phone'] = this.details.phone;
    list['basicInformation']['fax'] = this.details.fax;
    list['basicInformation']['phone'] = this.details.phone;
    list['basicInformation']['socialMediaList'] = socialMediaList;
    //list['basicInformation']['font'] = font;
    list['basicInformation']['logo'] = logo;
    list['basicInformation']['logo2'] = logo2;
    list['basicInformation']['primaryColor'] = this.colorList['primaryColor'];
    list['basicInformation']['secondaryColor'] = this.colorList['secondaryColor'];
    list['basicInformation']['favIcon'] = seoImg;
    list['basicInformation']['seoImage'] = seoImg;
    list['basicInformation']['seoKeywords'] = this.details.seoKeywords;
    list['basicInformation']['seoDescription'] = this.details.seoDescription;
    list['basicInformation']['seoTitle'] = this.details.seoTitle;
    list['committeePageDetails'] = this.chapterDetails['committeePageDetails'];
    list['committeePageDetails']['title'] = this.details.comTitle;
    list['committeePageDetails']['description'] = this.details.comDesc;
    list['committeePageDetails']['imageUrl'] = committeeImg;
    list['allowAboutUs']=allowAboutUs;
    list['aboutUs'] = aboutUs;
    console.log(list);
    let request = {
      path: '/community/chapter/'+this.chapterId,
      data: list,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.router.navigate(['/management/chapter-management']);
      } else {
        this.toastrService.error(response['status']['description']);
      }
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

  addSocialMedia() {
    this.socialMediaList.push({ "icon": '', "link": '', "name": '', 'img': [] });
  }

  removeSocialMedia(i) {
    this.socialMediaList.splice(i, 1);
  }
  maxFileError() {
    this.spinner.hide();
    this.toastrService.error('Maximum 1 files allowed');
  }

  invalidUploadFile() {
    this.spinner.hide();
    //this.notify.notifyUserError('Please upload vaild file');
  }

  fileSizeError() {
    this.spinner.hide();
    let request = {
      path: 'community/configuration/publicInfo',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.toastrService.error('Maximum ' + response['data']['imageMaxSize'] + 'MB size is allowed');
    });
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
