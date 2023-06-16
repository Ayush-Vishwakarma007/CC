import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "../../../services/api.service";
import { EMAIL_PATTERN } from "../../../helpers/validations";
import { SpinnerService } from "../../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, Subscription } from "rxjs";
@Component({
  selector: "app-sponsor-donor-selection",
  templateUrl: "./sponsor-donor-selection.component.html",
  styleUrls: ["./sponsor-donor-selection.component.scss"],
})
export class SponsorDonorSelectionComponent implements OnInit {
  @Output() sponsorchanges: EventEmitter<any> = new EventEmitter();
  @Output() donarchanges: EventEmitter<any> = new EventEmitter();
  @Input() eventId: string;
  @Input() response: string;
  @Input() activeTabName: string;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() skipvalue: EventEmitter<any> = new EventEmitter();
  @Output() registerArraychange: EventEmitter<any> = new EventEmitter();
  @Output() completenext: EventEmitter<any> = new EventEmitter();
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
  userForm: FormGroup;
  sponsorDetail: any = [];
  categoryList: any = [];
  checkoutArray: any = [];
  validTypesImage = ["jpeg", "jpg", "png"];
  uploadedFlyer: any = [];
  uploadedLogo: any = [];
  type: any;
  authDetail: any = [];
  guestDetail: any = [];
  storeselectId: any;
  amountStore: any;
  Storevalue: any
  checkvalue: boolean
  imageList: any = [];
  videoList: any = [];
  uploadedImageList: any = [];
  mediaUploadUrl = "notification/file/upload/file";

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    public apiService: ApiService,
    public spinner: SpinnerService,
    private route: ActivatedRoute
  ) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
   this.guestDetail = JSON.parse(localStorage.getItem("guestDetail"));
   
    this.userForm = this.formBuilder.group({
      firstName: [
        null,
        [Validators.required, Validators.pattern("[a-zA-Z ]*$")],
      ],
      middleName: [
        null,
        [ Validators.pattern("[a-zA-Z ]*$")],
      ],
      lastName: [
        null,
        [Validators.required, Validators.pattern("[a-zA-Z ]*$")],
      ],
      phone: ["", Validators.required],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],

      companyName: [null],
      companyWebsite: [null],
      displayName: [null],
      stayAnonymous: [false],
      flyer: [null],
      logo: [null],
    });
  }

  ngOnInit() {

    this.getCategoryList();
    if (this.authDetail) {
      if (this.activeTabName == 'SPONSOR') {
        this.userForm.patchValue({
          firstName: this.register["userDetail"]["firstName"],
          middleName: this.register["userDetail"]["middleName"],
          email: this.register["userDetail"]["email"],
          phone: this.register["userDetail"]["phone"],
          lastName: this.register["userDetail"]["lastName"],
          addressLine1: this.register["userDetail"]["addressLine1"],
          city: this.register["userDetail"]["city"],
          state: this.register["userDetail"]["state"],
          zipCode: this.register["userDetail"]["zipCode"],
          //displayName: this.register["userDetail"]["displayName"],
          companyName: this.register["userDetail"]["companyName"],
          // stayAnonymous: this.register["userDetail"]["stayAnonymous"],
          companyWebsite: this.register["userDetail"]["companyWebsite"],
          flyer: this.register["userDetail"][" flyer"],
          logo: this.register["userDetail"]["logo"]

        });
        if (this.register['userDetail']['middleName'] == null) {
          this.userForm.patchValue({
            displayName: this.register['userDetail']['firstName'] + ' ' + this.register['userDetail']['lastName']
          })

        }
        else {
          this.userForm.patchValue({
            displayName: this.register['userDetail']['firstName'] + ' ' + this.register['userDetail']['middleName'] + ' ' + this.register['userDetail']['lastName']
          })
        }
       
        let logos = [];
        if (this.register["userDetail"]["logo"] != '' && this.register["userDetail"]["logo"] != undefined) {
        
          logos.push(this.register["userDetail"]["logo"]
          );

          logos.forEach((item, index) => {
          
            this.uploadedLogo[index] = [];
            this.uploadedLogo[index]['responseData'] = [];
            this.uploadedLogo[index]['responseData']['data'] = [];
            this.uploadedLogo[index]['responseData']['data']['imageUrl'] = item;

          });
        }
      }


  
      if (this.activeTabName == 'DONATION') {
     
        // this.register["userDetail"]["anonymousDonation"]=this.userForm.value.stayAnonymous

        this.userForm.patchValue({
          firstName: this.register["userDetail"]["firstName"],
          middleName: this.register["userDetail"]["middleName"],
          email: this.register["userDetail"]["email"],
          phone: this.register["userDetail"]["phone"],
          lastName: this.register["userDetail"]["lastName"],
          addressLine1: this.register["userDetail"]["addressLine1"],
          city: this.register["userDetail"]["city"],
          state: this.register["userDetail"]["state"],
          zipCode: this.register["userDetail"]["zipCode"],
          //displayName: this.register["userDetail"]["displayName"],
          companyName: this.register["userDetail"]["companyName"],
          stayAnonymous: this.register["userDetail"]["stayAnonymous"],
          companyWebsite: this.register["userDetail"]["companyWebsite"],
          flyer: this.register["userDetail"][" flyer"],
          // logo: this.register["userDetail"]["logo"]

        });
        if (this.register['userDetail']['middleName'] == null) {
          this.userForm.patchValue({
            displayName: this.register['userDetail']['firstName'] + ' ' + this.register['userDetail']['lastName']
          })

        }
        else {
          this.userForm.patchValue({
            displayName: this.register['userDetail']['firstName'] + ' ' + this.register['userDetail']['middleName'] + ' ' + this.register['userDetail']['lastName']
          })
        }
        if (this.userForm.value.stayAnonymous == undefined) {
          this.userForm.value.stayAnonymous = false;
        }
 
      }
    } else {
      console.log(this.register["guestDetail"])
      this.userForm.patchValue({


        firstName: this.register["guestDetail"]["firstName"],
        email: this.register["guestDetail"]["email"],
        phone: this.register["guestDetail"]["phone"],
        lastName: this.register["guestDetail"]["lastName"],
        addressLine1: this.register["guestDetail"]["addressLine1"],
        city: this.register["guestDetail"]["city"],
        state: this.register["guestDetail"]["state"],
        zipCode: this.register["guestDetail"]["zipCode"],
        stayAnonymous: this.register["guestDetail"]["stayAnonymous"],

      });
      if (this.register['guestDetail']['middleName'] == null) {
        this.userForm.patchValue({
          displayName: this.register['guestDetail']['firstName'] + ' ' + this.register['guestDetail']['lastName']
        })

      }
      else {
        this.userForm.patchValue({
          displayName: this.register['guestDetail']['firstName'] + ' ' + this.register['guestDetail']['middleName'] + ' ' + this.register['guestDetail']['lastName']
        })
      }
    }

    
    this.saveSubscription = this.save.subscribe(() => {
      
      if (this.activeTabName == "SPONSOR") {
        let logoImage = '';
        if (this.uploadedLogo[0] != undefined) {
          logoImage = this.uploadedLogo[0]['responseData']['data']['imageUrl'];
          this.userForm.patchValue({

            logo: logoImage
          });
        }
        else {
          this.userForm.patchValue({

            logo: null
          });


        }
        if (this.register["sponsor"] == undefined || this.register['sponsor'].length == 0) {

          this.toastrService.error("Please select sponsorship category");
        }

        else {

          if (
            (this.register["sponsor"]["amount"] >= this.register["sponsor"]["range"]["min"] && this.register["sponsor"]["amount"] <= this.register["sponsor"]["range"]["max"]) && this.userForm
          ) {
            this.checkUserDetail()
            //this.completenext.emit();

          }
          /*else if (this.userForm) {
            this.checkUserDetail()
          }*/
          else {

            this.completed.emit()


          }
        }
      }
      if (this.activeTabName == "DONATION") {
        if (this.register["dontation"] == undefined || this.register['dontation'].length == 0) {
          this.toastrService.error("Please select Dontation category");
        }
        else {
          if (
            this.register["dontation"]["amount"] >= this.register["dontation"]["range"]["min"] && this.register["dontation"]["amount"] <= this.register["dontation"]["range"]["max"]

          ) {
            this.checkUserDetail()
            // this.toastrService.error("please fill all reqired fields");
            //this.completenext.emit();
          } else {
            //this.completenext.emit();
            this.completed.emit()
          }
        }
      }
    });
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  getCategoryList() {
    // this.userForm.patchValue({
    //   stayAnonymous: this.register["userDetail"]["anonymousDonation"]
    // })
    let path = "";
  console.log(this.activeTabName);
    if (this.activeTabName == "SPONSOR") {
      path = "event/getAllSponsorshipCategories/SPONSOR/" + this.eventId;
    }
    if (this.activeTabName == "DONATION") {
      path = "event/getAllSponsorshipCategories/DONATION/" + this.eventId;
    }

    let request = {
      path: path,
      isAuth: true,
    };

    this.apiService.get(request).subscribe((response) => {
      if (response["status"]["code"] == "OK") {
        this.categoryList = response["data"];
     
        this.categoryList.forEach((item, index) => {
       
          item["amount"] = 0;
          if (this.activeTabName == "SPONSOR") {
        
            if (this.register["sponsor"]["id"] == item["id"]) {

              this.categoryChange(true, index);
            }
          }
          if (this.activeTabName == "DONATION") {
            if (this.register["dontation"]["id"] == item["id"]) {
              this.categoryChange(true, index);
            }
          }
        });


      } else {
        this.toastrService.error(response["status"]["description"]);
      }
    });
  }

  categoryChange(check, index, onload = false) {
    if (onload == false) {
      this.categoryList.map((t) => {
        t.amount = 0;
        t.checked = false;
        return t;
      });
    }

    this.categoryList[index]["checked"] = check;


    if (this.activeTabName == "SPONSOR") {
    
      if (this.register["sponsor"] == undefined) {
        this.categoryList[index]["amount"] =
          this.categoryList[index]["range"]["min"];
      } else {
        if ((this.categoryList[index]["amount"] == 0 && this.register["sponsor"]["amount"] == 0) || this.register["sponsor"]["amount"] == undefined) {
          this.categoryList[index]["amount"] =
            this.categoryList[index]["range"]["min"];
        }
        else {
        
          this.categoryList[index]["amount"] = this.register["sponsor"]["amount"];
        }
      }

      this.register["sponsor"] = this.categoryList[index];

      if (this.register["sponsor"].checked == true) {

        this.register["sponsor"] = this.categoryList[index];
        //this.amountStore = this.register["sponsor"]["amount"];

        this.completed.emit();
      } else {
        this.register["sponsor"] = [];
        this.completed.emit();
      }
    }
    if (this.activeTabName == "DONATION") {
      if (this.register["dontation"] == undefined) {
        this.categoryList[index]["amount"] =
          this.categoryList[index]["range"]["min"];
      } else {
        if ((this.categoryList[index]["amount"] == 0 && this.register["dontation"]["amount"] == 0) || this.register["dontation"]["amount"] == undefined) {
          this.categoryList[index]["amount"] =
            this.categoryList[index]["range"]["min"];
        }
        else {
          this.categoryList[index]["amount"] =
            this.register["dontation"]["amount"];
        }
      }
      this.register["dontation"] = this.categoryList[index];
      if (this.register["dontation"].checked == true) {
        this.register["dontation"] = this.categoryList[index];
        this.completed.emit();
      } else {
        this.register["dontation"] = [];
        this.completed.emit();
      }
    }


  }
  categoryChange1(event) {
    this.checkvalue = event

  }
  changeAmount(list) {
   
    list["amount"] = parseFloat(list["amount"]);
    if (
      list["amount"] >= list["range"]["min"] &&
      list["amount"] <= list["range"]["max"]
    ) {
      list["amount"] = parseFloat(list["amount"]);


    } else {
      //list["amount"] = list["range"]["min"];

      if (isNaN(list['amount']) || list['amount'] == "" || list["amount"] == 0 || list['amount'] == undefined) {
        list["amount"] = list["range"]["min"];
      }

    }

    if (this.activeTabName == "SPONSOR") {

      this.register["sponsor"] = list;

      // console.log("regis ", this.register["sponsor"]);
      if (this.register["sponsor"].checked == true) {
        this.completed.emit();
      } else {
        this.register["sponsor"] = [];
        this.completed.emit();
      }
    }
    if (this.activeTabName == "DONATION") {
      this.register["dontation"] = list;
      if (this.register["dontation"].checked == true) {
        this.completed.emit();
      } else {
        this.register["dontation"] = [];
        this.completed.emit();
      }
    }
  }
  displayName(){
    this.userForm.patchValue({
      displayName: this.userForm.value.firstName
    });
  }
  displayName1()
  {
    this.userForm.patchValue({
      displayName: this.userForm.value.firstName+ ' ' +this.userForm.value.middleName
    });
  }
  displayName2(){
    this.userForm.patchValue({
      displayName: this.userForm.value.firstName+ ' ' +this.userForm.value.middleName + ' ' +this.userForm.value.lastName
    });
  }

  maxFileError() {
    this.spinner.hide();
    this.toastrService.error("Maximum 1 file is allowed");
  }

  invalidUploadFile() {
    this.spinner.hide();
    this.toastrService.error("Please upload only image file");
  }

  fileSizeError() {
    this.spinner.hide();
    let request = {
      path: "community/configuration/publicInfo",
      isAuth: true,
    };
    this.apiService.get(request).subscribe((response) => {
      this.toastrService.error(
        "Maximum " + response["data"]["imageMaxSize"] + "MB size is allowed"
      );
    });
  }

  uploadStarted() {
    this.spinner.show();
    //this.isFileUploading=true;
  }

  queueCompleted() {
    this.spinner.hide();
  }

  queueCompleted1() {
    // this.spinner.hide();
  }

  checkUserDetail() {
  
    if (this.userForm.value.phone) {
      let phone = this.userForm.value.phone;
      if (this.userForm.value.phone.length >= 17) {
        phone = phone.slice(0, -1);
      }
      phone = phone.replace('(', '');
      phone = phone.replace(')', '');
      phone = phone.replace(' ', '');
      phone = phone.replace(/[^0-9\.]+/g, "");
      this.userForm.patchValue({
        phone: phone
      })
    }

    if (this.uploadedLogo[0]) {

      this.userForm.patchValue({

        logo: this.uploadedLogo[0]['responseData']['data']['imageUrl']
      });
      this.register["userDetail"]["logo"] = this.uploadedLogo[0]['responseData']['data']['imageUrl']
    } else {
      this.userForm.patchValue({
        logo: null
      });
    }

    if (this.userForm.valid) {
      if (this.authDetail) {
        
        if (this.userForm.value.logo == null && (this.userForm.value.displayName == null || $.trim(this.userForm.value.displayName) == '')) {
          this.toastrService.error('Please Enter Receipt name or Logo');
          return false
        }
        this.register['userDetail']['firstName'] = this.userForm.value.firstName;
        this.register['userDetail']['lastName'] = this.userForm.value.lastName;
        //this.register['userDetail']['middleName'] = this.userForm.value.middleName;
        this.register['userDetail']['email'] = this.userForm.value.email;
        this.register['userDetail']['phone'] = this.userForm.value.phone;
        this.register['userDetail']['companyName'] = this.userForm.value.companyName;
        this.register['userDetail']['companyWebsite'] = this.userForm.value.companyWebsite;
        this.register['userDetail']['displayName'] = this.userForm.value.displayName;
        this.register["userDetail"]["stayAnonymous"] = this.userForm.value.stayAnonymous;
        this.register['userDetail']['flyer'] = this.userForm.value.flyer;
        this.register['userDetail']['logo'] = this.userForm.value.logo;
        this.register['advertisment'] = { logo: this.userForm.value.logo, companyName: this.userForm.value.companyName, firstName: this.userForm.value.firstName, lastName: this.userForm.value.lastName, email: this.userForm.value.email, phone: this.userForm.value.phone }
        this.register['advertismentDonation'] = { logo: this.userForm.value.logo, companyName: this.userForm.value.companyName, firstName: this.userForm.value.firstName, lastName: this.userForm.value.lastName, email: this.userForm.value.email, phone: this.userForm.value.phone, anonymousDonation: this.userForm.value.stayAnonymous }
        if (this.activeTabName == 'DONATION') {
        if (this.register['advertismentDonation']['anonymousDonation'] == undefined) {
          this.register['advertismentDonation']['anonymousDonation'] = false
        }
      }
        this.completed.emit();
        this.completenext.emit()
        return true;
      }
      else {
        if (this.userForm.value.logo == null && (this.userForm.value.displayName == null || $.trim(this.userForm.value.displayName) == '') && this.checkoutArray['url'] != 'donor-checkout-new') {
          this.toastrService.error('Please Enter Receipt name or Logo');
          return false
        }
        this.register['guestDetail']['firstName'] = this.userForm.value.firstName;
        this.register['guestDetail']['lastName'] = this.userForm.value.lastName;
        //this.register['userDetail']['middleName'] = this.userForm.value.middleName;
        this.register['guestDetail']['email'] = this.userForm.value.email;
        this.register['guestDetail']['phone'] = this.userForm.value.phone;
        this.register['guestDetail']['companyName'] = this.userForm.value.companyName;
        this.register['guestDetail']['companyWebsite'] = this.userForm.value.companyWebsite;
        this.register['guestDetail']['displayName'] = this.userForm.value.displayName;
        this.register['guestDetail']['stayAnonymous'] = this.userForm.value.stayAnonymous;
        this.register['guestDetail']['flyer'] = this.userForm.value.flyer;
        this.register['guestDetail']['logo'] = this.userForm.value.logo;
        this.register['advertismentDonation'] = { logo: this.userForm.value.logo, companyName: this.userForm.value.companyName, firstName: this.userForm.value.firstName, lastName: this.userForm.value.lastName, email: this.userForm.value.email, phone: this.userForm.value.phone, anonymousDonation: this.userForm.value.stayAnonymous }
        if (this.activeTabName == 'DONATION') {
        if (this.register['advertismentDonation']['anonymousDonation'] == undefined) {
          this.register['advertismentDonation']['anonymousDonation'] = false
        }
      }
        this.completed.emit();
        this.completenext.emit()
        return true;

      }
    } else {
      this.toastrService.error('All field are required')
      return false;
    }
  }

  skip() {

    if (this.activeTabName == 'SPONSOR') {

      this.register["sponsor"] = []
      this.completed.emit()
    }
    if (this.activeTabName == 'DONATION') {

      this.register["dontation"] = []
      this.completed.emit()
    }
    this.skipvalue.emit(true);
  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
}
