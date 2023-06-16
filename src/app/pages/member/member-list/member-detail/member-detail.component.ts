import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../../services/api.service";
import {SpinnerService} from "../../../../services/spinner.service";
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {EMAIL_PATTERN} from "../../../../helpers/validations";
import * as $ from "jquery";
import Swal from "sweetalert2";
import {Subject, Subscription} from "rxjs";
import {pagination} from "../../../../pagination";

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent implements OnInit {

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;

  @Input()
  userPermisssion: any = [];

  @Input()
  currentTab = '';
  @Input()
  chapterId = '';

  searchString:string = '';


  fieldName: any;
  filedValue: any;
  value: any;
  isHidden: boolean = true;
  memberId = '';
  memberList: any = [];
  reqData: any = [];
  rejectDetails: any = [];
  totalMember = 0;
  memberDetail: any = [];
  addMember: boolean = false;
  addMemberForm: FormGroup;
  submitBtn: boolean = true;
  rejectedData: any = [];
  notificationData: any = [];
  isMemberFormSubmitted = false;
  editMemberForm: FormGroup;
  validation: any;
  search= '';
  totalPages :any = [];
  checkedfield :any = [];
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
      ["link"]

    ]
  };
  notificationForm: FormGroup;
  listType = 'card';
  urlPattern =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;


  constructor(public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {
    this.reqData = {
      "filter": {
        "roles": [
          "USER",
          "GUEST"
        ],

        "approved": true,
        "mainUser": true,
        "search": ""
      },
      "page": {
        "limit": 8,
        "page": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    };
    this.addMemberForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      city: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    });
    this.notificationForm = this.formBuilder.group({
      message: ['', Validators.required],
      subject: ['', Validators.required],
    });
    this.editMemberForm = this.formBuilder.group({});
  }

  ngOnInit() {

    this.saveSubscription = this.save.subscribe(() => {
      this.search ='';
      this.memberData();
      this.reqData['page'] = {
        "limit": 8,
        "page": 0
      };
    });
  }

  // ====================== export to excel ============================
  getCurrentDate(){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //because January is 0!
    let yyyy = today.getFullYear();

    let date = '';
    let mon = '';

    if (dd < 10) {
      date = '0'+dd;
    }
    if (mm < 10) {
      mon = '0'+mm;
    }
    return(date+mon+yyyy);
  }

  exportToExport(){

    let memberStatus = "";
    let fileName = "";

    if (this.currentTab == 'member') {
      memberStatus = 'APPROVED';
      fileName = "Member_";
    }
    if (this.currentTab == 'new-member') {
      memberStatus = 'PENDING';
      fileName = "New_Member_";
    }

      let postData ={
        "filter": {
          "roles": [
            "USER"
            ,"GUEST"
          ],
          "approved": true,
          "mainUser": true,
          "search": this.searchString,
          "memberStatus": memberStatus,
        },
        "page": {
          "limit": 8,
          "page": 0
        },
        "sort": {
          "orderBy": "ASC",
          "sortBy": "FIRST_NAME"
        }
      };

      if (this.currentTab == 'user') {
        fileName = "User_";
        delete postData['filter']['memberStatus'];
      }


      let req = {
        path: "auth/users/excel",
        data: postData,
        isAuth: true,
      };

      let currentDate = this.getCurrentDate();

      let Exportfilename = fileName +currentDate;

      this.apiService.ExportReqBody(req ,Exportfilename);
  }

  //====================================================================
  memberData(search = "") {
    this.reqData['filter']['search'] = search;
    this.searchString = search;
    this.reqData['roles'] = ["USER","GUEST"];

    if (this.currentTab == 'member') {
      this.reqData['filter']['memberStatus'] = 'APPROVED';
      delete this.reqData['filter']['onlyMember'];
    }
    if (this.currentTab == 'new-member') {
      this.reqData['filter']['memberStatus'] = 'PENDING';
      delete this.reqData['filter']['onlyMember'];
    }
    if (this.currentTab == 'user') {
      this.reqData['filter']['onlyMember'] = 'false';
      delete this.reqData['filter']['memberStatus'];
    }
    let req = {
      path: "auth/user/getUsers",
      data: this.reqData,
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.post(req).subscribe(response => {
      this.memberList = response['data'];
      let member_length = this.memberList['content'].length;
      let page_no = this.reqData.page.page;
      if (member_length == 0) {
        if (page_no != 0) {
          this.reqData.page.page = page_no - 1;
          this.memberData();
        }
      }
      this.totalPages= pagination.arrayTwo(this.memberList['totalPages'],this.reqData.page.page);
      this.memberList['content'].forEach((item, index) => {
        item['sub'] = false;
        item['submembers'] = [];
        //this.subMembers(item.id, index);
        if (item.profilePictureUrl == null || item.profilePictureUrl == '') {
          item['profileShow'] = false;
          item['profileUrl'] = item.firstName[0] + "" + item.lastName[0];
        } else {
          item['profileShow'] = true;
          item['profileUrl'] = item.profilePictureUrl;
        }
      });
      this.totalPages= this.arrayTwo(this.memberList['totalPages']);
      this.totalMember = response['data']['totalElements'];
      this.spinner.hide();

    });
  }
  subMember(type, id, index) {
    let req = {
      path: "auth/user/getUserDetail/" + id,
      isAuth: true,
    };
    let sub = '';
    if (this.memberList['content'][index]['sub'] == false) {
      sub = 'true';
    } else if (this.memberList['content'][index]['sub'] == true) {
      sub = 'false';
    }
    if (sub == 'true') {
      this.spinner.show();
      this.apiService.get(req).subscribe(response => {
        if (type == 'member') {
          let array = [];
          array = response['data']['familyMembers'];
          array.concat(response['data']['guest']);
          this.spinner.hide();
          this.memberList['content'][index]['submembers'] = array;
        }
        this.memberList['content'][index]['sub'] = true;
      });
    } else {
      this.memberList['content'][index]['sub'] = false;
    }
  }
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

  deleteMember(id) {
    if (id == undefined) {
      id = this.editMemberForm.value.id;
    }
    $("#delete_btn").click();
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this member!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "auth/user/delete/" + id,
          isAuth: true,
        }
        this.apiService.get(request).subscribe(response => {
          if (response['status']['code'] == 'BAD_REQUEST') {
            Swal.fire(
              'warning!',
              response['status']['description'],
              'warning'
            );
          } else {
            Swal.fire(
              'Deleted!',
              //response['status']['description'],
              'Member has been deleted.',
              'success'
            );
          }


          this.memberData();
        }, error => {
          Swal.fire(
            'Cancelled',
            'Member is safe.',
            'error'
          )
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Member is safe.',
          'error'
        )
      }
    })
  }
  editMember(id) {

    if (this.currentTab == 'member') {
      this.isHidden = true;

    }
    if (this.currentTab == 'new-member') {
      this.isHidden = false;
    }
    this.memberId = id;
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
          if(this.filedValue ==  null)
          {
            this.filedValue= '';
          }
          if(value.type=='CHECK_BOX')
          {
            value.optionList = [];
            value.options.filter((op)=>{
              value.optionList.push({'value':op,'check':false});
            });
            let filedValue = this.filedValue.split(',');
              value.optionList.filter((list)=>{
                filedValue.filter((op)=>{
                if(op == list['value'])
                {
                  list['check'] = true;
                }
              });
            });
          }
          //this.editMemberForm.controls[fieldName].clearValidators();\
          if (value.required == true) {
            if (value.type == 'URL')
            {
              this.validation = [Validators.required,Validators.pattern(this.urlPattern)];
            }else{
              this.validation = [Validators.required];
            }
          } else {
            if (value.type == 'URL')
            {
              this.validation = [Validators.pattern(this.urlPattern)];
            }else{
              this.validation = [];
            }
          }
          this.editMemberForm.addControl(fieldName, new FormControl(this.filedValue, this.validation));
        });
      });
      //console.log(this.editMemberForm.value);
      this.isMemberFormSubmitted = true;
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
    }
  }
  arrayTwo(n: number) {
    let mainPage = this.reqData.page.page;
    let prePage = mainPage -5;
    let nextPage = mainPage +5;
    if(prePage <0){ prePage = 0;}
    if(nextPage >n){ nextPage = n;}
    let array = Array(nextPage).fill(prePage).map((x, i) => { if(prePage<=i){  return  i}});
    return array.filter((i)=> {return i != null});
  }
  checkboxChange(member,event,value)
  {
  }
  editMemberFormSubmit() {
    this.memberDetail.forEach((item, index) => {
      item.fieldValues.forEach((value, index1) => {
        let fieldName = value.fieldName;
        if(value.type=='CHECK_BOX')
        {
          let checked = '';
          value['optionList'].filter((list)=>{
            if(list['check'] == true)
            {
              checked += list['value'] +',';
            }
          });
          if (value.required == true) {
            this.validation = [Validators.required];
          } else {
            this.validation = [];
          }
          this.editMemberForm.patchValue({
            fieldName :checked
          });
          this.editMemberForm.removeControl(fieldName);
         this.editMemberForm.addControl(fieldName, new FormControl(checked, this.validation));
          value.value = checked;
        }
      });
    });
    if (this.editMemberForm.valid) {
      let formdata = { "fieldValues": this.editMemberForm.value }
      let data = {
        path: "auth/member/update/" + this.editMemberForm.value.id,
        data: formdata,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.addMember = false;
          this.isMemberFormSubmitted = false;
          $("#delete_btn").trigger("click");
          this.memberData();
          this.toastrService.success(response['status']['description']);
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }else {
      this.toastrService.error('All * fields are required');
    }
  }
  changeList(type) {
    this.listType = type;
    this.memberData();
  }

  NotificationClear() {
    this.notificationData['message'] = "";
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
          this.memberData();

          this.notificationData['id'] = '';
          this.notificationData['message'] = '';
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    } else {
      this.toastrService.error('Add vaild reason');
    }
  }
  sort(type) {
    if (type == 'name') {
      this.reqData['sort']['sortBy'] = 'FIRST_NAME';
    } else if (type == 'address') {
      this.reqData['sort']['sortBy'] = 'ADDRESS';
    } else if (type == 'email') {
      this.reqData['sort']['sortBy'] = 'EMAIL';
    } else if (type == 'phone') {
      this.reqData['sort']['sortBy'] = 'PHONE';
    }
    if (this.reqData['sort']['orderBy'] == 'ASC') {
      this.reqData['sort']['orderBy'] = 'DESC';
    } else if (this.reqData['sort']['orderBy'] == 'DESC') {
      this.reqData['sort']['orderBy'] = 'ASC';
    }
    this.memberData();
  }
  approveMember(id) {
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
      }
    });
  }
  submitRejectMember() {
    if ($.trim(this.rejectedData['message']) != '' && this.rejectedData['message'] != undefined) {
      let postData = {
        'message': this.rejectedData['message'],
        'reason': this.rejectedData['reason']
      };
      // console.log(postData);
      if(this.rejectedData['reason'] != '' && this.rejectedData['reason'] != undefined){
        let req = {
          path: "auth/member/reject/" + this.rejectedData['id'],
          data: postData,
          isAuth: true,
        };
        this.apiService.post(req).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            $('#delReject').trigger("click");
            this.toastrService.success(response['status']['description']);
            this.memberData();

            this.rejectedData['id'] = '';
            this.rejectedData['reason'] = '';
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });
      }else{
        this.toastrService.error('Please provide reason to reject membership');
      }
    } else {
      this.toastrService.error('Add vaild reason');
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
}
