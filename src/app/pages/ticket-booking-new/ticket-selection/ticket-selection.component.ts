import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { event } from "jquery";
import { ApiService } from "../../../services/api.service";
import { pagination } from "../../../pagination";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
// import { fadeInItems } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { Subject, Subscription } from "rxjs";
// import { store } from "@angular/core/src/render3";
// import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { deLocale } from "ngx-bootstrap";
import { configuration } from "../../../configration";
import { skip } from "rxjs/operators";

import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { CommunitySettingsModule } from "../../administration/community-settings/community-settings.module";

@Component({
  selector: "app-ticket-selection",
  templateUrl: "./ticket-selection.component.html",
  styleUrls: ["./ticket-selection.component.scss"],
})
export class TicketSelectionComponent implements OnInit {
  @Input() eventId: string;
  @Input() registrationType: any
  @Input() response: string;
  @Input() guestShow: boolean;
  @Input() authDetail: any = [];
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() completenext: EventEmitter<any> = new EventEmitter();
  @Output() category: EventEmitter<any> = new EventEmitter();
  @Output() ticketfield: EventEmitter<any> = new EventEmitter();
  @Output() ageRulechange: EventEmitter<any> = new EventEmitter();
  @Output() valchange: EventEmitter<any> = new EventEmitter();
  @Output() reqDataval: EventEmitter<any> = new EventEmitter();
  @Output() registerArraychange: EventEmitter<any> = new EventEmitter();
  @Output() userDetailreqchange: EventEmitter<any> = new EventEmitter();
  @Output() eventRuleIdchange: EventEmitter<any> = new EventEmitter();
  _register: any;
  @Input()
  get register() {
    return this._register;
  }

