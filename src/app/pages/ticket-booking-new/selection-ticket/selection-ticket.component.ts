import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import { data, event } from "jquery";
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
import  {TicketBookingNewComponent} from "../ticket-booking-new.component"
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { CommunitySettingsModule } from "../../administration/community-settings/community-settings.module";
import { ChSponsorListComponent } from "../../donation-sponsorship/chapter-sponsorship/ch-sponsor-list/ch-sponsor-list.component";
// import { element } from "protractor";
import { Console, timeStamp } from "console";
import { CommonService} from '../../../services/common.service'
import { exit } from "process";



@Component({
  selector: 'app-selection-ticket',
  templateUrl: './selection-ticket.component.html',
  styleUrls: ['./selection-ticket.component.scss']
})
export class SelectionTicketComponent implements OnInit {
  optionList: any = [{
    firstname: "",
    lastname:"",
    birth: "",
    email: "",
    phone: "",
  }]
  eventcategory: any = []
  ticket: any = []
  registerInfo: any = []
  ticketDetail: any = []
  storeDetails: any = []
  reqNewData: any = []
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
  currentAddMemberIndex = 0;
  modalRef: BsModalRef;
  search = ""
  age: any
  array: any = []
  checkEmailPattern: any
  checkPhonePattern: any
  isDisable: boolean = false
  reqUserData: any = []
  minAge: any
  maxAge: any
  userState:any=""
  ticketIndex:any
  checkedValue:boolean

  @Input() registrationType: any
  @Input() eventId: string;

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
  constructor(public apiService: ApiService,
    private modalService: BsModalService,
    private toastrService: ToastrService,public cd:ChangeDetectorRef,public common:CommonService) {
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
    this.reqUserData = {
      maxAge: "",
      minAge: ""
    }
  }

