import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Subject, Subscription} from "rxjs";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {ApiService} from "../../services/api.service";
import {ToastrService} from "ngx-toastr";
import * as $ from "jquery";
@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss']
})
export class EventModalComponent implements OnInit {
  modalRef: BsModalRef;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  _output: any;
  @Output() eventDetailChange: EventEmitter<any> = new EventEmitter();
  search_member = ''
  searchBox: FormControl = new FormControl('');
  search='';
  chapterId:any;
  _eventDetail: any;

  @Input()
  get eventDetail() {
    return this._eventDetail;
  }

  set eventDetail(value) {
    this._eventDetail = value;
    this.eventDetailChange.emit(value);
  }


  constructor(private modalService: BsModalService, public apiService: ApiService, private toastrService: ToastrService,) {
  }

  ngOnInit() {
    this.saveSubscription = this.save.subscribe((chapterId) => {
      this.chapterId = chapterId;
      $('#editBtn').click();
    });
    this.searchBox.valueChanges.pipe(
      debounceTime(900)
    ).subscribe((search) => {
      this.search = search;
      this.searchNewData(this.search);
    });
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'modal-lg modal-dialog-centered termsmain modelselectevent committee-member-mod'})
    );
    this.searchNewData(this.search);
  }

  searchNewData(search = '') {
      let data = {
        "filter": {
          "search": search,
          "chapterIds":[this.chapterId],
        },
        "page":{
          "pageLimit": 20,
          "pageNumber": 0
        }
      };
      let request = {
        path: "event/find",
        data: data,
        isAuth: true,
      };
      this.apiService.post(request).subscribe(response => {
          console.log(response);
          if(response['status']['code'] == 'OK'){
            this.search_member = response['data']['content']
          }
      });

  }
  hideBtn(){
    this.modalRef.hide();
    this.search_member ='';
    this.search ='';
    this.searchBox = new FormControl('');

  }
  submitEvent(data){
    this.eventDetail =data;
    this.eventDetailChange.emit(this.eventDetail);
    this.modalRef.hide();
    this.search_member ='';
    this.search ='';
    this.searchBox = new FormControl('');
  }

}
