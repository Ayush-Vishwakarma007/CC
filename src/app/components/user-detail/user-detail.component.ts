import {Component, HostListener, Input, OnDestroy, OnInit, TemplateRef,Output,EventEmitter} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiService} from "../../services/api.service";
import {SpinnerService} from "../../services/spinner.service";
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Location} from "@angular/common";
import Swal from "sweetalert2";
import {pagination} from "../../pagination";
import {EMAIL_PATTERN} from "../../helpers/validations";
import * as $ from "jquery";
import {CommunityDetailsService} from "../../services/community-details.service";
import {Moment} from "moment";
import * as moment from 'moment';
import { ThumbnailsMode } from '@ngx-gallery/core';
import { MenuService } from 'src/app/services/menu.service';
import { Editor, Toolbar } from 'ngx-editor';



@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit,OnDestroy {

  hide = true;
  
  modalRef: BsModalRef;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  startDate: Date;
  endDate: Date;
  selected: {startDate: Moment, endDate: Moment};

  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [
      moment()
        .subtract(1, 'month')
        .startOf('month'),
      moment()
        .subtract(1, 'month')
        .endOf('month')
    ],
    'Last 3 Month': [
      moment()
        .subtract(3, 'month')
        .startOf('month'),
      moment()
        .subtract(1, 'month')
        .endOf('month')
    ]
  };


  @Input()
  userPermisssion: any = [];

  @Input()
  currentTab = '';

  @Input()
  reqData: any = [];

  @Input()
  reseFilter ='';

  @Input()
  type = '';

  @Input()
  userId = '';
  @Input()
  chapterId = '';

  searchString: string = '';


  @Output() userDetailArraychange: EventEmitter<any> = new EventEmitter();
  _userDetailArray: any;
  @Input()
  get userDetailArray() {
    return this._userDetailArray;
  }

  set userDetailArray(value) {
    this._userDetailArray = value;
    this.userDetailArraychange.emit(value);
  }


  fieldName: any;
  filedValue: any;
  value: any;
  isHidden: boolean = true;
  memberId = '';
  memberList: any = [];
  totalFemMeb: any = [];
  status: boolean = false;
  rejectDetails: any = [];
  totalMember = 0;
  memberDetail: any = [];
  addMember: boolean = false;
  addMemberForm: FormGroup;
  accessForm: FormGroup;
  pagelimit:any ;
  submitBtn: boolean = true;
  rejectedData: any = [];
  notificationData: any = [];
  isMemberFormSubmitted = false;
  editMemberForm: FormGroup;
  validation: any;
  search = '';
  checkedfield: any = [];
  totalPages: any = [];
  rolesList: any = [];
  selectedRoles: any = [];
  chapterList: any = [];
  selectedAccess: any = [];
  memberdeletelist:any=[];
  reqData1:any=[];
  memType:any=[];
  reqActivity:any=[];
  referenceId:any;
  submittedPform: boolean = true;
  approveData:any = [];

  userDetails: any;
  membershipDetail:any;
  durationTypeList: any;
 // chapterId:any;
  private fb: FormBuilder;
  updateNewsletterArray:any =[];
  userDetail: any;