  set register(value) {
    this._register = value;
    this.registerArraychange.emit(value);
  }

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  eventcategory: any;
  agegroup: any = [];
  modalRef: BsModalRef;
  numberticket: any;
  ticketname: any = [];
  optionList: any = [];
  search = "";
  reqNewData: any = [];
  memberList: any = [];
  totalPages: any = [];
  totalMember: any = [];
  reqData: any = [];
  content = [];
  selectedItemsList: any = [];
  checkedIDs = [];
  other = [];
  isChecked: boolean;
  store: any = [];
  ticketCategory: any = [];
  tempArr = [];
  age = 21;
  ticketDetail: any = [];
  eventRuleId: string;
  ticket: any = [];
  currentAddMemberIndex = 0;
  registerInfo: any = [];
  ticketvalue: Subject<string> = new Subject();
  userDetailsRequired: any;
  checkEmailPattern: any;
  rule: any;
  flag: boolean = false;
  guestDetail: any = [];
  value:any
  constructor(
    public apiService: ApiService,
    private modalService: BsModalService,
    private toastrService: ToastrService
  ) {
    this.reqData = {
      eventId: this.eventId,

      registrations: [
        {
          age: null,
        },
      ],
    };

    this.reqNewData = {
      filter: {
        roles: ["USER"],
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
  }

  ngOnInit() {
    this.getCategory();
    this.guestDetail = JSON.parse(localStorage.getItem("guestDetail"));


    if (this.register["ticketDetails"]) {
      this.ticket = this.register["ticketDetails"];
    }

    this.saveSubscription = this.save.subscribe(() => {

      if (
        this.register["ticket"] == undefined ||
        this.register["ticket"].length == 0
      ) {
        this.toastrService.error("Please select one category");
      } else {
        if (this.response["status"] == 'ERROR') {


          this.toastrService.error(this.response["description"]);

        }
        else {
          this.completenext.emit();
        }
      }
    });
  }

  authDetailInfo() {
    this.registerInfo = [];

    //this.registerInfo.push(this.authDetail)
    this.ticket.forEach((e, index1) => {
      e.sub.map((sub) => {
        {
          this.registerInfo.push({
            firstName: sub.names,
            email: sub.email,
            phone: sub.phone,
            birthYear: sub.birth,
            eventRuleId: e.eventRuleId,
            userState:sub.userState

          });
        }
      });
    });

    this.register["registrations"] = this.registerInfo;
  }

  getCategory() {

    if (this.registrationType != 'FREE') {
      let data = {
        path: "event/eventRules/" + this.eventId,
        isAuth: true,
      };

      this.apiService.get(data).subscribe((response) => {
        this.eventcategory = response["data"];
        console.log(this.eventcategory)
        this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
        if(this.authDetail){

          if(this.authDetail.userState =='MEMBER')
          {

            this.eventcategory=  this.eventcategory.filter((t)=>

            (t.allowMember== true && t.allowNonMember== false)||t.allowMember== false && t.allowNonMember== true || t.allowMember== true && t.allowNonMember== true
            )

          }
          else{

            this.eventcategory=  this.eventcategory.filter((t)=>
            t.allowNonMember== true
            )

          }
        }
          else{

            this.eventcategory=  this.eventcategory.filter((t)=>

            t.allowNonMember== true || (t.allowNonMember== true&& t.allowMember)
            )

          }


        this.eventcategory.forEach((element) => {
          this.userDetailsRequired = element.userDetailsRequired;
        });

        if (this.register["ticket"] != undefined) {

          this.eventcategory.forEach((element, index) => {
            this.rule = this.register["ticket"].filter(function (data) {
              return data.eventRuleId == element.id;
            });

            if (this.rule.length > 0) {
              element.value = this.rule.length;
            }
          });


        }
        this.eventcategory.forEach((element) => {
          this.mychange(element)
        });
      });

    }
    else{
      if (this.register["ticket"] != undefined) {

        this.value=this.register['ticket'].length

        this.mychange(this.register['ticket'].length)



      }
    }
  }

  inputValueChanged(event, v) {
    event.value = v;

    this.ticketvalue.next(event);
  }

  detectBackspace(event) {
    if (event.keyCode === 8) {
    }
  }

  mychange(category) {

    if (this.registrationType != 'FREE') {
      this.eventRuleId = category.id;
      this.userDetailsRequired = category.userDetailsRequired;
      this.userDetailreqchange.emit(this.userDetailsRequired);
      this.eventRuleIdchange.emit(category.id);


      let array = this.ticket.filter((t) => {
        if (category.id == t.eventRuleId) {
          return t;
        }
      });


      if (array.length == 0) {
        this.ticket.push({
          id: category.id,
          type: category.name,
          value: category.value,
          eventRuleId: category.id,
          maxAge: category.maxAge,
          minAge: category.minAge,
          userDetailsRequired: category.userDetailsRequired,
        });
      } else {
        this.ticket.filter((t, i) => {
          if (category.id == t.eventRuleId) {
            this.ticket[i]["value"] = category.value;
          }
        });

      }
      if (this.eventcategory.length > 0) {
        this.ticket = this.ticket.filter(function (element) {
          return element.value != undefined;
        });
        this.ticket = this.ticket.filter(function (element) {
          return element.value != "";
        });
        this.ticket = this.ticket.filter(function (element) {
          return element.value != 0;
        });
      }

      this.ticketDetail = [];
      if (this.ticket.length == 0) {
        this.register["ticket"] = this.ticketDetail;
        this.completed.emit();
      }
      this.ticket.forEach((items, index) => {

        for (let i = 1; i <= items.value; i++) {
          if(this.authDetail)
          {
          this.ticketDetail.push({
            eventRuleId: items.eventRuleId,
            age: null,

            userState:this.authDetail.userState
          });
        }
        else{
          this.ticketDetail.push({
            eventRuleId: items.eventRuleId,
            age: null,

            userState:null,
          });
        }
        }
        if (this.authDetail) {
          this.ticketDetail[0]["email"] = this.authDetail["email"];
          this.ticketDetail[0]["userId"] = this.authDetail["id"];
        }
        if (!this.authDetail) {

          this.ticketDetail[0]["email"] = this.guestDetail["email"];
        }
        this.register["ticket"] = this.ticketDetail;

        this.register["registrations"] = this.register["ticket"];

      });
      this.completed.emit();

    }
    if (this.registrationType == 'FREE') {
     this.ticket=[]

      this.ticket = this.ticket.filter(function (element) {

        return element!= undefined;
      });
      this.ticket = this.ticket.filter(function (element) {
        return element != "";
      });
      this.ticket = this.ticket.filter(function (element) {
        return element!= 0;
      });

      this.ticket.push({


        value: category,
        eventRuleId: null,

        minAge: 18,


      })

      this.ticketDetail = [];
      if (this.ticket.length == 0) {
        this.register["ticket"] = this.ticketDetail;
        this.completed.emit();
      }
      this.ticket.forEach((items, index) => {

        for (let i = 1; i <= items.value; i++) {
          this.ticketDetail.push({
            eventRuleId: items.eventRuleId,
            age: items.minAge,
          });
        }
        if (this.authDetail) {
          this.ticketDetail[0]["email"] = this.authDetail["email"];
          this.ticketDetail[0]["userId"] = this.authDetail["id"];
        }
        if (!this.authDetail) {

          this.ticketDetail[0]["email"] = this.guestDetail["email"];
        }

        this.register["ticket"] = this.ticketDetail;

        this.register["registrations"] = this.register["ticket"];

        this.completed.emit();

      });
    }

  }

  /* mychange1(value, index = 0) {
    console.log(this.ticket);
    let age = configuration.calculateAge(value.birth);

    value.age = age;
    console.log("age  ", this.ticket);
    this.ticketDetail = [];
    this.ticket.forEach((e, index1) => {
      e.sub.map((sub) => {
        if (sub.age && sub.birth && sub.birth != "") {
            this.ticketDetail.push({
              eventRuleId: e.eventRuleId,
              age: sub.age,
            });
        }
      });
    });
    this.register["ticket"] = this.ticketDetail;


    this.register["ticketDetails"] = this.ticket;
    this.authDetailInfo();
    //  this.register["registrations"] = this.registerInfo;


    this.completed.emit();
  }*/

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  addNewOption(val, i, category) { }

  addMember() {
    // this.optionList.splice(0,this.optionList.length)

    this.content = this.memberList;
    let storefilter;
    this.selectedItemsList = (this.content || []).filter((value, index) => {
      return value.isChecked;
    });

    let n = this.ticket[this.currentAddMemberIndex]["sub"].filter(
      (sub) => sub.birth == ""
    );

    if (this.selectedItemsList.length > n.length) {
      this.toastrService.error(
        "sorry you selected more than number of ticket please  try again"
      );
    } else {
      let arr = this.selectedItemsList.map((item) => {
        let phone = "";
        phone = item.phone.substring(0, 10);
        phone = item.phone.replace(
          /^(\d{0,3})(\d{0,3})(\d{0,4})/,
          "($1) $2-$3"
        );
        return {
          names: item.firstName + item.lastName,
          email: item.email,
          birth: item.birthYear,
          phone: phone,
        };
      });
      arr.forEach((i) => {
        let shouldSkip = false;
        this.ticket[this.currentAddMemberIndex]["sub"].forEach((s) => {
          if (shouldSkip) {
            return;
          }
          if (s.names == "") {
            s.names = i.names;
            s.email = i.email;
            s.birth = i.birth;
            s.phone = i.phone;
            shouldSkip = true;
            return;
          }
        });
      });

      this.ticket[this.currentAddMemberIndex]["sub"].forEach((element, i) => {
        if (element.birth != null) {
          //this.mychange1(element);
        }
      });
      this.completed.emit();
    }
  }

  removeLastOption(i, index) {
    this.ticket[index]["sub"].splice(i, 1);
    this.register["ticket"] = [];
    this.ticketDetail = [];
    this.ticket.forEach((e, index1) => {
      e.sub.map((sub) => {
        if (sub.age && sub.birth && sub.birth != "") {
          this.ticketDetail.push({
            eventRuleId: e.eventRuleId,
            age: sub.age,
          });
        }
      });
    });
    this.register["ticket"] = this.ticketDetail;
    //this.register["ticket"].splice(i,1)

    this.completed.emit();
    this.authDetailInfo();
    this.ticket[index]["value"] = this.ticket[index]["sub"].length;

    this.eventcategory.filter((data) => {
      if (data.id == this.ticket[index]["eventRuleId"]) {
        data.value = this.ticket[index]["value"];
      }
    });
  }

  changeSelection() {
    this.addMember();
    //this.fetchCheckedIDs()
    this.modalRef.hide();
  }

  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }

  memberData() {
    this.reqNewData["filter"]["search"] = this.search;
    let req = {
      path: "auth/user/getUserDetail",
      isAuth: true,
    };
    this.apiService.get(req).subscribe((response) => {
      this.memberList = response["data"]["familyMembers"];
      this.memberList.unshift(response["data"]["user"]);

      this.totalMember = this.memberList.length;
      // this.totalPages = pagination.arrayTwo(
      //   this.memberList["totalPages"],
      //   this.reqNewData.page.page
      // );
      this.memberList.map((item, index) => {
        if (item.phone) {
          if (item.phone.length === 0) {
            let phone = "";
          } else if (item.phone.length <= 3) {
            item.phone = item.phone.replace(/^(\d{0,3})/, "($1)");
          } else if (item.phone.length <= 6) {
            item.phone = item.phone.replace(/^(\d{0,3})(\d{0,3})/, "($1) $2");
          } else if (item.phone.length <= 10) {
            item.phone = item.phone.replace(
              /^(\d{0,3})(\d{0,3})(\d{0,4})/,
              "($1) $2-$3"
            );
          } else {
            item.phone = item.phone.substring(0, 10);
            item.phone = item.phone.replace(
              /^(\d{0,3})(\d{0,3})(\d{0,4})/,
              "($1) $2-$3"
            );
          }
        }
        if (item.profilePictureUrl == null || item.profilePictureUrl == "") {
          item["profileShow"] = false;
          item["profileUrl"] = item.firstName[0] + "" + item.lastName[0];
        } else {
          item["profileShow"] = true;
          item["profileUrl"] = item.profilePictureUrl;
        }
      });
    });
  }

  searchNewData() {
    this.paginationNewMember("current", "user", 0);
  }

  paginationNewMember(type, data, current = null) {
    if (data == "user") {
      if (type == "prev") {
        this.reqNewData.page.page = this.reqNewData.page.page - 1;
      } else if (type == "current") {
        this.reqNewData.page.page = current;
      } else {
        this.reqNewData.page.page = this.reqNewData.page.page + 1;
      }
      this.memberData();
      document.getElementById("page_form").scrollIntoView();
    }
  }

  openModalWithClass3(template2: TemplateRef<any>, index) {
    this.currentAddMemberIndex = index;
    this.modalRef = this.modalService.show(
      template2,
      Object.assign(
        {},
        { class: "modal-lg modal-dialog-centered committee-member-donation" }
      )
    );
    this.memberData();
  }

  searchClick() {
    this.memberData();
  }
}
