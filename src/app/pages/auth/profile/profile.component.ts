import {Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {SeoService} from "../../../services/seo.service";
import {SpinnerService} from "../../../services/spinner.service";
import {MenuService} from "../../../services/menu.service";
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {configuration} from "../../../configration";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userData: any;
  pageLocation: 'Proﬁle' | 'Additional' | 'Family' | 'Guest' | 'Subscription' | 'Payment' = 'Proﬁle';
  sideMenuLarge: boolean = true;
  moredrop: boolean = true;
  countryData = [];

  submittedPform: boolean = true;
  submitedAform: boolean = false;

  profilesrc: any;
  username: any;
  userDetail: any = [];
  relationList: any;
  familyMemberDetail: any;
  guestDetail: any;
  logoName: any;
  subscribeNewsLetter: boolean = false;
  profileForm: FormGroup;
  proPicUpdate: FormGroup;
  changepassword: FormGroup;
  additionalForm: FormGroup;
  addFmailyMemberForm: FormGroup;
  addGuestMemberForm: FormGroup;

  password: boolean = false;
  cpassword: boolean = false;
  opassword: boolean = false;
  mpassword: boolean = false;
  strongpassword: boolean = false;

  AddFamilyMember: boolean = false;
  AddGuestMember: boolean = false;

  passwordResetSubmit: boolean = false;

  showProfile: boolean = false;
  isGuestFormSubmitted = false;
  isMemberFormSubmitted = false;

  btnName: any = "Add";

  defaultErr: any = "Kindly Enter required fields";
  errStatus: boolean = false;
  isSticky: boolean = false;
  addMemberForm: FormGroup;
  validation: any;
  memberDetail: any = [];
  addMember: boolean = false;
  filedValue: any;
  urlPattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];

  modalRef: BsModalRef;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  @ViewChild('profilepic') profilepic: ElementRef;

  constructor(private route: ActivatedRoute, private modalService: BsModalService, public menuService: MenuService, public spinner: SpinnerService, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService, private seo: SeoService) {
    this.profileForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      lastName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      phone: ['',[Validators.required]],
      email: ['',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      countryPhoneCode: [''],
    });

    this.proPicUpdate = this.fb.group({
      file: [''],
    });

    this.changepassword = this.fb.group({
      cnewPassword: [''],
      newPassword: [''],
      oldPassword: ['', Validators.required],
    });
    this.addMemberForm = this.fb.group({});

    this.additionalForm = this.fb.group({
      businessName: [''],
      addressLine1: ['',],
      addressLine2: [''],
      addressLine3: [''],
      city: [''],
      state: [''],
      country: ['']
    });
    //
    this.addFmailyMemberForm = this.fb.group({
      id: [''],
      allowedLogin: [false],
      email: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      birthYear: ['', [Validators.required,Validators.maxLength(4)]],
      relation: ['SIBLINGS', Validators.required],
    });

    this.addGuestMemberForm = this.fb.group({
      id: [''],
      allowedLogin: [true],
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      birthYear: ['', [Validators.required,Validators.maxLength(4)]],
      relation: ['GUEST'],
    });
    this.route.params.subscribe(params => {
      if (params['type'] != undefined) {
        this.showDiv(params['type']);
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 50;
  }

  get f() {
    return this.profileForm.controls;
  }

  get a() {
    return this.additionalForm.controls;
  }

  get fm() {
    return this.addFmailyMemberForm.controls;
  }

  get g() {
    return this.addGuestMemberForm.controls;
  }

  showAlerts(): void {
    // For normal messages
    this.toastrService.info('this is an info alert');
    this.toastrService.error('this is a danger alert');
    this.toastrService.success('this is a success alert');
    this.toastrService.warning('this is a warning alert');

    // For html messages:
    // this.toastrService.warning({ html: '<b>This message is bold</b>' });
  }

  ngOnInit() {
    document.querySelector("body").removeAttribute('class'); ///remove body class after modal
    this.profilesrc = 'assets/images/profile.png';

    this.userData = JSON.parse(localStorage.getItem("authDetail"));
    //this.CheckLoginSession();

    this.getProfileDetail();
    this.get_country();
    this.get_relation();
    this.getMemberDetails();
    this.seo.generateTags({});
   //this.addMemberBtnClick();

    window.scroll(0, 0);
  }

  getProfileDetail() {
    let data = {
      path: "auth/user/getUserDetail",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      //console.log(response['data']['user']);
      this.userDetail = response['data']['user'];
      this.getUserDetail();
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
        firstName: response['data']['user']['firstName'],
        lastName: response['data']['user']['lastName'],
        phone:phone,
        email: response['data']['user']['email'],
        countryPhoneCode: response['data']['user']['countryPhoneCode'],
      });
      console.log(this.profileForm.value)
      this.additionalForm.patchValue({
        businessName: response['data']['user']['businessName'],
        addressLine1: response['data']['user']['addressLine1'],
        addressLine2: response['data']['user']['addressLine2'],
        addressLine3: response['data']['user']['addressLine3'],
        city: response['data']['user']['city'],
        state: response['data']['user']['state'],
        country: response['data']['user']['country'],
      });

      if (response['data']['user']['profilePictureUrl'] == '' || response['data']['user']['profilePictureUrl'] == null) {
        this.showProfile = false;
      } else {
        this.showProfile = true;
      }

      this.logoName = response['data']['user']['firstName'][0] + "" + response['data']['user']['lastName'][0];
      this.profilesrc = response['data']['user']['profilePictureUrl'];
      this.username = response['data']['user']['firstName'] + " " + response['data']['user']['lastName'];

      this.familyMemberDetail = response['data']['familyMembers'];
      this.familyMemberDetail.forEach((item, index) => {
        if (item.phone) {
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
      });
      this.guestDetail = response['data']['guests'];
      this.guestDetail.forEach((item, index) => {
        if (item.phone) {
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
      });
    });
  }

  getUserDetail() {
    let data = {
      path: "auth/user/getUser/" + this.userDetail['id'],
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.subscribeNewsLetter = response['data']['subscribeNewsLetter'];
    });
  }

  CheckLoginSession() {
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    let isLogin = JSON.parse(localStorage.getItem("login"));
    if (authDetail) {
      if (isLogin == true) {
        this.router.navigate(['/Profile']);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  showDiv(value) {
    window.scroll(0, 0);
    this.pageLocation = value;
   $(function() {
      $('#cancel-btn').trigger('click')
      console.log("asdf")
  });
    //console.log("hello",this.pageLocation)
    this.btnName = "Add";


    this.addFmailyMemberForm.reset();
    this.addGuestMemberForm.reset();
    this.errStatus = false;
  }

  largeSmallSideMenu() {
    if (this.sideMenuLarge == true) {
      this.sideMenuLarge = false;
    } else {
      this.sideMenuLarge = true;
    }
  }

  moreDropdown() {
    if (this.moredrop == true) {
      this.moredrop = false;
    } else {
      this.moredrop = true;
    }
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

  profileFormSubmit() {
    // if (this.profileForm.invalid) {
    //   this.submittedPform = false;
    // } else {
    //   this.submittedPform = true;
    // }
    if (this.profileForm.valid) {
      this.submittedPform = true;
      let profileFormVal = this.profileForm.value;
      profileFormVal.subscribeNewsLetter = this.subscribeNewsLetter;
      let data = {
        path: "auth/user/updateUserDetails",
        data: profileFormVal,
        isAuth: true
      };

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {

          localStorage.setItem('authDetail', JSON.stringify(response['data']));

          this.menuService.setProfile();
          this.toastrService.success(response['status']['description']);
          this.username = response['data']['firstName'] + " " + response['data']['lastName'];
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
      });
    } else {
      this.toastrService.error('Enter valid password');
    }
  }

  uploadphotoclick() {
    $('#profileupdate').trigger('click');
  }

  removeProfile() {
    //================== update
    let profileUpdateData = {"profilePictureUrl": ''};
    let data = {
      path: "auth/user/updateUserDetails",
      data: profileUpdateData,
      isAuth: true
    };

    this.apiService.post(data).subscribe(response => {
      this.profileFormSubmit();
      this.getProfileDetail();
      this.toastrService.success("Profile Removed");
    });
  }


  updateProfile() {
    let file = configuration.dataURLtoFile(this.croppedImage, 'profile.png')

    // let file = this.profilepic.nativeElement.files;
    let formData = new FormData();
   // formData.append("file", file[0]);
    formData.append("file", file);
    console.log(file, (1024 * 1024))
    //if (file[0].size > (4 * 1024 * 1024)) {
    if (file.size > (4 * 1024 * 1024)) {
      this.toastrService.error('Maximum 4MB size allowed');
      return false;
    }
    console.log(this.allowed_types.indexOf(file.type));
    // if (this.allowed_types.indexOf(file[0].type) == -1) {
     if (this.allowed_types.indexOf(file.type) == -1) {
      this.toastrService.error('Only JPG , JPEG or PNG images are allowed.');
      return false;
    }
    this.spinner.show();
    let data = {
      path: "auth/user/uploadPicture",
      data: formData,
      isAuth: true
    };
    this.spinner.show();
    this.apiService.postImage(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.profilesrc = response['data']['profilePictureUrl'];
        this.toastrService.success(response['status']['description']);
        //================== update
        let profileUpdateData = {"profilePictureUrl": response['data']['profilePictureUrl']};
        this.profilesrc = response['data']['profilePictureUrl'];
        $('#hideModel').click();
        this.showProfile = true;
        this.spinner.hide();
        let data = {
          path: "auth/user/updateUserDetails",
          data: profileUpdateData,
          isAuth: true
        };

        this.apiService.post(data).subscribe(response => {
          localStorage.setItem('authDetail', JSON.stringify(response['data']));
          this.menuService.setProfile();
          this.spinner.hide();
        });
        //========================
      } else {
        this.spinner.hide();

        this.toastrService.error(response['status']['description']);
      }
    });

  }


  //====================================== Additional ==================================================
  additionalFormSubmit() {
    if (this.additionalForm.invalid) {
      this.submitedAform = false;
    } else {
      this.submitedAform = true;
    }
    if (this.submitedAform == true) {
      let additionalFormval = this.additionalForm.value;

      let data = {
        path: "auth/user/updateUserDetails",
        data: additionalFormval,
        isAuth: true
      };

      this.apiService.post(data).subscribe(response => {
        //console.log(response);
        if (response['status']['code'] == 'OK') {
          this.submitedAform = false;
          this.toastrService.success(response['status']['description']);
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }

  }

  //====================================================================================================

  // ================================= member =============================================
  addMemberBtnClick() {
    this.btnName = "Add";
    this.isMemberFormSubmitted = false;
    this.addFmailyMemberForm.reset();
    if (this.AddFamilyMember == false) {
      this.AddFamilyMember = true;
    } else {
      this.AddFamilyMember = false;
    }
  }

  get_relation() {
    let contry_data = {
      path: "auth/relation/getAll",
      isAuth: true
    };

    this.apiService.get(contry_data).subscribe(response => {
      this.relationList = response['data'];
    });
  }

  addFmailyMemberFormSubmit() {
    if(this.addFmailyMemberForm.value.phone){
      let phone =this.addFmailyMemberForm.value.phone;
      if (this.addFmailyMemberForm.value.phone.length >= 17) {
        phone = phone.slice(0, -1);
      }
      phone = phone.replace('(', '');
      phone = phone.replace(')', '');
      phone = phone.replace(' ', '');
      phone = phone.replace(/[^0-9\.]+/g, "");
      this.addFmailyMemberForm.patchValue({
        phone : phone
      })
      console.log(this.addFmailyMemberForm.value.phone);
    }

    let formdata = this.addFmailyMemberForm.value;
    this.isMemberFormSubmitted = true;
    if (formdata.allowedLogin == true && (formdata['email'] == null || formdata['email'] == '')) {
      this.toastrService.error('Email is required when allowed login is selected.');
    } else {
      if (this.addFmailyMemberForm.valid && this.isMemberFormSubmitted == true) {
        this.errStatus = false;
        //=============== add===================
        if (this.addFmailyMemberForm.value.id == "" || this.addFmailyMemberForm.value.id == null) {
          let data = {
            path: "auth/subUser/create",
            data: formdata,
            isAuth: true
          };
          //console.log(data);
          this.apiService.post(data).subscribe(response => {
            if (response['status']['code'] == 'CREATED') {
              this.submitedAform = false;
              this.addFmailyMemberForm.reset();
              this.isMemberFormSubmitted = false;
              if (this.AddFamilyMember == false) {
                this.AddFamilyMember = true;
              } else {
                this.AddFamilyMember = false;
              }
              this.toastrService.success(response['status']['description']);
              this.getProfileDetail();
            } else {
              this.toastrService.error(response['status']['description']);
            }
          });
          //=======================================
        } else {
          //=============== edit ==================
          let data = {
            path: "auth/subUser/update/" + this.addFmailyMemberForm.value.id,
            data: formdata,
            isAuth: true
          };
          this.apiService.post(data).subscribe(response => {
            if (response['status']['code'] == 'OK') {
              //this.AddFamilyMember = false;
              this.submitedAform = false;
              this.addFmailyMemberForm.reset();

              this.isMemberFormSubmitted = false;
              if (this.AddFamilyMember == false) {
                this.AddFamilyMember = true;
              } else {
                this.AddFamilyMember = false;

              }
              this.toastrService.success(response['status']['description']);
              this.getProfileDetail();
            } else {
              this.toastrService.error(response['status']['description']);
            }
          });
          //=======================================
        }
      } else {
        this.errStatus = true;
        //this.addMemberBtnClick();
      }
    }
  }

  editFM(memberDetail) {

    window.scroll(0, 0);
    this.AddFamilyMember = true;
    this.btnName = "Update";


    //this.getProfileDetail()


      this.addFmailyMemberForm.patchValue({
        id: memberDetail.id,
        allowedLogin: memberDetail.allowedLogin,
        birthYear: memberDetail.birthYear,
        email: memberDetail.email,
        firstName: memberDetail.firstName,
        lastName: memberDetail.lastName,
        phone: memberDetail.phone,
        relation: memberDetail.relation,

      });


      //this.addMemberBtnClick()

  }




  delete(id) {
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
          path: "auth/subUser/delete/" + id,
          isAuth: true,
        }
        this.apiService.delete(request).subscribe(response => {

          Swal.fire(
            'Deleted!',
            'Family member has been deleted.',
            'success'
          )
          this.getProfileDetail();

        }, error => {
          Swal.fire(
            'Cancelled',
            'Family member is safe.',
            'error'
          )
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Family Member is safe.',
          'error'
        )
      }
    })
  }

  // =====================================================================================
  // ================================= guest =============================================

  addGuestBtnClick() {
    this.addGuestMemberForm.reset();
    if (this.AddGuestMember == false) {
      this.AddGuestMember = true;
    } else {
      this.AddGuestMember = false;
    }
  }

  editFG(memberDetail) {
    this.AddGuestMember = true;
    this.btnName = "Update";
    window.scroll(0, 0);

    this.addGuestMemberForm.patchValue({
      id: memberDetail.id,
      allowedLogin: memberDetail.allowedLogin,
      birthYear: memberDetail.birthYear,
      email: memberDetail.email,
      firstName: memberDetail.firstName,
      lastName: memberDetail.lastName,
      phone: memberDetail.phone,
      relation: memberDetail.relation,
    });


  }

  addGuestMemberFormSubmit() {
    if(this.addGuestMemberForm.value.phone){
      let phone =this.addGuestMemberForm.value.phone;
      if (this.addGuestMemberForm.value.phone.length >= 17) {
        phone = phone.slice(0, -1);
      }
      phone = phone.replace('(', '');
      phone = phone.replace(')', '');
      phone = phone.replace(' ', '');
      phone = phone.replace(/[^0-9\.]+/g, "");
      this.addGuestMemberForm.patchValue({
        phone : phone
      })
      console.log(this.addGuestMemberForm.value.phone);
    }
    this.addGuestMemberForm.patchValue({
      allowedLogin: true,
    });
    this.isGuestFormSubmitted = true;
    let formdata = this.addGuestMemberForm.value;

    if (this.addGuestMemberForm.valid) {
      this.errStatus = false;
      if (this.addGuestMemberForm.value.id == "" || this.addGuestMemberForm.value.id == null) {
        // ==================== add =========================
        formdata['relation'] = "GUEST";
        let data = {
          path: "auth/subUser/create",
          data: formdata,
          isAuth: true
        };

        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED') {
            this.submitedAform = false;
            this.addGuestMemberForm.reset();
            this.isGuestFormSubmitted = false;
            if (this.AddGuestMember == false) {
              this.AddGuestMember = true;
            } else {
              this.AddGuestMember = false;
            }
            this.toastrService.success(response['status']['description']);
            this.getProfileDetail();
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });
        //=============================================================
      } else {
        //============================== edit =======================
        let data = {
          path: "auth/subUser/update/" + this.addGuestMemberForm.value.id,
          data: formdata,
          isAuth: true
        };
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            //this.AddGuestMember = false;
            this.submitedAform = false;
            this.addGuestMemberForm.reset();
            if (this.AddGuestMember == false) {
              this.AddGuestMember = true;
            } else {
              this.AddGuestMember = false;
            }
            this.isMemberFormSubmitted = false;
            this.toastrService.success(response['status']['description']);
            this.getProfileDetail();
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });
      }
      //===========================================================
    } else {
      this.errStatus = true;
    }
  }

  deleteG(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this guest!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "auth/subUser/delete/" + id,
          isAuth: true,
        }
        this.apiService.delete(request).subscribe(response => {

          Swal.fire(
            'Deleted!',
            'Guest has been deleted.',
            'success'
          )
          this.getProfileDetail();

        }, error => {
          Swal.fire(
            'Cancelled',
            'Guest is safe ',
            'error'
          )
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Guest is safe.',
          'error'
        )
      }
    })
  }

  // =====================================================================================
  getShortName(fullName) {
    return fullName.split(' ').map(n => n[0]).join('');
  }

  newsletterChanges($event) {
    this.subscribeNewsLetter =$event.checked;
    let data = {
      path: "auth/subscribe/" + this.userDetail['id'],
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

  getMemberDetails() {
    this.addMemberForm = this.fb.group({});
    let req = {
      path: "auth/formSteps/",
      isAuth: true,
    };
    this.spinner.show();
    let userDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.apiService.get(req).subscribe(response => {
      this.memberDetail = response['data'];
      this.memberDetail.forEach((item, index) => {

        this.addMemberForm.addControl('id', new FormControl(userDetail.id, Validators.required));
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
          this.addMemberForm.addControl(fieldName, new FormControl(this.filedValue, this.validation));
        });
      });
      this.isMemberFormSubmitted = true;
      this.spinner.hide();
    });
  }

  formSubmit() {
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
          this.addMemberForm.patchValue({
            fieldName: checked
          });
          this.addMemberForm.removeControl(fieldName);
          this.addMemberForm.addControl(fieldName, new FormControl(checked, this.validation));
          value.value = checked;
        }
      });
    });
    if (this.addMemberForm.valid) {
      let formdata = {"fieldValues": this.addMemberForm.value}
      let data = {
        path: "auth/member/update/" + this.addMemberForm.value.id,
        data: formdata,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    } else {
      this.toastrService.error('All * fields are required ');
    }
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
      Object.assign({}, {class: 'modal-lg modal-dialog-centered'})
    );
  }

  fileChangeEvent(event: any){
    let file = this.profilepic.nativeElement.files;
    console.log(file.length,file[0].type);

    if (file.length != 0) {
      if (this.allowed_types.indexOf(file[0].type) == -1) {
        this.toastrService.error('Only JPG , JPEG or PNG images are allowed.');
        return false;
      }
      $('#openModal').click();
     // this.updateProfile();
      this.imageChangedEvent = event;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log(event)
    this.croppedImage = event.base64;
    let file = configuration.dataURLtoFile(this.croppedImage, 'profile.png')
    console.log(file, this.croppedImage)

  }
  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }
}
