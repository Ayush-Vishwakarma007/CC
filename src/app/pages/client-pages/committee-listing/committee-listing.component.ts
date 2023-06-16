import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommunityDetailsService } from "../../../services/community-details.service";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { EMAIL_PATTERN } from '../../../helpers/validations';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-committee-listing',
  templateUrl: './committee-listing.component.html',
  styleUrls: ['./committee-listing.component.scss']
})
export class CommitteeListingComponent implements OnInit {
  modalRef: BsModalRef;
  comitymemberList: any = [];
  nationalMember: any = [];
  contactUsForm: FormGroup;
  submitted: any = false;
  subjectList: any;
  chapterList: any = [];
  chapter :any;
  committeeDescription : '';
  committeeImageUrl : '';
  committeeTitle : '';
  memberId : '';
  chapterId='';
  chapterDetail:any=[];
  @ViewChild("contactUsModel")
  contactUsModel: ElementRef
  constructor( private modalService: BsModalService, private fb: FormBuilder, private route: ActivatedRoute, public router: Router, public apiService: ApiService, public communityService: CommunityDetailsService, private toastrService: ToastrService,) {
    this.contactUsForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      firstName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      lastName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      middletName: [''],
      message: ['', Validators.required],
      phoneNumber: ['', [Validators.required]],
      subject: ['', Validators.required]
    });
    this.chapter = JSON.parse(localStorage.getItem('chapter'));
    this.chapterId= this.chapter.id;
    console.log(this.chapter);
  }

  async ngOnInit() {
    //this.getCommittieDetail();
    await this.getChapterList();
    this.getCommitteeMember();
    this.getChapterDetail();
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    if (authDetail) {
      this.getProfileDetail();
    }
  }

  get contactUsFormvalid() { return this.contactUsForm.controls; }

  getChapterList() {
    let request = {
      path: "community/chapters",
      isAuth: true
    };

    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.chapterList = response['data'];
        console.log(this.chapterDetail);
        resolve(null);
      });
    });
  }

  getCommitteeMember(status = false) {
    this.chapter = this.chapterList.filter((data)=>data.id == this.chapterId)[0];
    let request = {}
    if (this.chapterList.length == 1) {
      this.committeeDescription = this.chapterList[0].committeePageDetails['description'];
      this.committeeTitle = this.chapterList[0].committeePageDetails['title'];
      this.committeeImageUrl = this.chapterList[0].committeePageDetails['imageUrl'];
      let data = {
        'chapterId': this.chapterList[0].id
      }
      request = {
        path: 'community/committee/members',
        data: data,
        isAuth: true,
      }

      this.apiService.post(request).subscribe(response => {
        this.comitymemberList = response['data'];
        this.comitymemberList.map((item,index)=>{
          this.comitymemberList[index]['committeeMemberList'] = item['committeeMemberList'].filter((data) => data.firstName != null);
        });

        this.comitymemberList.forEach((item, index) => {
          if (index == 0) {
            this.nationalMember = item;
          }
        });
      });
    }
    else {
      let data = {}
      console.log(this.chapterId)
      if (this.chapter.level == 0) {
        data = {
          'highPriority': true
        }
      } else {
        data = {
          'chapterId': this.chapterId
        }
      }
      this.getCommitteePageDetail(this.chapterId);
      request = {
        path: 'community/committee/members',
        data: data,
        isAuth: true,
      }
      this.apiService.post(request).subscribe(response => {
          this.comitymemberList = response['data'];
          this.comitymemberList.map((item, index) => {
            if (item['committeeMemberList'] != '') {
              this.comitymemberList[index]['committeeMemberList'] = item['committeeMemberList'].filter((data) => data.firstName != null);
            }
          })
        if (this.comitymemberList.length!=0) {
          this.comitymemberList.forEach((item, index) => {
            if (index == 0) {
              this.nationalMember = item;
            }
          });
        }else{
          this.nationalMember =[];
        }
      });
      //this.nationalMember = this.nationalMember.filter((data) => data.firstName != null);
    }
  }

  getCommitteePageDetail(id){
    let request = {
      path: 'community/chapterDetails/' + id,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      let chapter = response['data'];
      if(chapter.committeePageDetails != null){
        this.committeeDescription = chapter.committeePageDetails['description'];
        this.committeeTitle = chapter.committeePageDetails['title'];
        this.committeeImageUrl = chapter.committeePageDetails['imageUrl'];
      }
    });
  }

  getCommittieDetail() {
    let request2 = {
      path: 'community/chaptersWithMembers',
      isAuth: true,
    };
    this.apiService.get(request2).subscribe(response => {
      this.comitymemberList = response['data'];
      this.comitymemberList.forEach((item, index) => {
        if (index == 0) {
          this.nationalMember = item;
        }
      });
    });
  }

  contactUs(email, id) {
    this.communityService.contactUsEmail = email;
    this.memberId = id;
    this.sendContactUsMail();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  sendContactUsMail() {
   // $("#contactus_modal_btn").trigger("click");
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    if (authDetail) {
      this.getProfileDetail();
    }
    this.submitted = false
  }

  getChapterDetail() {
    let request2 = {
      path: 'community/contact/subject',
      isAuth: true,
    };
    this.apiService.get(request2).subscribe(response => {
      this.subjectList = response['data'];
    });
  }

  ContactUsSubmit() {
    this.submitted = true;

    let FormValue = this.contactUsForm.value;
    FormValue['committeeMemberId'] = this.memberId;

    if (this.contactUsForm.invalid) {
      this.toastrService.error('Fill required fields');
      return;
    } else {
      let Data = {
        path: "community/contactUs",
        data: FormValue,
        isAuth: false
      };

      this.apiService.postWithoutToken(Data).subscribe(response => {

        if (response['status'].status == "SUCCESS") {
          this.toastrService.success(response['status'].description);
          $(".close", this.contactUsModel.nativeElement).click();
        } else {
          this.toastrService.error(response['status'].description);
        }
        this.contactUsForm.reset();
        $('#closeModel').click();
        this.submitted = false
      });

    }
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
        lastName: response['data']['user']['lastName'],
        middletName: response['data']['user']['middletName'],
        phoneNumber: response['data']['user']['phone'],
        email: response['data']['user']['email'],

      });
    });
  }
  openModalWithClass(template: TemplateRef<any>,email,id) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-md contactpopuplist' })
    );
    this.communityService.contactUsEmail = email;
    this.memberId = id;
    this.sendContactUsMail();
  }
}
