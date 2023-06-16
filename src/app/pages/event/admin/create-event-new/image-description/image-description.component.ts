import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, Subscription} from "rxjs";
import {CommunityDetailsService} from "../../../../../services/community-details.service";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-image-description',
  templateUrl: './image-description.component.html',
  styleUrls: ['./image-description.component.scss']
})

export class ImageDescriptionComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  @Output() imageDescriptionChange: EventEmitter<any> = new EventEmitter();
  @Output() completed: EventEmitter<any> = new EventEmitter();
  imageDescriptionForm: FormGroup;
  tags = [];
  T_CDetail :any = {};
  communityDetail:any = [];
  tagName = "";
  mediaList: any = [];
  profilePicList: any = [];
  bannerPicList: any = [];
  documentList: any = [];
  pollList: any = [];
  validTypesImage = ['jpeg', 'jpg', 'png','PNG','JPG','JPEG'];
  mediaUploadUrl :any;
  mainImage = [];
  @Input()
  save: Subject<any>;
  @Input() eventId = "";
  saveSubscription: Subscription;
  submitBtn = true;
  response = [];
  defaultTC:any
  myModel=false


  editors :Editor;
  editor: Editor;
  toolbar: Toolbar = [
    ["bold", "italic", "underline"],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ["link"]

    // ['bold', 'italic'],
    // ['underline', 'strike'],
    // ['code', 'blockquote'],
    // ['ordered_list', 'bullet_list'],
    // [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    // ['link', 'image'],
    // ['text_color', 'background_color'],
    // ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  // editorConfig = {
  //   "editable": true,
  //   "spellcheck": true,
  //   "height": "auto",
  //   "minHeight": "250px",
  //   "width": "auto",
  //   "minWidth": "0",
  //   "translate": "yes",
  //   "enableToolbar": true,
  //   "showToolbar": true,
  //   "placeholder": "Enter text here...",
  //   "imageEndPoint": "",
  //   "toolbar": [
  //     ["bold", "italic", "underline"],
  //     [{'header': 1}, {'header': 2}],

  //     ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
  //     // ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
  //     // ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
  //     ["link"]

  //   ]
  // };

  constructor( private modalService: BsModalService, private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService,public communityService:CommunityDetailsService) {
    this.imageDescriptionForm = this.formBuilder.group({
      description: ['', Validators.required],
      otherPictures: [[]],
      profilePicture: [''],
      tags: [''],
      termsAndCondition: [''],
      bannerPicture: [''],
      otherDocuments: [[]],
      polls: [''],
      sortDescription: ['', Validators.required],
    });
  }

  _imageDescription: any;

  @Input()
  get imageDescription() {
    return this._imageDescription;
  }

  set imageDescription(value) {
    this._imageDescription = value;
    this.imageDescriptionChange.emit(value);
  }

  ngOnInit() {

    this.editors = new Editor();
    this.editor = new Editor();
    this.mediaUploadUrl="event/file/upload/file"
    if (this.imageDescription.description != undefined) {
      this.tags = this.imageDescription.tags;
      this.imageDescriptionForm.patchValue({
        description: this.imageDescription.description,
        otherPictures: this.imageDescription.otherPictures,
        profilePicture: this.imageDescription.profilePicture,
        tags: this.imageDescription.tags,
        termsAndCondition: this.imageDescription.termsAndCondition,
        otherDocuments: this.imageDescription.otherDocuments,
        polls: this.imageDescription.polls,
        sortDescription: this.imageDescription.sortDescription
      });
      if (this.imageDescription.polls.length != 0) {
        this.pollList = this.imageDescription.polls;
      }
      
      let array = [];
      this.imageDescription.otherPictures.forEach((item, index) => {
        array.push(item);
      });
      array.forEach((item, index) => {
        this.mediaList[index] = [];
        this.mediaList[index]['responseData'] = [];
        this.mediaList[index]['responseData']['data'] = [];
        this.mediaList[index]['responseData']['data']['imageUrl'] = item;
      });

      let banner = [];
      if (this.imageDescription.bannerPicture != '') {
        banner.push(this.imageDescription.bannerPicture);
      }
      banner.forEach((item, index) => {
        this.bannerPicList[index] = [];
        this.bannerPicList[index]['responseData'] = [];
        this.bannerPicList[index]['responseData']['data'] = [];
        this.bannerPicList[index]['responseData']['data']['imageUrl'] = item;
      });

      let profile = [];
      if (this.imageDescription.profilePicture != '') {
        profile.push(this.imageDescription.profilePicture);
      }

      profile.forEach((item, index) => {
        this.profilePicList[index] = [];
        this.profilePicList[index]['responseData'] = [];
        this.profilePicList[index]['responseData']['data'] = [];
        this.profilePicList[index]['responseData']['data']['imageUrl'] = item;
      });

      let arrayDoc = [];
      this.imageDescription.otherDocuments.forEach((item, index) => {
        arrayDoc.push(item);
      });

      arrayDoc.forEach((item, index) => {

        this.documentList[index] = [];
        this.documentList[index]['responseData'] = [];
        this.documentList[index]['responseData']['data'] = [];
        this.documentList[index]['responseData']['data']['imageUrl'] = item;
      });
    }
    this.saveSubscription = this.save.subscribe(() => {
      let detail = this.mediaList;
      this.imageDescriptionForm.patchValue({
        tags: this.tags,
      });
      let pollList = this.pollList.filter((item) => {
        if ($.trim(item['title']) != '' && $.trim(item['link']) != '') {
          return item;
        }
      })
      let profileImage = '';
      if (this.profilePicList[0] != undefined) {
        profileImage = this.profilePicList[0]['responseData']['data']['imageUrl'];
      }

      let bannerImage = '';
      if (this.bannerPicList[0] != undefined) {
        bannerImage = this.bannerPicList[0]['responseData']['data']['imageUrl'];
      }

      let imageArray = [];
      imageArray = this.mediaList;
      let other = [];
      imageArray.forEach((item, index) => {
        other.push(item['responseData']['data']['imageUrl']);
      });

      let docArray = [];
      docArray = this.documentList;
      let otherDoc = [];
      docArray.forEach((item, index) => {
        otherDoc.push(item['responseData']['data']['imageUrl']);
      });
      this.imageDescriptionForm.patchValue({
        polls: pollList
      });
      this.imageDescriptionForm.patchValue({
        profilePicture: profileImage
      });
      this.imageDescriptionForm.patchValue({
        bannerPicture: bannerImage
      });
      this.imageDescriptionForm.patchValue({
        otherPictures: other
      });
      this.imageDescriptionForm.patchValue({
        otherDocuments: otherDoc
      });
     // if (profileImage != '') {
        if (this.imageDescriptionForm.valid) {
          
          if(this.imageDescriptionForm.value.termsAndCondition=="" || this.imageDescriptionForm.value.termsAndCondition=="<br>")
          {
            this.myModel=true
           
            this.imageDescriptionForm.patchValue({
              termsAndCondition:this.communityService.communityDetail.eventTermsAndConditions
            });
          }
          this.submitBtn = true;
          let data = {};
          let formData = this.imageDescriptionForm.value;
          data = {
            path: "event/updateImages/" + this.eventId,
            data: formData,
            isAuth: true
          };
          this.apiService.post(data).subscribe(response => {
            if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
              this.toastrService.success(response['status']['description']);
              this.response = response['data'];
              this.mediaList = detail;
             // this.modalRef.hide();
              this.completed.emit();
            } else {
              this.toastrService.error(response['status']['description']);
              this.submitBtn = false;
            }
          });

        } else {
          this.toastrService.error("Please fill all required fields !");
          this.submitBtn = false;
        }
     /* } else {
        this.toastrService.error("Please upload profile picture !");
        this.submitBtn = false;
      }*/

    });

  }
  hideModal()
  {
    $('#hideModal').click();
  }

  addTag(e) {
    if ($.trim(e.value) != '') {
      this.tags.push($.trim(e.value));
      this.tagName = "";
      $('.mat-chip-input').val('');
    }

  }

  remove(i) {
    this.tags.splice(i, 1);
    // this.basicInformationForm.patchValue({
    //   tags: this.tags
    // });
  }

  invalidUploadFile() {
    this.toastrService.error('The picture must be a file of type: jpeg, jpg, png');
  }
  invalidUploadFile1() {
    this.toastrService.error('The picture must be a file of type: jpeg, jpg, png');
  }

  maxFileError() {
    this.toastrService.error('Maximum 5 files allowed');
  }
  maxFileError1() {
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
    //this.toastrService.error('Maximum 4MB size allowed');
  }

  uploadStarted() {
    //this.isFileUploading=true;
  }

  queueCompleted() {

  }

  bannerQueueCompleted() {

  }

  profileQueueCompleted() {

  }

  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }

  onChangeBanner(event) {
    if (event.checked == true) {
      this.bannerPicList = [];
      this.imageDescriptionForm.patchValue({
        bannerPicture: ''
      });
    }
  }

  addPoll() {
    this.pollList.push({title: '', link: ''});
  }

  removePoll(i) {
    this.pollList.splice(i, 1);
  }

  openModalTermCondition(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg infomainpopup' })
    );
  }
  closeNewsMol() {

    this.modalRef.hide();

  }
}
