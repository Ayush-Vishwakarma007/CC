import {Component, OnInit, TemplateRef} from '@angular/core';
import grapesjs from 'grapesjs';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SpinnerService} from "../../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dynamic-page-management',
  templateUrl: './dynamic-page-management.component.html',
  styleUrls: ['./dynamic-page-management.component.scss']
})
export class DynamicPageManagementComponent implements OnInit {
  modalRef: BsModalRef;
  mediaUploadUrl = "event/uploadPicture";
  type = '';
  editor: any;
  blockManager: any;
  submitBtn = true;
  mediaList: any = [];
  pageForm: FormGroup;
  pageType: any = [];
  pageId = '';
  pageTypeId = true;
  menuDetail: any = [];
  pageDetail: any = [];

  constructor( private modalService: BsModalService, private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.pageForm = this.formBuilder.group({
      banner: [''],
      content: [''],
      name: ['', Validators.required],
      pageTitle: ['', Validators.required],
      pageType: ['', Validators.required],
      path: ['', Validators.required,  ],
      metaDescription: ['', Validators.required],
      metaKeyword: ['', Validators.required],
      metaTitle: ['', Validators.required],
      siteTitle: ['', Validators.required],
      menuType: [''],
    });
    this.route.params.subscribe(params =>
      this.pageId = params['id']
    );
  }

  ngOnInit() {
    this.getPageType();
    if (this.pageId != undefined) {
      this.getPageDetail();
    }else{
      this.setUpEditor();
    }
    this.pageForm.patchValue({

      path: '/'
   });

  }

  specificLength = 1;
  eventHandler(event){
    if(event.target.value.length == this.specificLength && (event.code == "Backspace" || event.code == "Delete")){
      return false;
    }

    return true;
   }
  getPageDetail() {
    let request = {
      path: 'uiPermission/uiPage/details/' + this.pageId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.pageDetail = response['data'];
      this.pageForm.patchValue({
        banner: this.pageDetail.banner,
        content: this.pageDetail.content,
        name: this.pageDetail.name,
        pageTitle: this.pageDetail.pageTitle,
        pageType: this.pageDetail.pageType,
        path: this.pageDetail.path,
        metaDescription: this.pageDetail.seoDetails.metaDescription,
        metaKeyword: this.pageDetail.seoDetails.metaKeyword,
        metaTitle: this.pageDetail.seoDetails.metaTitle,
        siteTitle: this.pageDetail.siteTitle,
        menuType: this.pageDetail.menuType,
      });
      this.setUpEditor();
    });
  }


  submitInformation(name) {
    this.spinner.show();
    console.log(this.mediaList.length);

    if (this.pageForm.value.pageType == 'IMAGE_HEADER' && this.mediaList.length == 0) {
      this.toastrService.error("Please Upload Banner Image");
      this.submitBtn = false;
      this.spinner.hide();
      return false;
    }
    this.pageForm.patchValue({
      content: this.editor.runCommand('gjs-get-inlined-html')
    });

    if (this.pageForm.valid) {
      this.submitBtn = true;
      let formData = this.pageForm.value;
      let data = {};
      if (this.mediaList.length != 0) {
        formData['banner'] = this.mediaList[0]['responseData']['data']['imageUrl'];
      }
      formData['seoDetails'] = {};
      formData['seoDetails']['metaDescription'] = this.pageForm.value.metaDescription;
      formData['seoDetails']['metaKeyword'] = this.pageForm.value.metaKeyword;
      formData['seoDetails']['metaTitle'] = this.pageForm.value.metaTitle;

      if (this.pageId != undefined) {
        data = {
          path: "uiPermission/uiPage/" + this.pageId,
          data: formData,
          isAuth: true
        };
      } else {
        data = {
          path: "uiPermission/uiPage",
          data: formData,
          isAuth: true
        };
      }
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.pageDetail = response['data'];
          this.pageId = this.pageDetail.id;
          this.spinner.hide();
          this.modalRef.hide();
          $('#closeModel').click();
          this.submit();
          if (name == 'redirect'){
            this.router.navigate(['/management/page-management']);
        }
          //this.pageId = response['data']['id'];
        } else {
          this.toastrService.error(response['status']['description']);
          this.submitBtn = false;
          this.spinner.hide();
        }
      });
    } else {
      this.toastrService.error("Please fill all required fields!");
      this.submitBtn = false;
      this.spinner.hide();
    }
  }

  submit() {
    let data = {};
    this.getMenuList(this.pageTypeId);

   /* if (this.pageId != '') {
      setTimeout(() => {
        if (this.pageTypeId == true) {
          data['currentMenuStatus'] = 'DISABLE';
          data['nextMenuStatus'] = 'ENABLE';
        } else {
          data['currentMenuStatus'] = 'ENABLE';
          data['nextMenuStatus'] = 'DISABLE';
        }
        data["menuId"] = this.menuDetail[0]['id'];
        data["menuItemId"] = this.pageId;
        data["position"] = -1;

        this.spinner.show();
        let request = {
          path: 'uiPermission/subMenu/updatePosition',
          data: data,
          isAuth: true,
        };
        this.apiService.post(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            this.spinner.hide();
          } else {
            this.toastrService.error(response['status']['description']);
            this.spinner.hide();
          }

        });
      }, 300);

    }*/
  }

  getPageType() {
    let request = {
      path: 'uiPermission/pageType',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.pageType = response['data'];
    });
  }

  getMenuList(value) {
    let formData = {
      allowChange: value
    };

    let data = {
      path: "uiPermission/menu/getAll/",
      data: formData,
      isAuth: true
    };
    this.type = value;

    this.apiService.post(data).subscribe(response => {
      this.menuDetail = response['data'];
    });
  }
  setUpEditor() {
    this.editor = grapesjs.init({
      container: '#gjs',
      height: '810px',
      storageManager: {type: 'none'},
      plugins: ['gjs-blocks-basic', 'gjs-preset-newsletter'],
      assetManager: {
        assets: [],
        uploadFile: (e) => {
          let files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
          let form = new FormData();
          form.append("file", files[0]);
          let postData = {
            path: "event/uploadPicture",
            data: form,
            isAuth: true
          };
          this.spinner.show();
          this.apiService.postImage(postData).subscribe((res) => {
            if (res['data'] == null) {
              this.toastrService.error(res['status']['description']);
            } else {
              this.editor.AssetManager.add(res['data']['imageUrl']);
            }
            this.spinner.hide();
          });
        }
      }
    });
    if (this.pageId == undefined) {
      this.editor.addComponents(`<div style="width: 90%;height: 100%;margin: 0 auto 10px auto;padding: 5px 5px 5px 5px;"></div>`);
    } else {
      this.editor.addComponents(this.pageDetail.content);
    }    this.blockManager = this.editor.BlockManager;
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

  openModalWithClass(template1: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template1,
      Object.assign({}, { class: 'modal-lg add-donation newsletterpopup popop-common-center page-information-popup' })
    );
  }
}
