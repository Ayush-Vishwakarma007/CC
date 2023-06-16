import {Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {AuthenticationService} from '../../services/authentication.service';
import {CommunityDetailsService} from "../../services/community-details.service";
import {MenuService} from "../../services/menu.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EMAIL_PATTERN} from "../../helpers/validations";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public menu: any[];
  modalRef: BsModalRef;

  @ViewChild("chapterModel")
  chapterModel: ElementRef

  @ViewChildren("chapterModelLogin")
  chapterModelLogin: ElementRef

  public communityDetail: any;
  public chapterList: any;
  userDetail: any;
  profileShow: boolean = false;
  profileDetail: any;
  profileUrl: string;
  userPermisssion: any = [];
  chapter: any;
  isSticky: boolean = false;
  showPdf : boolean = false;
  //logo : any;
  modalOpen = false;
  skipChapter: boolean = false;
  newsLetterform : FormGroup;
  isSubmit: boolean = false;
  constructor(public apiService: ApiService,private fb: FormBuilder,private toastrService: ToastrService,private formBuilder: FormBuilder,private modalService: BsModalService, private activatedroute: ActivatedRoute, public menuService: MenuService, public router: Router, public authService: AuthenticationService, public communityService: CommunityDetailsService, public activate: ActivatedRoute) {
    this.newsLetterform = this.fb.group({
      firstName: [''],
      lastName: [''],
      middleName: [''],
      phone: ['', Validators.minLength(10)],
      email: ['', [Validators.required, Validators.email, Validators.pattern(EMAIL_PATTERN)]],
    });
    this.activatedroute.data.subscribe(data => {
      if (data['skipChapter']) {
        this.skipChapter = data['skipChapter']
      }
    })
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 25;

  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md modal-dialog-centered newsletter-modal newslettertop' })
    );
  }
  ngOnInit(): void {
 
    this.activate.params.subscribe(data => {
      setTimeout(() => {
        this.chapter = JSON.parse(localStorage.getItem('chapter'));
        if (this.chapter == null && this.communityService.chapterList.length > 1) {
          if (this.skipChapter == false) {
            $('#openChapter').click();
          }
        }
        if (this.router.url === "/") {
            this.communityDetail = this.communityService['communityDetail'];
            this.chapterList = this.communityService['communityDetail']['chapters'];
            this.chapter = this.chapterList[0];
            localStorage.setItem('chapter', JSON.stringify(this.chapter));
        } else {
          this.chapter = JSON.parse(localStorage.getItem('chapter'));
        }
        console.log(this.chapter);

      }, 600);
    });


    setTimeout(() => {
      if (localStorage.getItem('chapter') != null) {
        this.chapter = JSON.parse(localStorage.getItem('chapter'));
      } else {
        if (this.skipChapter == false) {
          this.homePageRedirect();
        }
      }
    }, 600);
    this.authService.CheckLoginSession();
    this.getPermission();
    this.getMenus();
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    if (authDetail) {
      this.getProfileDetail();
    }

  }

  logout() {
    this.apiService.logout();
    this.menuService.setProfile()
    this.authService.CheckLoginSession();
    this.router.navigate(['/']);
   
  }
  newsletterChanges() {
    this.isSubmit = true;
    console.log(this.newsLetterform.valid,this.newsLetterform.value);
    if(this.newsLetterform.valid){

      let data = this.newsLetterform.value;

      let request = {
        path: "auth/subscribe",
        data: data,
        isAuth: true
      }

      this.apiService.post(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.newsLetterform.reset();
          this.modalRef.hide();
          this.isSubmit = false;
        } else {
          this.toastrService.error(response['status']['description']);
          this.isSubmit = false;
        }
      });
    }
    else{
      this.toastrService.error('Fill required fields!');
    }

  }

  getMenus() {
    let data = {
      path: "uiPermission/menuByRole/HEADER",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.menu = response['data']['menuItems'];
      //console.log(this.menuList);
    });
  }

  getPermission() {
    let req = {
      path: 'uiPermission/getPermissionByRole',
      isAuth: true,
    };
    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.userPermisssion = [];
        response['data'].forEach((item, index) => {
          this.userPermisssion[item.name] = item;
        });
      } else {
      }

    });
  }

  getProfileDetail() {
    let data = {
      path: "auth/user/getUserDetail",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.userDetail = response['data']['user'];
    });
  }

  clickChapter(e) {

    localStorage.removeItem('chapter');
    localStorage.setItem('chapter', JSON.stringify(e));
    if (e.level == 0) {
      this.router.navigate(["/"]);
    } else {
      this.router.navigate(["/chapter/" + e.name]);
    }

    $(".close", this.chapterModel.nativeElement).click();
  }

  homePageRedirect() {
    //localStorage.removeItem('chapter');
    //this.chapter = this.chapterList[0];
    localStorage.setItem('chapter', JSON.stringify(this.chapter));
    this.router.navigate(['/']);
  }

  clickOnChapterModal(e) {
    this.router.navigate(['/login']);
    localStorage.removeItem('chapter');
    localStorage.setItem('chapter', JSON.stringify(e));
    $(".close", this.chapterModelLogin.nativeElement).click();
  }

  clickOtherChapterModal(n) {
    window.open('https://www.spcsusa.org/', '_blank');
  }

  showChapterModal() {
    $("#login_modal_btn").trigger("click");
  }

  charOnly(evt): boolean {
    var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode :
      ((evt.which) ? evt.which : 0));
    if (charCode > 32 && (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }

  isActive(url): boolean {
    return this.router.url.includes(url);
  }
  openNewTab(url) {
    window.open(url, '_blank');
  }

  closeNewsMol() {
    this.newsLetterform.reset();
    this.modalRef.hide();
    this.isSubmit = false;
  }
}
