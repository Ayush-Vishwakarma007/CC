import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Subject, Subscription} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../../../services/api.service";
import {SpinnerService} from "../../../../services/spinner.service";
import {Location} from '@angular/common';
import {CommunityDetailsService} from "../../../../services/community-details.service";
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'app-membership-plan-new',
  templateUrl: './membership-plan-new.component.html',
  styleUrls: ['./membership-plan-new.component.scss']
})
export class MembershipPlanNewComponent implements OnInit {
  modalRef: BsModalRef;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() currentStepChange: EventEmitter<any> = new EventEmitter();
  @Output() checkoutArrayChange: EventEmitter<any> = new EventEmitter();
  membershipDetail: any = [];
  chapterList: any = [];
  chapterId = '';
  duration:any =[];
  constructor(private router:Router,private modalService: BsModalService, public _location: Location, public communityService: CommunityDetailsService,public spinner: SpinnerService, private toastrService: ToastrService, public apiService: ApiService,) {
  }

  _currentStep: any;
  durationTypeList: any = [];

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
    this.getDurationType();
    this.getChapterList();
  }

  getDurationType() {
    let request = {
      path: 'auth/membershipType/durationType',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.durationTypeList = response['data'];
        resolve();
      });
    });
  }
  changeTypeTab(event) {
    this.getMembershipList(event.tab.textLabel);
  }
  getMembershipList(type) {
    this.duration = (type.split("_"));
    console.log(this.duration[1],this.duration[2],this.duration[0]);
    let path;
    if(this.duration[1]=="true"){
      path = 'auth/membershipType/getAll?durationType=' + this.duration[0]+'&duration=' +this.duration[2];
    }else{
      path = 'auth/membershipType/getAll?durationType=' + this.duration[0];
    }
    let request = {
      path: path,
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.get(request).subscribe(response => {
      
      if (response['status']['code'] == 'OK') {
        this.membershipDetail = response['data'];
        this.membershipDetail.map((data, index) => {
          data['plans'].map((plan, i) => {
            if (plan['durationType'] == type) {
              this.membershipDetail[index]['price'] = plan['price'];
              this.membershipDetail[index]['planId'] = plan['id'];
            }
          })
        });
        console.log(this.membershipDetail[0]);
       /* if (this.membershipDetail[0]) {
          this.checkoutArray['selectedMembershipId'] = this.membershipDetail[0]['id'];
          
        }*/
        this.changePlan()
       /* if(this.currentStep == 3){
          this.changePlan();
        }*/
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    });
  }



  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'gray modal-md select-chapter-new'})
    );
  }

  changeStep(type) {
    console.log(this.checkoutArray)
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    if (type == 'back') {
      if(authDetail)
      {
        this.currentStep = 1;
      }
     else
     {
       this.currentStep=0
     }
     
    }
    else{

    
    if (this.checkoutArray['selectedMembershipId']) {
      if (this.checkoutArray['chapterDetail']) {
        if (type == 'next') {
          this.currentStep = 3;
        }
        
      } else {
        this.toastrService.error('Please select any chapter');
      }
    } else {
      this.toastrService.error('Please select any plan');
    }
  }
    //if(type== 'back'){this.currentStep = 0;}
  }

  getChapterList() {
    let request = {
      path: 'community/chapters',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.chapterList = response['data'];
      this.checkoutArray['chapterList'] = response['data'];
      this.chapterList = this.chapterList.filter((data) => data['mainChapter'] != true);
      if(response['data'].length==1){
        this.checkoutArray['chapterDetail'] =  response['data'][0];
        this.chapterId= this.chapterList[0]['name'];
      }
      if (this.checkoutArray['chapterId']) {
        //this.chapterId = this.checkoutArray['chapterId']
        let list = this.chapterList.filter((data) => data['id'] == this.chapterId)[0];
        if (!list) {
          if (this.chapterList[0]) {
            //this.chapterId = this.chapterList[0]['id']
          }
        }
      } else {
        if (this.chapterList[0]) {
          //this.chapterId = this.chapterList[0]['id']
        }
      }
      this.checkoutArray['chapterId'] = this.chapterId;

      console.log(this.chapterList, this.checkoutArray['chapterId'])

      this.changeChapter();

    });
  }

  changeChapter() {
    let list = this.chapterList.filter((data) => data['id'] == this.chapterId)[0];
    if (list) {
      this.checkoutArray['chapterDetail'] = list;
    } else {
      //this.toastrService.error('Please Select Any Chapter')
    }
    console.log(this.chapterId, list);
  }

  changePlan() {
    let list = this.membershipDetail.filter((data) => data['id'] == this.checkoutArray['selectedMembershipId'])[0];
    console.log(list)

    if (list) {
      this.checkoutArray['selectedPlan'] = list;
      this.completed.emit();
    }
  }
  goBack()
  {
    this.router.navigate(['/']);
  }

}
