import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { configuration } from '../../../../../configration';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from "rxjs";
import { ViewportScroller } from '@angular/common';
import { Location, DatePipe } from '@angular/common';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})

export class SessionComponent implements OnInit, OnDestroy {
  editor: Editor;
  toolbar: Toolbar = [
    ["bold", "italic", "underline"],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ["link"]]
  @ViewChild('sectionNeedToScroll') sectionNeedToScroll: ElementRef
  @Input()
  save: Subject<any>;
  @Input() eventId = "";
  saveSubscription: Subscription;

  _session: any;
  @Output() sessionChange: EventEmitter<any> = new EventEmitter();
  @Output() completed: EventEmitter<any> = new EventEmitter();

  @Input()
  get session() {
    return this._session;
  }
  set session(value) {
    this._session = value;
    this.sessionChange.emit(value);
  }
  submitBtn = true;
  sessionForm: FormGroup;

  session_list: any = [];
  response: any = [];

  editId = '';
  editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "auto",
    "minHeight": "250px",
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
      ["link", "image",]

    ]
  };

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, public router: Router, private _vps: ViewportScroller, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {

    this.sessionForm = this.formBuilder.group({
      name: ['', Validators.required],
      capacity: ['', Validators.required],
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required],
      address: ['', Validators.required],
      description: ['', Validators.required]
    });

  }

  ngOnInit() {
    this.editor = new Editor();
    this.sessionList();
    this.saveSubscription = this.save.subscribe(() => {
      this.sessionChange.emit(this.session_list);
      this.completed.emit();
    });
  }
  reset() {
    this.sessionForm.reset();
    this.editId = '';
    this.session_list.map(d=>{
      d['isDisabled'] = false
    })
  }
  submit() {
    if(this.editId){
      console.warn('the editable not submitted');
    }
   else{
    if (this.sessionForm.valid) {
      if (this.sessionForm.value.capacity > 0) {
        let formval = this.sessionForm.value;
        formval['eventId'] = this.eventId;
        
        let data = {};
        if (formval['eventId'] != '') {
          data = {
            path: "event/session/" + formval['eventId'],
            data: formval,
            isAuth: true
          };
        } else {
          data = {
            path: "event/session",
            data: formval,
            isAuth: true
          };
        }
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            this.submitBtn = true;
            this.response = response['data'];
            this.sessionForm.reset();
            this.sessionList();
            this.editId = '';
          } else {
            this.toastrService.error(response['status']['description']);
            this.submitBtn = false;
          }
        });
      } else {
        this.toastrService.error("Please enter valid capacity!");
        this.submitBtn = false;
      }
    } else {
      this.toastrService.error("Please fill all required fields!");
      this.submitBtn = false;
    }
   }
  }
  handleDateChange(event) {
    let startDate = this.datePipe.transform(this.sessionForm.value.startDateTime, 'yyyy-MM-dd:HH:mm');
    let endDate = this.datePipe.transform(event, 'yyyy-MM-dd:HH:mm');
    if (endDate < startDate) {
      this.toastrService.error("End date should be greater than start date");
      this.sessionForm.patchValue({ endDateTime: "" });
    }
  }
  sessionList() {
    let request = {
      path: "event/getAllSessions/" + this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.session_list = response['data'];
      console.log(this.session_list)
    });
  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
  edit(data, type) {
    this.editId = data.id;
    this.session_list.map((d,index)=>{
      if(this.editId == this.session_list[index].id){
        d['isDisabled'] = true;
      }
      else{
        d['isDisabled'] = false;
      }
    })    
    this.sessionForm.patchValue({
      name: data.name,
      capacity: data.capacity,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      address: data.address,
      description: data.description
    });

  }
  delete(data, type) {
    let request = {
      path: "event/session/" + data.id,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.editId = '';
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.sessionList();
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }
  /*public gotoSection() {
    //this will provide smooth animation for the scroll
    this.sectionNeedToScroll.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

}*/

  scrollFn(anchor: string): void {
    this._vps.scrollToAnchor(anchor)
    window.scroll(0, 0);
  }
}
