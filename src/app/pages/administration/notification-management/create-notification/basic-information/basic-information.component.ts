import {Component, OnInit, Input, OnDestroy,TemplateRef, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl  } from '@angular/forms';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from '../../../../../services/spinner.service';
import { Subject, Subscription, firstValueFrom } from "rxjs";
import grapesjs from 'grapesjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SidebarLayoutToggleService } from '../../../../../services/sidebar-layout-toggle.service';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import Quill from 'quill';
import { type } from 'os';
import { formatMoment } from 'ngx-bootstrap/chronos/format';
import { configuration } from 'src/app/configration';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss']
})
export class BasicInformationComponent implements OnInit, OnDestroy ,AfterViewInit{

  @Input()
  notificationId = "";

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;

  @Input() templateName = "";

  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();

  @Output() basicInfoIdChange: EventEmitter<any> = new EventEmitter();
  @Output() basicInformationChange: EventEmitter<any> = new EventEmitter();

  _basicInfoId: any;
  quill: Quill;
  htmlContent = '';

  @Input()
  get basicInfoId() {
    return this._basicInfoId;
  }

  set basicInfoId(value) {
    this._basicInfoId = value;
    this.basicInfoIdChange.emit(value);
  }

  _basicInformation: any;

  @Input()
  get basicInformation() {
    return this._basicInformation;
  }

  set basicInformation(value) {
    this._basicInformation = value;
    this.basicInformationChange.emit(value);
  }

  basicInformationForm: FormGroup;
  notificationTypeList: any = [];
  notificationTypes: any = [];
  startDate = new Date();
  dateList: any = [];
  checked: boolean = true;
  isSubjectShow: boolean = true;
  isMessageEditor: boolean = true;
  isMessageTextArea: boolean = false;
  isAttachment: boolean = true;
  isSubmit: boolean = false;
  emailMessage: any;
  pushSmsMessage: any;
  mainIndex = 0;
  

  mediaUploadUrl = "notification/uploadFile";
  imageList: any = [];
  documentList: any = [];
  scheduleList: any = [];
  disableMessage = "";

