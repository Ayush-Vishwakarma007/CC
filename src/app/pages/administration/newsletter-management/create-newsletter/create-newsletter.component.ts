import { AfterViewInit, Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SpinnerService } from "../../../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../../services/api.service";
import { ToastrService } from "ngx-toastr";
import grapesjs from "grapesjs";
import { MatRadioModule } from "@angular/material/radio";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { pagination } from "../../../../pagination";
import { SidebarLayoutToggleService } from "../../../../services/sidebar-layout-toggle.service";
import Swal from "sweetalert2";
import { unwatchFile } from "fs";
import { DatePipe } from "@angular/common";
import { BsCurrentDateViewComponent } from "ngx-bootstrap/datepicker/themes/bs/bs-current-date-view.component";
// import { template } from "@angular/core/src/render3";
import { response } from "express";
import { PipesModule } from "../../../../pipes/pipes.module";
import { EventImagesPipe } from "../../../../pipes/event-images.pipe";
import { transition } from "@angular/animations";
@Component({
  selector: "app-create-newsletter",
  templateUrl: "./create-newsletter.component.html",
  styleUrls: ["./create-newsletter.component.scss"],
  providers:[EventImagesPipe],
})
export class CreateNewsletterComponent implements OnInit, AfterViewInit {
  step: any = [
    {
      stepNo: 1,
      name: "Basic Information",
      step: "BASIC_INFO",
      class: "icon-file",
    },
    {
      stepNo: 2,
      name: "Newsletter Editor",
      step: "EDITOR",
      class: "icon-wallet numbericon",
    },
    {
      stepNo: 2,
      name: "User Selection",
      step: "USER_SELECTION",
      class: "icon-members numbericon",
    },
    {
      stepNo: 3,
      name: "User Confirmation",
      step: "USER_CONFIRMATION",
      class: "fas fa-check-square",
    },
  ];
  currentstep: any;
  totalselectmember: any;
  flag = 0;
  editorType: any = "advance";
  showUser: boolean = false;
  showUser1: boolean = false;
  checked: boolean = false;
  public show: boolean;
  modalRef: BsModalRef;
  chapterList: any = [];
  chapterDetail: any = [];
  editorConfig = {
    editable: true,
    spellcheck: true,
    height: "auto",
    minHeight: "650px",
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
      ["link", "image"],
    ],
  };
  editorConfig1 = {
    editable: true,
    spellcheck: true,
    minHeight: "200px",
    height: "200px",
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
  editorContent = "";
  editorContent1 = "";
  isEdit: boolean = false;
  paymentDetail: any = [];
  configList: any = [];
  newsletterId = "";
  chapterIds = [];
  submitBtn = true;
  newsletterForm: FormGroup;
  newsletterDetail: any = [];
  editor: any;
  startDate = new Date();
  blockManager: any;
  uploadedFiles: any = [];
  userReqData: any = [];
  selectmemberList: any = [];
  selectmember: any = [];
  memberReqData: any = [];
  memberList: any = [];
  totalPages: any = [];
  search = "";
  totalMember: any = [];
  selectedAll: boolean = false;
  checkUncheckUser: any = [];
  copyNewsletter: boolean = false;
  selectAllChapter: boolean = false;
  showModal: boolean = false;
  activeTabName: any;
  submitBasic: boolean = false;
  myselectchapter = [];
  totalPages1: any = [];
  myDate = new Date();
  now: any;
  detailNewsletter: any = [];
  searchSelect: any = [];
  datacheck: boolean;
  isShown: boolean;
  storecheckuser: any = [];
  store: any = [];
  store1: any;
  isshown1: boolean;
  searchMemberList: any = []

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public spinner: SpinnerService,
    public sidebarService: SidebarLayoutToggleService,
    public router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private pipe:EventImagesPipe,
  ) {
    //this.pipe = new EventImagesPipe()
    this.newsletterForm = this.formBuilder.group({
      chapterIds: ["", Validators.required],
      name: ["", Validators.required],
      template: ["", Validators.required],
      editorType: [""],
      description: [""],
      dateTime: ["", Validators.required],
      quickJobExecution: [""],
    });
    var datePipe = new DatePipe("en-US");
    this.now = datePipe.transform(this.myDate, "dd/MM/yyyy h:mm a");
    this.route.params.subscribe((params) => (this.newsletterId = params["id"]));
    this.route.url.subscribe((url) => {
      let path = url[0].path;
      if (path == "copy-newsletter") {
        this.copyNewsletter = true;
      }
    });
    this.memberReqData = {
      filter: {
        userIds: this.selectmember,
      },
      page: {
        limit: 5,
        page: 0,
      },
      sort: {
        orderBy: "ASC",
        sortBy: "FIRST_NAME",
      },
    };
    this.userReqData = {
      filter: {
        subscribeNewsLetter: true,
        approved: true,
        search: "",
      },
      page: {
        limit: 5,
        page: 0,
      },
      sort: {
        orderBy: "ASC",
        sortBy: "FIRST_NAME",
      },
    };
    this.checkUncheckUser["userIds"] = [];
    this.checkUncheckUser["userIdsNotIn"] = [];
  }

  async ngOnInit() {
    // this.show1(this.editorType)
    this.sidebarService.setMenu(true);
    this.getChapterList();
    this.getConfigList();
    this.activeTabName = this.step[0]["step"];
    if (this.newsletterId != undefined) {
      await this.getNewsletterDetail();
    }
  }

  ngAfterViewInit() {
    if (this.newsletterId == undefined) {
      this.setUpNewsLetter();
    }
  }

  getChapterList() {
    let request = {
      path: "community/chapters/access",
      isAuth: true,
    };
    this.apiService.get(request).subscribe((response) => {
      this.chapterList = response["data"];
      if (this.chapterList[0]) {
        this.myselectchapter = this.chapterList["0"]["id"];
      }
      if (this.chapterList.length == 1) {
        this.newsletterForm.patchValue({
          chapterIds: [this.myselectchapter],
        });
      }
    });
  }

  getConfigList() {
    let request = {
      path: "community/configuration/publicInfo",
      isAuth: true,
    };
    this.apiService.get(request).subscribe((response) => {
      this.configList = response["data"];
    });
  }
  /*public onchecked(){

    if(this.checked==true)
    {
      this.newsletterDetail.quickJobExecution= this.now;
      console.log("loo",this.newsletterDetail.quickJobExecution)
      this.newsletterDetail.dateTime= this.newsletterDetail.quickJobExecution
      this.newsletterDetail.quickJobExecution=this.newsletterDetail.dateTime
      console.log("lol",this.newsletterDetail.dateTime)
    }

}*/

  getNewsletterDetail() {
    let data = {
      path: "notification/newsLetter/details/" + this.newsletterId,
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.get(data).subscribe((response) => {
        if (response["status"]["code"] == "OK") {
          this.newsletterDetail = response["data"];
          if (this.newsletterDetail.editorType == "advance") {
            this.editorContent = this.newsletterDetail.template;
          } else {
            this.editorContent1 = this.newsletterDetail.template;
          }
          let date;
          if (this.newsletterDetail.publish != true) {
            date = this.newsletterDetail.dateTime;
          } else {
            date = new Date();
          }
          this.editorType = this.newsletterDetail.editorType;
          this.newsletterForm.patchValue({
            chapterIds: this.newsletterDetail.chapterIds,
            name: this.newsletterDetail.name,
            template: this.newsletterDetail.template,
            editorType: this.newsletterDetail.editorType,
            description: this.newsletterDetail.description,
            dateTime: date,
            quickJobExecution: this.newsletterDetail.quickJobExecution,
          });
          this.show1(this.newsletterDetail.editorType);
          let dateTime = this.newsletterDetail.dateTime.replace(
            /([+\-]\d\d)(\d\d)$/,
            "$1:$2"
          );
          let startDateTime = new Date(dateTime);
          if (startDateTime < this.startDate) {
            this.startDate = new Date(this.newsletterDetail.dateTime);
          }
          if (this.newsletterDetail["userIdsNotIn"] != null) {
            this.checkUncheckUser["userIdsNotIn"] =
              this.newsletterDetail["userIdsNotIn"];
          }
          if (this.newsletterDetail["userIds"] != null) {
            this.checkUncheckUser["userIds"] = this.newsletterDetail["userIds"];
          }

          this.isEdit = true;

          this.selectedAll = this.newsletterDetail["sendToAll"];
          if (this.copyNewsletter == true) {
            this.selectedAll = false;
            this.checkUncheckUser["userIds"] = [];
            this.checkUncheckUser["userIdsNotIn"] = [];
          }
          this.setUpNewsLetter();
          // this.userData();
        }
        resolve(null);
      });
    });
  }

  submit(publish = false) {
    this.spinner.show();

    this.newsletterForm.patchValue({
      editorType: this.editorType,
    });
    this.editorType = this.newsletterForm.value.editorType;
    this.editorContent = this.editor.runCommand("gjs-get-inlined-html");

    if (this.newsletterForm.value.editorType == "advance") {
      this.newsletterForm.patchValue({
        template: this.editorContent,
      });
    } else {
      this.newsletterForm.patchValue({
        template: this.editorContent1,
      });
    }

    if (
      (this.newsletterForm.value.chapterIds != "" &&
        this.newsletterForm.value.name != "" &&
        this.newsletterForm.value.quickJobExecution != "") ||
      this.newsletterForm.value.dateTime != ""
    ) {
      if (this.newsletterForm.value.dateTime == "") {
        let currentDate = new Date();
        this.newsletterForm.value.dateTime = currentDate;
      }
      this.submitBtn = true;
      let formData = this.newsletterForm.value;
      let data = {};
      formData["publish"] = publish == true;
      formData["userIdsNotIn"] = this.checkUncheckUser["userIdsNotIn"];

      if (this.checkUncheckUser["userIds"].length != 0) {
        formData["userIds"] = this.checkUncheckUser["userIds"];
        this.searchSelect = this.checkUncheckUser["userIds"];
      } else {
        formData["userIds"] = [];
      }
      if (this.search == "") {
        formData["sendToAll"] = this.selectedAll;
      } else {
        formData["sendToAll"] = false;
      }

      if (this.newsletterId != "" && this.newsletterId != undefined) {
        if (this.copyNewsletter == true) {
          data = {
            path: "notification/newsLetter/",
            data: formData,
            isAuth: true,
          };
        } else {
          data = {
            path: "notification/newsLetter/" + this.newsletterId,
            data: formData,
            isAuth: true,
          };
        }
      } else {
        data = {
          path: "notification/newsLetter",
          data: formData,
          isAuth: true,
        };
      }
      this.apiService.post(data).subscribe((response) => {
        this.detailNewsletter = response;

        if (
          response["status"]["code"] == "CREATED" ||
          response["status"]["code"] == "OK"
        ) {
          this.toastrService.success(response["status"]["description"]);
          if (this.newsletterId == undefined || this.copyNewsletter == true) {
            this.newsletterForm.reset();
          }
          this.router.navigate(["/management/newsletter-management"]);

          this.spinner.hide();
        } else {
          this.toastrService.error(response["status"]["description"]);
          this.submitBtn = false;
          this.spinner.hide();
        }
      });
    } else {
      this.toastrService.error("Please fill all required fields!!");
      this.submitBtn = false;
      this.spinner.hide();
    }
  }

  setUpNewsLetter(status = false) {
    this.editor = grapesjs.init({
      container: "#gjs",
      height: "90vh",
      storageManager: { type: "none" },
      plugins: ["gjs-blocks-basic", "gjs-preset-newsletter"],
      assetManager: {
        assets: [],
        uploadFile: (e) => {
          let files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
          let form = new FormData();
          form.append("file", files[0]);
          let postData = {
            path: "event/file/upload/file",
            data: form,
            isAuth: true,
          };
          this.spinner.show();
          this.apiService.postImage(postData).subscribe((res) => {
            if (res["data"] == null) {
              this.toastrService.error(res["status"]["description"]);
            } else {
              this.editor.AssetManager.add(this.pipe.transform( res["data"]["imageUrl"]));
            }
            this.spinner.hide();
          });
        },
      },
    });
    if (status == false) {
      if (this.newsletterId == undefined) {
        this.editor.addComponents(
          `<div style="width: 90%;height: 100%;margin: 0 auto 10px auto;padding: 5px 5px 5px 5px;"></div>`
        );
      } else {
        this.editor.addComponents(this.editorContent);
      }
    }

    this.blockManager = this.editor.BlockManager;
    this.blocksManager();
  }

  blocksManager() {
    //this.dynamicBlockData();
  }

  dynamicBlockData() {
    let data = {
      category: "Custom",
      label: `<div> <div class="my-label-block">Label block</div> </div>`,
      content: `<div class="c996 c2671 c4443 c3585">
                <table width="100%" height="150">
                  <tbody>
                    <tr>
                      <td valign="top" bgcolor="#ffffff" align="center">
                        <img src="https://communityconnectmedia.s3.amazonaws.com/20200626054127_5ecf547e11e3fb1e504871ca_logo-login.png" width="292.6666259765625" height="117"/>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table width="100%" height="150">
                  <tbody>
                    <tr>
                      <td valign="top">
                      </td>
                    </tr>
                  </tbody>
                </table>
                </div>`,
    };
    this.blockManager.add("custom-component", data);
    for (let i = 0; i <= 3; i++) {
      //this.blockManager.add('custom-component'+i, data);
    }
  }

  userData(search = "") {
    // this.activeTabName = this.step[2]["step"];
    if (this.search == "") {
      this.selectmember = [];
    }



    if (
      this.newsletterForm.value.chapterIds != "" &&
      this.newsletterForm.value.chapterIds != null
    ) {
      this.showModal = true;
      this.userReqData["filter"]["search"] = this.search;
      this.userReqData["filter"]["checkInvalidEmail"] = true;
      this.userReqData["filter"]["chapterIds"] =
        this.newsletterForm.value.chapterIds;

      let req = {
        path: "auth/user/getUsers",
        data: this.userReqData,
        isAuth: true,
      };
      this.spinner.show();
      this.apiService.post(req).subscribe((response) => {
        this.memberList = response["data"];

        let member_length = this.memberList["content"].length;
        let page_no = this.userReqData.page.page;
        if (member_length == 0) {
          if (page_no != 0) {
            this.userReqData.page.page = page_no - 1;
            this.userData();
          }
        }
        this.totalPages = pagination.arrayTwo(
          this.memberList["totalPages"],
          this.userReqData.page.page
        );
        this.memberList["content"].forEach((item, index) => {
          item["sub"] = false;
          item["submembers"] = [];
          item["profileShow"] = false;
          //this.subMembers(item.id, index);
          if (this.selectedAll == true) {
            item["checked"] = true;
          }
          //this.checkUncheckUser["userIds"]=[]
          this.checkUncheckUser["userIds"].forEach((user) => {
            if (user == item["id"]) {
              item["checked"] = true;
            }
          });
          this.checkUncheckUser["userIdsNotIn"].forEach((user) => {
            if (user == item["id"]) {
              item["checked"] = false;
            }
          });

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
        window.scrollTo(0, 0);
        this.totalMember = response["data"]["totalElements"];
        this.spinner.hide();
        this.showUser = true;
      });
    } else {
      this.toastrService.error("Please select chapter first");
      this.showModal = false;
    }
  }

  pagination(type, data, current = null) {
    if (data == "user") {
      if (type == "prev") {
        this.userReqData.page.page = this.userReqData.page.page - 1;
      } else if (type == "current") {
        this.userReqData.page.page = current;
      } else {
        this.userReqData.page.page = this.userReqData.page.page + 1;
      }
      window.scroll(0, 0);
      this.userData();
    }
  }

  sendNow() {
    let count = 0;
    if (this.selectedAll == true) {
      count =
        this.memberList["totalElements"] -
        this.checkUncheckUser["userIdsNotIn"].length;

      //this.checkUncheckUser["userIdsNotIn"].length;
    }
    if (this.selectedAll == false) {
      count = this.checkUncheckUser["userIds"].length;
    }
    if (count == 0) {
      this.toastrService.error("Please select any one user");
      return false;
    } else {
      let message = "";
      Swal.fire({
        title: "Are you sure?",
        text: "Are you sure to send the newsletter to the user?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, send it!",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          this.submit(true);
          $("#closeModel").click();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Newsletter has not been send.", "error");
        }
      });
    }
    // if (count == 0) {
    //   this.toastrService.error('Please select any one users');
    //   return false;
    // } else {
    //   this.submit(true);
    //   $('#closeModel').click();
    // }
  }

  selectedUser() {
    this.checkUncheckUser["userIds"] = [];
    this.checkUncheckUser["userIdsNotIn"] = [];

    this.memberList["content"].forEach((item, index) => {
      if (this.selectedAll == true && this.search == "") {


        item["checked"] = true;
        this.isShown = false;
        this.datacheck = false;
        this.selectmember = this.checkUncheckUser["userIds"];
      } else if (this.selectedAll == false) {

        item["checked"] = false;

        this.selectmember = [];
      }
      if (
        this.datacheck == true &&
        this.selectedAll == true &&
        this.search != ""
      ) {

        this.isShown = true;
        // this.checkUncheckUser["userIds"] = [];
        let array = [];
        array = this.storecheckuser.concat(this.store1);
        var set = new Set(array);
        array = Array.from(set);

        this.checkUncheckUser["userIds"] = array;



        this.selectmember = this.checkUncheckUser["userIds"];

      } else if (
        this.datacheck == false &&
        this.selectedAll == false &&
        this.search == ""
      ) {
        this.checkUncheckUser["userIds"] = [];


      }
      //this.selectmember = this.checkUncheckUser["userIds"];



    });
    if (this.selectedAll == true && this.search != "") {
      this.store1 = []
      //this.checkUncheckUser["userIds"] = [];

      this.isShown = true;
      this.isshown1 = true;
      this.userReqData["page"]["limit"] = this.memberList['totalElements']
      let req = {
        path: "auth/user/getUsers",
        data: this.userReqData,
        isAuth: true,
      };
      this.apiService.post(req).subscribe((response) => {

        this.searchMemberList = response["data"];
        this.memberList = this.searchMemberList


        this.memberList["content"].forEach((item1, index) => {

          if (this.selectedAll == true && this.search != "")
            item1["checked"] = true;

          this.checkUncheckUser["userIds"].push(item1["id"]);

          const result = Array.from(this.checkUncheckUser.reduce((m, t) => m.set(t.id, t), new Map()).values());
          this.storecheckuser = result;


          this.selectmember = this.checkUncheckUser["userIds"];
        })
      })

    }
    else {

      this.checkUncheckUser["userIds"] = []
      this.checkUncheckUser["userIdsNotIn"] = [this.memberList['totalElements']]

      if (this.search == '' && this.selectedAll == false) {
        this.selectmember = []


      }
    }

    //this.selectmember = this.checkUncheckUser["userIds"];



  }

  getCheckUncheckUser(data) {
    this.checkUncheckUser["userIds"] = this.checkUncheckUser["userIds"].filter(
      (item) => item !== data["id"]
    );
    this.checkUncheckUser["userIdsNotIn"] = this.checkUncheckUser[
      "userIdsNotIn"
    ].filter((item) => item !== data["id"]);
    //this.datacheck=data["checked"]
    if (data["checked"] == true) {
      this.datacheck = data["checked"];
      this.checkUncheckUser["userIds"].push(data["id"]);

      this.selectmember = this.checkUncheckUser["userIds"];
      this.store1 = this.selectmember;

    } else {
      this.datacheck = false;
      this.checkUncheckUser["userIdsNotIn"].push(data["id"]);
      this.selectmember = this.checkUncheckUser["userIds"];

    }
  }

  completeStep() {
    this.editorContent = this.editor.runCommand("gjs-get-inlined-html");
    $("#closeModald").click();
  }

  resetNewsletter() {
    this.setUpNewsLetter(true);
    if (this.editorContent == "") {
      this.editor.addComponents(
        `<div style="width: 90%;height: 100%;margin: 0 auto 10px auto;padding: 5px 5px 5px 5px;"></div>`
      );
    } else {
      this.editor.addComponents(this.editorContent);
    }
    this.blockManager = this.editor.BlockManager;
  }

  selectAllChange(event) {
    if (event.checked) {
      this.selectAllChapter = true;
      let array = [];
      this.chapterList.forEach((item, index) => {
        array.push(item.id);
      });
      this.newsletterForm.patchValue({
        chapterIds: array,
      });
    } else {
      this.selectAllChapter = false;
      this.newsletterForm.patchValue({
        chapterIds: null,
      });
    }
  }

  changeChapterSelection(list) {
    if (list.length == this.chapterList.length) {
      this.selectAllChapter = true;
    } else {
      this.selectAllChapter = false;
    }
  }
  nextBackActiveTab(currentTabName, type) {
    let step = 0;
    if (
      this.newsletterForm.value.chapterIds == "" ||
      this.newsletterForm.value.name == "" ||
      this.newsletterForm.value.dateTime == "" ||
      this.newsletterForm.value.quickJobExecution == "" ||
      this.newsletterForm.value.description == ""
    ) {
      if (type == "back") {
        step = step - 1;
        if (
          this.newsletterForm.value.chapterIds == "" ||
          this.newsletterForm.value.name == ""
        ) {
          this.router.navigate(["/management/newsletter-management"]);
        }
      }

      if (
        this.newsletterForm.value.chapterIds == "" ||
        this.newsletterForm.value.name == ""
      ) {
        if (type == "next") {
          this.toastrService.error("Please fill all required fields!!");
        }
      }
    }

    if (
      this.newsletterForm.value.chapterIds != "" &&
      this.newsletterForm.value.name != ""
    ) {
      if (
        this.newsletterForm.value.dateTime != "" ||
        this.newsletterForm.value.quickJobExecution != ""
      ) {
        if (this.showUser == true) {
          this.showUser = false;
        }

        /* if (currentTabName!='USER_SELECTION') {
          console.log(this.showUser)
          this.showUser=false
         if(this.showUser==true){

          this.showUser = false;
          console.log("aaaa",this.showUser)
          return false;
          console.log("come")
         }
        }
       else
       {
         console.log(this.showUser)
         if(currentTabName=='USER_SELECTION')
         {
           this.showUser=true
           if(this.showUser==false)
           {

             this.showUser=true
             console.log(this.showUser)
             //this.userData()
            return true

           }

         }
         if(currentTabName=='USER_CONFIRMATION')
         {
          this.showUser=true
         }

       }*/

        setTimeout(() => {
          this.step.filter(function (entry, index) {
            if (entry.step == currentTabName) {
              step = index;
            }
          });
          if (type == "next") {
            step = step + 1;
          }

          if (type == "back") {
            step = step - 1;
          }

          if (step == -1) {
            this.router.navigate(["/management/newsletter-management"]);
          }
          if (this.submitBasic == true) {
            this.toastrService.error("Save the Basic Information!");
          } else {
            this.step.forEach((item, index) => {
              if (this.activeTabName == item["step"]) {
                this.step[index]["active"] = true;
              }
            });

            if (step >= 0 && step < this.step.length) {
              let tab;
              tab = this.step[step]["step"];
              this.activeTabName = tab;
            }
          }
          if (this.activeTabName == "USER_SELECTION") {
            this.userData();
          }
          if (this.activeTabName == "USER_CONFIRMATION") {
            this.save();
          }

          window.scrollTo(0, 0);
        }, 1000);
      }

      if (
        this.newsletterForm.value.dateTime == "" &&
        this.newsletterForm.value.quickJobExecution == ""
      ) {
        this.toastrService.error("Please select any one Date or send now!");
      }
    }
    //if (
    // ) {
    // this.toastrService.error("Please fill all required fields!");
    // }
  }

  show1(type) {
    this.show = !this.show;
    this.editorType = type;
    /* if(this.isEdit == true){
    this.editorType=this.newsletterForm.value.editorType
    console.log("hello", this.editorType)
    this.checked=true
  }*/

    if (this.show == true) {
      if (type == "simple") {
        this.newsletterForm.patchValue({
          editorType: type,
        });
        this.editorType = this.newsletterForm.value.editorType;
      }
      this.show = true;
    } else {
      if (type == "advance") {
        this.newsletterForm.patchValue({
          editorType: type,
        });
        this.editorType = this.newsletterForm.value.editorType;
        //this.show=false
      }
    }
  }
  openModalWithClassAdd(templatepreview: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      templatepreview,
      Object.assign({}, { class: "gray modal-lg edit-news" })
    );
    this.save();
  }
  save() {
    if (this.editorType == "advance") {
      this.editorContent = this.editor.runCommand("gjs-get-inlined-html");
    }
  }
  openModalWithClassSelect(selectmember: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      selectmember,
      Object.assign({}, { class: "gray modal-lg edit-news" })
    );
    this.selectedMember();
  }
  message: any;
  closeModel() {
    this.memberReqData["page"]["page"] = 0;
    this.modalRef.hide();
  }
  selectedMember() {
    let req = {
      path: "auth/user/getUsers",
      data: this.memberReqData,
      isAuth: true,
    };
    if (this.selectmember.length == 0 && this.selectedAll == false) {
      this.memberReqData["filter"]["userIds"] = this.selectmember;
      this.selectmemberList = [];
      this.totalPages1 = [];

      this.message = "Member is not selected";
    } else {
      this.memberReqData["filter"]["userIds"] = this.selectmember;

      this.apiService.post(req).subscribe((response) => {
        this.selectmemberList = response["data"];

        this.selectmemberList["content"].forEach((item, index) => {
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

        this.totalPages1 = pagination.arrayTwo(
          this.selectmemberList["totalPages"],
          this.memberReqData.page.page
        );
      });
    }
  }
  pagination1(type, data, current = null) {
    if (data == "user") {
      if (type == "prev") {
        this.memberReqData.page.page = this.memberReqData.page.page - 1;
      } else if (type == "current") {
        this.memberReqData.page.page = current;
      } else {
        this.memberReqData.page.page = this.memberReqData.page.page + 1;
      }
      window.scroll(0, 0);
      this.selectedMember();
    }
  }
}
