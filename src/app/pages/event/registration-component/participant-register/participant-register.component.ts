import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { configuration } from "../../../../configration";
import { EMAIL_PATTERN } from "../../../../helpers/validations";
import { Subject, Subscription } from "rxjs";
import { SpinnerService } from "../../../../services/spinner.service";
@Component({
  selector: 'app-participant-register',
  templateUrl: './participant-register.component.html',
  styleUrls: ['./participant-register.component.scss']
})
export class ParticipantRegisterComponent implements OnInit {

  @Input() eventId = "";
  response: any = [];
  @Input() eventDetail: any[];

  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() completeParticipant: EventEmitter<any> = new EventEmitter();
  @Output() participantDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() choreographerDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() businessInfoChange: EventEmitter<any> = new EventEmitter();
  @Output() mediaListChange: EventEmitter<any> = new EventEmitter();

  registerForm: FormGroup;
  registerChoreographerForm: FormGroup;
  submitted: boolean = false;
  submitBtn: boolean = false;
  businessDetailForm: FormGroup;
  step = 0;
  isEdit: boolean = false;
  index = 0;


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
  constructor(private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService,  public spinner: SpinnerService) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    });
    this.registerChoreographerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      description: ['', Validators.required],
      performanceName: ['', Validators.required],
      phone: ['', Validators.minLength(10)],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      duration: ['', Validators.required],
      contactChoreographerBusinessName: ['', Validators.required],
    });
    this.businessDetailForm = this.formBuilder.group({
      address: [''],
      businessDetail: [''],
      businessName: [''],
      website: [''],
    })
  }

  get f() {
    return this.registerForm.controls;
  }

  _participantDetail: any;
  @Input()
  get participantDetail() {
    return this._participantDetail;
  }

  set participantDetail(value) {
    this._participantDetail = value;
    this.participantDetailChange.emit(value);
  }

  _choreographerDetail: any;
  @Input()
  get choreographerDetail() {
    return this._choreographerDetail;
  }

  set choreographerDetail(value) {
    this._choreographerDetail = value;
    this.choreographerDetailChange.emit(value);
  }

  _businessInfo: any;
  @Input()
  get businessInfo() {
    return this._businessInfo;
  }

  set businessInfo(value) {
    this._businessInfo = value;
    this.businessInfoChange.emit(value);
  }

  _mediaList: any=[];
  @Input()
  get mediaList() {
    return this._mediaList;
  }

  set mediaList(value) {
    this._mediaList = value;
    this.mediaListChange.emit(value);
  }
  ngOnInit() {
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    if (authDetail) {
      this.registerChoreographerForm.patchValue({
        firstName: authDetail['firstName'],
        lastName: authDetail['lastName'],
        email: authDetail['email'],
        phone: authDetail['phone'],
      })
    }
  }

  addParticipant() {
    this.submitted = true;

    if (this.registerForm.valid) {

      let minAge = this.eventDetail['participationConfig']['allowedAge']['min']
      let maxAge = this.eventDetail['participationConfig']['allowedAge']['max']

      if (this.registerForm.value.age < minAge || this.registerForm.value.age > maxAge) {
        this.toastrService.error("Participant's age should be between " + minAge + " to " + maxAge + " years");
      }
      else {
        let formData = this.registerForm.value
        if (this.isEdit) {
          this.participantDetail.map((item, index) => {
            console.log(item)
            if (index == this.index) {
              this.participantDetail[index] = formData
            }
          })
        }
        else {
          let maxParticipant = this.eventDetail['participationConfig']['participation']['max'];
          if (this.participantDetail.length >= maxParticipant) {
            this.toastrService.error("Maximum " + maxParticipant + " Participants are allowed");
          } else {
            this.participantDetail.push(formData);
          }
        }
        this.isEdit = false;
        this.submitted = false;
        this.registerForm.reset();
      }
    }
    else {
      this.toastrService.error('Please fill all required fields.')
    }
  }

  editParticipant(list, index) {
    this.isEdit = true
    this.index = index
    this.registerForm.patchValue({
      firstName: list.firstName,
      lastName: list.lastName,
      age: list.age,
      email: list.email,
    })
  }

  deleteParticipant(index) {
    this.participantDetail.splice(index, 1)
  }

  participantReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep(choreographerDetail = false) {
    if (choreographerDetail) {
      if (this.registerChoreographerForm.valid) {
        this.step++;
      }
    } else {
      this.step++;
    }
  }
  
  addChoreographer() {
    this.submitBtn = true;
    let choreographerFormValue = this.registerChoreographerForm.value;

    if (this.registerChoreographerForm.valid) {
      this.submitBtn = true;
      this.choreographerDetail = choreographerFormValue;
      console.log(this.choreographerDetail);
    } else {
      this.toastrService.error('All fields are required !');
    }
  }

  addBusinessInfo(){
    let formData = this.businessDetailForm.value;
    this.businessInfo = formData
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
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

  removeLastUrl(i, list) {
    this.youTubeUrls.splice(i, 1);
    if (list.id) {
      this.deletedIds.push(list.id);
    }
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
    this.mediaList.push(this.videoList[0]['responseData']['data']['url'])
  }
  invalidUploadFile() {
    this.toastrService.error('Please upload only image file');
  }

  maxFileError() {
    this.toastrService.error('Maximum 1 file is allowed');
  }

  imageQueueCompleted() {
    console.log(this.imageList);
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
    this.mediaList.push(this.imageList[0]['responseData']['data']['url'])
    console.log(this.imageList)
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

}
