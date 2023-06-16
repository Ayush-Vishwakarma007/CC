import { Component, OnInit, TemplateRef } from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ApiService} from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import {CommunityDetailsService} from "../../services/community-details.service";
import { pagination } from "src/app/pagination";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { EMAIL_PATTERN } from '../../helpers/validations';
import {SeoService} from "../../services/seo.service";
@Component({
  selector: 'app-volunteer-list',
  templateUrl: './volunteer-list.component.html',
  styleUrls: ['./volunteer-list.component.scss']
})
export class VolunteerListComponent implements OnInit {
  modalRef: BsModalRef;
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
  reqData:any=[];
  reqData1:any=[]
  volunteerList:any=[];
  volunteerList1:any=[];
  volunteerid:any=[];
  subject:any;
  message:any;
  activeVolunteer:any=[];
  search:any;
  volunteerrequestList:any=[]
  volunteerReqId:any ='';
  state:any
  stateId:any
  checked:boolean
  pagelimit:any
  totalPages:any
  search1:any
  contactUsForm: FormGroup;
  chapterDetail: any = [];
  subjectList: any;

  chapter : any = [];

  submitted: any = false;
  authDetail: any;
  zoom = 12
  center:''
  markers: any = [];
  constructor( private modalService: BsModalService,public communityService:CommunityDetailsService, private fb: FormBuilder,public communityDetailsService: CommunityDetailsService ,public apiService: ApiService,private toastrService: ToastrService,private seo:SeoService) {
    this.contactUsForm = this.fb.group({
      // chapterId: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      firstName:  [null, [ Validators.required ,Validators.pattern('[a-zA-Z ]*$')]],
      lastName:  [null, [ Validators.required ,Validators.pattern('[a-zA-Z ]*$')]],
      middleName: [''],
      message: ['', Validators.required],
      subject: ['', Validators.required],
      chapterId: [''],
      phoneNumber: ['', [Validators.required,Validators.minLength(10)]],
    });
    this.reqData={

      "filter":{
        "search": "",
        "status": "APPROVED"
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
    this.reqData1={

      "filter":{
        "search": "",
        "status": "PENDING"
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


   }

  ngOnInit() {
    this.getVolunteer()
    this.getrequestVolunteer()
    this.getChapterDetail();
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    if (this.authDetail) {
      this.getProfileDetail();
    }
    this.seo.generateTags({});
   
  }
  get contactUsFormvalid() { return this.contactUsForm.controls;}

  getVolunteer(){
    this.reqData['filter']['search']=this.search
    let request = {
      path: "community/volunteer/getAll",
      data: this.reqData,
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.post(request).subscribe(response => {
        this.volunteerList=response["data"]["content"]
        this.volunteerList1=response["data"]
       this.totalPages = pagination.arrayTwo(
        this.volunteerList1["totalPages"],
        this.reqData.page.page
      );
       this.volunteerList.forEach((element,index) => {

        if(element.state=='ACTIVE')
        {
          this.volunteerList[index]['check']=true
        }
        else{
          this.volunteerList[index]['check']=false
        }

      });
        resolve(null);
      });


  });
  }

  selected_pagelimit(event) {
    this.pagelimit=event.value
    this.reqData.page.limit = this.pagelimit;
    this.reqData1.page.limit=this.pagelimit
    this.getVolunteer();

  }
  getrequestVolunteer(){
    this.reqData1['filter']['search']=this.search1
    let request = {
      path: "community/volunteer/getAll",
      data: this.reqData1,
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.post(request).subscribe(response => {
        this.volunteerrequestList=response["data"]
        resolve(null);
      });
    });

  }
  openModalWithClassEmail(template: TemplateRef<any>,id) {
    this.volunteerReqId=id
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'modal-lg infomainpopup terms-margin'})
    );
  }
  openModalWithClassEmailApprove(template: TemplateRef<any>,id) {
    this.volunteerReqId=id
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'modal-lg infomainpopup terms-margin'})
    );
  }
  RejectMail()
  {
    let mailData={
      "message":this.message,
    }
    let request = {
      path: "community/volunteer/reject/"+ this.volunteerReqId,
      data: mailData,
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.post(request).subscribe(response => {
        if(response['status']['code']=='OK')
        {
          this.toastrService.success(response['status']['description'])
          this.modalRef.hide()
          this.message=""
          this.getrequestVolunteer()
        }
        else{
          this.toastrService.error(response['status']['description'])
          this.message=""
        }
        resolve(null);
      });
    });
  }
 ApproveMail()
  {
    let mailData={
      "message":this.message,
    }
    let request = {
      path: "community/volunteer/approve/"+ this.volunteerReqId,
      data: mailData,
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.post(request).subscribe(response => {
        if(response['status']['code']=='OK')
        {
          this.toastrService.success(response['status']['description'])
          this.modalRef.hide()
          this.message=""
          this.getrequestVolunteer()
        }
        else{
          this.toastrService.error(response['status']['description'])
          this.message=""
        }
        resolve(null);
      });
    });
  }
  changeTab(event){

  }
  pagination(type, data, current = null) {
    if (data == "user") {
      if (type == "prev") {
        this.reqData.page.pageNumber =
          this.reqData.page.pageNumber - 1;
      } else if (type == "current") {
        this.reqData.page.pageNumber = current;
      } else {
        this.reqData.page.pageNumber =
          this.reqData.page.pageNumber + 1;
      }
      this.getVolunteer()
    } //console.log(this.regestredReqData.page);
  }
  checkUncheck(event,id,i){
    var index = this.volunteerid.indexOf(id);

    if(event.checked==true)
    {
      this.volunteerid.push(id)
    }
    else{
     this.volunteerid.splice(index,1)
    }
  }

  openModalWithClassAcceptedEmail(template: TemplateRef<any>) {
    if(this.volunteerid !='') {
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, {class: 'modal-lg infomainpopup terms-margin'})
      );

    }
    this.toastrService.error('Please select volunteer')
  }
  Closehide(){
    this.modalRef.hide();
    this.message='';
    this.subject='';
  }
  sendEmail(){
    let data={
      "id":this.volunteerid,
      "message":this.message,
      "subject":this.subject
    }
    if(this.message!='' && this.subject!='') {
      let request = {
        path: "community/volunteer/sendMail",
        data: data,
        isAuth: true,
      };
      return new Promise((resolve) => {
        this.apiService.post(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description'])
            this.modalRef.hide();
            this.message = '';
            this.subject = '';
            this.volunteerid = '';
          } else {
            this.toastrService.error(response['status']['description'])
          }

          resolve(null);
        });
      });
    }else{
      this.toastrService.error('Please fill all field!');
    }

  }
  onChange(event,id) {
    let wlist = [];
    this.volunteerList.map((item) => {

      if(event.checked==true)
      {
        item['state']="ACTIVE"
        this.state=item['state']
       this.checked=true
      }
      else{
        item['state']="INACTIVE"
        this.state=item['state']
        this.checked=false
      }
    });

    this.stateId=id

   this.volunteerState()
  }
  volunteerState(){
    let request = {
      path: "community/volunteer/state/"+this.stateId + "?state=" + this.state,

      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        if(response['status']['code']=='OK')
        {
          this.toastrService.success(response['status']['description'])
          //this.modalRef.hide()
        }
        else{
          this.toastrService.error(response['status']['description'])
        }

        resolve(null);
      });
    });
  }

  getChapterDetail() {
    let request;
        if(this.authDetail)
        {
          request = {
            path: "community/chapters/access",
            isAuth: true
          };
        }else
        {
          request = {
            path: "community/chapters",
            isAuth: true
          };
        }
    this.apiService.get(request).subscribe(response => {
      this.chapter = JSON.parse(localStorage.getItem('chapter'));
      if(this.chapter.level!= 0){
         this.chapterDetail[0] = this.chapter;
         this.contactUsForm.patchValue({
           chapterId: this.chapterDetail[0]['name']
         })
      }else{
        this.chapterDetail = response['data'];
        this.contactUsForm.patchValue({
          chapterId: this.chapterDetail[0]['id']
        })
      }
    });
    let request2 = {
      path: 'community/volunteer/subject',
      isAuth: true,
    };
    this.apiService.get(request2).subscribe(response => {
      this.subjectList = response['data'];
    });
  }

  ContactUsSubmit() {
    this.submitted = true;

    let formValue = this.contactUsForm.value;
    if(formValue['phoneNumber']){
      let phone = formValue['phoneNumber'];
    if (formValue['phoneNumber'].length >= 17) {
      phone = phone.slice(0, -1);
    }
    phone = phone.replace('(', '');
    phone = phone.replace(')', '');
    phone = phone.replace(' ', '');
    phone = phone.replace(/[^0-9\.]+/g, "");
    formValue['phoneNumber'] = phone;
    this.contactUsForm.patchValue({
      phoneNumber : phone
    })
    console.log(this.contactUsForm.value.phoneNumber);
    }

    if(this.communityService.uiPermission['PLATFORM'])
    {
      this.contactUsForm.controls["chapterId"].clearValidators();
      this.contactUsForm.controls["chapterId"].updateValueAndValidity();
      delete formValue.chapterId;
      delete formValue.subject;
    }
    if (this.contactUsForm.invalid) {
      this.toastrService.error('Fill required fields');
      return ;
    } else {
      let Data = {
        path: "community/volunteer/query",
        data: formValue,
        isAuth: false
      };

      this.apiService.postWithoutToken(Data).subscribe(response => {

        if (response['status'].status == "SUCCESS") {
          this.toastrService.success(response['status'].description);
        }else{
          this.toastrService.error(response['status'].description);
        }
        this.contactUsForm.reset();
        this.submitted = false
      });

    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  getProfileDetail() {
    let data = {
      path: "auth/user/getUserDetail",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      //console.log(response['data']['user']);
      this.contactUsForm.patchValue({
        firstName: response['data']['user']['firstName'],
        middleName: response['data']['user']['middleName'],
        lastName: response['data']['user']['lastName'],
        phoneNumber: response['data']['user']['phone'],
        email: response['data']['user']['email'],

      });
    });
  }
  openModalWithClassAdd(templateadd: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      templateadd,
      Object.assign({}, { class: 'gray modal-lg edit-news' })
    );
  }
  resetForm() {
    this.submitted = false;
    
    this.contactUsForm.reset();
 
    this.modalRef.hide();
  }
}