approveId:any;
mainUser:boolean
  showRow:boolean=false
  totalMemLab:any;
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
      [{'header': 1}, {'header': 2}],
      ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
      ["link"]

    ]
  };

  notificationForm: FormGroup;
  listType = 'table';
  pathUrl = '';
  selectedOtp='all';
  urlPattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  changePassword = '';
  activeIndex = 0;
  adminFirstName:any
  adminLastName:any
  loginDate:any

 /* pagefilter:any=[{
    value:15
  },
    {
      value:25
    },
    {
      value:50
    },
    {
      value:100
    },
  ]*/
 // pagefilter=[]
  pagelist:any=[]

 // limit=15
  //selected=this.pagefilter[0].value
  private showProfile: boolean;
  private logoName: string;
  private ModalSelectedUser: any;
  profilesrc:any;
  path:any;
  familyArray:any;
  profileForm:FormGroup;
  subscribeNewsLetter:boolean = false;
  newUserDetails: any = [];
  countryData:any;
  ph:any;
  username: any;
  memberState:any=[];
  tab = 'ALL';
  statisticSubject: Subject<any> = new Subject();
  memberSubject :  Subject<any> = new Subject();
  currentActiveTab = 'All';
  resetbtn:any='';
  deleteReason:string='';
  delId:any;
  duration:any;
  reasonArray:any=[];
  storeActivityLog:any=[]
  totalPages1:any
  constructor(public Http: HttpClient, public communityDetailsService: CommunityDetailsService, private modalService: BsModalService, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location,public menuService: MenuService) {
    this.addMemberForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      city: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    });
    this.accessForm = this.formBuilder.group({
      roles: [[], Validators.required],
      access: [[]]
    })
    this.notificationForm = this.formBuilder.group({
      message: ['', Validators.required],
      subject: ['', Validators.required],
    });
    this.editMemberForm = this.formBuilder.group({});
    this.pathUrl = this.router.url;

    this.profileForm = this.formBuilder.group({
      id:[],
      firstName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      lastName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      middleName:[''],
      phone: [''],
      email: ['',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      countryPhoneCode: [''],
    });

  }
  get f() {
    return this.profileForm.controls;
  }
  ngOnInit() {
    this.editor = new Editor();
    //this.userDetailArray['userState']=this.tab
   //this.deletemember()
    this.saveSubscription = this.save.subscribe((data) => {

      this.search = '';
      this.reqData['page'] = {
       // "limit":this.pagefilter[0].value,
       "limit": this.communityDetailsService.pagelimit,
        "page": 0
      };
      this.getRoles();

      this.getChapterList();
      this.membershipType();
      this.changeMemberType(this.selectedOtp);

     if(data==true){
      this.search=""
      this.reqData['filter']['search'] = this.search;
      this.reqData1['filter']['search'] = this.search;
      localStorage.removeItem("search");
      this.selectedOtp='all';
      delete(this.reqData['filter']['membershipTypeIds']);
      delete(this.reqData1['filter']['membershipTypeIds']);
      delete this.reqData['filter']['startDate'];
      delete this.reqData['filter']['endDate'];
      delete this.reqData1['filter']['startDate'];
      delete this.reqData1['filter']['endDate'];

      this.communityDetailsService.pagelimit = this.communityDetailsService.pagelist[0];
      this.reqData1['page']['limit'] =   this.communityDetailsService.pagelimit;
      this.reqData['page']['limit'] =   this.communityDetailsService.pagelimit;

      this.selected = null;


     }

    })
    this.reqData1={

      "filter":{
        "search": ""

      },
      "page":{
        "limit":this.communityDetailsService.pagelimit,
        "page":0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    }
    this.reqActivity={
      "filter": {

        "userId": "",

      },
        "page": {
        "limit": 10,
        "page": 0
        },
        "sort": {
        "orderBy": "DESC",
        "sortBy": "DATE_TIME"
        }

    }
    this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.path= event.url;
      }
    });

    if(this.path="'/management/newsletter-management'") {
      this.search ='';
      localStorage.removeItem("search")
    }

    this.get_country();
    this.getUserDetail();
    this.getMemberState();
    this.memberData();
  }
  @HostListener('unloaded')
  ngOnDestroy() {
    this.saveSubscription.unsubscribe();
  }
  // ====================== export to excel ============================
  getCurrentDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //because January is 0!
    let yyyy = today.getFullYear();

    let date = '';
    let mon = '';

    if (dd < 10) {
      date = '0' + dd;
    }
    if (mm < 10) {
      mon = '0' + mm;
    }
    return (date + mon + yyyy);
  }

  clickMemDetail(id) {
    this.router.navigate(['member-details/' + id]);
  }

  membershipType(){
    let req = {
      path: "auth/membershipType/getAll",
      isAuth: true,
    };
    this.apiService.get(req).subscribe(response => {
      if(response['status']['code']=="OK") {
        this.memType = response['data'];
      }else{
        this.toastrService.error("Membership List Error!");
      }
    });
  }

  exportToExport() {

    let memberStatus = "";
    let fileName = this.currentTab + "_";
    if(this.type=="DELETE_MEMBER"){
      delete(this.reqData['filter']['userState'])
      delete(this.reqData['filter']['mainUser'])
      delete(this.reqData['filter']['roles'])
      let req = {
        path: "auth/user/all/deleted/excel",
        data: this.reqData,
        isAuth: true,
      };
      let currentDate = this.getCurrentDate();
       let Exportfilename = fileName + currentDate;
      this.apiService.ExportReqBody(req, Exportfilename);
      // this.apiService.post(req).subscribe(response => {
      //   //console.log(response)
      //   if (response['status']['code'] == "OK") {
      //     this.toastrService.success(response['status']['description']);
      //   } else {
      //     this.toastrService.error(response['status']['description']);
      //   }
      // })
    }else {
      let req = {
        path: "auth/users/excel/send",
        data: this.reqData,
        isAuth: true,
      };
      this.apiService.post(req).subscribe(response => {

        if (response['status']['code'] == "OK") {
          this.toastrService.success(response['status']['description']);
        } else {
          this.toastrService.error(response['status']['description']);
        }
      })
    }

    // let currentDate = this.getCurrentDate();
    //
    // let Exportfilename = fileName + currentDate;
    //
    // this.apiService.ExportReqBody(req, Exportfilename);
  }

  //====================================================================
  searchFunction(search){
    this.showRow = true;
    this.reqData['filter']['search'] = this.search;
    localStorage.setItem("search",this.search)
    this.searchString = search;

    // if(this.path="'/management/newsletter-management'") {
    //   search ==''
    //   console.log("works!")
    // }

    if(search ==''){
      this.reqData['page']['page'] = 0;
      localStorage.removeItem("search")
    }

    this.memberData()

  }

  datesUpdated(e){
    this.startDate = new Date(e.startDate.add(1,'days').format('MM-DD-YYYY'));
    this.endDate = new Date(e.endDate.add(1,'days').format('MM-DD-YYYY'));

    this.reqData['filter']['startDate'] = this.startDate;
    this.reqData['filter']['endDate'] = this.endDate;
    this.reqData1['filter']['startDate'] = this.startDate;
    this.reqData1['filter']['endDate'] = this.endDate;
    this.memberData();
  }

  clearDateFilter(){
    delete this.reqData['filter']['startDate'];
    delete this.reqData['filter']['endDate'];
    delete this.reqData1['filter']['startDate'];
    delete this.reqData1['filter']['endDate'];
    this.selected = null;

    // this.memberData();
    this.newMeberData();
  }

  memberData() {

    this.search=localStorage.getItem("search")

    this.reqData['filter']['search'] = this.search;
    if (this.type == 'family' || this.type == 'guest')
    {
      let data = {
        path: "auth/user/getUserDetail/" + this.userId,
        isAuth: true
      };
      this.apiService.get(data).subscribe(response => {
// console.log('123456',this.response);
        if (response.type == 'family') {
          // console.log('abcd',response);
          this.memberList['content'] = response['data']['familyMembers'];       
        } else {
          this.memberList['content'] = response['data']['guests'];
        }
        this.memberList['content'].forEach((item, index) => {
          item['sub'] = false;
          item['submembers'] = [];
          item['profileShow'] = false;
          // this.subMembers(item.id, index);
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
        if (this.type == 'family') {
          this.memberList['totalElements'] = response['data']['familyMembers'].length;
          // console.log('123456',this.memberList);
        } else {
          this.memberList['totalElements'] = response['data']['guests'].length;
        }
      });
    }
    else {
      // if(search != ''){
      //   this.reqData['page']['page'] = 0;
      // }
      //

      let req ={};
      console.log("foamm",this.reqData);
      if(this.type=='subscriber' || this.type=='unsubscriber'){
        delete(this.reqData['filter']['roles']);
      }
      if(this.type=='DELETE_MEMBER') {
        this.reqData1['filter']['roles']=[
          "USER",
          "GUEST",
          "MEMBER"
        ]
        this.reqData1['filter']['search'] = this.search;
        this.reqData1['page']['limit'] = this.communityDetailsService.pagelimit;
        req = {
          path: "auth/user/all/deleted",
          data: this.reqData1,
          isAuth: true,
        };
      }else {
        req = {
          path: "auth/user/getUsers",
          data: this.reqData,
          isAuth: true,
        };
      }
      this.spinner.show();
      this.apiService.post(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.spinner.hide();
          this.memberList = response['data'];
          this.totalFemMeb = response['details']
          let member_length = this.memberList['content'].length;
          let page_no = this.reqData.page.page;
          if (member_length == 0) {
            if (page_no != 0) {
              this.reqData.page.page = page_no - 1;
              this.memberData();
            }
          }
          this.totalPages = pagination.arrayTwo(this.memberList['totalPages'], this.reqData.page.page);

          this.reseFilter = '';
          this.memberList['content'].forEach((item, index) => {
            if(item.phone) {
              if (item.phone.length === 0) {
                item.phone = '';
              } else if (item.phone.length <= 3) {
                item.phone = item.phone.replace(/^(\d{0,3})/, '($1)');
              } else if (item.phone.length <= 6) {
                item.phone = item.phone.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
              } else if (item.phone.length <= 10) {
                item.phone = item.phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
              } else {
                item.phone = item.phone.substring(0, 10);
                item.phone = item.phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
              }
            }
            item['sub'] = false;
            item['submembers'] = [];
            item['profileShow'] = false;
            //this.subMembers(item.id, index);
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

          this.totalMember = response['data']['totalElements'];
          this.spinner.hide();
        }else{
          this.spinner.hide();
        }
      });
      // this.reseFilter =='resetFilter';


    }


  }
  response(arg0: string, response: any) {
    throw new Error('Method not implemented.');
  }
  family(arg0: string, family: any) {
    throw new Error('Method not implemented.');
  }

  changeMemberType(event){

    if(event =='all'){
     delete( this.reqData['filter']['membershipTypeIds']);
      delete(this.reqData1['filter']['membershipTypeIds']);
    }else{
      this.reqData['filter']['membershipTypeIds'] = [event];
      this.reqData1['filter']['membershipTypeIds'] = [event];
    }
    this.reqData['filter']['roles'] =  [
      "USER",
      "GUEST",
      "MEMBER"
    ];
    this.communityDetailsService.pagelimit = this.communityDetailsService.pagelist[0];
    this.reqData1['page']['limit'] =   this.communityDetailsService.pagelimit;
    this.reqData['page']['limit'] =   this.communityDetailsService.pagelimit;
    // this.memberData();
    this.newMeberData();

  }

  selected_pagelimit(event) {
    this.pagelimit=event.value
    this.reqData.page.limit = this.pagelimit;
    this.reqData1.page.limit=this.pagelimit
    this.memberData();

  }
  searchClick() {
    this.reqData['filter']['search'] = this.search;
    if(this.search ==''){
      this.reqData['page']['page'] = 0;
    }
    this.memberData()
  }

  subMember(member, id, index) {
    let req = {
      path: "auth/user/getUserDetail/" + id,
      isAuth: true,
    };
    let sub = '';
    if (this.memberList['content'][index]['sub'] == false) {
      sub = 'true';
    }
    if (this.memberList['content'][index]['sub'] == true) {
      sub = 'false';
    }
    if (sub == 'true') {
      this.spinner.show();
      this.apiService.get(req).subscribe(response => {
        let array = [];
        array = response['data']['familyMembers'];
        console.log("arr ",array)
        array.concat(response['data']['guest']);
        this.spinner.hide();
        this.memberList['content'][index]['submembers'] = array;
      });
    }
    member['sub'] = !member['sub'];
  }
  /*pageLimit(){
    let request = {
      path: 'community/configuration/pageFilterValue',

    };
    this.apiService.get(request).subscribe(response => {
      this.pagelimit = response['data'][0];
      this.pagelist=response['data']
      this.reqData['page']['limit'] = this.pagelimit
      this.reqData1['page']['limit'] = this.pagelimit
    });
    this.saveSubscription = this.save.subscribe(() => {
      this.search = '';

      this.reqData['page'] = {
       // "limit":this.pagefilter[0].value,
       "limit": this.pagelimit,
        "page": 0
      };
      this.memberData();
      this.getRoles();
      this.getChapterList();
    });
  }*/

  subMembers(id, index) {
    let req = {
      path: "auth/user/getUserDetail/" + id,
      isAuth: true,
    };

    this.apiService.get(req).subscribe(response => {
      let array = [];
      array = response['data']['familyMembers'];
      array.concat(response['data']['guest']);
      this.memberList['content'][index]['submembers'] = array;
    });
  }
  subscribeNewsletter(id,text){
    let lab;
    if(text =='subscribe'){
      lab ='Subscribe';
    }else{
      lab ='Unsubscribe';
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be '+text+' for the newsletter!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, '+text+' it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let formdata={};
        if(text=='unsubscribe'){
          formdata['subscribeNewsLetter'] = false;
        }else {
          formdata['subscribeNewsLetter'] = true;
        }

        let request1: any;
        request1 = {
          path: "auth/subscribe/newsletterNotify/" + id,
          data:formdata,
          isAuth: true,
        };
        this.apiService.post(request1).subscribe(response => {
          if (response['status']['code'] == 'BAD_REQUEST') {
            Swal.fire(
              'warning!',
              response['status']['description'],
              'warning'
            );
          } else {
            Swal.fire(
              lab,
              //response['status']['description'],
              response['status']['description'],
              'success'
            );
          }


          this.memberData();
        }, error => {
          Swal.fire(
            'Cancelled',
            'User is not '+text,
            'error'
          )
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'User is not '+text,
          'error'
        )
      }
    })
  }
  RecoverMember(id){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be able to recover this User!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request1: any;
          request1 = {
            path: "auth/user/recover/" + id,
            isAuth: true,
          };
        this.apiService.get(request1).subscribe(response => {
          if (response['status']['code'] == 'BAD_REQUEST') {
            Swal.fire(
                'warning!',
                response['status']['description'],
                'warning'
            );
          } else {
            Swal.fire(
                'Active!',
                //response['status']['description'],
                response['status']['description'],
                'success'
            );
          }


          this.memberData();
        }, error => {
          Swal.fire(
              'Cancelled',
              'User is not recover.',
              'error'
          )
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
            'Cancelled',
            'User is not recover.',
            'error'
        )
      }
    })
  }
  deleteMember(id,durationName,status = false) {
    if (id == undefined) {
      id = this.editMemberForm.value.id;
    }
    if(status == false){
      this.modalRef.hide();
    }
    let label = 'inactive';
    if (this.type == 'subscriber') {
      label = 'unsubscribe';
    }
    let msgLable ='You will not be able to recover this User!';
    let msgtitle="Are you sure?";
    if(durationName =='LIFETIME'){
     msgLable ='Inactivation for life member is not allowed, you still want to inactivate ?';
      msgtitle="WARNING";
    }else{
      msgLable ='You will not be able to recover this user!';
      msgtitle="Are you sure?";
    }
    $("#delete_btn").click();
    Swal.fire({
      title: msgtitle,
      text: msgLable,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, ' + label + ' it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request1: any;
        if (this.type == 'member') {
          request1 = {
            path: "auth/user/delete/" + id +"?deleteReason="+this.deleteReason,
            isAuth: true,
          };
        }
         else if (this.type == 'user') {
          request1 = {
            path: "auth/user/delete/" + id+"?deleteReason="+this.deleteReason,
            isAuth: true,
          };
        } else if (this.type == 'family' || this.type == 'guest') {
          request1 = {
            path: "auth/user/delete/" + id +"?deleteReason="+this.deleteReason,
            isAuth: true,
          };
        } else if (this.type == 'subscriber') {
          request1 = {
            path: "auth/subscribe/" + id +"?deleteReason="+this.deleteReason,
            isAuth: true,
          };
        }
        else if (this.type != 'member' ||  'user' ||'family'|| 'guest'||'subscriber') {
          request1 = {
            path: "auth/user/delete/" + id +"?deleteReason="+this.deleteReason,
            isAuth: true,
          };
        }

        this.apiService.get(request1).subscribe(response => {
          if (response['status']['code'] == 'BAD_REQUEST') {
            Swal.fire(
              'warning!',
              response['status']['description'],
              'warning'
            );
          } else {
            Swal.fire(
              'Inactive!',
              //response['status']['description'],
              response['status']['description'],
              'success'
            );
          }


          this.memberData();
          this.modalRef.hide();
          this.deleteReason='';
        }, error => {
          Swal.fire(
            'Cancelled',
            'User is safe.',
            'error'
          )
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'User is safe.',
          'error'
        )
      }
    })
  }

  editMember(id,mainuser) {
    this.mainUser=mainuser
    if (this.currentTab == 'MEMBER') {
      this.isHidden = true;

    }
    if (this.currentTab == 'NEW_MEMBER') {
      this.isHidden = false;
    }
    this.memberId = id;
    this.selectedAccess = [];
    this.selectedRoles = [];
    this.memberList['content'].map((data) => {

      if (data['id'] == id) {
        this.selectedRoles = data['roles'];
        if (data.userAccessList) {
          data.userAccessList.map((item) => {
            this.selectedAccess.push(item.specificId);
          })
        }
      }
    });

    this.memberList['content'].map((data) => {
      data['submembers'].map((item) => {
        if (item['id'] == id) {
          this.selectedRoles = item['roles'];
          if (item.userAccessList) {
            item.userAccessList.map((i) => {
              this.selectedAccess.push(i.specificId);
            })
          }
        }
      })
    });


    this.accessForm.patchValue({roles: this.selectedRoles, access: this.selectedAccess})
    this.spinner.show();
    this.editMemberForm = this.formBuilder.group({});
    let req = {
      path: "auth/formSteps/" + id,
      isAuth: true,
    };
    this.apiService.get(req).subscribe(response => {

      this.memberDetail = response['data'];
      this.memberDetail.forEach((item, index) => {
        this.editMemberForm.addControl('id', new FormControl(id, Validators.required));
        item.fieldValues.forEach((value, index1) => {
          let fieldName = value.fieldName;
          this.filedValue = value.value;
          
          if (this.filedValue == null) {
            this.filedValue = '';
          }
          if (value.type == 'CHECK_BOX') {
            value.optionList = [];
            value.options.filter((op) => {
              value.optionList.push({'value': op, 'check': false});
            });
            let filedValue = this.filedValue.split(',');
            value.optionList.filter((list) => {
              filedValue.filter((op) => {
                if (op == list['value']) {
                  list['check'] = true;
                }
              });
            });
          }
          //this.editMemberForm.controls[fieldName].clearValidators();\
          if (value.required == true) {
            if (value.type == 'URL') {
              this.validation = [Validators.required, Validators.pattern(this.urlPattern)];
            } else {
              this.validation = [Validators.required];
            }
          } else {
            if (value.type == 'URL') {
              this.validation = [Validators.pattern(this.urlPattern)];
            } else {
              this.validation = [];
            }
          }
          this.editMemberForm.addControl(fieldName, new FormControl(this.filedValue, this.validation));
        });
      });


      this.isMemberFormSubmitted = true;
      setTimeout(() => {
        $('#editBtn').click();
        this.spinner.hide();

      }, 800);
    });

  }

  pagination(type, data, current = null) {
    if (data == 'user') {
      if (type == 'prev') {

        this.reqData.page.page = this.reqData.page.page - 1;

      } else if (type == 'current') {

        this.reqData.page.page = current;
      } else {

        this.reqData.page.page = this.reqData.page.page + 1;
      }
      this.memberData();
      document.getElementById("user_form").scrollIntoView();

    }
  }

  getChapterList() {
    let request = {
      path: 'community/chapters',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.chapterList = response['data'];
    });
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }

  checkboxChange(member, event, value) {
  }

  editMemberFormSubmit(mainUser) {

    if (this.activeIndex == this.memberDetail.length + 1) {
      if ($.trim(this.changePassword) != '') {
        let formdata = {
          "newPassword": btoa(this.changePassword)
        }
        let data = {
          path: "auth/user/forgetPassword/update/" + this.editMemberForm.value.id,
          data: formdata,
          isAuth: true
        };
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            this.addMember = false;
            this.isMemberFormSubmitted = false;
            this.modalRef.hide();
            //$("#delete_btn").trigger("click");
            this.memberData();
            this.toastrService.success(response['status']['description']);
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });
      } else {
        this.toastrService.error('Please enter valid password');
      }
    } else {
      this.memberDetail.forEach((item, index) => {
        item.fieldValues.forEach((value, index1) => {
          let fieldName = value.fieldName;
          if (value.type == 'CHECK_BOX') {
            let checked = '';
            value['optionList'].filter((list) => {
              if (list['check'] == true) {
                checked += list['value'] + ',';
              }
            });
            if (value.required == true) {
              this.validation = [Validators.required];
            } else {
              this.validation = [];
            }
            this.editMemberForm.patchValue({
              fieldName: checked
            });
            this.editMemberForm.removeControl(fieldName);
            this.editMemberForm.addControl(fieldName, new FormControl(checked, this.validation));
            value.value = checked;
          }
        });
      });
      if (this.editMemberForm.valid) {

        let formdata = {"fieldValues": this.editMemberForm.value}
        formdata['roles'] = this.accessForm.value.roles;
        let userAccessList = [];
        this.accessForm.value.access.map((item) => {
          userAccessList.push({
            "accessType": "CHAPTER",
            "specificId": item
          });
        });
        formdata['userAccessList'] = userAccessList;
        formdata['fieldValues']['mainUser'] = this.mainUser;

        let data = {
          path: "auth/member/update/" + this.editMemberForm.value.id,
          data: formdata,
          isAuth: true
        };
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            this.addMember = false;
            this.memberId='';
            this.isMemberFormSubmitted = false;
            this.modalRef.hide();
            //$("#delete_btn").trigger("click");
            this.memberData();
            this.toastrService.success(response['status']['description']);
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });
      } else {
        this.toastrService.error('All * fields are required');
      }
    }
  }

  changeTab1(event) {
    this.activeIndex = event.index;
  }

  changeList(type) {
    this.listType = type;
    this.memberData();
  }

  NotificationClear() {
    this.notificationData['message'] = "";
    this.modalRef.hide()
  }

  submitNotification() {
    if ($.trim(this.notificationData['message']) != '' && this.notificationData['message'] != undefined) {
      let postData = {
        'message': this.notificationData['message']
      };
      let req = {
        path: "auth/member/contact/" + this.notificationData['id'],
        data: postData,
        isAuth: true,
      };
      this.apiService.post(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          $('#deleEmail').trigger("click");
          this.toastrService.success(response['status']['description']);
          this.modalRef.hide();
          this.memberData();
          this.notificationData['id'] = '';
          this.notificationData['message'] = '';
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    } else {
      this.toastrService.error('Add valid reason');
    }
  }

  sort(type) {
    if (type == 'name') {
      this.reqData['sort']['sortBy'] = 'FIRST_NAME';
      this.reqData1['sort']['sortBy'] = 'FIRST_NAME';

    } else if (type == 'address') {
      this.reqData['sort']['sortBy'] = 'ADDRESS';
      this.reqData1['sort']['sortBy'] = 'ADDRESS';
    } else if (type == 'email') {
      this.reqData['sort']['sortBy'] = 'EMAIL';
      this.reqData1['sort']['sortBy'] = 'EMAIL';
    } else if (type == 'phone') {
      this.reqData['sort']['sortBy'] = 'PHONE';
      this.reqData1['sort']['sortBy'] = 'PHONE';

    }
    if (this.reqData['sort']['orderBy'] == 'ASC') {
      this.reqData['sort']['orderBy'] = 'DESC';
      this.reqData1['sort']['orderBy'] = 'DESC';
    } else if (this.reqData['sort']['orderBy'] == 'DESC') {
      this.reqData['sort']['orderBy'] = 'ASC';
      this.reqData1['sort']['orderBy'] = 'ASC';
    }
    this.memberData();
  }

  approveMember(id) {
    this.approveData['id']=id;
    let req = {
      path: "auth/member/approve/" + id,
      isAuth: true,
    };
    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.memberData();
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  notificationMember(id) {
    this.notificationData['id'] = id;
  }

  rejectMember(id) {
    this.rejectedData['id'] = id;
    let req = {
      path: "auth/configuration/rejectionReason",
      isAuth: true,
    };
    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.rejectDetails = response['data'];
        this.rejectedData['message'] = "";
        this.rejectedData['reason'] = ""
      }
    });
  }

  sendLink(id) {
    let req = {
      path: "auth/member/paymentLink?userId=" + id,
      isAuth: true,
    };
    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
      } else {
        this.toastrService.error(response['status']['description']);

      }
    });
  }
  cancelRejectMember(){
    this.modalRef.hide();
    this.rejectedData['reason']='';
  }
  submitRejectMember() {
    //  if ($.trim(this.rejectedData['message']) != '' && this.rejectedData['message'] != undefined) {
      // let postData = {
      //   'message': this.rejectedData['message'],
      //   'reason': this.rejectedData['reason']
      // };
    //  if (this.rejectedData['reason'] != '' && this.rejectedData['reason'] != undefined) {

    if(this.rejectedData['reason']==''){
      this.rejectedData['reason']=this.rejectedData['message'];
    }
     if ($.trim(this.rejectedData['message']) != '' || this.rejectedData['reason'] != '') {

      let postData = {
        'message': this.rejectedData['message'],
        'reason': this.rejectedData['reason']

      };

        let req = {
          path: "auth/member/reject/" + this.rejectedData['id'],
          data: postData,
          isAuth: true,
        };
        this.apiService.post(req).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            $('.delReject').trigger("click");
            this.toastrService.success(response['status']['description']);
            this.memberData();

            this.rejectedData['id'] = '';
            this.rejectedData['reason'] = '';
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });
      }
       else {
        this.toastrService.error('Please provide reason to reject membership');
      }
    // }
    //  else {
    //   this.toastrService.error('Add valid reason');
    // }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  openModalWithClass(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'modal-lg modal-dialog-centered edituser'})
    );
  }

  openModalWithClass1(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'modal-lg termsmain rejectmem'})
    );
  }

  openModalWithClassEmail(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'modal-lg infomainpopup terms-margin'})
    );
  }

  openModalWithClassEmail2(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'modal-dialog infomainpopup'})
    );
  }

  reasonForRejection(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'modal-dialog termsmain rejectmem'})
    );
  }
  reasonForUserLog(template: TemplateRef<any>,id,firstName,lastName,lastLoginDate) {
    this.referenceId=id
    this.adminFirstName=firstName
    this.adminLastName=lastName
    this.loginDate=lastLoginDate
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'modal-dialog performance-newsletter wid-user'})
    );
    this.activityLog()
  }