  quillConfiguration = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      ['link', 'image', 'code-block']
    ],
  };

  
  // editorConfig: AngularEditorConfig = {
  //   editable: true,
  //   spellcheck: true,
  //   height: 'auto',
  //   minHeight: '25rem',
  //   maxHeight: 'auto',
  //   placeholder: 'Enter text here...',
  //   translate: 'no',
  //   defaultParagraphSeparator: 'p',
  //   defaultFontName: 'Arial',
  // };
  editor: any;
  editorContent='';
  blockManager: any;
  modalRef: BsModalRef;
  constructor( private modalService: BsModalService, private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, public toastrService: ToastrService, public sidebarService: SidebarLayoutToggleService) {
    this.basicInformationForm = this.formBuilder.group({
      notificationTypes: [''],
      subject: ['', Validators.required],
      attachments: [null],
      quickJobExecution: [''],
      message: [''],

      // imageUploader: {
      //   customUploader: (file: File, editor: Quill, next: () => void) => {
      //     const imagePath = 'http://example.com/images/'; // Replace with your image path
      //     const formData = new FormData();
      //     formData.append('image', file);
      //     formData.append('path', imagePath); // Pass the image path along with the file data
    
      //     // Open a dialog box to prompt the user to enter a custom URL
      //     const url = window.prompt('Enter the URL of the image (optional)');
      //     if (url) {
      //       // If the user entered a URL, add it to the formData object
      //       formData.append('url', url);
      //     }
    
      //     // Send the image data to the server
      //       fetch('/api/upload-image', {
      //         method: 'POST',
      //         body: formData
      //       })
      //         .then(response => response.json())
      //         .then(data => {
      //           // Insert the image into the Quill editor
      //           const range = editor.getSelection(true);
      //           editor.insertEmbed(range.index, 'image', data.url);
      //           next();
      //         })
      //         .catch(error => {
      //           console.error(error);
      //           next();
      //         });
      //   }
      // }
    })

    this.notificationTypes = ["EMAIL"];
  }

  async ngOnInit() {
    window.scrollTo( 0 , document.body.scrollHeight);
    this.sidebarService.setMenu(true);
    await this.getNotificationTypes();
    if (this.basicInformation != '') {
      this.basicInformationForm.patchValue({
        subject: this.basicInformation.subject,
        attachments: this.basicInformation.attachments,
        quickJobExecution: this.basicInformation.quickJobExecution,
        message: this.basicInformation.message
      });
      window.scroll(0, 0);
      this.emailMessage = this.basicInformation.message;
      this.pushSmsMessage = this.basicInformation.message;
      //  this.setUpNewsLetter();

      if (this.basicInformation.attachments != null) {
        let arrayDoc = [];
        this.basicInformation.attachments.forEach((item, index) => {
          arrayDoc.push(item);
        });

        arrayDoc.forEach((item, index) => {
          this.documentList[index] = [];
          this.documentList[index]['responseData'] = [];
          this.documentList[index]['responseData']['data'] = [];
          this.documentList[index]['responseData']['data']['url'] = item;
        });
      }
      // console.log("Doc",this.documentList)
      let arrayDate = [];
      this.basicInformation.schedules.forEach((item, index) => {
        if (item.executed == false && item.canceled == false) {
          arrayDate.push(item);
        }
        else if (item.executed == true) {
          this.scheduleList.push({ date: item.scheduleDate, status: 'Executed' })
        }
        else if (item.canceled == true) {
          this.scheduleList.push({ date: item.scheduleDate, status: 'Canceled' })
        }
      })

      arrayDate.forEach((item, index) => {
        this.dateList[index] = [];
        this.dateList[index]['date'] = [];
        this.dateList[index]['date'] = item['scheduleDate'];
      });
    }

    this.saveSubscription = this.save.subscribe(async () => {
      this.isSubmit = true;
      if (this.basicInformationForm.valid) {
        let request = {};
        let formData = this.basicInformationForm.value;
        console.log("FormData: ", formData)
        if (this.documentList != null || this.documentList != '') {
          let docArray = [];
          docArray = this.documentList;
          let otherDoc = [];
          docArray.forEach((item, index) => {
            console.log("documentList",item)
            if (item['responseData']['data']['imageUrl']['attachmentUrl']) {
              otherDoc.push({ attachmentUrl: item['responseData']['data']['imageUrl']['attachmentUrl'], fileName: item['responseData']['data']['imageUrl']['fileName'] });
            }
            else {
              otherDoc.push({ attachmentUrl: item['responseData']['data']['imageUrl'], fileName: item['name'] });
            }
          });
          formData['attachments'] = otherDoc;
          this.basicInformationForm.patchValue({
            attachments: otherDoc
          });
        }

        formData['notificationTypes'] = this.notificationTypes;
        formData['notificationFilterType'] = this.templateName;
        if (this.basicInformationForm.value.quickJobExecution == false) {
          if (this.dateList.length != 0) {
            let dates = [];
            this.dateList.map(item => {
              if (item.date != '') {
                dates.push({ scheduleDate: item.date });
              }
            })
            formData['schedules'] = dates;
            if (formData['schedules'].length == 0) {
              this.toastrService.error('Select one Date!');
              return false;
            }
          }
          else {
            this.toastrService.error('Add at least one Date!')
            return false;
          }
        } else {
          formData['schedules'] = [];
        }
        if (formData['notificationTypes'] == 'EMAIL') {
          formData['message'] = this.emailMessage;
        }
        else {
          formData['message'] = this.pushSmsMessage;
        }

        let messageContent = await this.changeImageFormat(formData['message']);
        console.log("Message Content: ",messageContent);

        var count = (messageContent.match(/base64,/g) || []).length; 
        for (let index = 0; index < count; index++) {
          messageContent = this.changeImageFormat(messageContent);
        }
        formData['message'] = messageContent;
        console.log("Message Data: ",formData['message']);
        
        if (this.notificationId != '' && this.notificationId != undefined) {
          request = {
            path: "notification/notification/basic/" + this.notificationId,
            data: formData,
            isAuth: true
          };
        } else {
          request = {
            path: "notification/notification/basic",
            data: formData,
            isAuth: true
          };
        }

        this.apiService.post(request).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.basicInfoIdChange.emit(response['data']['id']);
            this.basicInformationChange.emit(response['data']);
            this.toastrService.success(response['status']['description']);
            this.isSubmit = false;
            this.completed.emit();
            this.next.emit();
          }
          else {
            this.toastrService.error(response['status']['description']);
            this.isSubmit = false;
          }
        })
      }
      else {
        this.toastrService.error('Fill all the required fields')
      }
    })
  }
  ngAfterViewInit() {

  }

  async changeImageFormat(value: any){
    let currValue = value;

    if (currValue.includes("base64,")) {

      let startingValue, endingValue, contentType, b64Data: string;
      let val: string[];

      val = currValue.split("data:");

      startingValue = val[0];

      contentType = val[1].split(";base64,")[0];
      b64Data = val[1].split("\">")[0];

      const blobFile = this.b64toBlob(b64Data, contentType);
      const fileDataRes = await this.uploadOnServer(blobFile).then(res => { return res  }).catch(err => { return err })
      if (fileDataRes['status']['code'] == "OK") {
        let fileUrl = fileDataRes.data.fileUrl;
        let fileKey = startingValue.concat(`${configuration.BASE_URL}/auth/file/view?fileKey=${fileUrl}"`);
        let entireEndStr: string = '';
        entireEndStr = fileKey.concat(endingValue)
        for (let index = 2; index < val.length; index++) {
          entireEndStr = entireEndStr.concat(`"data:${val[index]}`)
        }
        let newendingValue = entireEndStr;
        let finalValue = newendingValue
        this.mainIndex++
        if (finalValue.includes("base64,")) {
          currValue = finalValue;
        } else {
          currValue = finalValue;
          this.spinner.hide();
        }
      } else {
        this.toastrService.error(fileDataRes['status']['description']);
        return null;
      }
    }
    return currValue;    
  }

  b64toBlob = (b64Data, contentType = '', sliceSize = 512): Blob => {
    const byteCharacters = atob(b64Data.split("base64,")[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  async uploadOnServer(file: Blob) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let imgEndVal: string = '';
    for (let index = 0; index < 10; index++){
      imgEndVal = imgEndVal.concat(characters.charAt(Math.floor(Math.random() * characters.length)))
    }
    let formData = new FormData();
    formData.append("file", file, `image_${imgEndVal}`);

    let request = {
      path: "auth/file/upload",
      data: formData,
      isAuth: true,
    };

    return await firstValueFrom(this.apiService.postImage(request));
  }

  
  //SHOULD BE REMOVED
  logContent(){
    console.log("Image String: ", this.emailMessage);
  }

  setUpNewsLetter(status= false){
    console.log('jjj');
    this.editor = grapesjs.init({
      container: '#gjs',
      height: '90vh',
      storageManager: {type: 'none'},
      plugins: ['gjs-blocks-basic', 'gjs-preset-newsletter' ,],
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
    if(status == false){
      if (this.notificationId == undefined) {
        this.editor.addComponents(`<div style="width: 90%;height: 100%;margin: 0 auto 10px auto;padding: 5px 5px 5px 5px;"></div>`);
      } else {
        this.editor.addComponents(this.emailMessage);
      }
    }

    this.blockManager = this.editor.BlockManager;
  }

  getNotificationTypes() {

    let request = {
      path: "notification/notificationTypes",
      isAuth: true
    }
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.notificationTypeList = response['data'];
          this.notificationTypeList.map((t, index) => {
            if (index == 0) {
              t.active = true;
            }
          })
          console.log(this.notificationTypeList);
        }
        resolve(null);
      })
    });
  }

  setType(list) {
    this.isSubmit = false;
    let type = [];
    this.notificationTypeList.map((item) => {
      if (item['value'] == list.value) {
        list['active'] = true;
        type.push(item['value']);
      }
      else{
        item['active'] = false;
      }
    });

    this.notificationTypes = type;

    if (list['subject']) {
      this.isSubjectShow = true;
    }
    else {
      this.isSubjectShow = false;
    }

    if (list.value == 'EMAIL') {
      this.isMessageEditor = true;
      this.isMessageTextArea = false;
    }
    else {
      this.isMessageEditor = false;
      this.isMessageTextArea = true;
    }

    if (list.value == 'EMAIL') {
      this.isAttachment = true;
    }
    else {
      this.isAttachment = false;
    }
    setTimeout(()=>{
      //this.setUpNewsLetter()
    },2000)

  }

  getDisableMessage(list){
    this.disableMessage = list.disableMessage;
    
    $('#exampleModalinfo').click();
  }

  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
    this.sidebarService.setMenu(true);
  }

  addDate() {
    this.dateList.push({ date: '' });
  }

  removeDate(i) {
    this.dateList.splice(i, 1);
  }

  invalidUploadFile() {
    this.toastrService.error('Please upload vaild file');
  }

  maxFileError() {
    this.toastrService.error('Maximum 4 files allowed');
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

  openModalWithInfo(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'info modal-lg infomainpopup shortdiscription'})
    );
    
  }
  
  
  uploadStarted() {
    //this.isFileUploading=true;
  }

  queueCompleted() {

  }

  documentQueueCompleted() {

  }

  imageQueueCompleted() {

  }

  
}