  ngOnInit() {
    this.common.subscribe('response',(data)=>{

    })

    this.getCategory()

    this.saveSubscription = this.save.subscribe(() => {

      if (
        this.register["ticket"] == undefined ||
        this.register["ticket"].length == 0
      ) {
        this.toastrService.error("Please select atleast one ticket");

      } else if (
        this.register["registrations"] != undefined

      ) {
        let i = 0;
        this.registerInfo.forEach((element) => {
          console.log(element)
          if (
            element.firstName == "" ||  element.lastName ==""

          ) {
            i++;

          }
          // if (element.email != "") {
          //   this.checkEmailPattern = this.registerInfo.filter(s => !/[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/.test(s.email))
          // }
          // if (element.phone != "") {
          //   this.checkPhonePattern = element.phone.length
          // }
        });

        if (i != 0) {
          this.toastrService.error("Please fill all required details ");
        }
        // else if (this.checkEmailPattern != "" && this.checkEmailPattern != undefined) {
        //   this.toastrService.error("Please enter valid email");
        
        //  }
        // else if (this.checkPhonePattern < 14) {
        //   this.toastrService.error("Please enter valid phone");
        // }


        else {
      
          if (this.response["status"] == 'ERROR') {


            this.toastrService.error(this.response["description"]);

          }
          else {


            this.completenext.emit();
          }
        }

      }

      /* else {
         if (this.response["status"] == "OK") this.completenext.emit();
       }*/

    });
  }
  getCategory() {

    if (this.registrationType != 'FREE') {
      let data = {
        path: "event/eventRules/" + this.eventId,
        isAuth: true,
      };

      this.apiService.get(data).subscribe((response) => {
        this.eventcategory = response["data"];

        // this.eventcategory.filter((t)=>
        //   console.log(t)
        //    )
        this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
      if(this.authDetail){
        if(this.authDetail.userState =='MEMBER')
        {
         
        this.eventcategory=  this.eventcategory.filter((t)=>
        
           (t.allowMember== true && t.allowNonMember== false)||t.allowMember== false && t.allowNonMember== true || t.allowMember== true && t.allowNonMember== true
           )
          console.log(this.eventcategory)
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

        this.eventcategory.forEach((element,index) => {


          element['sub'] = []
          if (this.register["registrations"] && this.register["registrations"].length != 0) {
            this.register["registrations"].filter((item, index) => {
              if (item['eventRuleId'] == element['id']) {
                element['sub'].push({
                  birth: item.birthYear,
                  firstname: item.firstName,
                  lastname:item.lastName,
                  email: item.email,
                  phone: item.phone,
                  userState:item.userState
                });

                element.sub.forEach(element => {

                });
              }

            });
            this.registerInfo = this.register["registrations"];
          }

          if (element['sub'].length == 0) {
            element['sub'].push({ birth: '', email: '', firstname: '',lastname: '', phone: '',userId:null ,userState:null,age:null });
          }
        });
        this.eventcategory.forEach(element => {
          element['sub'].map((item) => {
            if (item['birth']) {
              this.mychange1(item);
            }
          });
        });

      })
    }
    else {

      /*this.optionList.push({
        names: "",
        birth: "",
        email: "",
        phone: "",
      });*/
      if (this.register["registrations"] && this.register["registrations"].length != 0) {

        this.optionList = this.register["registrations"]

        this.register["registrations"].forEach((e, index) => {
          this.optionList.forEach((element, index1) => {
            if (index == index1) {
              element.firstname = e.firstName,
              element.lastname = e.lastName,
                element.birth = e.birthYear,
                element.email = e.email,
                element.phone = e.phone
            }
          });

        });
      }

    }
  }

  addDynamicField(index, cate) {
    if (this.registrationType != 'FREE') {
      this.eventcategory.forEach((element, index) => {
        if (element.id == cate.id)
          element["sub"].push({
            firstname: "",
            lastname:"",
            birth: "",
            email: "",
            phone: "",
          });
        this.ticket.push(element["sub"])
      });
    }
    else {

      this.optionList.push({
        firstname: "",
        lastname:"",
        birth: "",
        email: "",
        phone: "",
      });
      this.ticket.push(this.optionList)

    }
  }

  removeLastOption(index, i) {
  

    this.ticketDetail = [];

    if (this.registrationType != 'FREE') {
      this.eventcategory[i]["sub"].splice(index, 1);

      this.eventcategory.forEach((e, index1) => {
        e.sub.map((sub) => {

            this.ticketDetail.push({
              eventRuleId: e.id,
              age: sub.age,
            });

        });
      });
    }
    else {
      this.optionList.splice(index, 1)
    }

    this.register["ticket"] = this.ticketDetail;

    this.authDetailInfo()

    this.completed.emit();
  }
  mychange1(value) {

    this.age=''
    this.age = configuration.calculateAge(value.birth);

   // value.age = this.age;


    this.ticketDetail = [];

    if (this.registrationType != 'FREE') {
      this.eventcategory.forEach((e, index1) => {

        e.sub.map((sub) => {

                 //this.userState=item.userState
          this.storeDetails.push(e.sub)

          if (sub.firstname!=""&& sub.lastname!="") {

            this.ticketDetail.push({
              eventRuleId: e.id,
              age: sub.age,
            });


          }

        });
      });
    }
    else {

      this.optionList.forEach(element => {
        if (element.firstname!=""&& element.lastname!="") {
          this.ticketDetail.push({
            eventRuleId: null,
            age: configuration.calculateAge(value.birth),
          });
        }

      });
    }
    if (this.authDetail) {
     
      this.ticketDetail[0]["userId"] = this.authDetail["id"];
    }
    this.register["ticket"] = this.ticketDetail;
   

    //this.register["ticketDetails"] = this.ticket;
    this.authDetailInfo();
    //  this.register["registrations"] = this.registerInfo;

    if ( value.firstname != "" && value.lastname !="" ) {
      this.completed.emit();

    }

  }
  authDetailInfo() {
    this.registerInfo = [];
    //this.registerInfo.push(this.authDetail)
    if (this.registrationType != 'FREE') {
      this.eventcategory.forEach((e, index1) => {
     
      e.sub= [].concat.apply([],  e.sub);
    
      if(e.sub.length==0){
        e.sub.push({firstname:'',lastname:'',birth:'',phone:''})
      }
        e.sub.map((sub) => {
          this.age = configuration.calculateAge(sub.birth);
          {
         
            if(sub.firstname!="" || sub.lastname!="" )
            {
            this.registerInfo.push({

              firstName: sub.firstname,
              lastName:sub.lastname,
              email: sub.email,
              phone: sub.phone,
              birthYear: sub.birth,
              eventRuleId: e.id,
              userState:sub.userState,
              age:this.age,
              userId:sub.userId
            });
          }

              // this.registerInfo.forEach((element,index) => {
              //   if(e.id==element.eventRuleId&&e.allowMember==false&& element.userState!='MEMBER')
              //   this.registerInfo[index]['userState']=null
              // });

          }
        });


        this.registerInfo.forEach((element, index) => {

          if (e.id == element.eventRuleId) {
            if (element.firstName =="") {
              this.registerInfo.splice(index)
            }
          }
        });
      });
    }
    else {

      this.optionList.forEach(element => {
        this.registerInfo.push({

          firstName: element.firstname,
          //firstName: element.firstname,
          lastName:element.lastname,
          email: element.email,
          phone: element.phone,
          birthYear: element.birth,
          eventRuleId: element.id,
        });

      });
    }
   
    this.register["registrations"] = this.registerInfo;
    this.register["ticket"]=this.registerInfo
    this.completed.emit()


  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  changeSelection() {
    if (this.registrationType != 'FREE') {

    }
    else {

      this.addMember1();
    }
    //this.fetchCheckedIDs()
    this.modalRef.hide();
  }

  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
    this.common.destroy("response")
  }
  // addMember() {

  //   console.log("aaaa")
  //   // this.optionList.splice(0,this.optionList.length)

  //   this.content = this.memberList;

  //   let storefilter;
  //   this.selectedItemsList = (this.content || []).filter((value, index) => {
  //    console.log("check",value)
  //     return value.isChecked;
  //   });


  //   let n = this.eventcategory[this.currentAddMemberIndex]["sub"].filter(
  //     (sub) => sub.birth == ""
  //   );

  //   if (this.selectedItemsList.length > n.length) {
  //     this.toastrService.error(
  //       "sorry you selected more than number of ticket please  try again"
  //     );
  //   }


  //   else {

  //     let arr = this.selectedItemsList.map((item) => {
  //      //this.userState=item.userState
  //      console.log(this.userState)
  //       let phone = '';
  //       phone = item.phone.substring(0, 10);
  //       phone = item.phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
  //       return {
  //         names: item.firstName + item.lastName,
  //         email: item.email,
  //         birth: item.birthYear,
  //         phone: phone,
  //         userState:item.userState
  //       };
  //     });
  //     console.log(arr)
  //     arr.forEach((i) => {
  //       let shouldSkip = false;
  //       this.eventcategory[this.currentAddMemberIndex]["sub"].forEach((s) => {
  //         if (shouldSkip) {
  //           return;
  //         }
  //         if (s.names == "") {
  //           s.names = i.names;
  //           s.email = i.email;
  //           s.birth = i.birth;
  //           s.phone = i.phone;
  //           s.userState=i.userState
  //           shouldSkip = true;
  //           return;
  //         }


  //       });
  //     });

  //     this.eventcategory[this.currentAddMemberIndex]["sub"].forEach((element, i) => {


  //       if (element.birth != null) {
  //         this.mychange1(element);
  //         console.log(element)
  //       }
  //     });

  //     this.completed.emit();
  //     this.common.subscribe('response',(data)=>{
  //       if(data=="ERROR"){
  //         console.log(this.eventcategory)
  //         this.eventcategory[this.currentAddMemberIndex]["sub"].forEach((element, i) => {
  //           element.names=""
  //           element.email=""
  //           element.phone=""
  //           element.birth=""
  //           if (element.birth != null) {
  //             this.mychange1(element);
  //             console.log(element)
  //           }
  //         });
  //        }
  //     })

  //   }

  // }
  addMember(e,data,i){
   
    if(e==true){
     
      this.selectedItemsList=[]
      this.age = configuration.calculateAge(data.birthYear);
      this.selectedItemsList.push({
        firstname:data.firstName ,
        lastname:data.lastName,
        birth:data.birthYear,
        phone:data.phone,
        email:data.email,
        userState:data.userState,
        age:this.age,
        userId:data.id
      })
     // this.mychange1(this.selectedItemsList)

     
      let arr=[]
      arr= [].concat.apply([], arr);
   
       arr = this.selectedItemsList.map((item) => {
             //this.userState=item.userState
           
              let phone = '';
              //phone = item.phone.substring(0, 10);
              // phone = item.phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
              return {
                firstname: item.firstname,
                lastname: item.lastname,
                email: item.email,
                birth: item.birth,
                phone: item.phone,
                userState:item.userState,
                age:item.age,
                userId:item.userId,
              };
            });
            arr= [].concat.apply([], arr);
           console.log(arr)

           console.log(this.eventcategory[this.currentAddMemberIndex]["sub"])
           // this.eventcategory[this.currentAddMemberIndex]["sub"].push(arr)
          //  this.eventcategory[this.currentAddMemberIndex]["sub"].forEach(element => {
          //    if(element.firstname=='' && element.lastname=='' && element.phone=='' && element.birth=='')
          //    {
          //     this.eventcategory[this.currentAddMemberIndex]["sub"]=arr
          //     console.log('if execute')
          //    }
          //    else{
          //     this.eventcategory[this.currentAddMemberIndex]["sub"]= [].concat.apply([], this.eventcategory[this.currentAddMemberIndex]["sub"]);
          //     this.eventcategory[this.currentAddMemberIndex]["sub"].push(arr)
          //     this.eventcategory[this.currentAddMemberIndex]["sub"]= [].concat.apply([], this.eventcategory[this.currentAddMemberIndex]["sub"]);
          //     return
          //     console.log('else execute')
          //   }
          //             });
           for(let item of this.eventcategory[this.currentAddMemberIndex]["sub"])
           {
             if(item.firstname=='' && item.lastname=='' && item.phone=='' && item.birth=='')
             {
              this.eventcategory[this.currentAddMemberIndex]["sub"]=arr
                   
             }
             else{
            
                  this.eventcategory[this.currentAddMemberIndex]["sub"]= [].concat.apply([], this.eventcategory[this.currentAddMemberIndex]["sub"]);
                  this.eventcategory[this.currentAddMemberIndex]["sub"].push(arr)
                  this.eventcategory[this.currentAddMemberIndex]["sub"]= [].concat.apply([], this.eventcategory[this.currentAddMemberIndex]["sub"]);
                  break
                }
           }

        

            this.eventcategory[this.currentAddMemberIndex]["sub"].forEach((element, i) => {



                this.mychange1(element);


            });

            this.completed.emit();
            this.common.subscribe('response',(data)=>{
                    if(data=="ERROR"){

                      this.eventcategory[this.currentAddMemberIndex]["sub"].forEach((element, i) => {
                        if(element.userState == null){
                          if(this.eventcategory[this.currentAddMemberIndex]["sub"].length==1)
                          {
                          element.firstname='',
                          element.lastname='',
                          element.birth='',
                          element.phone='',
                          element.email=''

                         // this.eventcategory[this.currentAddMemberIndex]['sub'].splice(i,1)
                        }
                        else{
                          this.eventcategory[this.currentAddMemberIndex]['sub'].splice(i,1)
                        }
                      }
                          this.mychange1(element);

                      });
                    }
                  })
    }
    if(e == false){

      this.eventcategory[this.currentAddMemberIndex]['sub'].forEach((element ,index) =>{

        if(element.firstname == data.firstName   && element.phone == data.phone && element.email == data.email){
         
          this.eventcategory[this.currentAddMemberIndex]['sub'].splice(index,1);

          this.selectedItemsList= this.eventcategory[this.currentAddMemberIndex]['sub']
        
          let arr = this.selectedItemsList.map((item) => {
            //this.userState=item.userState

             let phone = '';
            // phone = item.phone.substring(0, 10);
            // phone = item.phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
             return {
               firstname: "",
               lastname: "",
               email: "",
               birth: "",
               phone: "",
               userState:""
             };
           });

         
          if(  this.selectedItemsList.length==0  ||   this.selectedItemsList==undefined)
           {
            
            this.eventcategory[this.currentAddMemberIndex]["sub"].push(arr)
           }
           else{
            this.eventcategory[this.currentAddMemberIndex]["sub"]=this.selectedItemsList
           }
           this.authDetailInfo()
           //this.completed.emit();
        }

      });

  }


  }
  addMember1() {
    // this.optionList.splice(0,this.optionList.length)

    this.content = this.memberList;

    let storefilter;
    this.selectedItemsList = (this.content || []).filter((value, index) => {

      return value.isChecked;
    });
     let n = this.optionList.filter(
      (sub) => sub.birth == ""
    );

    if (this.selectedItemsList.length > n.length) {
      this.toastrService.error(
        "sorry you selected more than number of ticket please  try again"
      );
    } else {
      let arr = this.selectedItemsList.map((item) => {
        let phone = '';
        phone = item.phone.substring(0, 10);
        phone = item.phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');

        return {
          firstname: item.firstName ,
          lastname: item.lastName ,
          email: item.email,
          birth: item.birthYear,
          phone: phone,
        };

      });
      arr.forEach((i) => {
        let shouldSkip = false;
        this.optionList.forEach((s) => {
          if (shouldSkip) {
            return;
          }
          if (s.firstname == "") {
            s.firstname= i.firstname;
            s.lastname= i.lastname;
            s.email = i.email;
            s.birth = i.birth;
            s.phone = i.phone;
            shouldSkip = true;
            return;
          }
        });
      });

      this.optionList.forEach((element, i) => {


        if (element.birth != null) {
          this.mychange1(element);
        }
      });
      this.completed.emit();
    }
  }

  memberData() {
    // this.reqNewData["filter"]["search"] = this.search;
    if (this.registrationType == 'AGE') {
      this.reqUserData["minAge"] = ""
      this.reqUserData["maxAge"] = ""
      let req = {
        path: "auth/user/getUserDetail",
        isAuth: true,
      };
      this.apiService.get(req).subscribe((response) => {
        this.memberList = response["data"]["familyMembers"];
        this.memberList.unshift(response["data"]["user"])
        this.memberList.forEach((element, index) => {
         this.eventcategory.forEach((e, index1) => {
            e.sub.map((sub) => {
            this.storeDetails.push(e.sub)

              if (sub.email == element.email) {

                this.isDisable = true
              }

            });
          });
        });
        this.totalMember = this.memberList.length;
        // this.totalPages = pagination.arrayTwo(
        //   this.memberList["totalPages"],
        //   this.reqNewData.page.page
        // );
        this.memberList.map((item, index) => {
          // if (item.phone) {
          //   if (item.phone.length === 0) {
          //     let phone = '';
          //   } else if (item.phone.length <= 3) {
          //     item.phone = item.phone.replace(/^(\d{0,3})/, '($1)');
          //   } else if (item.phone.length <= 6) {
          //     item.phone = item.phone.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
          //   } else if (item.phone.length <= 10) {
          //     item.phone = item.phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
          //   } else {
          //     item.phone = item.phone.substring(0, 10);
          //     item.phone = item.phone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
          //   }
          // }
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
    else {
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
              let phone = '';
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
  }



  checkotherTickitcheckbox(data, index): boolean {
     console.log(data)

      let response = false;
      let num = 0;

      for (let value of this.registerInfo) {

        if (num == this.ticketIndex) {

          num++;
          continue;
        }

        num++;

        if (value.length == 0) {

          break;
        } else {
         

          if (value.firstName == data.firstName ) {
            response = true;
            
            this.memberList.splice(index)
            return response
          }
          else{

            return response;
          }

        }
      }

      return response;

    // else {
    //   let response = false;
    //   let num = 0;
    //   for (let value of this.registerInfo) {

    //     if (num != index) {

    //       num++;
    //       continue;
    //     }

    //     num++;

    //     if (value.length == 0) {

    //       break;
    //     } else {
    //       // console.log("hello", value.email, data.email, data.firstName + data.lastName, value.firstName)

    //       if (value.firstName == data.firstName + data.lastName && value.email == data.email && value.birthYear == data.birthYear) {

    //         response = true;
    //         break;
    //       }

    //     }
    //   }
    //   return response;

    // }
  }
  checkCheckbox(data){
   
    let value = false;
    this.checkedValue=value
  
    for(let element of this.registerInfo){
      
     if(element.firstName == data.firstName && element.email == data.email ){

     value = true;

     data.value=value

       break;

     }

    }
   return value;

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

  openModalWithClass3(template2: TemplateRef<any>, list,index, minAge, maxAge) {

 console.log(list)
 this.ticketIndex=index
    this.minAge = minAge
    this.maxAge = maxAge
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
