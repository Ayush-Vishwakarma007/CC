import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../services/spinner.service';
import {ActivatedRoute, Router} from "@angular/router";
import {configuration} from "../../../configration";

@Component({
  selector: 'app-member-register',
  templateUrl: './member-register.component.html',
  styleUrls: ['./member-register.component.scss']
})
export class MemberRegisterComponent implements OnInit {

  activeTabName: any = [];
  activeTabNameNo: number = 1;
  lastSubmitBtnValue: string = "Next";
  userData: any;
  familyData: any;
  guestData: any;
  addGuestMemberForm: FormGroup;
  allUser: any;
  eventId: string = "5de5f2744914d61844801360";
  foodOptions: any;
  seatingDetail: any;
  totalEntry: any;

  checkedMember: any = [];
  seatingCategoryId: any = null;
  vendorExpo: any = [];
  eventDetail: any = [];
  userFees: any = [];
  totalFees: any;
  userType: any = [];
  boothData: any = [];
  step: any = [];
  display: any = [];
  sponsorList: any = [];
  postData: any = {};
  finalData: any = {};
  sponsorData: any = {};
  mediaList: any = [];
  mediaUploadUrl = "event/uploadPicture";
  mediaUrl: any = [];
  donationAmount = '';

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, public router: Router, private route: ActivatedRoute, private toastrService: ToastrService, public spinner: SpinnerService, private cd: ChangeDetectorRef) {
    this.addGuestMemberForm = this.formBuilder.group({
      allowedLogin: [true],
      birthYear: ['', Validators.required],
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      relation: [''],
    });
    this.route.params.subscribe(params =>
      this.userType = params
    );
  }

  ngOnInit() {
    this.displayData();
    this.getStep();
    this.getProfileDetail();
    this.getFoodOption();
    this.getSeatingDetil();
    this.getSponsorDetail();
    this.getEventDetail();
    this.getVendorExpo();
    this.postData['eventId'] = this.eventId;
    this.postData['role'] = this.userType['type'].toUpperCase();
  }

  feesCalculation(type, event, id, detail) {
    if (type == 'fee') {
      if (event.checked == true) {
        let age = configuration.calculateAge(detail['birthYear']);
          this.checkedMember.push({
            'id': id, 'age': age, 'detail': detail,
            'selectedFoodNames': [], 'seatNumber': '', 'seatingCategoryName': '', 'seat': [], 'seatCategoryId': null
          });
      } else {
        this.checkedMember = this.checkedMember.filter(item => item.id !== id);
      }
      let totalSelectedMember = this.checkedMember.length;
    } else if (type == 'booth') {
      let tempArr = [];
      this.vendorExpo.forEach(item => {
        tempArr.push({
          "categoryId": item.id,
          "count": item.count,
        });
      });
      this.postData['expoCategories'] = tempArr;
    } else if (type == 'sponsorship') {
      this.postData['donationAmount'] = this.donationAmount;
    } else if (type == 'seat') {
      this.checkedMember[id]['seatNumber'] = event.value;
      this.checkedMember.forEach((item, key) => {
        if (key != id) {
          if (event.value == item['seatNumber'] && detail['seatingCategoryName'] == item['seatingCategoryName']) {
            this.toastrService.error('Seat Already Taken');
            event.value = '';
            this.checkedMember[id]['seatNumber'] = '';
          }
        }
      });
    }else if(type == 'final') {

      let tempArr = [];
      this.checkedMember.forEach(item => {
        tempArr.push({
          "age": item.age,
          "id": item.id,
          "selectedFoodNames": item.selectedFoodNames,
          "seatingCategoryId": item.seatCategoryId,
        });
      });
      this.postData['registrations'] = tempArr;
      let data = {
        path: "event/event/registration/",
        data: this.postData,
        isAuth: true
      };

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          return ;
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
    let tempArr = [];
    this.checkedMember.forEach(item => {
      tempArr.push({
        "age": item.age,
        "id": item.id,
        "selectedFoodNames": item.selectedFoodNames,
        "seatingCategoryId": item.seatCategoryId,
      });
    });
    this.postData['userInfo'] = tempArr;
    let data = {
      path: "event/calculateAmount/",
      data: this.postData,
      isAuth: true
    };

    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.finalData = response['data'];
        this.totalEntry = 0;
        this.finalData['userAgeFees'].forEach(item => {
            this.totalEntry = this.totalEntry + item['members'];
        });
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  foodSelection(event, food, detail, i) {
    let data = [];
    if (event.checked == true) {
      data.push(food['foodName']);
    }
    detail['selectedFoodNames'] = detail['selectedFoodNames'].concat(data);
    this.checkedMember[i] = detail;
    this.feesCalculation('', event, '', '');

  }

  getFoodOption() {
    let data = {
      path: "event/eventFoodOptions/" + this.eventId,
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      this.foodOptions = response['data'];
    });
  }

  addGuestMemberFormSubmit() {
    if (this.addGuestMemberForm.valid) {
      let formdata = this.addGuestMemberForm.value;
      let data = {
        path: "auth/subUser/create",
        data: formdata,
        isAuth: true
      };

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED') {
          this.addGuestMemberForm.reset();
          this.toastrService.success(response['status']['description']);
          this.getProfileDetail();
          $("#addguestmodalclosebtn").trigger("click");
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });

    } else {
      this.toastrService.error("Please fill required fields");
    }
  }

  getSeatingDetil() {
    let data = {
      path: "event/getSeatings/" + this.eventId,
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.seatingDetail = response['data'];
      //console.log(this.seatingDetail);
    });
  }

  getProfileDetail() {
    this.spinner.show();
    let data = {
      path: "auth/user/getUserDetail",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      //console.log(response['data']['user']);
      this.spinner.hide();
      this.userData = response['data']['user'];
      this.familyData = response['data']['familyMembers'];

      this.guestData = response['data']['guests'];
      this.allUser = this.familyData;
      if (this.userType['type'] != 'vendor') {
        this.allUser = [];
        this.allUser = this.familyData.concat(this.guestData);
      }
    });
  }

  back() {
    if (this.activeTabNameNo != 1) {
      this.activeTabNameNo = this.activeTabNameNo - 1;
      this.activeTabName = "activeTabName_" + this.activeTabNameNo;
      this.lastSubmitBtnValue = "Next";
    }
  }

  next() {
    // if (this.submitValue != 4) {
    //   this.activeTabNameNo = this.activeTabNameNo + 1;
    //   this.activeTabName = "activeTabName_" + this.activeTabNameNo;
    //   this.lastSubmitBtnValue = "Next";
    // }
    // if (this.activeTabNameNo == 4) {
    //   this.lastSubmitBtnValue = "Confirm & Pay";
    // }
  }

  getShortName(fullName) {
    return fullName.split(' ').map(n => n[0]).join('');
  }

  getStep() {
    let data = {
      path: "event/eventRegistrationSteps/" + this.userType['type'].toUpperCase() + "/" + this.userType['event'],
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.step = response['data'];
        this.step.forEach((item, index) => {
          this.step[index]['active'] = false;
        });
        this.activeTabName = this.step[0];
      }
    });
  }

  getSponsorDetail() {
    let data = {
      path: "event/getAllSponsorshipCategories/" + this.userType['event'],
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.sponsorList = response['data'];
        //console.log( this.sponsorList);
      }
    });
  }

  getEventDetail() {
    let data = {
      path: "event/details/" + this.userType['event'],
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.eventDetail = response['data'];

        this.eventDetail['display_date'] = configuration.format_date(this.eventDetail['dateTime']) + ' - ' + configuration.format_date(this.eventDetail['endDateTime']);
      }
    });
  }

  decrementBoothCounter(booth) {
    if (!booth['count']) {
      booth['count'] = 0;
      booth['totalPrice'] = 0;
    }
    booth['count'] = booth['count'] == 0 ? 0 : booth['count'] - 1;
    booth['totalPrice'] = booth['count'] * booth['price'];
    this.feesCalculation('booth', event, booth['id'], booth);
  }

  incrementBoothCounter(booth) {
    if (!booth['count']) {
      booth['count'] = 0;
      booth['totalPrice'] = 0;
    }
    if (booth['count'] < booth['maxCapacity']) {
      booth['count'] = booth['count'] + 1;
      booth['totalPrice'] = booth['count'] * booth['price'];
      this.feesCalculation('booth', event, booth['id'], booth);

    }
  }

  getVendorExpo() {
    let data = {
      path: "event/getAllVendorExpo/" + this.userType['event'],
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.vendorExpo = response['data'];
        this.vendorExpo.forEach((item, index) => {
          item['totalPrice'] = 0
        });
      }
    });
  }

  openActiveTab(tabName) {
    this.nextBackActiveTab(tabName, 'current');
  }

  displayData() {
    if (this.userType['type'] == 'user') {
      this.display['header'] = 'MEMBER REGISTRATION';
      this.display['sub_header'] = 'Family Members';
      this.display['add_new'] = 'Add Guest';
      this.display['relation'] = [
        {'name': 'Family Member', 'value': 'SIBLINGS'},
        {'name': 'Guest', 'value': 'Guest'},
      ];
    } else if (this.userType['type'] == 'vendor') {
      this.display['header'] = 'VENDOR REGISTRATION';
      this.display['sub_header'] = 'Added Vendors';
      this.display['add_new'] = 'Add Employee';
      this.display['relation'] = [
        {'name': 'Employee', 'value': 'EMPLOYEE'},
      ];

    }
  }

  submitValue() {
    this.nextBackActiveTab(this.activeTabName['step'], 'next');

  }

  submitSponsor() {
    if (this.sponsorData['title'] && this.sponsorData['title'] != '' && this.donationAmount != '') {
      this.postData['marketingMaterial'] = this.sponsorData;
      this.feesCalculation('sponsorship', [], '', {});
      this.toastrService.success('Sponsors Detail Saved Successfully');
    } else {
      this.toastrService.error('Please Enter Required Field');
    }
  }

  nextBackActiveTab(currentTabName, type) {
    if (this.activeTabName['step'] == "MEMBER_REGISTRATION" && this.checkedMember.length == 0 && this.activeTabName['step'] != currentTabName) {
      this.toastrService.error('Select Member');
    } else if (this.activeTabName['step'] == "BOOTH_SELECTION" && this.checkedMember.length == 0) {
      this.toastrService.error('Select Any booth');
    } else {
      let step;
      this.step.filter(function (entry, index) {
        if (entry.step == currentTabName) {
          step = index;
        }
      });
      if (type == 'next') {
        step = step + 1;
      } else if (type == 'back') {
        step = step - 1;
      }
      this.step.forEach((item, index) => {
        if (this.activeTabName == item['step']) {
          this.step[index]['active'] = true;
        }
      });
      if (step >= 0 && step < this.step.length) {
        let tab;
        tab = this.step[step];
        this.activeTabName = tab;
      }
      if(this.step.length == step)
      {
        this.feesCalculation('final', [],'', []);

      }
    }
  }

  invalidUploadFile() {
    this.toastrService.error('Please Add Valid File');
  }

  maxFileError() {
    //this.notify.notifyUserError('Maximum 4 files allowed');
  }

  fileSizeError() {
    //this.notify.notifyUserError('Maximum 4MB size allowed');
  }

  uploadStarted() {
    //this.isFileUploading=true;
  }

  queueCompleted() {
    this.mediaUrl = [];
    let dataImage = [];
    let dataVideo = [];
    let dataOther = [];

    if (this.mediaList.length > 0) {
      this.mediaList.forEach(item => {
        if (item['extention'] == 'jpg' || item['extention'] == 'png' || item['extention'] == 'jpeg') {
          dataImage.push(item.responseData.data.imageUrl);
        } else if (item['extention'] == 'mp4') {
          dataVideo.push(item.responseData.data.imageUrl);
        } else {
          dataOther.push(item.responseData.data.imageUrl);
        }
        this.mediaUrl.push(item.responseData.data);
      });
      this.sponsorData['bannerUrls'] = dataImage;
      this.sponsorData['videoUrls'] = dataVideo;
      this.sponsorData['otherMaterialUrls'] = dataOther;
    }
  }

  userSeatData(value, detail, i) {
    let seat = this.seatingDetail.filter(item => item.seatingCategoryName == value)[0];
    this.checkedMember[i]['seatNumber'] = '';
    this.checkedMember[i]['seat'] = [];


    if (seat) {
      this.checkedMember[i]['seatCategoryId'] = seat['seatingCategoryId'];
      this.checkedMember[i]['seatingCategoryName'] = value;
      this.checkedMember[i]['seatNumber'] = '';

      this.checkedMember[i]['seat'] = seat['eventSeatingDetail']['seats'];
    } else {
      this.checkedMember[i]['seatCategoryId'] = null;
      this.checkedMember[i]['seat'] = [];
    }

  }
}
