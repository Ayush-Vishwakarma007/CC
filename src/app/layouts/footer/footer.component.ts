import {Component, Input, OnInit, Pipe, PipeTransform, TemplateRef, ChangeDetectionStrategy} from '@angular/core';
import {CommunityDetailsService} from "../../services/community-details.service";
import {Router,ActivatedRoute, NavigationEnd} from '@angular/router';
import {ApiService} from "../../services/api.service";
import {ToastrService} from "ngx-toastr";
import {EMAIL_PATTERN} from "../../helpers/validations";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {DomSanitizer} from "@angular/platform-browser";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatPasswordStrengthComponent } from "@angular-material-extensions/password-strength";
import {AuthenticationService} from "../../services/authentication.service";
import { localeData } from 'moment';

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {

  @Input()
  footer = '';
  modalRef: BsModalRef;
  changepassword: FormGroup;

  newsLetterform : FormGroup;
  isSubmit: boolean = false;
  password: boolean = false;
  cpassword: boolean = false;
  opassword: boolean = false;
  mpassword: boolean = false;
  strongpassword: boolean = false;
  passwordResetSubmit: boolean = false;
  hide:false;
  hidePass:false;
  hideCmPass:false;
  email='';
  chapter: any;
  passwordStrength : boolean = false;
  passwordStrengthCheck : any;
  routerUrl:any
  show:boolean=false

  constructor(private modalService: BsModalService,public authService: AuthenticationService, private route: ActivatedRoute,public communityService:CommunityDetailsService, private fb: FormBuilder, public router: Router,public apiService: ApiService, private toastrService: ToastrService , ) {

    this.newsLetterform = this.fb.group({
      firstName: [''],
      lastName: [''],
      phone: ['', Validators.minLength(10)],
      email: ['', [Validators.required, Validators.email, Validators.pattern(EMAIL_PATTERN)]],
    });
    this.changepassword = this.fb.group({
      cnewPassword: [''],
      newPassword: [''],
      oldPassword: ['', Validators.required],
    });
   }

  ngOnInit() {
    // console.log('123',this.communityService);
    this.route.url.subscribe(url => {
      let path = url[0].path;
      this.routerUrl=path     
      if (path == 'event-details' )
      {
        this.show=true
      }
      
    })
   
    console.log(this.router.url)
    this.chapter = JSON.parse(localStorage.getItem('chapter'));

  }
  hideModal()
  {
    $('#hideModal').click();
  }

  clickChapter(e)
  {
      localStorage.removeItem('chapter');
      localStorage.setItem('chapter', JSON.stringify(e));
      if(e.level == 0){
        this.router.navigate(["/"]);
      }else{
        this.router.navigate(["/chapter/"+e.name]);
      }
  }
  newsletterChanges() {

    this.isSubmit = true;
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
          this.isSubmit = false;
        } else {
          this.toastrService.error(response['status']['description']);
          this.isSubmit = false;
        }
      });
    }
    else{
      this.toastrService.error('Fill required Fields.!');
    }

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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  openModalAddFamilyMember(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg performance-newsletter' })
    );
  }
  cpValidation() {
    let data = this.changepassword.value;

    if (data.oldPassword == '') {
      this.opassword = true;
    } else {
      this.opassword = false;
    }

    if (data.newPassword == '') {
      this.password = true;
    } else {
      this.password = false;
    }

    if (data.cnewPassword == '') {
      this.cpassword = true;
    } else {
      this.cpassword = false;
    }

    if (data.cnewPassword == data.newPassword) {
      this.mpassword = false;
    } else {
      this.mpassword = true;
    }

    if (this.mpassword == false && this.opassword == false && this.password == false && this.cpassword == false) {
      this.passwordResetSubmit = true;
    }
    let upperCaseCharacters = /[A-Z]+/g;
    let lowerCaseCharacters = /[a-z]+/g;
    let numberCharacters = /[0-9]+/g;
    let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (upperCaseCharacters.test(data.cnewPassword) === false || lowerCaseCharacters.test(data.cnewPassword) === false || numberCharacters.test(data.cnewPassword) === false || specialCharacters.test(data.cnewPassword) === false) {
      this.strongpassword = true;
    } else {
      this.strongpassword = false;
    }
  }

  canclePassword(){
    $('#exampleModalChangePassword').hide();
    this.changepassword.reset();
  }

  changepasswordSubmit() {
    let data = this.changepassword.value;
    let formData = {
      "newPassword": btoa(data.newPassword),
      "oldPassword": btoa(data.oldPassword)
    };

    if (this.passwordResetSubmit == true && this.strongpassword == false) {
      let data = {
        path: "auth/user/updatePassword",
        data: formData,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.changepassword.reset();
          this.toastrService.success(response['status']['description']);
        } else {
          this.toastrService.error(response['status']['description']);
        }
        $('#exampleModalChangePassword').hide();
      });
    } else {
      this.toastrService.error('Enter valid password');
    }
  }

  onStrengthChanged(strength: number) {
    this.passwordStrengthCheck = strength;
    if(strength>=20){
      this.passwordStrength = true;
    }else{
      this.passwordStrength = false;
    }
  }

  check() {
    this.passwordStrength = false;
    this.strongpassword= false;
    this.opassword = false;
    this.mpassword = false;
    this.changepassword.reset();
  }
  onChanegNewOldPassword(checkStatus:any){
    if( this.passwordStrengthCheck<100 || checkStatus=='New'){
      this.passwordStrength = true;
    }else{
      this.passwordStrength = false;
    }
  }
}
