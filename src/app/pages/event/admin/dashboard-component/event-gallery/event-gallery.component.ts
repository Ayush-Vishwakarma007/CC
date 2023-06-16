import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from "rxjs";
import {SpinnerService} from "../../../../../services/spinner.service";

@Component({
  selector: 'app-event-gallery',
  templateUrl: './event-gallery.component.html',
  styleUrls: ['./event-gallery.component.scss']
})
export class EventGalleryComponent implements OnInit, OnDestroy {
  @Output() imageDescriptionChange: EventEmitter<any> = new EventEmitter();
  @Output() completed: EventEmitter<any> = new EventEmitter();
  tags = [];
  tagName = "";
  mediaList: any = [];
  mediaUploadUrl = "event/uploadPicture";
  @Input()
  save: Subject<any>;
  @Input() eventId = "";
  saveSubscription: Subscription;
  submitBtn = true;
  response = [];

  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
  }
  ngOnInit() {
    this.getEventImages();
  }

  getEventImages() {
    let list = [];

    this.mediaList.forEach((item, index) => {
      list.push(item['responseData']['data']['imageUrl']);
    });
    console.log(list);
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

  uploadStarted() {
    this.spinner.show();
    //this.isFileUploading=true;
  }

  queueCompleted() {
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
    this.spinner.hide();
    console.log(this.mediaList);

  }

  ngOnDestroy(): void {
    // this.saveSubscription.unsubscribe();
  }

}