activityLog(){
  this.reqActivity['filter']['userId']=this.referenceId
  let req = {
    path: "auth/activityLog/getAll",
    data: this.reqActivity,
    isAuth: true,
  };
  this.apiService.post(req).subscribe(response => {
    this.storeActivityLog=response['data']
    this.totalPages1 = pagination.arrayTwo(
      this.storeActivityLog["totalPages"],
      this.reqActivity.page.page
    );
  })

}
pagination1(type, data, current = null) {
  if (data == "user") {
    if (type == "prev") {
      this.reqActivity.page.page = this.reqActivity.page.page - 1;
    } else if (type == "current") {
      this.reqActivity.page.page = current;
    } else {
      this.reqActivity.page.page = this.reqActivity.page.page + 1;
    }
    window.scroll(0, 0);
    this.activityLog();
  }
}
  clickEvent() {
    this.status = !this.status;
  }

  getRoles() {
    let req = {
      path: "auth/roles",
      isAuth: true,
    };
    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        let array=[];
        response['data'].map((item) => {
          if (item.selectable == true) {
            array.push(item);
          }
        });
        this.rolesList =array;
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });

  }

  roleChange(data) {
    let find = data.find(ob => ob == 'CHAPTER_ADMIN');
    this.selectedRoles = this.accessForm.value.roles;

    if (this.selectedAccess.length == 0 && find != undefined) {
      this.selectedAccess.push(this.chapterList[0]['id']);
    }
    if (find == undefined) {
      this.selectedAccess = [];

    }
    this.accessForm.patchValue({
      access: this.selectedAccess
    })
  }

  chapterChange(data) {
    this.selectedRoles = this.accessForm.value.roles;
    this.selectedAccess = this.accessForm.value.access;

    if (data.length != 0) {
      this.selectedRoles = this.selectedRoles.filter((item) => item != 'CHAPTER_ADMIN')
      this.selectedRoles.push('CHAPTER_ADMIN');
    } else {
      this.selectedRoles = this.selectedRoles.filter((item) => item != 'CHAPTER_ADMIN')
    }
    this.accessForm.patchValue({
      roles: this.selectedRoles
    })
  }

  public openModal1(template: TemplateRef<any>,id) {
    this.modalRef = this.modalService.show(template, { class: "modal-lg performance-newsletter wid-user" });
  this.getProfileDetail(id);
  }

  public openModal(template: TemplateRef<any>,id) {
    this.modalRef = this.modalService.show(template, { class: "modal-lg performance-newsletter wid-user" });
    this.ModalSelectedUser = id;

    let req = {
      path: "auth/user/getUserDetail/"+id,
      isAuth: true,
    };
    this.apiService.get(req).subscribe(response => {
      this.userDetail = response['data']['user'];
      this.familyArray = response['data']['familyMembers']
      if(this.userDetail.phone) {
        if (this.userDetail.phone.length === 0) {
          this.userDetail.phone = '';
        } else if (this.userDetail.phone.length <= 3) {
          this.userDetail.phone = this.userDetail.phone.replace(/^(\d{0,3})/, '($1)');
        } else if (this.userDetail.phone.length <= 6) {
          this.userDetail.phone = this.userDetail.phone.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
        } else if (this.userDetail.phone.length <= 10) {
          this.userDetail.phone = this.userDetail.phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
        } else {
          this.userDetail.phone = this.userDetail.phone.substring(0, 10);
          this.userDetail.phone = this.userDetail.phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
        }
      }
      if (response['data']['user']['profilePictureUrl'] == '' || response['data']['user']['profilePictureUrl'] == null) {
        this.showProfile = false;
      } else {
        this.showProfile = true;
        this.profilesrc = response['data']['user']['profilePictureUrl'];
      }
      this.logoName = response['data']['user']['firstName'][0] + "" + response['data']['user']['lastName'][0];

    });
  }


  reasonForApproval(template: TemplateRef<any>,id) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'modal-dialog termsmain rejectmem'})
    );
    this.approveId=id;
  }

  cancelApprovedMember(){
    this.modalRef.hide();
     this.approveData['reason']='';
  }





 submitApproveMember(){
  if(this.approveData['reason']!=''){

    let postData = {
      'approveReason': this.approveData['reason'],
    };
      let req = {
        path: "auth/member/approve/" + this.approveId,
        data: postData,
        isAuth: true,
      };
      this.apiService.post(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          $('.delReject').trigger("click");
          this.toastrService.success(response['status']['description']);
          this.memberData();
          this.approveData['id'] = '';
          this.approveData['reason'] = '';
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
     else {
      this.toastrService.error('Please provide reason to approve membership');
    }
 }

 profileFormSubmit() {
  if (this.profileForm.valid) {
    this.submittedPform = true;
    let formdata = {};
    let profileFormVal = this.profileForm.value;
    profileFormVal.subscribeNewsLetter = this.subscribeNewsLetter;
    formdata['fieldValues'] =profileFormVal;
    let data = {
      path: "auth/member/update/" +this.profileForm.value.id,
      data:formdata,
      isAuth: true
    };

    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success('Details updated successfully');
        this.modalRef.hide();
        this.memberData();
      } else {
        this.toastrService.error(response['status']['description']);
        this.submittedPform = false;
      }
    });

  } else {
    this.toastrService.error("Please fill all required fields!");
    this.submittedPform = false;
  }
}




  newsletterChanges($event) {
    this.subscribeNewsLetter =$event.checked;
    let data = {
      path: "auth/subscribe/" + this.newUserDetails['id'],
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  getUserDetail() {

    let data = {
      path: "auth/user/getUser/" + this.newUserDetails['id'],
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      if(response['data']) {
        this.subscribeNewsLetter = response['data']['subscribeNewsLetter'];
      }
    });
  }

  get_country() {
    let contry_data = {
      path: "auth/country",
      isAuth: false
    };

    this.apiService.get(contry_data).subscribe(response => {
      this.countryData = response['data'];
    });
  }


  getProfileDetail(userId) {
    let data = {
      path: "auth/user/getUserDetail/"+userId,
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.newUserDetails =response['data']['user'];
      this.getUserDetail();
      this.ph = response['data']['user']['phone'];
      this.profilesrc = response['data']['user']['profilePictureUrl'];
      if (response['data']['user']['profilePictureUrl'] == '' || response['data']['user']['profilePictureUrl'] == null) {
        this.showProfile = false;
      } else {
        this.showProfile = true;
      }

      this.logoName = response['data']['user']['firstName'][0] + "" + response['data']['user']['lastName'][0];
      if(this.ph) {
        if (this.ph === 0) {
          this.ph = '';
        } else if (this.ph.length <= 3) {
          this.ph = this.ph.replace(/^(\d{0,3})/, '($1)');
        } else if (this.ph.length <= 6) {
          this.ph = this.ph.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
        } else if (this.ph.length <= 10) {
          this.ph = this.ph.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
        } else {
          this.ph = this.ph.substring(0, 10);
          this.ph = this.ph.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
        }
      }


      let phone =response['data']['user']['phone'];
      if(phone) {
        if (phone.length === 0) {
          phone = '';
        } else if (phone.length <= 3) {
          phone = phone.replace(/^(\d{0,3})/, '($1)');
        } else if (phone.length <= 6) {
          phone = phone.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
        } else if (phone.length <= 10) {
          phone = phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
        } else {
          phone = phone.substring(0, 10);
          phone = phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
        }
      }

      this.profileForm.patchValue({
        id: response['data']['user']['id'],
        firstName: response['data']['user']['firstName'],
        lastName: response['data']['user']['lastName'],
        middleName: response['data']['user']['middleName'],
        phone:phone,
        // phone:response['data']['user']['phone'],
        email: response['data']['user']['email'],
        countryPhoneCode: response['data']['user']['countryPhoneCode'],
        // subscribeNewsLetter : response['data']['subscribeNewsLetter']
      });
      this.profilesrc = response['data']['user']['profilePictureUrl'];
      if (response['data']['user']['profilePictureUrl'] == '' || response['data']['user']['profilePictureUrl'] == null) {
        this.showProfile = false;
      } else {
        this.showProfile = true;
      }
      this.username = response['data']['user']['firstName'] + " " + response['data']['user']['lastName'];
      this.logoName = response['data']['user']['firstName'][0] + "" + response['data']['user']['lastName'][0];

    });

  }

  getMemberState() {
    let request = {
      path: 'auth/userState',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.memberState = response['data'];
      let array=[];
      response['data'].map((item) => {
        if (item.showInMemberDirectory == true) {
          array.push(item);
        }
      });
      this.memberState =array;
      this.memberState.splice(0, 0, {'name':'All',"showInMemberDirectory" : true,
        "type" : "member", value:'ALL',}
      );

    });
  }


  changeTab(data,reset=false) {
    let tab = data;
    let t = this.memberState.filter((op)=>
      op.value == data
    )[0];

    if(t){
      this.currentActiveTab = t.name;
    }
    this.memberState.forEach((item, index) => {
      if(tab == item.value){
        this.totalMemLab =item.name
      }
      return;
    });
    if(tab == 'dashboard') {
      this.currentActiveTab = 'Dashboard';
    }
    this.reqData['filter']['chapterIds'] = this.chapterId
    this.currentTab = tab;
    localStorage.setItem("tab",this.currentTab)
    delete this.reqData['approved'];
    if (this.currentTab == 'member') {
      this.reqData['approved'] =true;
    }
  else{
    this.reqData['approved'] =true;
  }
    console.log(this.chapterId);
    if(data =='member' || data =='ALL'  ) {
      this.reqData = {
        "filter": {
          "roles": [
            "USER",
            "GUEST",
            "MEMBER"
          ],
          "chapterIds":this.chapterId,
          "emailVerified": true,
          "mainUser": true,
          "search": ""
        },
        "page": {
          "limit": 15,
          "page": 0
        },
        "sort": {
          "orderBy": "ASC",
          "sortBy": "FIRST_NAME"
        }
      }
      }else{
        this.userDetailArray['userState']=this.currentTab
      this.reqData['filter']['userState'] = this.currentTab;

    }
    setTimeout(() => {
      if(tab == 'dashboard')
      {
        this.statisticSubject.next(null);
      }else{
        this.memberSubject.next(reset);
      }
    },300);
    this.memberData();

  }

  reset(){

    this.resetbtn = 'resetFilter';
    this.changeTab('ALL',true);
    this.tab ='ALL';
    this.search='';
    localStorage.removeItem("search");
    this.reqData['filter']['search'] =this.search;
    this.reqData1['filter']['search'] = this.search;
    this.selectedOtp='all';


    this.memberData();

  }



  newMeberData() {
    this.reqData['filter']['search'] = this.search;
    if (this.type == 'family' || this.type == 'guest')
    {
      let data = {
        path: "auth/user/getUserDetail/" + this.userId,
        isAuth: true
      };
      this.apiService.get(data).subscribe(response => {
        if (this.type == 'family') {
          this.memberList['content'] = response['data']['familyMembers'];
        } else {
          this.memberList['content'] = response['data']['guests'];
        }
        this.memberList['content'].forEach((item, index) => {
          item['sub'] = false;
          item['submembers'] = [];
          item['profileShow'] = false;
          //this.subMembers(item.id, index);
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
        if (this.type == 'family') {
          this.memberList['totalElements'] = response['data']['familyMembers'].length;
        } else {
          this.memberList['totalElements'] = response['data']['guests'].length;
        }
      });
    }
    else {

      let req ={};
      if(this.type=='subscriber' || this.type=='unsubscriber'){
        delete(this.reqData['filter']['roles']);
      }
      if(this.type=='DELETE_MEMBER') {
        this.reqData1['filter']['roles']=[
          "USER",
          "GUEST",
          "MEMBER"
        ]
        this.reqData1['filter']['search'] = this.search;
        this.reqData1['page']['limit'] = this.communityDetailsService.pagelimit;
        req = {
          path: "auth/user/all/deleted",
          data: this.reqData1,
          isAuth: true,
        };
      }else {
        req = {
          path: "auth/user/getUsers",
          data: this.reqData,
          isAuth: true,
        };
      }
      this.spinner.show();
      this.apiService.post(req).subscribe(response => {
       this.reasonArray=response['data']['content']
        if (response['status']['code'] == 'OK') {
          this.spinner.hide();
          this.memberList = response['data'];
          let member_length = this.memberList['content'].length;
          let page_no = this.reqData.page.page;
          if (member_length == 0) {
            if (page_no != 0) {
              this.reqData.page.page = page_no - 1;
              this.memberData();
            }
          }
          this.totalPages = pagination.arrayTwo(this.memberList['totalPages'], this.reqData.page.page);

          // this.reseFilter = '';
          this.memberList['content'].forEach((item, index) => {
            if(item.phone) {
              if (item.phone.length === 0) {
                item.phone = '';
              } else if (item.phone.length <= 3) {
                item.phone = item.phone.replace(/^(\d{0,3})/, '($1)');
              } else if (item.phone.length <= 6) {
                item.phone = item.phone.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
              } else if (item.phone.length <= 10) {
                item.phone = item.phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
              } else {
                item.phone = item.phone.substring(0, 10);
                item.phone = item.phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
              }
            }
            item['sub'] = false;
            item['submembers'] = [];
            item['profileShow'] = false;
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

          this.totalMember = response['data']['totalElements'];
          this.spinner.hide();
        }else{
          this.spinner.hide();
        }
      });
      this.spinner.hide();
    }
  }


  resetNew() {
    this.search='';
    this.changeTab('ALL');
    this.tab ='ALL';
    this.selectedOtp='all'
    this.changeMemberType(this.selectedOtp);
    // this.search=''

    this.clearDateFilter();
    this.newMeberData();



  }


  reasonForRejection1(template: TemplateRef<any>,id,durationType) {
    this.delId=id;
    this.duration=durationType;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'modal-dialog termsmain rejectmem'})
    );
  }
  inactiveMdlHide(){
    this.modalRef.hide();
    this.deleteReason ='';
  }

}
