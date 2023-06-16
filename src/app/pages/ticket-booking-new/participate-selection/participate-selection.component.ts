import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ApiService } from "../../../services/api.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  ValidationErrors,
  FormArray,
} from "@angular/forms";
import { SpinnerService } from "../../../services/spinner.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
// import { EmbedVideoService } from "ngx-embed-video";
import { SeoService } from "../../../services/seo.service";
import { request } from "express";
import { Subject, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import index from '@angular/pwa/pwa';
// import {forEach} from "@angular/router/src/utils/collection";
@Component({
  selector: "app-participate-selection",
  templateUrl: "./participate-selection.component.html",
  styleUrls: ["./participate-selection.component.scss"],
})
export class ParticipateSelectionComponent implements OnInit {
  @Input() eventId: string;
  mediaUploadUrl = "gallery/file/upload/file";
  imageList: any = [];
  videoList: any = [];
  uploadedImageList: any = [];
  uploadedVideoList: any = [];
  totalAlbum: any;
  deletedIds: any = [];
  youTubeUrls: any = [];
  validTypesImage = ["jpeg", "jpg", "png"];
  validTypesVideo = ["mp4", "MP4"];
  maxFileSize: any;
  participate: any = [];
  performanceList: any[] = [{ title: "", duration: "" }];
  ParticipantList: any[] = [{ age: "", email: "", firstName: "" }];
  AddParticipant: FormGroup;
  Participant: FormGroup;
  _register: any;
  AddParti: boolean = false;
  value: boolean;
  paymentInfo: "";
  submitted: boolean;
  array: any;
  array1: any[] = [];
  optionList: any=[];
  checkEmailPattern:any
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() registerArraychange: EventEmitter<any> = new EventEmitter();
  @Output() completenext: EventEmitter<any> = new EventEmitter();
  @Output() skipvalue: EventEmitter<any> = new EventEmitter();
  @Output() patchedForm: EventEmitter<any> = new EventEmitter();
  @Input()
  get register() {
    return this._register;
  }

  set register(value) {
    this._register = value;
    this.registerArraychange.emit(value);
  }
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;

  patch: Subject<any>;
  patchSubscription: Subscription;

  reqData: any = [];
  constructor(
    public spinner: SpinnerService,
    public formBuilder: FormBuilder,
    public router: Router,
    public apiService: ApiService,
    private toastrService: ToastrService
  ) {
    this.reqData = {
      eventId: this.eventId,
      performance: this.value,
    };
  }
  ngOnInit() {
    this.saveSubscription = this.save.subscribe(() => {
      this.submit();
    });
    this.Participant = this.formBuilder.group({
      cfirstName: ["", [Validators.required]],
      clastName: ["", [Validators.required]],
      email: ["", [Validators.required]],
      performanceDuration: ["", [Validators.required]],
      eventName: ["", [Validators.required]],
      businessName: ["", [Validators.required]],
    });
    this.AddParticipant = this.formBuilder.group({
      participant: this.formBuilder.array([]),
    });
    this.getParticipate();
    //
    // if (localStorage.getItem("formDetails") == null && localStorage.getItem("formDetails1") == null) {
    //   localStorage.setItem(
    //     "formDetails",
    //     JSON.stringify(this.Participant.value)
    //   );
    //   localStorage.setItem(
    //     "formDetails1",
    //     JSON.stringify(this.optionList)
    //   );
    // }
    if (localStorage.getItem("formDetails") != null && localStorage.getItem("formDetails1") != null) {
      this.array = JSON.parse(localStorage.getItem("formDetails"));
      this.array1 = JSON.parse(localStorage.getItem("formDetails1"));
      this.patchForm(this.array);
      this.optionList =this.array1;
    }
  }

  // participant(): FormArray {
  //   return this.AddParticipant.get("participant") as FormArray;
  // }

  newParticipant(): FormGroup {
    return this.formBuilder.group({
      firstName: ["", [Validators.required]],
      email: ["", [Validators.required]],
      age: ["", [Validators.required]],
    });
  }

  addDynamicField() {
    this.optionList.push({firstName: '', email: '',age:0});

    //this.participant().push(this.newParticipant());
  }

  removeLastOption(i) {
    //this.participant().removeAt(i);
    this.optionList.splice(i, 1);
  }

  getParticipate() {
    let data = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };
    this.apiService.get(data).subscribe((response: any) => {
      this.participate = response["data"]["participationConfig"];
    });
  }
  removeLastUrl(i, list) {
    this.youTubeUrls.splice(i, 1);
    if (list.id) {
      this.deletedIds.push(list.id);
    }
  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
  removeImage(index, list) {
    this.imageList.splice(index, 1);
    this.uploadedImageList.splice(index, 1);
    localStorage.removeItem("mediaFile");
    if (list.id) {
      this.deletedIds.push(list.id);
    } else {
      this.removeUploadMedia(list.link, list.thumbnailLink);
    }
  }

  removeVideo(index, list) {
    this.videoList.splice(index, 1);
    this.uploadedVideoList.splice(index, 1);
    localStorage.removeItem("videoFile");

    if (list.id) {
      this.deletedIds.push(list.id);
    } else {
      this.removeUploadMedia(list.link, list.thumbnailLink);
    }
  }

  removeUploadMedia(link, thumbnailLink) {
    let data = {
      link: link,
      thumbnailLink: thumbnailLink,
    };

    let request = {
      path: "gallery/deleteMedia",
      data: data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe((response) => {});
  }





  videoQueueCompleted() {
    let last = [];
    last.push(this.videoList[this.videoList.length - 1]);
    localStorage.removeItem("videoFile");

    last.map((item, index) => {
      this.uploadedVideoList.push({
        link: item["responseData"]["data"]["url"],
      });
    });
    this.spinner.hide();

  }
  invalidUploadFile() {
    this.toastrService.error('Please upload only image file');
  }

  maxFileError() {
    this.toastrService.error('Maximum 1 file is allowed');
  }

  imageQueueCompleted() {
  
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

  max1FileError() {

    this.toastrService.error('Maximum 1 file is allowed');
  }
  invalidVideoUploadFile() {
    this.toastrService.error('Please upload only video file');
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
  uploadedFilesChange() {}
  // addDynamicField() {
  //   this.performanceList.push({title: '', duration: '',});
  //   this.ParticipantList.push({ pfirstName: "", email: "", age: "" });
  // }
  // removeLastOption(i) {
  //   this.performanceList.splice(i, 1);
  //   this.ParticipantList.splice(i, 1);
  // }

  mychange(event) {
    this.reqData["eventId"] = this.eventId;
    if (
      this.AddParticipant.value.firstName != "" ||
      this.AddParticipant.value.firstName != null
    ) {
      this.value = true;
      this._register["participate"] = this.value;
      this.completed.emit();
    } else {
      this.value = false;
      this._register["participate"] = this.value;
      this.completed.emit();
    }
  }

  patchForm(array) {
    this.Participant.patchValue({
      cfirstName: array.cfirstName,
      clastName: array.clastName,
      email: array.email,
      performanceDuration:array.performanceDuration,
      eventName: array.eventName,
      businessName: array.businessName,
    });
    let image =JSON.parse(localStorage.getItem("mediaFile"))
    let video =JSON.parse(localStorage.getItem("videoFile"))
    this.uploadedImageList.push({
      link: image,
      thumbnailLink: image
    });
    this.uploadedVideoList.push({
      link: video,
      thumbnailLink: video
    });
  }

  submit() {
    let mediafile=[];
    if(this.videoList!=''){
      mediafile.push(this.videoList[0]['responseData']['data']['url'])
      localStorage.setItem(
        "videoFile",
        JSON.stringify(this.videoList[0]['responseData']['data']['url'])
      );
    }
    if(this.imageList!=''){
      mediafile.push(this.imageList[0]['responseData']['data']['url'])
      localStorage.setItem(
        "mediaFile",
        JSON.stringify(this.imageList[0]['responseData']['data']['url'])
      );
    }
    let data = {
      businessInfo: {
        businessName: this.Participant.value.businessName,
      },
      eventId: this.eventId,
      eventPerformance: {
        contactFirstName: this.Participant.value.cfirstName,
        contactLastName:this.Participant.value.clastName,
        email: this.Participant.value.email,
        name: this.Participant.value.eventName,
      },
      mediaFiles: mediafile,
      participants: this.optionList,
      performanceDuration: this.Participant.value.performanceDuration,
    };
    let optionList = this.optionList.filter(item => item.firstName!= '' && item.age != '' && item.email != '');
   /*this.optionList.forEach(element => {
    if (element.email != "") {
      this.checkEmailPattern= this.optionList.filter(s => !/[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/.test(s.email))
      console.log("optionlist",this.checkEmailPattern)
    }
    
   });*/
    if (this.Participant.valid && optionList!='') {
      let request = {
        path: "event/participation",
        data: data,
       isAuth: true,
      };
      this.apiService.post(request).subscribe((response: any) => {
        if (
          response["status"]["code"] == "CREATED" ||
          response["status"]["code"] == "OK"
        ) {
          this.toastrService.success(response["status"]["description"]);
          this.submitted = true;
          this.completenext.emit();
          localStorage.setItem(
            "formDetails",
            JSON.stringify(this.Participant.value)
          );
          localStorage.setItem(
            "formDetails1",
            JSON.stringify(this.optionList)
          );
          this.patchedForm.emit();
        } else {
          this.toastrService.error(response["status"]["description"]);
          this.submitted = false;
        }
      });
    } else {
      this.toastrService.error("Please fill all required fields");
    }
  }
  skip() {
    this.skipvalue.emit(true);
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  charOnly(evt): boolean {
    var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode :
      ((evt.which) ? evt.which : 0));
    if (charCode > 32 && (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }
}
