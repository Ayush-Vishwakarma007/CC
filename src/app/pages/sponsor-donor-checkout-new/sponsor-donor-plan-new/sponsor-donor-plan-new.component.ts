import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Subject, Subscription} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../../services/api.service";
import {SpinnerService} from "../../../services/spinner.service";
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'app-sponsor-donor-plan-new',
  templateUrl: './sponsor-donor-plan-new.component.html',
  styleUrls: ['./sponsor-donor-plan-new.component.scss']
})
export class SponsorDonorPlanNewComponent implements OnInit {
  modalRef: BsModalRef;
  @Input() title = ''

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() currentStepChange: EventEmitter<any> = new EventEmitter();
  @Output() checkoutArrayChange: EventEmitter<any> = new EventEmitter();
  membershipDetail: any = [];
  chapterList: any = [];
  chapterId = '';
  categoryList: any = [];
  eventDetail: any = [];
  constructor(private modalService: BsModalService,private route: ActivatedRoute, public _location: Location, public spinner: SpinnerService, private toastrService: ToastrService, public apiService: ApiService,public router:Router) {
  }  eventId:any;


  _currentStep: any;
  @Input()
  get currentStep() {
    return this._currentStep;
  }

  set currentStep(value) {
    this._currentStep = value;
    this.currentStepChange.emit(value);
  }

  _checkoutArray: any;
  @Input()
  get checkoutArray() {
    return this._checkoutArray;
  }

  set checkoutArray(value) {
    this._checkoutArray = value;
    this.checkoutArrayChange.emit(value);
  }

  ngOnInit() {
    this.route.params.subscribe(params =>
      this.eventId = params['id']
    );
    if (this.checkoutArray['type'] == 'chapter') {
      this.chapterId = this.checkoutArray['id']
      this.getChapterList();
    } else {
      this.getEventDetail();
    }
  }

  getChapterList() {
    let request = {
      path: 'community/chapters',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.chapterList = response['data'];
      if (this.chapterId == '') {
        this.chapterId = this.chapterList[0]['id'];
      }
      this.changeChapter();
    });
  }

  getEventDetail() {
    this.spinner.show();
    let request = {
      path: "event/details/" + this.checkoutArray['id'],
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.eventDetail = response['data'];
          this.eventDetail.paymentMethod = [];
          Object.keys(this.eventDetail.paymentMethods).map((index) => {
            this.eventDetail.paymentMethod.push({value: index, name: this.eventDetail.paymentMethods[index]});
          });
          this.checkoutArray['eventDetail']=this.eventDetail;
          this.getCategoryList();
        }
        this.spinner.hide();
        console.log(this.eventDetail)
      });
      resolve(null);
    });
  }

  getCategoryList() {
    let path = '';
    console.log(this.checkoutArray['url'])
    if (this.checkoutArray['type'] == 'event') {
      if (this.checkoutArray['url'] == 'sponsor-checkout-new') {
        path = 'event/getAllSponsorshipCategories/SPONSOR/' + this.checkoutArray['id']
      } else {
        path = 'event/getAllSponsorshipCategories/DONATION/' + this.checkoutArray['id']
      }
    }else{
      if (this.checkoutArray['url'] == 'sponsor-checkout-new') {
        path = 'event/chapter/sponsorshipCategory/getAll/SPONSOR/' + this.checkoutArray['chapterDetail']['id']
      } else {
        path = 'event/chapter/sponsorshipCategory/getAll/DONATION/' + this.checkoutArray['chapterDetail']['id']
      }
    }
    let request = {
      path: path,
      isAuth: true,
    };
    this.categoryList = [];
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.categoryList = response['data'];
        console.log(this.categoryList)
        this.categoryList.forEach((item, index) => {
         
          
        });
        if (this.categoryList.length == 0) {
          this.checkoutArray['details'] = undefined;
          this.checkoutArray['summery'] = null;
          this.completed.emit();
        }
        console.log(this.categoryList)
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  categoryChange(check, index, onload = false) {
    if (onload == false) {
      this.categoryList.map(t => {
        t.amount = 0;
        t.checked = false;
        return t
      });
    }
    this.categoryList[index]['checked'] = check;
    this.categoryList[index]['amount'] = this.categoryList[index]['range']['min'];
    this.checkoutArray['details'] = this.categoryList[index];
    this.completed.emit();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  changeChapter() {
    let list = this.chapterList.filter((data) => data['id'] == this.chapterId)[0];
    if (list) {
      this.checkoutArray['chapterDetail'] = list;
      this.checkoutArray['id'] = this.chapterId;
      this.getCategoryList();
     // this.modalRef.hide();
    } else {
      this.toastrService.error('Please select any chapter')
    }
    console.log(this.chapterId, list);
  }

  changeStep(type) {
    console.log(this.checkoutArray['details'])
    if (this.checkoutArray['details']) {
      if (this.checkoutArray['chapterDetail'] || this.checkoutArray['eventDetail'] ) {
        if (type == 'next') {
          this.currentStep = 3;
        }
    
       
      } else {
        this.toastrService.error('Please select any chapter');
      }
    } else {
     
      if(type != 'back')
      {
        this.toastrService.error('Please select any plan');
      this.checkoutArray['summery'] = [];
      }
     
      
    }
    if (type == 'back') {
      this.currentStep = 1;
      console.log(this.currentStep)
   }
   
  }

  changeAmount(list) {
    console.log(list);
    list['amount'] = parseFloat(list['amount'])
    if (list['amount'] >= list['range']['min'] && list['amount'] <= list['range']['max']) {
      list['amount'] = parseFloat(list['amount'])
    } else {
      list['amount'] = list['range']['min']
    }
    this.checkoutArray['details'] = list;
    console.log(list)
    this.completed.emit();
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'gray modal-md select-chapter-new'})
    );
  }
  goBack()
  {
    if(this.checkoutArray['type'] == 'chapter') {
      this.router.navigate(['/']);
    }
    else {
      this.router.navigate(['/event-details/' + this.eventId]);
    }
  }
}
