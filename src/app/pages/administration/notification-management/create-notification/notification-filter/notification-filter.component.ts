import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SpinnerService } from "../../../../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from "rxjs";
import { pagination } from "../../../../../pagination";
import { configuration } from 'src/app/configration';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from "sweetalert2";
import { IframeItem } from '@ngx-gallery/core';

@Component({
  selector: 'app-notification-filter',
  templateUrl: './notification-filter.component.html',
  styleUrls: ['./notification-filter.component.scss']
})
export class NotificationFilterComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  @Input() templateName = "";
  @Input() notificationId = "";

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;

  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();

  @Output() basicInfoIdChange: EventEmitter<any> = new EventEmitter();
  @Output() showUserChange: EventEmitter<any> = new EventEmitter();
  @Output() filterDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() communityFilterChange: EventEmitter<any> = new EventEmitter();
  @Output() eventFilterChange: EventEmitter<any> = new EventEmitter();

  _basicInfoId: any;

  @Input()
  get basicInfoId() {
    return this._basicInfoId;
  }

  set basicInfoId(value) {
    this._basicInfoId = value;
    this.basicInfoIdChange.emit(value);
  }

  _filterDetail: any;

  @Input()
  get filterDetail() {
    return this._filterDetail;
  }

  set filterDetail(value) {
    this._filterDetail = value;
    this.filterDetailChange.emit(value);
  }

  _communityFilter: any;

  @Input()
  get communityFilter() {
    return this._communityFilter;
  }

  set communityFilter(value) {
    this._communityFilter = value;
    this.communityFilterChange.emit(value);
  }
  _showUser: any;

  @Input()
  get showUser() {
    return this._showUser;
  }

  set showUser(value) {
    this._showUser = value;
    this.showUserChange.emit(value);
  }
  _eventFilter: any;

  @Input()
  get eventFilter() {
    return this._eventFilter;
  }

  set eventFilter(value) {
    this._eventFilter = value;
    this.eventFilterChange.emit(value);
  }

  chapterList: any = [];
  roleList: any = [];
  roles: any = [];
  userFilterForm: FormGroup;
  membershipType: any = [];
  startDate = new Date();
  isMemberChecked: boolean = false;
  isSubmit: boolean = false;
  userReqData: any = [];
  checkUncheckUser: any = [];
  memberList: any = [];
  totalPages: any = [];
  search = "";
  totalMember: any = [];
  selectedAll: boolean = false;
  roleListSubject: Subject<string> = new Subject();
  communityFilterForm: FormGroup;
  chapterIds: any = [];
  committeeList: any = [];
  designationList: any = [];
  showModal: boolean = false;
  memberReqData: any = [];
  eventFilterForm: FormGroup;
  allowChapterSponsor: boolean = false;
  allowChapterDonor: boolean = false;
  allowDonors: boolean = false;
  allowParticipants: boolean = false;
  allowPerformances: boolean = false;
  allowSponsors: boolean = false;
  allowVendors: boolean = false;
  isEventSelected: boolean = false;
  chapterSponsorList: any = [];
  chapterDonorList: any = [];
  eventList: any = [];
  eventIds: any = [];
  eventSponsorList: any = [];
  eventDonationList: any = [];
  eventVendorList: any = [];
  eventParticipantList: any = [];
  statusList: any = [];
  selectAllChapterSponsor: boolean = false;
  selectAllChapterDonor: boolean = false;
  selectAllSponsor: boolean = false;
  selectAllDonor: boolean = false;
  selectAllVendor: boolean = false;
  selectAllPerformance: boolean = false;
  selectAllParticipant: boolean = false;
  userPagination: boolean = false;
  commonPaginatin: boolean = false;
  datacheck:any
  isShown: boolean;
  storecheckuser: any = [];
  store: any = [];
  store1: any;
  isshown1: boolean;
  searchMemberList: any = []
  selectmember: any = [];
  selectmemberList :any =[]
  totalPages1: any = [];
  memberReqData1: any = [];
  constructor(private modalService: BsModalService, private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.userFilterForm = this.formBuilder.group({
      chapterIds: ['', Validators.required],
      minAge: [null],
      maxAge: [null],
      minimumAmount: [null],
      maximumAmount: [null],
      membershipTypeIds: [null],
      mainUser:[null],
      roles: [null],
      startDate: [null],
      endDate: [null],
      approved: [null],
      checkInvalidEmail:[true],
      subscribeNewsLetter: [null],
      successfulPayment: [null],

    })

    this.communityFilterForm = this.formBuilder.group({
      chapterIds: ['', Validators.required],
      committeeIds: [null],
      designations: [null],
      startDate: [null],
      endDate: [null],
      activeMember: [null]
    })

    this.eventFilterForm = this.formBuilder.group({
      allowAdmins: [null],
      allowChapterDonors: [null],
      allowChapterSponsors: [null],
      allowDonors: [null],
      allowParticipants: [null],
      allowPerformances: [null],
      allowSponsors: [null],
      allowVendors: [null],
      allowVolunteers: [null],
      chapterDonationCategoryIds: [null],
      chapterIds: [null, Validators.required],
      chapterSponsorshipCategoryIds: [null],
      donationCategoryIds: [null],
      eventIds: [null],
      expoCategoryIds: [null],
      ruleCategoryIds: [null],
      sponsorshipCategoryIds: [null],
      successfulPayment: [null],
      startDate: [null],
      endDate: [null],
      maximumAmount: [null],
      minimumAmount: [null],
      status: [null],

    })

    this.userReqData = {
      "filter": {
        "search": ""
      },
      "page": {
        "limit": 5,
        "page": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    };

    this.memberReqData = {
      "filter": {
        "search": ""
      },
      "page": {
        "pageLimit": 5,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    };
    this.memberReqData1 = {
      filter: {
        userIds: this.selectmember,
        
      },
      page: {
        limit: 5,
        page: 0,
      },
      sort: {
        orderBy: "ASC",
        sortBy: "FIRST_NAME",
      },
    };

    this.checkUncheckUser['userIds'] = [];
    this.checkUncheckUser['userIdsNotIn'] = [];
  }

  async ngOnInit() {
    window.scroll(0, 0);
    await this.getChapterList();
    await this.getUserRoles();
    await this.getMembershipType();
    await this.getDesignationList();
    if (this.filterDetail != '' && this.filterDetail != null) {
      this.userFilterForm.patchValue({
        chapterIds: this.filterDetail.chapterIds,
        startDate: this.filterDetail.startDate,
        endDate: this.filterDetail.endDate,
        approved: this.filterDetail.approved,
        checkInvalidEmail:this.filterDetail.checkInvalidEmail,
        mainUser:this.filterDetail.mainUser,
        subscribeNewsLetter: this.filterDetail.subscribeNewsLetter,
      })
      if(this.userFilterForm.value.mainUser==null){
        this.userFilterForm.value.mainUser="null"
      }
      console.log(this.filterDetail.subscribeNewsLetter,this.userFilterForm.value)
      if (this.filterDetail.roles != '' && this.filterDetail.roles != null) {
        this.filterDetail.roles.forEach((item) => {
          this.roles.push(item);
        })
      }

      if (this.filterDetail.userIds != null) {
        this.filterDetail.userIds.forEach((item) => {
          // this.checkUncheckUser['userIds'].push(item);   
        })
      }

      if (this.roleListSubject) {
        this.roleList.forEach((i) => {
          this.filterDetail.roles.filter((item) => {
            if (item == i['specificRole']) {
              i['check'] = true;
              if (item == 'MEMBER') {
                this.isMemberChecked = true;
                this.userFilterForm.patchValue({
                  minAge: this.filterDetail.minAge,
                  maxAge: this.filterDetail.maxAge,
                  minimumAmount: this.filterDetail.minimumAmount,
                  maximumAmount: this.filterDetail.maximumAmount,
                  membershipTypeIds: this.filterDetail.membershipTypeIds,
                  successfulPayment: this.filterDetail.successfulPayment
                })
              }
            }
          })
        })
      }
      window.scrollTo(0, 0)
    }

    if (this.communityFilter != '' && this.communityFilter != null) {
      this.communityFilterForm.patchValue({
        chapterIds: this.communityFilter.chapterIds,
        committeeIds: this.communityFilter.committeeIds,
        designations: this.communityFilter.designations,
        startDate: this.communityFilter.startDate,
        endDate: this.communityFilter.endDate,
        activeMember: this.communityFilter.activeMember
      })

      if (this.communityFilter.userIds != null) {
        this.communityFilter.userIds.forEach((item) => {
          this.checkUncheckUser['userIds'].push(item);
        })
      }

      if (this.communityFilter.chapterIds != null) {
        this.getChapterDetail(this.communityFilter.chapterIds);
      }
    }

    if (this.eventFilter != '' && this.eventFilter != null) {
      this.eventFilterForm.patchValue({
        allowAdmins: this.eventFilter.allowAdmins,
        allowChapterDonors: this.eventFilter.allowChapterDonors,
        allowChapterSponsors: this.eventFilter.allowChapterSponsors,
        allowDonors: this.eventFilter.allowDonors,
        allowParticipants: this.eventFilter.allowParticipants,
        allowPerformances: this.eventFilter.allowPerformances,
        allowSponsors: this.eventFilter.allowSponsors,
        allowVendors: this.eventFilter.allowVendors,
        allowVolunteers: this.eventFilter.allowVolunteers,
        chapterDonationCategoryIds: this.eventFilter.chapterDonationCategoryIds,
        chapterIds: this.eventFilter.chapterIds,
        chapterSponsorshipCategoryIds: this.eventFilter.chapterSponsorshipCategoryIds,
        donationCategoryIds: this.eventFilter.donationCategoryIds,
        eventIds: this.eventFilter.eventIds,
        expoCategoryIds: this.eventFilter.expoCategoryIds,
        ruleCategoryIds: this.eventFilter.ruleCategoryIds,
        sponsorshipCategoryIds: this.eventFilter.sponsorshipCategoryIds,
        successfulPayment: this.eventFilter.successfulPayment,
        startDate: this.eventFilter.startDate,
        endDate: this.eventFilter.endDate,
        maximumAmount: this.eventFilter.maximumAmount,
        minimumAmount: this.eventFilter.minimumAmount,
        status: this.eventFilter.status,
      })

      if (this.eventFilter.allowChapterSponsors) { this.allowChapterSponsor = true }
      if (this.eventFilter.allowChapterDonors) { this.allowChapterDonor = true }
      if (this.eventFilter.allowSponsors) { this.allowSponsors = true }
      if (this.eventFilter.allowDonors) { this.allowDonors = true }
      if (this.eventFilter.allowVendors) { this.allowVendors = true }
      if (this.eventFilter.allowPerformances) { this.allowPerformances = true }
      if (this.eventFilter.allowParticipants) { this.allowParticipants = true }
      if (this.eventFilter.eventIds != null) {
        this.getEventSelection(this.eventFilter.eventIds);
      }
      if (this.eventFilter.chapterIds != null) {
        this.getSponosrDonorDetail(this.eventFilter.chapterIds);
      }
      if (this.eventFilter.userIds != null) {
        this.eventFilter.userIds.forEach((item) => {
          this.checkUncheckUser['userIds'].push(item);
        })
      }
      window.scrollTo(0, 0)
    }
  }

  submit(publish = false) { 
    let data = {};
    if (this.templateName == 'AUTH') {
      this.isSubmit = true;
      if (this.userFilterForm.valid) {
        if (new Date(this.userFilterForm.value.startDate) <= new Date(this.userFilterForm.value.endDate)) {
          data = {
            "communityFilter": null,
            "eventFilter": null,
          }
          if(this.userFilterForm.value.subscribeNewsLetter==false){
            this.userFilterForm.value.subscribeNewsLetter=null
          }
          if(this.userFilterForm.value.successfulPayment==false){
            this.userFilterForm.value.successfulPayment=null
          }
          if(this.userFilterForm.value.checkInvalidEmail==false){
            this.userFilterForm.value.checkInvalidEmail=null
          }
          if(this.userFilterForm.value.mainUser=="null"){
            this.userFilterForm.value.mainUser=null
          }
          
          data['filter'] = this.userFilterForm.value;
          data['filter']['notIncludeNullChapterIds']=true
          data['filter']['roles'] = this.roles;
          data['filter']['userIdsNotIn'] = this.checkUncheckUser['userIdsNotIn'];
          if (this.checkUncheckUser['userIds'].length != 0) {
            data['filter']['userIds'] = this.checkUncheckUser['userIds'];
          }
          else {
            data['filter']['userIds'] = null;
          }
          if (publish == true) {
            data['filter']['search'] = null;
          }
        }
        else {
          this.toastrService.error('Please select valid End date')
          return false;
        }
      }
      else {
        this.toastrService.error('Fill all the required fields')
        return false;
      }
    }
    else if (this.templateName == 'COMMUNITY') {
      this.isSubmit = true
      if (this.communityFilterForm.valid) {
        if (new Date(this.communityFilterForm.value.startDate) <= new Date(this.communityFilterForm.value.endDate)) {
          data = {
            "filter": null,
            "eventFilter": null,
          }

          data['communityFilter'] = this.communityFilterForm.value;
          data['communityFilter']['userIdsNotIn'] = this.checkUncheckUser['userIdsNotIn'];
          if (this.checkUncheckUser['userIds'].length != 0) {
            data['communityFilter']['userIds'] = this.checkUncheckUser['userIds'];
          }
          else {
            data['communityFilter']['userIds'] = null;
          }
          if (publish == true) {
            data['communityFilter']['search'] = null;
          }
        }
        else {
          this.toastrService.error('Please select valid End date')
          return false;
        }
      }
      else {
        this.toastrService.error('Fill all the required fields');
        return false;
      }
    }
    else if (this.templateName == 'EVENT') {
      this.isSubmit = true
      if (this.eventFilterForm.valid) {
        if (new Date(this.eventFilterForm.value.startDate) <= new Date(this.eventFilterForm.value.endDate)) {
          data = {
            "filter": null,
            "communityFilter": null,
          }

          data['eventFilter'] = this.eventFilterForm.value;

          if (this.eventFilterForm.value.allowChapterSponsors == false) {
            data['eventFilter']['chapterSponsorshipCategoryIds'] = null;
          }
          if (this.eventFilterForm.value.allowChapterDonors == false) {
            data['eventFilter']['chapterDonationCategoryIds'] = null;
          }
          if (this.eventFilterForm.value.allowSponsors == false) {
            data['eventFilter']['sponsorshipCategoryIds'] = null;
          }
          if (this.eventFilterForm.value.allowDonors == false) {
            data['eventFilter']['donationCategoryIds'] = null;
          }
          if (this.eventFilterForm.value.allowVendors == false) {
            data['eventFilter']['expoCategoryIds'] = null;
          }
          if (this.eventFilterForm.value.allowPerformances == false) {
            data['eventFilter']['status'] = null;
          }
          if (this.eventFilterForm.value.allowParticipants == false) {
            data['eventFilter']['ruleCategoryIds'] = null;
          }
          if (this.eventFilterForm.value.successfulPayment == false) {
            data['eventFilter']['successfulPayment'] = null;
          }
         
          data['eventFilter']['userIdsNotIn'] = this.checkUncheckUser['userIdsNotIn'];
          if (this.checkUncheckUser['userIds'].length != 0) {
            data['eventFilter']['userIds'] = this.checkUncheckUser['userIds'];
          }
          else {
            data['eventFilter']['userIds'] = null;
          }
          if (publish == true) {
            data['eventFilter']['search'] = null;
          }
        }
        else {
          this.toastrService.error('Please select valid End date')
          return false;
        }
      }
      else {
        this.toastrService.error('Fill all the required fields');
        return false;
      }
    }

    data['publish'] = publish == true;
    data['sendToAll'] = this.selectedAll;
    console.log("Data notification: ",data) ///////// Need to remove 
    let request = {
      path: "notification/notification/update/" + this.basicInfoId,
      data: data,
      isAuth: true
    }

    this.apiService.post(request).subscribe(response =>{
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.isSubmit = false;
        this.userFilterForm.reset();
        this.communityFilterForm.reset();
        if (this.modalRef != undefined) {
          this.modalRef.hide();
        }
        this.eventFilterForm.reset();
        this.completed.emit();
        this.next.emit();
        this.router.navigate(['/management/notification-management']); 
      }
      else {
        this.toastrService.error(response['status']['description']);
        this.isSubmit = false;
      }
    })
  }

  getChapterList() {
    let request = {
      path: 'community/chapters/access',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.chapterList = response['data'];
        if ((this.filterDetail == '' || this.filterDetail == null) && (this.communityFilter == '' || this.communityFilter == null) && (this.eventFilter == '' || this.eventFilter == null)) {
          if (this.chapterList.length != 0) {
            let id = [];
            this.chapterList.map((item) => {
              id.push(item['id']);
            })
            if (this.templateName == 'AUTH') {
              this.userFilterForm.patchValue({
                chapterIds: id
              })
            }
            else if (this.templateName == 'EVENT') {
              this.eventFilterForm.patchValue({
                chapterIds: id
              })
            }
            else if (this.templateName == 'COMMUNITY') {
              this.communityFilterForm.patchValue({
                chapterIds: id
              })
            }
            this.getChapterDetail(id);
            this.getSponosrDonorDetail(id);
          }
        }
        resolve(null);
      });
    });
  }

  getUserRoles() {
    let request = {
      path: 'auth/roles',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.roleList = response['data'];
        console.log(this.roleList);
        this.roleListSubject.next('');
        resolve(null);
      });
    });
  }

  setRole(roleType) {
    let role = [];
    this.roleList.map((item) => {
      if (item['check'] && item['check'] == true) {
        role.push(item['specificRole']);
      }
    });
    this.roles = role;

    if (roleType.specificRole == 'MEMBER' && roleType.check == true) {
      this.isMemberChecked = true;
    }
    else if (roleType.specificRole == 'MEMBER' && roleType.check == false) {
      this.isMemberChecked = false;
    }
  }

  getMembershipType() {
    let request = {
      path: 'auth/membershipType/getAll',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.membershipType = response['data'];
        resolve(null);
      });
    });
  }

  getChapterDetail(ids) {
    ids.forEach((item) => {
      this.chapterIds.push(item);
    })
    this.chapterIds.push(null);
    this.chapterIds.push("");
    this.getCommitteeList();
  }

  getCommitteeList() {
    let data = {
      "chapterIds": this.chapterIds
    }
    let request = {
      path: 'community/committee/details/getAll',
      data: data,
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.post(request).subscribe(response => {
        this.committeeList = response['data'];
        this.chapterIds.length = 0;
        resolve(null);
      });
    });
  }

  getDesignationList() {
    let request = {
      path: 'community/designation/getAll',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.designationList = response['data'];
        resolve(null);
      });
    });
  }
  //original code//
  // selectedUser() {
  //   this.checkUncheckUser['userIds'] = [];
  //   this.checkUncheckUser['userIdsNotIn'] = [];
  //   this.memberList['content'].forEach((item, index) => {
  //     if (this.selectedAll == true) {
  //       item['checked'] = true;
  //     } else {
  //       item['checked'] = false;
  //     }
  //   });
  // }

  // getCheckUncheckUser(data) {
  //   this.checkUncheckUser['userIds'] = this.checkUncheckUser['userIds'].filter(item => item !== data['id']);
  //   this.checkUncheckUser['userIdsNotIn'] = this.checkUncheckUser['userIdsNotIn'].filter(item => item !== data['id']);
  //   if (data['checked'] == true) {
  //     this.checkUncheckUser['userIds'].push(data['id']);
  //   } else {
  //     this.checkUncheckUser['userIdsNotIn'].push(data['id']);
  //   }
  // }

  selectedUser() {
    this.checkUncheckUser["userIds"] = [];
    this.checkUncheckUser["userIdsNotIn"] = [];
 
    this.memberList["content"].forEach((item, index) => {
      if (this.selectedAll == true && this.search == "") {
      
        
        item["checked"] = true;
        this.isShown = false;
        this.datacheck = false;
        this.selectmember = this.checkUncheckUser["userIds"];
      }  else if(this.selectedAll==false){
       
        item["checked"] = false;

        this.selectmember = [];
      }
      if (
        this.datacheck == true &&
        this.selectedAll == true &&
        this.search != ""
      ) {
    
        this.isShown = true;
       // this.checkUncheckUser["userIds"] = [];
        let array = [];
        array = this.storecheckuser.concat(this.store1);
        var set = new Set(array);
        array = Array.from(set);

        this.checkUncheckUser["userIds"] = array;

      

        this.selectmember = this.checkUncheckUser["userIds"];
        
      } else if (
          this.datacheck == false &&
          this.selectedAll == false &&
          this.search == ""
        ) {
          this.checkUncheckUser["userIds"] = [];
         
          
        }
        //this.selectmember = this.checkUncheckUser["userIds"];
      
      
      
    });
    if (this.selectedAll == true && this.search != "" ) {
      this.store1=[]
      //this.checkUncheckUser["userIds"] = [];
     
      this.isShown = true;
      this.isshown1 = true;
      this.userReqData["page"]["limit"]=this.memberList['totalElements']
      let req = {
        path: "auth/user/getUsers",
        data: this.userReqData,
        isAuth: true,
      };
      this.apiService.post(req).subscribe((response) => {
       
        this.searchMemberList = response["data"];
        this.memberList=this.searchMemberList
      
     
      this.memberList["content"].forEach((item1, index) => {
       
        if(this.selectedAll == true && this.search != "" )
        item1["checked"] = true;
      
      this.checkUncheckUser["userIds"].push(item1["id"]);
     
      const result = Array.from(this.checkUncheckUser.reduce((m, t) => m.set(t.id, t), new Map()).values());
      this.storecheckuser = result;
     
      
     this.selectmember = this.checkUncheckUser["userIds"];
      })
    })
   
    } 
    else{
    
      this.checkUncheckUser["userIds"]=[]
      this.checkUncheckUser["userIdsNotIn"] =[this.memberList['totalElements']] 
     
        if(this.search==''&& this.selectedAll==false)
        {
         // this.selectmember=[]
       
       
        }
      }
     
      //this.selectmember = this.checkUncheckUser["userIds"];
    
    
    
  }
  getCheckUncheckUser(data) {
    this.checkUncheckUser["userIds"] = this.checkUncheckUser["userIds"].filter(
      (item) => item !== data["id"]
    );
    this.checkUncheckUser["userIdsNotIn"] = this.checkUncheckUser[
      "userIdsNotIn"
      ].filter((item) => item !== data["id"]);
    this.datacheck=data["checked"]
    if (data["checked"] == true) {
      //this.datacheck = data["checked"];
      this.checkUncheckUser["userIds"].push(data["id"]);
     
      this.selectmember = this.checkUncheckUser["userIds"];
    this.store1 = this.selectmember;
    
    } else {
      this.datacheck = false;
      this.checkUncheckUser["userIdsNotIn"].push(data["id"]);
      this.selectmember = this.checkUncheckUser["userIds"];
     
    }
  }

  userData(search = "") {

    if (this.templateName == 'AUTH') {
      this.isSubmit = true;
      if (this.userFilterForm.valid) {
        if (new Date(this.userFilterForm.value.startDate) <= new Date(this.userFilterForm.value.endDate)) {
          this.showModal = true;
          this.userReqData['filter']['search'] = this.search;
          if (search != "") {
            this.userReqData['page']['page'] = 0;
          }
          console.log("user filter",this.userFilterForm.value)
          if(this.userFilterForm.value.subscribeNewsLetter==false){
            this.userFilterForm.value.subscribeNewsLetter=null
          }
          if(this.userFilterForm.value.successfulPayment==false){
            this.userFilterForm.value.successfulPayment=null
          }
          if(this.userFilterForm.value.checkInvalidEmail==false){
            this.userFilterForm.value.checkInvalidEmail=null
          }
          if(this.userFilterForm.value.mainUser=="null"){
            this.userFilterForm.value.mainUser=null
          }
          
          this.userReqData['filter'] = this.userFilterForm.value;
          this.userReqData['filter']['approved'] = true;
          this.userReqData['filter']['roles'] = this.roles;
          this.userReqData['filter']['membershipPlanIds'] = null;
          this.userReqData['filter']['notIncludeNullChapterIds']=true
          
        }
        else {
          this.toastrService.error('Please select valid End date')
          return false;
        }
      }
      else {
        this.toastrService.error('Fill all required Fields!')
        this.showModal = false;
        return false;
      }

      let req = {
        path: "auth/user/getUsers",
        data: this.userReqData,
        isAuth: true,
      };
      this.spinner.show();
      this.apiService.post(req).subscribe(response => {
        this.memberList = response['data'];
        this.isSubmit = false;
        this.userPagination = true;
        this.commonPaginatin = false;
        this.totalMember = response['data']['totalElements'];
        this.totalPages = pagination.arrayTwo(this.memberList['totalPages'], this.userReqData.page.page);
        this.memberList['content'].forEach((item, index) => {
          item['sub'] = false;
          item['submembers'] = [];
          item['profileShow'] = false;
          if (this.selectedAll == true) {
            item['checked'] = true;
          }
          this.checkUncheckUser['userIds'].forEach((user) => {
            if (user == item['id']) {
              item['checked'] = true;
            }
          });
          this.checkUncheckUser['userIdsNotIn'].forEach((user) => {
            if (user == item['id']) {
              item['checked'] = false;
            }
          });
          if (item.firstName) {
            if (item.profilePictureUrl == null || item.profilePictureUrl == '') {
              item['profileShow'] = false;
              item['profileUrl'] = item.firstName[0] + "" + item.lastName[0];
            } else {
              item['profileShow'] = true;
              item['profileUrl'] = item.profilePictureUrl;
            }
          }

        });
      });
      this.spinner.hide();
    }

    else if (this.templateName == 'COMMUNITY') {
      this.isSubmit = true
      if (this.communityFilterForm.valid) {
        if (new Date(this.communityFilterForm.value.startDate) <= new Date(this.communityFilterForm.value.endDate)) {
          this.showModal = true;

          this.memberReqData['filter']['search'] = this.search;
          if (search != "") {
            this.memberReqData['page']['pageNumber'] = 0;
          }
          this.memberReqData['filter'] = this.communityFilterForm.value;
          this.memberReqData['filter']['activeMember'] = true;
        }
        else {
          this.toastrService.error('Please select valid End date')
          return false;
        }
      }
      else {
        this.toastrService.error('Fill all required Fields!');
        this.showModal = false;
        return false;
      }

      let req = {
        path: "community/user/getAll",
        data: this.memberReqData,
        isAuth: true,
      };
      this.spinner.show();
      this.apiService.post(req).subscribe(response => {
        this.memberList = response['data'];
        this.isSubmit = false;
        this.userPagination = false;
        this.commonPaginatin = true;
        this.totalMember = response['data']['totalElements'];
        this.totalPages = pagination.arrayTwo(this.memberList['totalPages'], this.memberReqData.page.pageNumber);
        this.memberList['content'].forEach((item, index) => {
          item['sub'] = false;
          item['submembers'] = [];
          item['profileShow'] = false;
          if (this.selectedAll == true) {
            item['checked'] = true;
          }
          this.checkUncheckUser['userIds'].forEach((user) => {
            if (user == item['id']) {
              item['checked'] = true;
            }
          });
          this.checkUncheckUser['userIdsNotIn'].forEach((user) => {
            if (user == item['id']) {
              item['checked'] = false;
            }
          });
          if (item.firstName) {
            if (item.profilePictureUrl == null || item.profilePictureUrl == '') {
              item['profileShow'] = false;
              item['profileUrl'] = item.firstName[0] + "" + item.lastName[0];
            } else {
              item['profileShow'] = true;
              item['profileUrl'] = item.profilePictureUrl;
            }
          }

        });
      });
      this.spinner.hide();
    }
    else if (this.templateName == 'EVENT') {
      this.isSubmit = true
      if (this.eventFilterForm.valid) {
        if (new Date(this.eventFilterForm.value.startDate) <= new Date(this.eventFilterForm.value.endDate)) {
          this.showModal = true;

          this.memberReqData['filter']['search'] = this.search;
          if (search != "") {
            this.memberReqData['page']['pageNumber'] = 0;
          }
          this.memberReqData['filter'] = this.eventFilterForm.value;

          if (this.eventFilterForm.value.allowChapterSponsors == false) {
            this.memberReqData['filter']['chapterSponsorshipCategoryIds'] = null;
          }
          if (this.eventFilterForm.value.allowChapterDonors == false) {
            this.memberReqData['filter']['chapterDonationCategoryIds'] = null;
          }
          if (this.eventFilterForm.value.allowSponsors == false) {
            this.memberReqData['filter']['sponsorshipCategoryIds'] = null;
          }
          if (this.eventFilterForm.value.allowDonors == false) {
            this.memberReqData['filter']['donationCategoryIds'] = null;
          }
          if (this.eventFilterForm.value.allowVendors == false) {
            this.memberReqData['filter']['expoCategoryIds'] = null;
          }
          if (this.eventFilterForm.value.allowPerformances == false) {
            this.memberReqData['filter']['status'] = null;
          }
          if (this.eventFilterForm.value.allowParticipants == false) {
            this.memberReqData['filter']['ruleCategoryIds'] = null;
          }
          if (this.eventFilterForm.value.successfulPayment == false) {
            this.memberReqData['filter']['successfulPayment'] = null;
          }
        }
        else {
          this.toastrService.error('Please select valid End date')
          return false;
        }
      }
      else {
        this.toastrService.error('Fill all required Fields!');
        this.showModal = false;
        return false;
      }

      let req = {
        path: "event/user/getAll",
        data: this.memberReqData,
        isAuth: true,
      };
      this.spinner.show();
      this.apiService.post(req).subscribe(response => {
        this.memberList = response['data'];
        this.isSubmit = false;
        this.userPagination = false;
        this.commonPaginatin = true;
        this.totalMember = response['data']['totalElements'];
        this.totalPages = pagination.arrayTwo(this.memberList['totalPages'], this.memberReqData.page.pageNumber);
        this.memberList['content'].forEach((item, index) => {
          item['sub'] = false;
          item['submembers'] = [];
          item['profileShow'] = false;
          if (this.selectedAll == true) {
            item['checked'] = true;
          }
          this.checkUncheckUser['userIds'].forEach((user) => {
            if (user == item['id']) {
              item['checked'] = true;
            }
          });
          this.checkUncheckUser['userIdsNotIn'].forEach((user) => {
            if (user == item['id']) {
              item['checked'] = false;
            }
          });
          if (item.firstName) {
            if (item.profilePictureUrl == null || item.profilePictureUrl == '') {
              item['profileShow'] = false;
              item['profileUrl'] = item.firstName[0] + "" + item.lastName[0];
            } else {
              item['profileShow'] = true;
              item['profileUrl'] = item.profilePictureUrl;
            }
          }

        });
      });
      this.spinner.hide();
    }
    this.showUser = true;

  }

  sendNow() {
    let count = 0;
    if (this.selectedAll == true) {
      count = this.memberList['totalElements'] - this.checkUncheckUser['userIdsNotIn'].length;
    }
    if (this.selectedAll == false) {
      count = this.checkUncheckUser['userIds'].length;
    }
    if (count == 0) {
      this.toastrService.error('Please select any one user');
      return false;
    } else {
      let message = '';
      Swal.fire({
        title: 'Are you sure?',
        text: 'Are you sure to send the notification to the users?!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Send it!',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.submit(true);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Notification has been not send.',
            'error'
          );
        }
      })
    }
  }

  drpDownChange(checkboxType, event) {
    if (checkboxType == 'chapterSponsor') {
      if (event.checked) {
        this.allowChapterSponsor = true;
      }
      else {
        this.allowChapterSponsor = false;
      }
    }
    else if (checkboxType == 'chapterDonor') {
      if (event.checked) {
        this.allowChapterDonor = true;
      }
      else {
        this.allowChapterDonor = false;
      }
    }
    else if (checkboxType == 'sponsor') {
      if (event.checked) {
        this.allowSponsors = true;
      }
      else {
        this.allowSponsors = false;
      }
    }
    else if (checkboxType == 'donor') {
      if (event.checked) {
        this.allowDonors = true;
      }
      else {
        this.allowDonors = false;
      }
    }
    else if (checkboxType == 'performance') {
      if (event.checked) {
        this.allowPerformances = true;
      }
      else {
        this.allowPerformances = false;
      }
    }
    else if (checkboxType == 'participant') {
      if (event.checked) {
        this.allowParticipants = true;
      }
      else {
        this.allowParticipants = false;
      }
    }
    else if (checkboxType == 'vendor') {
      if (event.checked) {
        this.allowVendors = true;
      }
      else {
        this.allowVendors = false;
      }
    }
  }

  getSponosrDonorDetail(ids) {
    this.chapterIds.length = 0;
    ids.forEach((item) => {
      this.chapterIds.push(item);
    })
    this.getChapterBasedDetail();
  }

  getChapterBasedDetail() {
    // to get SponsorList
    let data = {
      "chapterIds": this.chapterIds,
      "donationType": "SPONSOR",
    }

    let request = {
      path: "event/filter/sponsor/category",
      data: data,
      isAuth: true
    }

    this.apiService.post(request).subscribe(response => {
      this.chapterSponsorList = response['data'];
    });
    //SponsorList over

    //to get DonorList
    let data1 = {
      "chapterIds": this.chapterIds,
      "donationType": "DONATION",
    }

    let request1 = {
      path: "event/filter/sponsor/category",
      data: data1,
      isAuth: true
    }

    this.apiService.post(request1).subscribe(response => {
      this.chapterDonorList = response['data'];
    });
    //Donorlist over

    //to get eventList
    let data2 = {
      "chapterIds": this.chapterIds,
    }

    let request2 = {
      path: "event/filter/events",
      data: data2,
      isAuth: true
    }

    this.apiService.postWithToken(request2).subscribe(response => {
      this.eventList = response['data'];
    });
    //eventList over
  }

  getEventSelection(ids) {
    if (ids.length != 0) {
      this.isEventSelected = true;
      ids.forEach((item) => {
        this.eventIds.push(item);
      })
      this.getEventBasedDetail();
    } else {
      this.isEventSelected = false;
    }
  }

  getEventBasedDetail() {
    // to get SponsorList
    let data = {
      "chapterIds": this.chapterIds,
      "donationType": "SPONSOR",
      "eventIds": this.eventIds
    }

    let request = {
      path: "event/filter/sponsor/category",
      data: data,
      isAuth: true
    }

    this.apiService.post(request).subscribe(response => {
      this.eventSponsorList = response['data'];
    });
    //SponsorList over

    //to get DonorList
    let data1 = {
      "chapterIds": this.chapterIds,
      "donationType": "DONATION",
      "eventIds": this.eventIds
    }

    let request1 = {
      path: "event/filter/sponsor/category",
      data: data1,
      isAuth: true
    }

    this.apiService.post(request1).subscribe(response => {
      this.eventDonationList = response['data'];
    });
    //Donorlist over

    //to get VendorList
    let data2 = {
      "eventIds": this.eventIds
    }

    let request2 = {
      path: "event/vendorExpo/getAll",
      data: data2,
      isAuth: true
    }

    this.apiService.post(request2).subscribe(response => {
      this.eventVendorList = response['data'];
    });
    // VendorList over

    //to get ParticipantsList
    let data3 = {
      "eventIds": this.eventIds
    }

    let request3 = {
      path: "event/eventRules",
      data: data3,
      isAuth: true
    }

    this.apiService.post(request3).subscribe(response => {
      this.eventParticipantList = response['data'];
    });
    // ParticipantsList over

    //to get StatusList
    let request4 = {
      path: "event/status",
      isAuth: true
    }

    this.apiService.get(request4).subscribe(response => {
      this.statusList = response['data'];
    });
    //StatusList over
  }


  onSelectionChange(type, list) {
    if (type == 'chapterSponsor') {
      if (list.length == this.chapterSponsorList.length) {
        this.selectAllChapterSponsor = true;
      }
      else {
        this.selectAllChapterSponsor = false;
      }
    }
    else if (type == 'chapterDonor') {
      if (list.length == this.chapterDonorList.length) {
        this.selectAllChapterDonor = true;
      }
      else {
        this.selectAllChapterDonor = false;
      }
    }
    else if (type == 'sponsor') {
      if (list.length == this.eventSponsorList.length) {
        this.selectAllSponsor = true;
      }
      else {
        this.selectAllSponsor = false;
      }
    }
    else if (type == 'donor') {
      if (list.length == this.eventDonationList.length) {
        this.selectAllDonor = true;
      }
      else {
        this.selectAllDonor = false;
      }
    }
    else if (type == 'vendor') {
      if (list.length == this.eventVendorList.length) {
        this.selectAllVendor = true;
      }
      else {
        this.selectAllVendor = false;
      }
    }
    else if (type == 'performance') {
      if (list.length == this.statusList.length) {
        this.selectAllPerformance = true;
      }
      else {
        this.selectAllPerformance = false;
      }
    }
    else if (type == 'participant') {
      if (list.length == this.eventParticipantList.length) {
        this.selectAllParticipant = true;
      }
      else {
        this.selectAllParticipant = false;
      }
    }
  }

  selectAllItem(type, event) {
    if (type == 'chapterSponsor') {
      if (event.checked) {
        this.selectAllChapterSponsor = true;
        let array = [];
        this.chapterSponsorList.forEach((item, index) => {
          array.push(item.id);
        });
        this.eventFilterForm.patchValue({
          chapterSponsorshipCategoryIds: array
        })
      } else {
        this.selectAllChapterSponsor = false;
        this.eventFilterForm.patchValue({
          chapterSponsorshipCategoryIds: null
        })
      }
    }
    else if (type == 'chapterDonor') {
      if (event.checked) {
        this.selectAllChapterDonor = true;
        let array = [];
        this.chapterDonorList.forEach((item, index) => {
          array.push(item.id);
        });
        this.eventFilterForm.patchValue({
          chapterDonationCategoryIds: array
        })
      } else {
        this.selectAllChapterDonor = false;
        this.eventFilterForm.patchValue({
          chapterDonationCategoryIds: null
        })
      }
    }
    else if (type == 'sponsor') {
      if (event.checked) {
        this.selectAllSponsor = true;
        let array = [];
        this.eventSponsorList.forEach((item, index) => {
          array.push(item.id);
        });
        this.eventFilterForm.patchValue({
          sponsorshipCategoryIds: array
        })
      } else {
        this.selectAllSponsor = false;
        this.eventFilterForm.patchValue({
          sponsorshipCategoryIds: null
        })
      }
    }
    else if (type == 'donor') {
      if (event.checked) {
        this.selectAllDonor = true;
        let array = [];
        this.eventDonationList.forEach((item, index) => {
          array.push(item.id);
        });
        this.eventFilterForm.patchValue({
          donationCategoryIds: array
        })
      } else {
        this.selectAllDonor = false;
        this.eventFilterForm.patchValue({
          donationCategoryIds: null
        })
      }
    }
    else if (type == 'vendor') {
      if (event.checked) {
        this.selectAllVendor = true;
        let array = [];
        this.eventVendorList.forEach((item, index) => {
          array.push(item.id);
        });
        this.eventFilterForm.patchValue({
          expoCategoryIds: array
        })
      } else {
        this.selectAllVendor = false;
        this.eventFilterForm.patchValue({
          expoCategoryIds: null
        })
      }
    }
    else if (type == 'performance') {
      if (event.checked) {
        this.selectAllPerformance = true;
        let array = [];
        this.statusList.forEach((item, index) => {
          array.push(item.value);
        });
        this.eventFilterForm.patchValue({
          status: array
        })
      } else {
        this.selectAllPerformance = false;
        this.eventFilterForm.patchValue({
          status: null
        })
      }
    }
    else if (type == 'participant') {
      if (event.checked) {
        this.selectAllParticipant = true;
        let array = [];
        this.eventParticipantList.forEach((item, index) => {
          array.push(item.id);
        });
        this.eventFilterForm.patchValue({
          ruleCategoryIds: array
        })
      } else {
        this.selectAllParticipant = false;
        this.eventFilterForm.patchValue({
          ruleCategoryIds: null
        })
      }
    }



  }

  pagination(type, data, current = null, template = null) {
    if (template == 'user') {
      if (data == 'user') {
        if (type == 'prev') {
          this.userReqData.page.page = this.userReqData.page.page - 1;
        } else if (type == 'current') {
          this.userReqData.page.page = current;
        } else {
          this.userReqData.page.page = this.userReqData.page.page + 1;
        }
        setTimeout(() => window.scroll(0, 0), 1000);
        this.userData();
      }
    }
    else {
      if (data == 'user') {
        if (type == 'prev') {
          this.memberReqData.page.pageNumber = this.memberReqData.page.pageNumber - 1;
        } else if (type == 'current') {
          this.memberReqData.page.pageNumber = current;
        } else {
          this.memberReqData.page.pageNumber = this.memberReqData.page.pageNumber + 1;
        }
        this.userData();
      }
    }

  }

  resetPagination() {
    this.userReqData.page.page = 0;
    this.memberReqData.page.pageNumber = 0;
    this.search = '';
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg modal-dialog-centered' })
    );
  }
  openModalWithClassSelect(selectmember: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      selectmember,
      Object.assign({}, { class: "gray modal-lg edit-news" })
    );
    this.selectedMember();
  }
  message: any;
  closeModel() {
    this.memberReqData1["page"]["page"] = 0;
    this.modalRef.hide();
  }
  selectedMember() {
    let req = {
      path: "auth/user/getUsers",
      data: this.memberReqData1,
      isAuth: true,
    };
    if (this.selectmember.length == 0 && this.selectedAll == false) {
      this.memberReqData1["filter"]["userIds"] = this.selectmember;
      this.selectmemberList = [];
      this.totalPages1 = [];

      this.message = "Member is not selected";
    } else {
      this.memberReqData1["filter"]["userIds"] = this.selectmember;

      this.apiService.post(req).subscribe((response) => {
        this.selectmemberList = response["data"];
        this.selectmemberList["content"].forEach((item, index) => {
          item["sub"] = false;
          item["submembers"] = [];
          item["profileShow"] = false;
          //this.subMembers(item.id, index);
          if (item.firstName) {
            if (
              item.profilePictureUrl == null ||
              item.profilePictureUrl == ""
            ) {
              item["profileShow"] = false;
              item["profileUrl"] = item.firstName[0] + "" + item.lastName[0];
            } else {
              item["profileShow"] = true;
              item["profileUrl"] = item.profilePictureUrl;
            }
          }
        });

        this.totalPages1 = pagination.arrayTwo(
          this.selectmemberList["totalPages"],
          this.memberReqData1.page.page
        );
      });
    }
  }
  pagination1(type, data, current = null) {
    if (data == "user") {
      if (type == "prev") {
        this.memberReqData1.page.page = this.memberReqData1.page.page - 1;
      } else if (type == "current") {
        this.memberReqData1.page.page = current;
      } else {
        this.memberReqData1.page.page = this.memberReqData1.page.page + 1;
      }
      window.scroll(0, 0);
      this.selectedMember();
    }
  }
}
