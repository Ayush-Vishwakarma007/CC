import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../../../services/api.service";
import { SpinnerService } from "../../../../../services/spinner.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import Swal from "sweetalert2";
import { pagination } from "src/app/pagination";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import {CommunityDetailsService} from "../../../../../services/community-details.service";

@Component({
  selector: "app-participant-vendor-detail",
  templateUrl: "./participant-vendor-detail.component.html",
  styleUrls: ["./participant-vendor-detail.component.scss"],
})
export class ParticipantVendorDetailComponent implements OnInit {
  modalRef: BsModalRef;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Input()
  eventId = "";

  @Input()
  eventDetail: any = [];

  @Input()
  currentTab = "";

  submitBtn: boolean = true;
  notificationForm: FormGroup;
  userNotificationId = "";
  listType = "table";
  reqData: any = [];
  regestredReqData: any = [];
  search = "";
  searchString = "";
  userList: any = [];
  totalUser = 0;
  totalPages: any;
  selfCreated: boolean = false;
  familyMemberData:any=[]
  totalFamilyMem:any
  mainMemFirstName:any
  mainMemLastName:any
  additionalDetail:any=[];
  lengthfieldValue:any
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
      // ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
      // ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
      ["link"],
    ],
  };
  constructor(
    public communityService:CommunityDetailsService,
    private modalService: BsModalService,
    public Http: HttpClient,
    private formBuilder: FormBuilder,
    public apiService: ApiService,
    public spinner: SpinnerService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    public router: Router,
    public _location: Location
  ) {
    this.notificationForm = this.formBuilder.group({
      message: ["", Validators.required],
      subject: ["", Validators.required],
      notificationAudiences: [""],
    });
    this.regestredReqData = {
      filter: {
       eventId:this.eventId,
        roles: ["USER"],
        search: "",
      },
      page: {
        pageLimit: 8,
        pageNumber: 0,
      },
      sort: {
        orderBy: "ASC",
        sortBy: "FIRST_NAME",
      },
    };
  }

  ngOnInit() {
    console.log(this.eventDetail)
    this.saveSubscription = this.save.subscribe(() => {
      this.search = "";
      this.memberData(this.searchString);
      this.regestredReqData["page"] = {
        pageLimit: 8,
        pageNumber: 0,
      };
    });
  }

  memberData(search = "") {
    if (this.currentTab == "participant") {
      this.searchString = search;
      this.regestredReqData["filter"]["eventId"] = this.eventId;
     // delete this.regestredReqData["filter"]["registrationId"];
      //this.regestredReqData["filter"]["responsiblePerson"] = true;
      this.regestredReqData["filter"]["search"] = search;
      this.regestredReqData["filter"]["roles"] = ["USER"];
      this.regestredReqData["roles"] = ["USER"];
    } else {
      this.searchString = search;
      delete this.regestredReqData["filter"]["registrationId"];
      this.regestredReqData["filter"]["responsiblePerson"] = true;
      this.regestredReqData["filter"]["search"] = search;
      this.regestredReqData["filter"]["roles"] = ["VENDOR"];
      this.regestredReqData["roles"] = ["VENDOR"];
    }

    let req = {
      path: "event/memberList",
      data: this.regestredReqData,
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.post(req).subscribe((response) => {

        this.userList = response["data"];

        let member_length = this.userList["content"].length;
        let page_no = this.regestredReqData.page.pageNumber;
        if (member_length == 0) {
          if (page_no != 0) {
            this.regestredReqData.page.pageNumber = page_no - 1;
            this.memberData(this.searchString);
          }
        }
        this.totalPages = pagination.arrayTwo(
          this.userList["totalPages"],
          this.regestredReqData.page.pageNumber
        );
        this.userList["content"].forEach((item, index) => {
        //this.lengthfieldValue= Object.keys(item.fieldValues)
          if (item.profilePictureUrl == null || item.profilePictureUrl == "") {
            item["profileShow"] = false;
            item["profileUrl"] = "";
            if (item.firstName) {
              item["profileUrl"] += item.firstName[0];
            }
            if (item.lastName) {
              item["profileUrl"] += "" + item.lastName[0];
            }
          } else {
            item["profileShow"] = true;
            item["profileUrl"] = item.profilePictureUrl;
          }
        });
        this.totalUser = response["data"]["totalElements"];
        this.spinner.hide();

    });
  }
  getCurrentDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //because January is 0!
    let yyyy = today.getFullYear();

    let date = "";
    let mon = "";

    if (dd < 10) {
      date = "0" + dd;
    }
    if (mm < 10) {
      mon = "0" + mm;
    }
    return date + mon + yyyy;
  }
  exportMember() {
    let req = {
      path: "event/getRegistrationExcel/" + this.eventId,
      data: this.regestredReqData,
      isAuth: true,
    };
    let filename = "";
    let currentDate = this.getCurrentDate();
    if (this.currentTab == "participant") {
      filename = "Participants_" + currentDate + "_" + this.eventDetail.name;
    } else {
      filename = "Vendors_" + currentDate + "_" + this.eventDetail.name;
    }
    this.apiService.ExportReqBody(req, filename);
  }

  pagination(type, data, current = null) {
    if (data == "user") {
      if (type == "prev") {
        this.regestredReqData.page.pageNumber =
          this.regestredReqData.page.pageNumber - 1;
      } else if (type == "current") {
        this.regestredReqData.page.pageNumber = current;
      } else {
        this.regestredReqData.page.pageNumber =
          this.regestredReqData.page.pageNumber + 1;
      }
      this.memberData(this.searchString);
    } //console.log(this.regestredReqData.page);
  }

  arrayTwo(n: number) {
    return Array(n)
      .fill(0)
      .map((x, i) => i);
  }
  changeList(type) {
    this.listType = type;
    this.memberData(this.searchString);
  }
  sort(type) {
    if (type == "name") {
      this.regestredReqData["sort"]["sortBy"] = "FIRST_NAME";
    } else if (type == "address") {
      this.regestredReqData["sort"]["sortBy"] = "FIRST_NAME";
    } else if (type == "email") {
      this.regestredReqData["sort"]["sortBy"] = "EMAIL";
    }else if (type == "address") {
      this.regestredReqData["sort"]["sortBy"] = "ADDRESS";
    } else if (type == "phone") {
      this.regestredReqData["sort"]["sortBy"] = "PHONE";
    }else if (type == "registerDate") {
      this.regestredReqData["sort"]["sortBy"] = "REGISTRATION_DATE";
    }else if (type == "paymentType") {
      this.regestredReqData["sort"]["sortBy"] = "PAYMENT_TYPE";
    }else if (type == "payment") {
      this.regestredReqData["sort"]["sortBy"] = "PAYMENT";
    }else if (type == "checkInstatus") {
      this.regestredReqData["sort"]["sortBy"] = "CHECK_IN_STATUS";
    }
    else if (type == "totalPayment") {
      this.regestredReqData["sort"]["sortBy"] = "TOTAL_PAYMENT";
    }
    if (this.regestredReqData["sort"]["orderBy"] == "ASC") {
      this.regestredReqData["sort"]["orderBy"] = "DESC";
    } else if (this.regestredReqData["sort"]["orderBy"] == "DESC") {
      this.regestredReqData["sort"]["orderBy"] = "ASC";
    }
    this.memberData(this.searchString);
  }
  deleteUser(id) {
    let message = "";
    if (this.currentTab == "participant") {
      message = "Participant";
    } else {
      message = "Vendor";
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this Participant!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "event/event/registration/" + id,
          isAuth: true,
        };
        this.apiService.get(request).subscribe(
          (response) => {
            if (response["status"]["code"] == "OK") {
              Swal.fire("Deleted!", message + " has been deleted.", "success");
              this.regestredReqData.page.pageNumber = 0;
              this.memberData(this.searchString);
            } else {
              Swal.fire(
                "Cancelled",
                response["status"]["description"],
                "error"
              );
            }
          },
          (error) => {
            Swal.fire("Cancelled", message + " has been safe.", "error");
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", message + " has been safe.", "error");
      }
    });
  }
  userNoti(id) {
    //console.log(id);
    this.userNotificationId = id;
    this.notificationForm.reset();
  }

  submitNotification() {
    //console.log(this.userNotificationId);
    if (this.notificationForm.valid) {
      this.submitBtn = true;
      let data = {};
      let formData = this.notificationForm.value;
      delete formData.notificationAudiences;
      formData["onlyMainUsers"] = true;
      data = {
        path: "event/sendEmail/" + this.eventId + "/" + this.userNotificationId,
        data: formData,
        isAuth: true,
      };
      this.apiService.post(data).subscribe((response) => {
        if (
          response["status"]["code"] == "CREATED" ||
          response["status"]["code"] == "OK"
        ) {
          this.toastrService.success(response["status"]["description"]);
          this.userNotificationId = "";
          $("#deleteNoti").click();
          this.modalRef.hide();
        } else {
          this.toastrService.error(response["status"]["description"]);
          this.submitBtn = false;
        }
      });
    } else {
      this.submitBtn = false;
    }
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "modal-lg infomainpopup" })
    );
  }
  openModalFamilyMember(template: TemplateRef<any>,member,mainmemfirstname,mainMemlastname,index) {
    console.log(member)
    member.forEach((element,i) => {
      console.log(index,i)

        console.log(element.firstName,element.lastName)
      if((element.profilePictureUrl==''|| element.profilePictureUrl==null) && element.firstName!=null && element.lastName!=null )
      {
        console.log("Ddfgdf")
        member[i]['memberProfile']=element.firstName[0]+element.lastName[0]
      }
      else{
        member[i]['memberProfile']=element.profilePictureUrl
      }
      
    });
   this.familyMemberData=member
   this.totalFamilyMem=member.length
   this.mainMemFirstName=mainmemfirstname
   this.mainMemLastName=mainMemlastname
   console.log(this.totalFamilyMem)
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "modal-dialog modal-lg performance-newsletter wid-user" })
    );
    console.log(this.familyMemberData)
  }
  openModalAdditionalInformation(template: TemplateRef<any>,userId) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "modal-dialog modal-lg performance-newsletter wid-user" })
    );
    this.getAdditinalInfoDetails(userId)
  }
  getAdditinalInfoDetails(userId){
    let data = {
      path: "event/userRegistration/form/" + this.eventId + "?id=" + userId,
      isAuth: true,
    };
    this.apiService.get(data).subscribe((response) => {
      this.additionalDetail = response['data'];
    })

  }
  sendEmail(userId){
    console.log(userId);
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to send email",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, send it!",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "event/sendRegistrationEmail/"+this.eventId+"/"+userId,
          isAuth: true,
        };
        this.apiService.get(request).subscribe(
          (response) => {
            if (response["status"]["code"] == "OK") {
              Swal.fire("Email send successfully", "success");
            } else {
              Swal.fire(
                "Cancelled",
                response["status"]["description"],
                "error"
              );
            }
          },
          (error) => {
            Swal.fire("Cancelled",  "Email not send.", "error");
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled",  "Email not send.", "error");
      }
    });
  }
}
