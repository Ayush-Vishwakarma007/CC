import { Component, OnInit, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { MenuService } from "../../../services/menu.service";
import { SpinnerService } from "../../../services/spinner.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from "ngx-toastr";
import { SeoService } from "../../../services/seo.service";
import Swal from "sweetalert2";
import { pagination } from "../../../pagination";
import { Subject } from "rxjs";
import * as $ from "jquery";
import { Location } from "@angular/common";
import { CommunityDetailsService } from "../../../services/community-details.service";
import { Item } from "angular2-multiselect-dropdown";
// import { DISABLED } from "@angular/forms/src/model";

@Component({
  selector: "app-member-details",
  templateUrl: "./member-details.component.html",
  styleUrls: ["./member-details.component.scss"],
})
export class MemberDetailsComponent implements OnInit {
  changePass:boolean=false;
  modalRef: BsModalRef;
  userId: any;
  userDetails: any = [];
  familyDetails: any = [];
  guestDetails: any = [];
  memberDetail: any = [];
  filedValue: any = [];
  editMemberForm: FormGroup;
  accessForm: FormGroup;
  pageLocation: "Family" | "Guest" = "Family";
  totalPages: any = [];
  totalSettingPages: any = [];
  durationTypeList: any = [];
  addFmailyMemberForm: FormGroup;
  addGuestMemberForm: FormGroup;
  memberHistory: any = [];
  memberSettingHistory: any = [];
  password: boolean = false;
  addMemberForm: FormGroup;
  relationList: any;
  rolesList: any = [];
  chapterList: any = [];
  userPermission: any = [];
  reqData: any = [];
  reqData1: any = [];
  userSubject: Subject<any> = new Subject();
  currentTab = "";
  membershipDetail: any = [];
  publicInfo: any = [];
  chapterId = "";
  validation: any;
  urlPattern =
    /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  isMemberFormSubmitted: boolean;
  selectedRoles: any = [];
  selectedAccess: any = [];
  changePassword = "";
  startDate = null;
  endDate = null;
  tags: any = [];
  notificationData: any = [];
  memberList: any = [];
  search = "";
  searchString: string = "";
  type: any;
  reqData2: any = [];
  reqData3: any = [];
  mydontation: any = [];
  mysponsorship: any = [];
  isDisabled: boolean;
  location: Location;
  totalMember = 0;
  reqActivity:any=[]
  totalPages1:any
  storeActivityLog:any
  editorConfig = {
    editable: true,
    spellcheck: true,
    height: "auto",
    minHeight: "250px",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Enter text here...",
    imageEndPoint: "",
    toolbar: [
      ["bold", "italic", "underline"],
      [{ header: 1 }, { header: 2 }],
      [
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
        "indent",
        "outdent",
      ],
      ["link"],
    ],
  };
  constructor(
    private route: ActivatedRoute,
    public communityService: CommunityDetailsService,
    public activate: ActivatedRoute,
    public communityDetailsService: CommunityDetailsService,
    public _location: Location,
    private modalService: BsModalService,
    public menuService: MenuService,
    public spinner: SpinnerService,
    public router: Router,
    private fb: FormBuilder,
    public apiService: ApiService,
    private toastrService: ToastrService,
    private seo: SeoService
  ) {
    this.reqData2 = {
      filter: {
        userId: this.userId,
        donationType: "DONATION",
      },
      page: {
        pageLimit: 50,
        pageNumber: 0,
      },
      sort: {
        orderBy: "DESC",
        sortBy: "DATE",
      },
    };
    this.reqData3 = {
      filter: {
        userId: this.userId,
        donationType: "SPONSOR",
      },
      page: {
        pageLimit: 50,
        pageNumber: 0,
      },
      sort: {
        orderBy: "DESC",
        sortBy: "DATE",
      },
    };
    this.reqActivity={
      "filter": {
       
        "referenceId": "",
       
      },
        "page": {
        "limit": 10,
        "page": 0
        },
        "sort": {
        "orderBy": "DESC",
        "sortBy": "DATE_TIME"
        }
        
    };
    this.addFmailyMemberForm = this.fb.group({
      id: [""],
      allowedLogin: [false],
      email: [""],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      phone: [""],
      birthYear: ["", Validators.required],
      relation: ["SIBLINGS", Validators.required],
    });
    this.accessForm = this.fb.group({
      roles: [[], Validators.required],
      access: [[]],
    });
    this.addGuestMemberForm = this.fb.group({
      id: [""],
      allowedLogin: [true],
      email: [""],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      phone: [""],
      birthYear: ["", Validators.required],
      relation: ["GUEST"],
    });
    this.reqData = {
      filter: {},
      page: {
        limit: 10,
        page: 0,
      },
      sort: {
        orderBy: "ASC",
        sortBy: "FIRST_NAME",
      },
    };
    this.reqData1 = {
      filter: {
        userId: this.userId,
      },
      page: {
        limit: 8,
        page: 0,
      },
      sort: {
        orderBy: "DESC",
        sortBy: "START_DATE",
      },
    };
    this.editMemberForm = this.fb.group({});
  }

  get fm() {
    return this.addFmailyMemberForm.controls;
  }

  get g() {
    return this.addGuestMemberForm.controls;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params["id"];
    });

    this.activate.params.subscribe((data) => {
      this.getRoles();
      this.getUserDetails();
      this.userSubject.next(null);
      this.getNotificationSettingMember();
      this.getFormData();
      this.getPermission();
      this.get_relation();
      this.getChapterList();
      this.getMemberHistory();
      this.getCurrentMembership();
      this.getDurationType();
      this.getPublicInfo();
      this.myContribution();
      this.activityLog()
    });
  }

  becomeMember() {
    this.router.navigate(["membership-checkout-new"]);
  }

  getCurrentMembership() {
    if (this.userDetails["member"]) {
      let request = {
        path:
          "auth/membershipType/details/plan/" +
          this.userDetails["member"]["planId"],
        isAuth: true,
      };
      this.apiService.get(request).subscribe((response) => {
        this.membershipDetail = response["data"];
        console.log(this.memberDetail)
        this.membershipDetail["plans"].forEach((i, j) => {
          if (i["id"] == this.userDetails["member"]["planId"]) {
            this.membershipDetail["currentPlan"] = i;
            this.membershipDetail["planName"] = this.durationTypeList.filter(
              (item) => {
                if (item["value"] == i["durationType"]) {
                  return item;
                }
              //s console.log("ank",item)
              }
            )[0];
          }
        });
      });
    }
  }

  getDurationType() {
    let request = {
      path: "auth/durationType",
      isAuth: true,
    };
    return new Promise<void>((resolve) => {
      this.apiService.get(request).subscribe((response) => {
        this.durationTypeList = response["data"];
        resolve();
      });
    });
  }

  getPublicInfo() {
    let request = {
      path: "auth/configuration/publicInfo",
      isAuth: true,
    };
    this.apiService.get(request).subscribe((response) => {
      this.publicInfo = response["data"];
    });
  }
  changeDate() {
    this.getNotificationSettingMember();
  }
  clearFilter() {
    this.startDate = null;
    this.endDate = null;
    this.getNotificationSettingMember();
  }
  addTag(e) {
    if ($.trim(e.value) != "") {
      this.tags.push($.trim(e.value));
      $(".mat-chip-input").val("");
    }
  }
  remove(i) {
    this.tags.splice(i, 1);
  }
  sendRecipt(id) {
    let req = {};
    req["cc"] = this.tags;
    let data = {
      path: "auth/memberHistory/sendReceipt/" + id,
      data: req,
      isAuth: true,
    };
    this.apiService.post(data).subscribe((response) => {
      if (response["status"]["status"] != "ERROR") {
        this.tags = [];
        this.toastrService.success(response["status"]["description"]);
      } else {
        this.toastrService.error(response["status"]["description"]);
      }
    });
  }
  getUserDetails() {
    this.spinner.show();
    let data = {
      path: "auth/user/getUser/" + this.userId,
      isAuth: true,
    };
    console.log(data);
    return new Promise<void>((resolve) => {
      this.apiService.get(data).subscribe((response) => {
        if (response["status"]["code"] == "OK") {
          if (
            response["data"].profilePictureUrl == null ||
            response["data"].profilePictureUrl == ""
          ) {
            response["data"]["profileShow"] = false;
            response["data"]["profileUrl"] =
              response["data"].firstName[0] + "" + response["data"].lastName[0];
          } else {
            response["data"]["profileShow"] = true;
            response["data"]["profileUrl"] = response["data"].profilePictureUrl;
          }
          this.userDetails = response["data"];
          this.chapterId = this.userDetails["chapterId"];
          this.selectedRoles = this.userDetails["roles"];
          if (this.userDetails.userAccessList) {
            this.userDetails.userAccessList.map((item) => {
              this.selectedAccess.push(item.specificId);
            });
          }
          //console.log(this.selectedAccess,this.selectedRoles)
          this.accessForm.patchValue({
            roles: this.selectedRoles,
            access: this.selectedAccess,
          });
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
        resolve();
      });
    });
  }
  noReceipt(){
    this.toastrService.error('Receipt not available');
  }
  viewReceipt(id){
    this.spinner.show();
    let req = {
      path: "auth/memberHistory/viewReceipt/"+id,
      isAuth: true,
    };
    this.apiService.getPDF(req);
  }

  getNotificationSettingMember() {
    this.reqData1["filter"]["minDate"] = this.startDate;
    this.reqData1["filter"]["maxDate"] = this.endDate;
    this.reqData1["filter"]["userId"] = this.userId;
    let data = {
      path: "auth/memberHistory/getAll",
      data: this.reqData1,
      isAuth: true,
    };
    this.apiService.post(data).subscribe((response) => {
      this.memberSettingHistory = response["data"];
      this.totalSettingPages = pagination.arrayTwo(
        this.memberSettingHistory["totalPages"],
        this.reqData1.page.page
      );
    });
  }
  getMemberHistory() {
    this.reqData1["filter"]["userId"] = this.userId;
    let data = {
      path: "auth/memberHistory/getAll",
      data: this.reqData1,
      isAuth: true,
    };
    this.apiService.post(data).subscribe((response) => {
      this.memberHistory = response["data"];
      this.memberHistory["content"].map((data, index) => {

        this.memberHistory["content"][index]["active"] = false;
        if (
          index == 0 &&
          (data["expirationDate"] == null ||
            data["expirationDate"] < new Date())
        ) {
          this.memberHistory["content"][index]["active"] = true;

        }
      });

      this.totalPages = pagination.arrayTwo(
        this.memberHistory["totalPages"],
        this.reqData1.page.page
      );
    });
  }

  getPermission() {
    let req = {
      path: "uiPermission/getPermissionByRole",
      isAuth: true,
    };

    return new Promise<void>((resolve) => {
      this.apiService.get(req).subscribe((response) => {
        if (response["status"]["code"] == "OK") {
          this.userPermission = [];
          response["data"].forEach((item, index) => {
            this.userPermission[item.name] = item;
          });
        } else {
        }

        resolve();
      });
    });
  }

  get_relation() {
    let contry_data = {
      path: "auth/relation/getAll",
      isAuth: true,
    };

    this.apiService.get(contry_data).subscribe((response) => {
      this.relationList = response["data"];
    });
  }

  arrayTwo(n: number) {
    return Array(n)
      .fill(0)
      .map((x, i) => i);
  }

  pagination1(type, data, current = null) {
    if (data == "user") {
      if (type == "prev") {
        this.reqData1.page.page = this.reqData1.page.page - 1;
      } else if (type == "current") {
        this.reqData1.page.page = current;
      } else {
        this.reqData1.page.page = this.reqData1.page.page + 1;
      }
      this.getNotificationSettingMember();
    }
  }
  pagination(type, data, current = null) {
    if (data == "user") {
      if (type == "prev") {
        this.reqData1.page.page = this.reqData1.page.page - 1;
      } else if (type == "current") {
        this.reqData1.page.page = current;
      } else {
        this.reqData1.page.page = this.reqData1.page.page + 1;
      }
      this.getMemberHistory();
    }
  }

  delete(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this member!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "auth/subUser/delete/" + id,
          isAuth: true,
        };
        this.apiService.delete(request).subscribe(
          (response) => {
            Swal.fire("Deleted!", "Family member has been deleted.", "success");
            this.getUserDetails();
          },
          (error) => {
            Swal.fire("Cancelled", "Family member is safe.", "error");
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your Family Member is safe.", "error");
      }
    });
  }

  /*/=====================================ROLE & ACCESS=====================================*/
  getChapterList() {
    let request = {
      path: "community/chapters",
      isAuth: true,
    };
    this.apiService.get(request).subscribe((response) => {
      this.chapterList = response["data"];
    });
  }

  getShortName(fullName) {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("");
  }

  changeChapter(value) {
    let request = {
      path: "auth/user/chapter/" + value + "?userId=" + this.userDetails.id,
      isAuth: true,
    };
    this.apiService.get(request).subscribe((response) => {
      if (response["status"]["code"] == "OK") {
        this.chapterId = value;
        this.toastrService.success(response["status"]["description"]);
      } else {
        this.toastrService.error(response["status"]["description"]);
      }
    });
  }

  getFormData() {
    this.editMemberForm = this.fb.group({});
    let req = {
      path: "auth/formSteps/" + this.userId,
      isAuth: true,
    };
    this.apiService.get(req).subscribe((response) => {
      this.memberDetail = response["data"];
      this.memberDetail.forEach((item, index) => {
        this.editMemberForm.addControl(
          "id",
          new FormControl(this.userId, Validators.required)
        );
        item.fieldValues.forEach((value, index1) => {
          let fieldName = value.fieldName;
          this.filedValue = value.value;
          if (this.filedValue == null) {
            this.filedValue = "";
          }
          if (value.type == "CHECK_BOX") {
            value.optionList = [];
            value.options.filter((op) => {
              value.optionList.push({ value: op, check: false });
            });
            let filedValue = this.filedValue.split(",");
            value.optionList.filter((list) => {
              filedValue.filter((op) => {
                if (op == list["value"]) {
                  list["check"] = true;
                }
              });
            });
          }

          //this.editMemberForm.controls[fieldName].clearValidators();\
          if (value.required == true) {
            if (value.type == "URL") {
              this.validation = [
                Validators.required,
                Validators.pattern(this.urlPattern),
              ];
            } else {
              this.validation = [Validators.required];
            }
          } else {
            if (value.type == "URL") {
              this.validation = [Validators.pattern(this.urlPattern)];
            } else {
              this.validation = [];
            }
          }
          this.editMemberForm.addControl(
            fieldName,
            new FormControl(this.filedValue, this.validation)
          );
        });
      });
      //this.editMemberForm.disable();
    });
  }
  viewNotificationReceipt(id){
    this.spinner.show();
    let req = {
      path: "event/chapter/sponsorship/getReceipt/"+id,
      isAuth: true,
    };
    this.apiService.getPDF(req);
  }
  getNotificationReceipt(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want send receipt!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Send it!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        let req = {
          path: "event/chapter/sponsorship/sendReceipt/" + id,
          isAuth: true,
        };
        this.apiService.get(req).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Success!',
              response['status']['description'],
              'success'
            );
          } else {
            Swal.fire(
              'Cancelled',
              'Receipt not send.',
              'error'
            );
          }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Receipt not send.',
          'error'
        )
      }
    })
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  editMemberFormSubmit() {
    this.memberDetail.forEach((item, index) => {
      item.fieldValues.forEach((value, index1) => {
        let fieldName = value.fieldName;
        if (value.type == "CHECK_BOX") {
          let checked = "";
          value["optionList"].filter((list) => {
            if (list["check"] == true) {
              checked += list["value"] + ",";
            }
          });
          if (value.required == true) {
            this.validation = [Validators.required];
          } else {
            this.validation = [];
          }
          this.editMemberForm.patchValue({
            fieldName: checked,
          });
          this.editMemberForm.removeControl(fieldName);
          this.editMemberForm.addControl(
            fieldName,
            new FormControl(checked, this.validation)
          );
          value.value = checked;
        }
      });
    });
    if (this.editMemberForm.valid) {
      let formdata = { fieldValues: this.editMemberForm.value };
      formdata["roles"] = this.accessForm.value.roles;
      let userAccessList = [];
      this.accessForm.value.access.map((item) => {
        userAccessList.push({
          accessType: "CHAPTER",
          specificId: item,
        });
      });
      formdata["userAccessList"] = userAccessList;
      let data = {
        path: "auth/member/update/" + this.editMemberForm.value.id,
        data: formdata,
        isAuth: true,
      };
      this.apiService.post(data).subscribe((response) => {
        if (response["status"]["code"] == "OK") {
          window.scroll(0,0);
          this.isMemberFormSubmitted = false;
          this.getFormData();
          this.toastrService.success(response["status"]["description"]);
        } else {
          this.toastrService.error(response["status"]["description"]);
        }
      });
    } else {
      this.toastrService.error("All * fields are required");
    }
  }
  submitAccess() {
    let formdata = {};
    console.log('1231231231231',formdata);
    
    ``;
    formdata["roles"] = this.accessForm.value.roles;
    let userAccessList = [];
    this.accessForm.value.access.map((item) => {
      userAccessList.push({
        accessType: "CHAPTER",
        specificId: item,
      });
    });
    formdata["userAccessList"] = userAccessList;
    formdata["mainUser"] = true;

    let data = {
      path: "auth/member/update/" + this.editMemberForm.value.id,
      data: formdata,      
      isAuth: true,
    };
    this.apiService.post(data).subscribe((response) => {      
      if (response["status"]["code"] == "OK") {
        this.isMemberFormSubmitted = false;
        this.getFormData();
        this.toastrService.success(response["status"]["description"]);
      } else {
        this.toastrService.error(response["status"]["description"]);
      }
    });
  }
  passwordChange() {
    if(this.changePass == true) {
    if ($.trim(this.changePassword) != "") {
      let formdata = {
        newPassword: btoa(this.changePassword),
      };
      let data = {
        path: "auth/user/forgetPassword/update/" + this.editMemberForm.value.id,
        data: formdata,
        isAuth: true,
      };
      this.apiService.post(data).subscribe((response) => {
        if (response["status"]["code"] == "OK") {
          this.toastrService.success(response["status"]["description"]);
        } else {
          this.toastrService.error(response["status"]["description"]);
        }
      });
    } else {
      this.toastrService.error("Please enter valid password");
    }
  }
  this.changePass = false;
  }
  deleteMember(id) {
    if (id == undefined) {
      id = this.editMemberForm.value.id;
    }
    $("#delete_btn").click();
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this member!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, inactive it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "auth/user/delete/" + id,
          isAuth: true,
        };
        this.apiService.get(request).subscribe(
          (response) => {
            if (response["status"]["code"] == "BAD_REQUEST") {
              Swal.fire(
                "warning!",
                response["status"]["description"],
                "warning"
              );
            } else {
              Swal.fire(
                "Inactive!",
                //response['status']['description'],
                "Member has been deleted.",
                "success"
              );
            }
            //console.log(response)
            this._location.back();
          },
          (error) => {
            Swal.fire("Cancelled", "Member is safe.", "error");
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Member is safe.", "error");
      }
    });
  }
  memberData(search = "") {
    if (this.type == "family" || this.type == "guest") {
      let data = {
        path: "auth/user/getUserDetail/" + this.userId,
        isAuth: true,
      };

      this.apiService.get(data).subscribe((response) => {
        if (this.type == "family") {
          this.memberList["content"] = response["data"]["familyMembers"];
        } else {
          this.memberList["content"] = response["data"]["guests"];
        }
        this.memberList["content"].forEach((item, index) => {
          item["sub"] = false;
          item["submembers"] = [];
          item["profileShow"] = false;
          //this.subMembers(item.id, index);
          if (item.firstName) {
            if (
              item.profilePictureUrl == null ||
              item.profilePictureUrl == ""
            ) {
              item["profileShow"] = false;
              item["profileUrl"] = item.firstName[0] + "" + item.lastName[0];
            } else {
              item["profileShow"] = true;
              item["profileUrl"] = item.profilePictureUrl;
            }
          }
        });
        if (this.type == "family") {
          this.memberList["totalElements"] =
            response["data"]["familyMembers"].length;
        } else {
          this.memberList["totalElements"] = response["data"]["guests"].length;
        }
      });
    } else {
      if (this.search != "") {
        this.reqData["page"]["page"] = 0;
      }
      this.reqData["filter"]["search"] = this.search;
      this.searchString = search;
      let req = {
        path: "auth/user/getUsers",
        data: this.reqData,
        isAuth: true,
      };
      this.spinner.show();
      this.apiService.post(req).subscribe((response) => {
        this.memberList = response["data"];

        let member_length = this.memberList["content"].length;
        let page_no = this.reqData.page.page;
        if (member_length == 0) {
          if (page_no != 0) {
            this.reqData.page.page = page_no - 1;
            this.memberData();
          }
        }
        this.totalPages = pagination.arrayTwo(
          this.memberList["totalPages"],
          this.reqData.page.page
        );
        this.memberList["content"].forEach((item, index) => {
          item["sub"] = false;
          item["submembers"] = [];
          item["profileShow"] = false;
          //this.subMembers(item.id, index);
          if (item.firstName) {
            if (
              item.profilePictureUrl == null ||
              item.profilePictureUrl == ""
            ) {
              item["profileShow"] = false;
              item["profileUrl"] = item.firstName[0] + "" + item.lastName[0];
            } else {
              item["profileShow"] = true;
              item["profileUrl"] = item.profilePictureUrl;
            }
          }
        });
        this.totalMember = response["data"]["totalElements"];
        this.spinner.hide();
      });
    }
  }
  openModalWithClassEmail(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "modal-lg infomainpopup terms-margin" })
    );
  }
  NotificationClear() {
    this.notificationData["message"] = "";
  }

  submitNotification() {
    if (
      $.trim(this.notificationData["message"]) != "" &&
      this.notificationData["message"] != undefined
    ) {
      let postData = {
        message: this.notificationData["message"],
      };
      let req = {
        path: "auth/member/contact/" + this.notificationData["id"],
        data: postData,
        isAuth: true,
      };
      this.apiService.post(req).subscribe((response) => {
        if (response["status"]["code"] == "OK") {
          $("#deleEmail").trigger("click");
          this.toastrService.success(response["status"]["description"]);
          this.modalRef.hide();
          this.memberData();
          this.notificationData["id"] = "";
          this.notificationData["message"] = "";
        } else {
          this.toastrService.error(response["status"]["description"]);
        }
      });
    } else {
      this.toastrService.error("Add vaild reason");
    }
  }
  notificationMember(id) {
    this.notificationData["id"] = id;
  }
  getRoles() {
    let req = {
      path: "auth/roles",
      isAuth: true,
    };
    this.apiService.get(req).subscribe((response) => {
      if (response["status"]["code"] == "OK") {
        let array = [];
        response["data"].map((item) => {
          if (item.selectable == true) {
            array.push(item);
          }
        });
        this.rolesList = array;
      } else {
        this.toastrService.error(response["status"]["description"]);
      }
    });
  }

  roleChange(data) {
    let find = data.find((ob) => ob == "CHAPTER_ADMIN");
    this.selectedRoles = this.accessForm.value.roles;

    if (this.selectedAccess.length == 0 && find != undefined) {
      this.selectedAccess.push(this.chapterList[0]["id"]);
    }
    if (find == undefined) {
      this.selectedAccess = [];
    }
    this.accessForm.patchValue({
      access: this.selectedAccess,
    });
  }
  chapterChange(data) {
    this.selectedRoles = this.accessForm.value.roles;
    this.selectedAccess = this.accessForm.value.access;

    if (data.length != 0) {
      this.selectedRoles = this.selectedRoles.filter(
        (item) => item != "CHAPTER_ADMIN"
      );
      this.selectedRoles.push("CHAPTER_ADMIN");
    } else {
      this.selectedRoles = this.selectedRoles.filter(
        (item) => item != "CHAPTER_ADMIN"
      );
    }
    console.log(this.selectedAccess);

    this.accessForm.patchValue({
      roles: this.selectedRoles,
    });
  }

  myContribution() {
    this.spinner.show();
    this.reqData2["filter"]["userId"] = this.userId;

    let data = {
      path: "event/chapter/sponsorship/self",
      data: this.reqData2,
      isAuth: true,
    };

    this.apiService.post(data).subscribe((response) => {
      this.mydontation = response["data"];
    });
    this.reqData3["filter"]["userId"] = this.userId;

    let data1 = {
      path: "event/chapter/sponsorship/self",
      data: this.reqData3,
      isAuth: true,
    };

    this.apiService.post(data1).subscribe((response) => {
      this.mysponsorship = response["data"];
    });
  }
  renewMembership() {
    let data = {
      path: "auth/member/renew/remainder/" + this.userId,
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.get(data).subscribe((response) => {
      this.spinner.hide();
      if (response["status"]["code"] == "OK") {
        this.toastrService.success(response["status"]["description"]);
      } else {
        this.toastrService.error(response["status"]["description"]);
      }
    });
  }

  change(event) {
    if(event=true) {
      console.log("change");
      this.changePass = true;
    }
  }
  activityLog(){
    console.log(this.userId)
    this.reqActivity['filter']['referenceId']=this.userId
    let req = {
      path: "auth/activityLog/getAll",
      data: this.reqActivity,
      isAuth: true,
    };
    this.apiService.post(req).subscribe(response => {
      console.log(response)
      this.storeActivityLog=response['data']
      console.log(this.storeActivityLog)
      this.totalPages1 = pagination.arrayTwo(
        this.storeActivityLog["totalPages"],
        this.reqActivity.page.page
      );
    })
  
  }
  pagination2(type, data, current = null) {
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
}
