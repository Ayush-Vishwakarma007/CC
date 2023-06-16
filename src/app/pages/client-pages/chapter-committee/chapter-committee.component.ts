import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {CommunityDetailsService} from "../../../services/community-details.service";
import {ToastrService} from "ngx-toastr";
import {EMAIL_PATTERN} from "../../../helpers/validations";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-chapter-committee',
  templateUrl: './chapter-committee.component.html',
  styleUrls: ['./chapter-committee.component.scss']
})

export class ChapterCommitteeComponent implements OnInit {

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
  chapters: any= [];
  committeeId:any;
  title:any;
  description:any;
  @ViewChild("contactUsModel")
  contactUsModel: ElementRef
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService,private fb: FormBuilder, private route: ActivatedRoute, public router: Router, public apiService: ApiService, public communityService: CommunityDetailsService, private toastrService: ToastrService,) {
    this.contactUsForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      firstName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      lastName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      middleName: [''],
      message: ['', Validators.required],
      phoneNumber: ['', [Validators.required]],
      subject: ['', Validators.required]
    });
  }

  async ngOnInit() {
    //this.getCommittieDetail();
    await this.getChapterList();
    this.getChapterDetail();
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.chapter = JSON.parse(localStorage.getItem("chapter"));
    this.route.params.subscribe(params => {
      this.committeeId = params['id']
    })
    if (authDetail) {
      this.getProfileDetail();
    }
    this.getCommitteeMember();

  }

  get contactUsFormvalid() { return this.contactUsForm.controls; }

  getChapterList() {
    let request = {
      path: "community/chapters",
      isAuth: true
    };

    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.chapterList = response['data']
        resolve(null);
      });
    });
  }

  getCommitteeMember() {
    let url;
    if(this.chapter.level ==0){
     url = 'community/committeeMember/group?committeeId='+this.committeeId
    }else{
      url ='community/committeeMember/group?committeeId='+this.committeeId+'&chapterId='+this.chapter.id
    }
     let request = {
        path: url,
        isAuth: true,
      }

      this.apiService.get(request).subscribe(response => {
        this.comitymemberList = response['data']['list'];
        this.comitymemberList.forEach((item, index) => {
          if (index == 0) {
            this.nationalMember = item;
          }
        });
        //this.chapters = Object.keys(this.comitymemberList);
        this.description = response['data']['description'];
        this.title = response['data']['name'];
      });
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
  backToLeaderShip(){
    this.router.navigate(['/about-us/committee']);
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
    $("#contactus_modal_btn").trigger("click");
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
          this.modalRef.hide()
          $(".close", this.contactUsModel.nativeElement).click();
        } else {
          this.toastrService.error(response['status'].description);
        }
        this.contactUsForm.reset();
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
        middleName: response['data']['user']['middleName'],
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
