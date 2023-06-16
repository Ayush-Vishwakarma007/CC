import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../services/api.service';
import { SpinnerService } from '../../../services/spinner.service';
import Swal from 'sweetalert2';
import { MenuService } from "../../../services/menu.service";
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { configuration } from "../../../configration";
import { ActivatedRoute } from "@angular/router";
import { CommunityDetailsService } from "../../../services/community-details.service";
import { ThumbnailsPosition } from '@ngx-gallery/core';
import { MatDatepickerInput } from '@angular/material/datepicker';


@Component({
  selector: 'app-profile-member',
  templateUrl: './profile-member.component.html',
  styleUrls: ['./profile-member.component.scss']
})
export class ProfileMemberComponent implements OnInit {


  userDetail: any = [];
  newUserDetails: any = [];
  familyMemberDetail: any = [];
  guestDetail: any = [];
  submitted: boolean = false;
  guestSubmitted: boolean = false;
  addFamailyMemberForm: FormGroup;
  addGuestForm: FormGroup;
  memberDetail: any = [];
  profileForm: FormGroup;
  countryData = [];
  subscribeNewsLetter: boolean = false;
  profilesrc: any;
  relationList: any;
  showProfile: boolean = false;
  proPicUpdate: FormGroup;
  allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
  imageChangedEvent: any = '';
  submittedPform: boolean = true;
  username: any;
  croppedImage: any = '';
  logoName: any;
  addMemberForm: FormGroup;
  additionalForm: FormGroup;
  validation: any;
  filedValue: any;
  showAdmin: any;
  urlPattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  pageLocation: 'Proﬁle' | 'Additional' | 'Family' | 'Guest' | 'profile-member' | 'Subscription' | 'profile-member' | 'Payment' = 'Proﬁle';
  dynamicFormId: any;
  ph: any;
  validTypesImage = ['jpeg', 'jpg', 'png'];
  mediaList: any = [];
  mediaUploadUrl = "auth/file/upload/file";
  addEditButtonName = "Add";
  profileUpdatedEvent: boolean;
  currentDate: Date;
  mainEmail: any
  changeEmail: any
  flag: boolean = false
  otp: any
  otp1: any
  otp2: any
  otp3: any
  otp4: any
  otp5: any
  minDate: Date;
  maxDate: Date;
  @ViewChild('profilepic') profilepic: ElementRef;
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  modalRef3: BsModalRef;
  modalRef4: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(private modalService: BsModalService, public communityService: CommunityDetailsService, public apiService: ApiService, private fb: FormBuilder, public spinner: SpinnerService, private toastrService: ToastrService, public menuService: MenuService) {


    this.maxDate = new Date();

    this.addFamailyMemberForm = this.fb.group({
      id: [''],
      firstName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      middleName: [''],
      lastName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      phone: [''],
      relation: ['', [Validators.required]],
      birthYear: ['', [Validators.required, Validators.maxLength(4)]],
      email: [''],
      allowedLogin: [false],
    });

    this.addGuestForm = this.fb.group({
      id: [''],
      firstName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      lastName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      middleName: [''],
      phone: [''],
      birthYear: ['', [Validators.required, Validators.maxLength(4)]],
      email: [''],
      relation: ['GUEST'],
      allowedLogin: [false],
    });


    this.profileForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      lastName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      middleName: [''],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      countryPhoneCode: [''],
      signatureImage: ['']
    });

    this.proPicUpdate = this.fb.group({
      file: [''],
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
  }

  get f() {
    return this.profileForm.controls;
  }

  get a() {
    return this.additionalForm.controls;
  }


  ngOnInit() {
    this.getMemberDetails();
    this.getProfileDetail();
    this.get_country();
    this.get_relation();
    this.profileUpdatedEvent = false;
  }

  onFocusEvent(event) {
    // console.log("event called")
    // console.log(event);
    if (event = true) {
      this.profileUpdatedEvent = true;
      console.log(this.profileUpdatedEvent);
      console.log("change");
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

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg performance-newsletter profile-add-member' })
    );
  }
  openModalAddFamilyMember(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg performance-newsletter profile-add-family-member' })
    );
    this.addEditButtonName = "Add";
  }

  updateProfile(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg performance-newsletter profile-add-family-member' })
    );
  }
  updateProfileEmail(template: TemplateRef<any>) {
    this.mainEmail = this.profileForm.value.email
    this.changeEmail = this.mainEmail
    this.modalRef4 = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg infomainpopup' }, this.config)
    );
  }

  getProfileDetail() {
    let data = {
      path: "auth/user/getUserDetail",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.newUserDetails = response['data']['user'];
      this.showAdmin = this.newUserDetails.roles.filter(function (item) { return item === 'ADMIN'; });
      this.familyMemberDetail = response['data']['familyMembers'];
      this.guestDetail = response['data']['guests'];
      this.getUserDetail();
      console.log("res ", response);
      // console.log("guest",this.guestDetail);
      this.ph = response['data']['user']['phone'];
      // console.log(this.ph);
      this.profilesrc = response['data']['user']['imageUrl'];
      if (response['data']['user']['imageUrl'] == '' || response['data']['user']['imageUrl'] == null) {
        this.showProfile = false;
      } else {
        this.showProfile = true;
      }

      this.logoName = response['data']['user']['firstName'][0] + "" + response['data']['user']['lastName'][0];
      if (this.ph) {
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
      // console.log(this.ph);

      let phone = this.ph;
      // if(phone) {
      //   if (phone.length === 0) {
      //     phone = '';
      //   } else if (phone.length <= 3) {
      //     phone = phone.replace(/^(\d{0,3})/, '($1)');
      //   } else if (phone.length <= 6) {
      //     phone = phone.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
      //   } else if (phone.length <= 10) {
      //     phone = phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
      //   } else {
      //     phone = phone.substring(0, 10);
      //     phone = phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
      //   }
      // }

      this.profileForm.patchValue({
        firstName: response['data']['user']['firstName'],
        middleName: response['data']['user']['middleName'],
        lastName: response['data']['user']['lastName'],
        phone: response['data']['user']['phone'],
        // phone:response['data']['user']['phone'],
        email: response['data']['user']['email'],
        countryPhoneCode: response['data']['user']['countryPhoneCode'],
        // subscribeNewsLetter : response['data']['subscribeNewsLetter']
        signatureImage: response['data']['user']['signatureImage'],
      });


      let array = [];
      array.push(response['data']['user']['signatureImage']);
      array.forEach((item, index) => {
        this.mediaList[index] = [];
        this.mediaList[index]['responseData'] = [];
        this.mediaList[index]['responseData']['data'] = [];
        this.mediaList[index]['responseData']['data']['imageUrl'] = item;
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


  getUserDetail() {

    let data = {
      path: "auth/user/getUser/" + this.newUserDetails['id'],
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.subscribeNewsLetter = response['data']['subscribeNewsLetter'];
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


  newsletterChanges($event) {
    this.profileUpdatedEvent = true;
    this.subscribeNewsLetter = $event.checked;
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




  getShortName(fullName) {
    return fullName.split(' ').map(n => n[0]).join('');
  }

  get f1() {
    return this.addFamailyMemberForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.addFamailyMemberForm.invalid) {
      return this.toastrService.error("Please fill all required fields!!");
    } else {
      console.log("member data : ", this.addFamailyMemberForm.value);
      this.submitted = false;
    }

    // if(this.addFamailyMemberForm.value.phone){
    //   let phone =this.addFamailyMemberForm.value.phone;
    //   if(phone.length ===10) {
    //     if (phone.length === 0) {
    //       phone = '';
    //     } else if (phone.length <= 3) {
    //       phone = phone.replace(/^(\d{0,3})/, '($1)');
    //     } else if (phone.length <= 6) {
    //       phone = phone.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
    //     } else if (phone.length <= 10) {
    //       phone = phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    //     } else {
    //       phone = phone.substring(0, 10);
    //       phone = phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    //     }
    //   }
    //   else {
    //     return this.toastrService.error("Please enter valid contact");
    //   }
    //   this.addFamailyMemberForm.patchValue({
    //     phone : phone
    //   })
    // }



    let formdata = this.addFamailyMemberForm.value;
    if (this.addFamailyMemberForm.valid) {
      if (this.addFamailyMemberForm.value.id == "" || this.addFamailyMemberForm.value.id == null) {
        let postData = {
          path: "auth/subUser/create",
          data: formdata,
          isAuth: true,
        };
        this.apiService.post(postData).subscribe((response) => {
          if (response['status']['code'] == 'CREATED') {
            this.submitted = false;
            this.getProfileDetail();
            this.addFamailyMemberForm.reset();
            this.modalRef.hide();
            this.modalRef2.hide();
            this.toastrService.success(response['status']['description']);
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });
      }
      else {
        let data = {
          path: "auth/subUser/update/" + this.addFamailyMemberForm.value.id,
          data: formdata,
          isAuth: true
        };
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            this.addFamailyMemberForm.reset();
            this.getProfileDetail();
            //this.AddFamilyMember = false;
            this.submitted = false;
            // this.addFamailyMemberForm.reset();
            this.modalRef.hide();
            this.modalRef2.hide();
            this.toastrService.success(response['status']['description']);
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });
      }
    }
    else {
      this.toastrService.error("Please fill all required fields!!");
    }

  }

  get f2() {
    return this.addGuestForm.controls;
  }

  onGuestSubmit() {
    this.submitted = true;
    if (this.addGuestForm.invalid) {
      return this.toastrService.error("Please fill all required fields!!");
    } else {
      this.submitted = false;
    }

    // if(this.addGuestForm.value.phone){
    //   let phone =this.addGuestForm.value.phone;
    //   if(phone.length ===10) {
    //     if (phone.length === 0) {
    //       phone = '';
    //     } else if (phone.length <= 3) {
    //       phone = phone.replace(/^(\d{0,3})/, '($1)');
    //     } else if (phone.length <= 6) {
    //       phone = phone.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
    //     } else if (phone.length <= 10) {
    //       phone = phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    //     } else {
    //       phone = phone.substring(0, 10);
    //       phone = phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    //     }
    //   }else{
    //     return this.toastrService.error("Please Enter valid Contact");
    //   }
    //
    //   this.addGuestForm.patchValue({
    //     phone : phone
    //   })
    // }

    let formdata = this.addGuestForm.value;
    if (this.addGuestForm.valid) {
      if (this.addGuestForm.value.id == "" || this.addGuestForm.value.id == null) {
        formdata['relation'] = "GUEST";
        let data = {
          path: "auth/subUser/create",
          data: formdata,
          isAuth: true
        };
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED') {
            this.submitted = false;
            this.getProfileDetail();
            this.addGuestForm.reset();
            this.modalRef.hide();
            this.toastrService.success(response['status']['description']);
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });
      }
      else {
        let data = {
          path: "auth/subUser/update/" + this.addGuestForm.value.id,
          data: formdata,
          isAuth: true
        };
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            //this.AddGuestMember = false;
            this.submitted = false;
            this.addGuestForm.reset();
            this.getProfileDetail();
            this.modalRef.hide();
            this.modalRef2.hide();
            this.toastrService.success(response['status']['description']);
          } else {
            this.toastrService.error(response['status']['description']);
          }
        });
      }
    }
    else {
      this.toastrService.error("Please fill all required fields!!");
    }
  }


  editFM(guestmember) {
    console.log(this.addGuestForm.value.firstName);
    this.addGuestForm.patchValue({
      id: guestmember.id,
      firstName: guestmember.firstName,
      lastName: guestmember.lastName,
      middleName: guestmember.middleName,
      phone: guestmember.phone,
      relation: guestmember.relation,
      email: guestmember.email,
      birthYear: guestmember.birthYear,
      allowedLogin: guestmember.allowedLogin,
    });
    this.addEditButtonName = "Save";

  }

  editGM(familyMember) {
    this.addFamailyMemberForm.patchValue({
      id: familyMember.id,
      firstName: familyMember.firstName,
      middleName: familyMember.middleName,
      lastName: familyMember.lastName,
      phone: familyMember.phone,
      relation: familyMember.relation,
      email: familyMember.email,
      birthYear: familyMember.birthYear,
      allowedLogin: familyMember.allowedLogin,
    });
    this.addEditButtonName = "Save";
  }

  clear() {
    this.modalRef.hide();
    this.modalRef2.hide();
    this.addGuestForm.reset();
    this.addFamailyMemberForm.reset();

  }

  deleteGM(familyMember) {
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
          path: "auth/subUser/delete/" + familyMember.id,
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
          'Your family member is safe.',
          'error'
        )
      }
    })
  }


  deleteFM(guestmember) {
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
          path: "auth/subUser/delete/" + guestmember.id,
          isAuth: true,
        }
        this.apiService.delete(request).subscribe(response => {

          Swal.fire(
            'Deleted!',
            'Guest member has been deleted.',
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
          'Your family member is safe.',
          'error'
        )
      }
    })
  }

  clearModel() {
    this.modalRef.hide();
    this.addGuestForm.reset();
    this.submitted = false;
  }

  clearModel1() {
    this.modalRef.hide();
    this.submitted = false;
    this.addFamailyMemberForm.reset();
    this.addEditButtonName = "Add";

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  uploadphotoclick() {
    $('#profileupdate').trigger('click');
  }


  fileChangeEvent(event: any) {
    let file = this.profilepic.nativeElement.files;
    console.log(file.length, file[0].type);

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


  removeProfile() {
    //================== update
    let profileUpdateData = { "profilePictureUrl": '' };
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


  profileFormSubmit() {

    if (this.profileForm.valid) {
      console.log("m ", this.mediaList)
      console.log("img ", this.profileForm.value.signatureImage);

      this.submittedPform = true;
      let phone = this.profileForm.value.phone;
      if (this.profileForm.value.phone.length >= 17) {
        phone = phone.slice(0, -1);
      }
      phone = phone.replace('(', '');
      phone = phone.replace(')', '');
      phone = phone.replace(' ', '');
      phone = phone.replace(/[^0-9\.]+/g, "");

      this.profileForm.patchValue({
        phone: phone,
      });
      let profileFormVal = this.profileForm.value;

      if (this.mediaList != '') {
        profileFormVal.signatureImage = this.mediaList[0]['responseData']['data']['imageUrl'];
      }
      else {
        profileFormVal.signatureImage = '';
      }

      profileFormVal.subscribeNewsLetter = this.subscribeNewsLetter;
      let data = {
        path: "auth/user/updateUserDetails",
        data: profileFormVal,
        isAuth: true
      };

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          localStorage.setItem('authDetail', JSON.stringify(response['data']));
          this.getProfileDetail();
          this.mediaList = [];
          this.menuService.setProfile();
          this.toastrService.success(response['status']['description']);
          this.username = response['data']['firstName'] + " " + response['data']['lastName'];
          this.modalRef.hide();
          this.modalRef2.hide();


        } else {
          this.toastrService.error(response['status']['description']);
          this.submittedPform = false;
        }
      });

    } else {
      this.toastrService.error("Please fill all required fields!");
      this.submittedPform = false;
    }

    this.profileUpdatedEvent = false;
  }


  imageCropped(event: ImageCroppedEvent) {
    console.log(event)
    this.croppedImage = event.base64;
    let file = configuration.dataURLtoFile(this.croppedImage, 'profile.png')
    console.log(file, this.croppedImage)

  }


  updateProfile1() {
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
      path: "auth/file/upload/file",
      data: formData,
      isAuth: true
    };
    this.spinner.show();
    this.apiService.postImage(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.profilesrc = response['data']['imageUrl'];
        this.toastrService.success(response['status']['description']);
        //================== update
        let profileUpdateData = { "profilePictureUrl": response['data']['url'] };
        this.profilesrc = response['data']['imageUrl'];
        $('#hideModel').click();
        this.showProfile = true;
        this.getProfileDetail();
        this.modalRef3.hide();
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
          this.getProfileDetail();
          this.modalRef3.hide();
        });
      } else {
        this.spinner.hide();

        this.toastrService.error(response['status']['description']);
      }
    });

  }

  openModalWithClass1(template: TemplateRef<any>) {
    this.modalRef3 = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg modal-dialog-centered upload-profile-img' })
    );
  }


  imageLoaded() {
  }

  cropperReady() {
  }

  loadImageFailed() {
  }


  openModalWithBasicInfo(template: TemplateRef<any>, id) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg performance-newsletter profile-add-member' })

    );
    this.dynamicFormId = id;
    // console.log(this.dynamicFormId);
  }


  openModalOtherInfo(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg performance-newsletter profile-add-member' })
    );
  }



  dynamicClose() {
    this.modalRef.hide();
  }
  getMemberDetails() {
    this.addMemberForm = this.fb.group({});
    let req = {
      path: "auth/formSteps/",
      isAuth: true,
    };
    this.spinner.show();
    let userDetail = JSON.parse(localStorage.getItem("authDetail"));
    console.log("user detail: ", userDetail)
    this.apiService.get(req).subscribe(response => {
      this.memberDetail = response['data'];
      console.log("Member Detail: ", this.memberDetail)
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
              value.optionList.push({ 'value': op, 'check': false });
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
      // this.isMemberFormSubmitted = true;
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
      let formdata = { "fieldValues": this.addMemberForm.value }
      let data = {
        path: "auth/member/update/" + this.addMemberForm.value.id,
        data: formdata,
        isAuth: true
      };
      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.modalRef.hide();
          this.getProfileDetail();
          this.getMemberDetails();
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    } else {
      this.toastrService.error('All * fields are required ');
    }
  }

  filterNonAlphabets(event: KeyboardEvent) {
    const input = event.key;
    const alphabetsPattern = /^[a-zA-Z]+$/;

    if (!alphabetsPattern.test(input)) {
      event.preventDefault();
    }
  }



  queueCompleted() {
    // this.profileForm.patchValue({
    //   signatureImage: this.mediaList[0]['responseData']['data']['imageUrl'],
    // });
  }

  invalidUploadFile() {
    this.toastrService.error('Please upload only image file');
  }

  // maxFileError() {
  //   this.toastrService.error('Maximum 1 file is allowed');
  // }

  fileSizeError() {
    //this.notify.notifyUserError('Maximum 4MB size allowed');
  }
  uploadStarted() {
    //this.isFileUploading=true;
  }
  closeOtpMdl() {
    this.modalRef4.hide();
    this.changeEmail = '';
    this.flag = false;
  }
  update1() {
    if (this.changeEmail != this.mainEmail) {
      let formval = this.profileForm.value
      let postData = {
        path: "auth/user/updateUserDetails",
        data: formval,
        isAuth: true,
      };
      this.apiService.post(postData).subscribe((response) => {
        if (response['status']['code'] == 'OK') {
          this.sendOtpEmail()

        }
        else {
          this.toastrService.error(response['status']['description']);
        }

      });
    } else {
      this.toastrService.error('Please update your email');
    }


  }
  sendOtpEmail() {
    let postData1 = {
      path: "auth/user/sendOtp/temporary",

      isAuth: true,
    };
    this.apiService.get(postData1).subscribe((response) => {
      console.log(response)
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.flag = true

      } else {
        this.toastrService.error(response['status']['description']);
      }

    });
  }
  onOtpChange(event) {
    this.otp = event;
  }
  VerifyOtp() {
    let otp = this.otp;
    let data = {
      path: "auth/user/verifyOtp/temporary/" + otp,
      isAuth: true,
    }
    this.apiService.get(data).subscribe((response) => {
      console.log(response)
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.getProfileDetail();
        this.modalRef4.hide();
        this.profileForm.patchValue({
          email: this.changeEmail
        })
      } else {
        this.toastrService.error(response['status']['description']);
      }

    });
  }
  click(event) {
    console.log("event called")
    this.profileUpdatedEvent = true;
  }
  inputChanged(value) {
    this.changeEmail = value
  }
  updateEmail() {
    //   let formval=this.profileForm.patchValue({
    //     email:this.changeEmail
    //   })
    //   let postData = {
    //     path: "auth/user/updateUserDetails",
    //     data: formval,
    //     isAuth: true,
    //   };
    //   this.apiService.post(postData).subscribe((response) => {
    //     console.log(response)
    //     if (response['status']['code'] == 'CREATED') {

    //       this.toastrService.success(response['status']['description']);

    //     } else {
    //       this.toastrService.error(response['status']['description']);
    //     }
    //   });
    console.log("sfsds")

  }

}
