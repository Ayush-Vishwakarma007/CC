import {Component, EventEmitter, Input, OnInit, Output,OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {ApiService} from '../../../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, Subscription} from "rxjs";
import {Location, DatePipe} from '@angular/common';

import { BsModalRef, BsModalService, MiniState } from 'ngx-bootstrap';
import Swal from 'sweetalert2';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Editor, Toolbar } from 'ngx-editor';


@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})

export class PricingComponent implements OnInit,OnDestroy {

  @Input()
  save:Subject<any>;
  @Input() eventId = "";
  @Input() configuration :any = [];

  participationConfig: any;

  _pricing:any;
  @Output()pricingChange: EventEmitter<any> = new EventEmitter();
  @Output() completed:EventEmitter<any> = new EventEmitter();
  @Output() registerArraychange: EventEmitter<any> = new EventEmitter();

  @Input()
  get pricing(){
    return this._pricing;
  }
  set pricing(value){
    this._pricing = value;
    this.pricingChange.emit(value);
  }
  _register: any;
  @Input()
  get register() {
    return this._register;
  }

  set register(value) {
    this._register = value;
    this.registerArraychange.emit(value);
  }
  mediaUploadUrl = "event/file/upload/file";
  saveSubscription:Subscription;
  storeDefault:boolean=false ;
  modalRef: BsModalRef;
  options:any = [ {value: true, viewValue: 'Yes'},
  {value: false, viewValue: 'No'}];

  options1:any = [{value: 'TICKET', viewValue: 'Ticket'},
                  {value: 'PERCENT', viewValue: 'Discount in Percentage'},
                  {value: 'AMOUNT', viewValue: 'Discount in Amount'}];

  option2:any = [{value:'AGE-WISE' , viewValue:'Age-Wise'},
                  {value:'CATEGORY-WISE' , viewValue:'Category-Wise'}];

  option3:any = [{value:true , viewValue: 'Yes'},
                  {value:false , viewValue:'No'}];

  freeFoodForm: FormGroup;
  pricingForm: FormGroup;
  donationForm : FormGroup;
  vendorForm: FormGroup;
  sponsorForm: FormGroup;
  accommodationForm : FormGroup;
  participationConfigForm : FormGroup;
  foodForm : FormGroup;
  newVendorForm : FormGroup ;
  f_List:any;
  parkingForm : FormGroup ;

  media_list : any = [];
  ageList :any = [];
  ageListNew:any=[]
  donationTypeList : any = [];

  price_list  : any = [];
  donation_list  : any = [];
  vendor_list : any = [];
  sponsor_list  : any = [];
  accommodation_list  : any = [];
  food_List : any = [];
  parking_list : any = [];
  validTypesImage = ['jpeg', 'jpg', 'png'];
  // allowParking:boolean;
  // paidParking:boolean;

  // radioOption:any;
  colorCode = '#1ea9c9';
  getType:any;
  radioOption='CATEGORY' ;
  selectedOption: any;
  changeOption='TICKET' ;
  changeSponDiscount='AMOUNT' ;
  count:number=1;
  check:boolean = false;
  submitNewVendorBtn = true;
  submitBtn = true;
  submitDonationBtn = true;
  submitVendorBtn = true;
  submitSponsorBtn = true;
  submitAccommodationBtn = true;
  submitFoodBtn = true;
  submitConfigBtn = true;
  submitFreeFoodBtn = true;
  submitParkingBtn = true;
  currency = '';
  editId = '';
  editType = '';
  mediaList:any = [];
  eventDetail: any = [];
  vendorCount:number=1;
  userDetailsRequireValue:boolean;
  title:any
  lifemem:boolean
  colorList: any = [];
  lifenonmem:boolean
  allewSeatCat:boolean;
  ageTicketList: any = [{
  name:"",
  minAge:"",
  maxAge:"",
  amount:""
  }]
  seatList: any = [{
    name:"",
    start:"",
    end:"",
    totalSeats:0,
  }]
  seatsId:any =[];
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  editors1 : Editor;
  editors : Editor;
  editor: Editor;
  toolbar: Toolbar = [
    ["bold", "italic", "underline"],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ["link"]];

    showError = ''

  constructor(private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute,private datePipe: DatePipe, private apiService: ApiService, private toastrService: ToastrService, private modalService: BsModalService) {
    this.pricingForm = this.formBuilder.group({
      name: ['', Validators.required],
      capacity: ['', Validators.required],
      allocated: [''],
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required],
      // userDetailsRequired:[''] ,
      //maxAge: ['', Validators.required],
      //minAge: ['', Validators.required],
      amount: ['', Validators.required],
      // registrationType: [''],
      seatType: [''],
      allowMember:[true],
      allowNonMember:[true],
      allowLifeMember:[''],
      allowAssociateMember:[''],
      allowSeniorMember:[''],
      allowSeatSelection:[false],
    });

    this.donationForm = this.formBuilder.group({
      categoryName: ['', Validators.required],
      description: ['', Validators.required],
      discount: [''],
      discountType: [''],
      maxDiscount: [''],
      index: ['', Validators.required],
      maxRange: ['', Validators.required],
      minRange:  ['', Validators.required],
    });

    this.vendorForm = this.formBuilder.group({
      arenaImage: [''],
      description: ['', Validators.required],
      discount: ['', Validators.required],
      discountType: ['', Validators.required],
      endDateTime: ['', Validators.required],
      maxDiscount:  ['', Validators.required],
      memberAllowed:  ['', Validators.required],
      name:  ['', Validators.required],
      price:  ['', Validators.required],
      startDateTime:  ['', Validators.required],
    });

    this.sponsorForm = this.formBuilder.group({
      categoryName: ['', Validators.required],
      description: ['', Validators.required],
      discount: [''],
      discountType: ['AMOUNT', Validators.required],
      maxDiscount: [''],
      index:['',Validators.required],
      maxRange: ['', Validators.required],
      minRange:  ['', Validators.required],
      advertisementDays: [''],
      lowestPriceTicketFree:[false]
    });

    this.accommodationForm = this.formBuilder.group({
      // allowedMembers: [''],
      // availableRooms: [''],
      description: ['', Validators.required],
      name: ['', Validators.required],
      profilePicture: [''],
      accommodationUrl:['']
    });

    this.participationConfigForm = this.formBuilder.group({
      maxAge: ['', Validators.required],
      minAge: ['', Validators.required],
      maxParticipation: ['', Validators.required],
      minParticipation: ['', Validators.required],
      startDate:['',Validators.required],
      endDate:['',Validators.required],
      maxDurationOfPerformance:['',Validators.required]

    });

    this.foodForm = this.formBuilder.group({
      foodName:['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.freeFoodForm = this.formBuilder.group({
      foodName:['', Validators.required],
      description: ['', Validators.required],
      default: ['', Validators.required]
    });


    this.newVendorForm = this.formBuilder.group({
      arenaImage: [''],
      description: ['', Validators.required],
      discount: [''],
      discountType: ['TICKET', Validators.required],
      endDateTime: ['', Validators.required],
      maxDiscount:  [''],
      memberAllowed:  [''],
      name:  ['', Validators.required],
      price:  ['', Validators.required],
      startDateTime:  ['', Validators.required],
      length:['',Validators.required],
      breadth: ['',Validators.required],
      featureList:['',Validators.required]
    });

    this.parkingForm = this.formBuilder.group({
      title:['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      defaultParking :[''],
      totalSlots : ['',Validators.required]
    });

  }

  // editorConfig = {
  //   "editable": true,
  //   "spellcheck": true,
  //   "height": "auto",
  //   "minHeight": "250px",
  //   "width": "auto",
  //   "minWidth": "0",
  //   "translate": "yes",
  //   "enableToolbar": true,
  //   "showToolbar": true,
  //   "placeholder": "Enter text here...",
  //   "imageEndPoint": "",
  //   "toolbar": [
  //       ["bold", "italic", "underline"],
  //       [{ 'header': 1 }, { 'header': 2 }],

  //       ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
  //       // ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
  //       ["orderedList", "unorderedList"],
  //       // ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
  //       ["link" ]

  //   ]
  // };

  ngOnInit() {
    this.editors1 = new Editor();
    this.editors = new Editor();
    this.editor = new Editor();
    this.paymentType();
    this.donationType();

    this.priceList();
    this.donationList();
    this.vendorList();
    this.sponsorList();
    this.accommodationList();
    this.configurationList();
    this.getEventDetail();
    this.foodList();
    this. newVendorList();
    this. parkingList();
    this.selectedOption = "TICKET";
    this.saveSubscription = this.save.subscribe(()=>{

      this.register['sponsor_list']=this.sponsor_list
      this.register['donation_list']=this.donation_list
      this.pricingChange.emit();
        this.completed.emit();
    });
  }


  resetPricing(){
    this.editId='';
    this.pricingForm.reset();
  }
  submitPricing()
  {
    localStorage.setItem('RegStartDate',this.eventDetail['startDateTime'])
    let flag = false
    let arr=[]
    let ageflag=false
    let ageInfo
    let errorMsg;
    console.log("arr",arr)
    if(this.eventDetail['eventConfigurations']['registrationType']  == 'AGE'){
      this.pricingForm.patchValue({
        seatType:null,
      });
      this.pricingForm.patchValue({
        amount:"null",
      });
    };
    // if(this.eventDetail['eventConfigurations']['registrationType'] == 'CATEGORY'){
    //   this.pricingForm.patchValue({
    //     minAge:0,
    //     maxAge:0
    //   });
    // };

    console.log(this.pricingForm.value)
    if (this.pricingForm.valid) {
      if (new Date(this.pricingForm.value.startDateTime) <= new Date(this.pricingForm.value.endDateTime)) {
        if(this.pricingForm.value.capacity >= this.pricingForm.value.allocated){

          ['allowMember', 'allowNonMember', 'allowLifeMember', 'allowAssociateMember', 'allowSeniorMember'].forEach((controlName) => {
            if (this.pricingForm.value[controlName] === null) {
              this.pricingForm.patchValue({ [controlName]: false });
            }
          });

            this.ageList.forEach(element => {
              console.log(element)
              if((element.price==undefined || element.price=="")&& this.eventDetail['eventConfigurations']['registrationType']=='AGE'){
                flag=true
                errorMsg ="Please enter amount";
              }
              else{
                flag =false
              }
              console.log(element.minAge,element.maxAge)
              if(element.minAge<element.maxAge){
                ageflag=false
              }
              else{
                ageflag=true
                console.log(element)
                ageInfo=element
              }
              console.log(flag)

            //  arr.push({minAge:element.minAge,maxAge:element.maxAge})

              // arr.forEach(e=> {
              //   console.log(e.minAge,element.minAge,e.maxAge,element.maxAge)
              //   if(element.minAge>e.minAge && element.maxAge<e.maxAge)
              //   {
              //     ageflag=true
              //     return ageflag
              //   }
              // });
              // console.log("age flag",ageflag)
            });
          if(this.allewSeatCat ==true) {
            this.seatList.forEach(element => {
              console.log(element.end, this.pricingForm.value.capacity)
              if (element.name != "" && element.start != "" && element.end != "") {
                if (element.start > element.end) {
                  flag = true;
                  errorMsg = "Please enter valid Seat number";
                } else if (element.end > this.pricingForm.value.capacity) {
                  flag = true;
                  errorMsg = "Please enter valid Seat range";
                } else {
                  flag = false;
                }
              } else {
                flag = true;
                errorMsg = "Please enter seat selection details ";
              }
            });
          }
          console.log("sfds",flag);


          if(flag==false){
           if(ageflag==false){
          if(this.pricingForm.value.allowMember == true || this.pricingForm.value.allowNonMember == true)
          {
          let formval = this.pricingForm.value;
              formval['ageRules'] = this.ageList;
              formval['seatRequests'] = this.seatList;
              formval['seatIds'] =this.seatsId;
              formval['eventId'] = this.eventId;
              formval['registrationType']=this.eventDetail['eventConfigurations']['registrationType'];
              formval['color'] = this.colorCode;
              let data = {};
              if(this.editId != '' && this.editType =='ticket')
              {
                 data = {
                  path: "event/eventRule/"+this.editId,
                  data: formval,
                  isAuth: true
                };
              }else
              {
                 data = {
                  path: "event/eventRule/",
                  data: formval,
                  isAuth: true
                };
              }

        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            this.submitBtn = true;
            this.allewSeatCat = false;
            this.seatList=[{
              name:"",
              start:"",
              end:"",
              totalSeats:0,
            }];
            this.seatsId =[];
            this.pricingForm.reset();
            this.priceList();
            this.paymentType();
            this.editId = '';
            this.editType = '';

          }

          else {
            this.toastrService.error(response['status']['description']);
            this.submitBtn = false;
          }

        });
          }
          else{
            this.toastrService.error("Please check member,nonmember or both")
          }
      }
      else{
        this.toastrService.error(ageInfo.name+":"+"age is already use")
      }
      }

       else{
         this.toastrService.error(errorMsg)
       }


          // if(this.userDetailsRequireValue == true) {
          //   this.pricingForm.value.userDetailsRequired=true;
          // }
          // else {
          //   this.pricingForm.value.userDetailsRequired=false;
          // }

      }else {
        this.toastrService.error("Invalid number of reserved seats!");
        this.submitBtn= false;
      }
     }
      else {
        this.toastrService.error("Please add valid date & time !");
        this.submitBtn= false;
      }
    }else
    {
      this.toastrService.error("Please fill all required fields!");
      this.submitBtn= false;
    }

  }
  submitAgePricing()
  {
    let formval = {};
    formval['ageRulePriceList'] = this.ageList;

    let data = {
      path: "event/ageTicket/" + this.eventId,
      data: formval,
      isAuth: true
    }

    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.priceList();
        this.paymentType();
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }
  resetDonation(){
    this.editId='';
    this.donationForm.reset();
  }
  submitDonation()
  {
    this.submitDonationBtn = true;
    if (this.donationForm.valid) {
      if(Number(this.donationForm.value.maxRange) > Number(this.donationForm.value.minRange))
      {
        let result = this.donation_list.filter((item) => item.index == this.donationForm.value.index)
        if(this.donationForm.value.index >0){
          if(result != '' &&  this.editId == ''){
            this.submitDonationBtn = false;
            this.toastrService.error('This Priority Number already added');
          }else{
            this.submitDonationBtn = true;
          }
        }else{
          this.submitDonationBtn = false;
          this.toastrService.error('This Priority Number Not allowed');
        }
        let formData = this.donationForm.value;
        let range = {};
        range['min'] = this.donationForm.value.minRange;
        range['max'] = this.donationForm.value.maxRange;
        formData['range'] = range;
        formData['eventId'] = this.eventId;
        formData['donationType'] = "DONATION";
        if(formData['discountType'] == '')  { formData['discountType'] = null; }
        if(formData['discount'] == '')  { formData['discount'] = null; }
        if(formData['maxDiscount'] == '')  { formData['maxDiscount'] = null; }

        delete formData.minRange;
        delete formData.maxRange;
        this.donationForm.value.minRange = range['min'];
        this.donationForm.value.maxRange = range['max'];
        let data = {};
        if(this.submitDonationBtn == true){
        if(this.editId != '' && this.editType == 'donation'){
          data = {
            path: "event/sponsorshipCategory/"+this.editId,
            data: formData,
            isAuth: true
          };
        }else{
          data = {
            path: "event/sponsorshipCategory",
            data: formData,
            isAuth: true
          };
        }
        }

        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            this.submitDonationBtn = true;
            this.donationForm.reset();
            this.donationList();
            this.editId = '';
            this.editType = '';

          } else {
            this.toastrService.error(response['status']['description']);
            this.submitDonationBtn = false;
          }
        });
      }else {
        this.toastrService.error("Please add Valid Donation !");
        this.submitDonationBtn= false;
      }
      }else
      {
        this.toastrService.error("Please fill all required fields!");
        this.submitDonationBtn = false;
      }


  }
  resetVendor(){
    this.editId='';
    this.vendorForm.reset();
  }
  submitVendor(){
    if (this.vendorForm.valid) {
      if (new Date(this.vendorForm.value.startDateTime) <= new Date(this.vendorForm.value.endDateTime)) {
        let formval = this.vendorForm.value;
        formval['eventId'] = this.eventId;
        let data = {};
        if (this.editId != '' && this.editType == 'vendor') {
          data = {
            path: "event/vendorExpo/" + this.editId,
            data: formval,
            isAuth: true
          };
        } else {
          data = {
            path: "event/vendorExpo",
            data: formval,
            isAuth: true
          };
        }
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            this.submitVendorBtn = true;
            this.vendorForm.reset();
            this.mediaList = [];
            this.vendorList();
            this.editId = '';
            this.editType = '';

          } else {
            this.toastrService.error(response['status']['description']);
            this.submitVendorBtn = false;
          }
        });
      }else {
        this.toastrService.error("Please add valid time !");
        this.submitVendorBtn = false;
      }
    }else
    {
      this.toastrService.error("Please fill all required fields!");
      this.submitVendorBtn= false;
    }
  }
  resetSponsor(){
    this.editId='';
    this.sponsorForm.reset();
  }

  handleVendorTimeChange(event){
    let startDate = this.datePipe.transform(this.newVendorForm.value.startDateTime, 'yyyy-MM-dd:HH:mm');
    let endDate = this.datePipe.transform(event, 'yyyy-MM-dd:HH:mm');

    if(endDate < startDate){
      this.toastrService.error("End date should be greater than start date");
      this.newVendorForm.patchValue({endDateTime:""});
    }
  }

  handleDateChange(event){
    let startDate = this.datePipe.transform(this.participationConfigForm.value.startDate, 'yyyy-MM-dd:HH:mm');
    let endDate = this.datePipe.transform(event, 'yyyy-MM-dd:HH:mm');
    if(endDate < startDate){
      this.toastrService.error("End date should be greater than start date");
      this.participationConfigForm.patchValue({endDate:""});
    }
  }

  submitSponsor(){
    this.submitSponsorBtn = true;
    if (this.sponsorForm.valid) {
      if (Number(this.sponsorForm.value.minRange) <= Number(this.sponsorForm.value.maxRange)) {
        let result = this.sponsor_list.filter((item) => item.index == this.sponsorForm.value.index)
        if(this.sponsorForm.value.index >0){
        if(result !='' &&  this.editId==''){
          this.submitSponsorBtn = false;
          this.toastrService.error('This Priority Number already added');
          }else{
          this.submitSponsorBtn = true;
        }
        }else{
          this.submitSponsorBtn = false;
          this.toastrService.error('This Priority Number Not allowed');
        }

        let formData = this.sponsorForm.value;
        formData['eventId'] = this.eventId;
        formData['donationType'] = "SPONSOR";
        delete formData['maxUploadSize'];
        delete formData['sponsorAmount'];
        let range = {};
        range['min'] = this.sponsorForm.value.minRange;
        range['max'] = this.sponsorForm.value.maxRange;
        formData['range'] = range;
        if(formData['discountType'] == '')  { formData['discountType'] = null; }
        if(formData['discount'] == '')  { formData['discount'] = null; }
        if(formData['maxDiscount'] == '')  { formData['maxDiscount'] = null; }

        delete formData.minRange;
        delete formData.maxRange;
        this.sponsorForm.value.minRange= range['min'];
        this.sponsorForm.value.maxRange= range['max'];

        if(formData['advertisementDays'] == null || formData['advertisementDays'] == ''){
          formData['advertisementDays'] = -1;
        }

        let data = {};
        if(formData['discount']==0 && formData['discountType']!='NONE'){
          this.submitSponsorBtn=false
          this.toastrService.error("please add discount more than zero")
        }
        if(this.sponsorForm.value.discountType=='NONE'){
          this.sponsorForm.patchValue({
            discount:"0",
            discountType:"AMOUNT"

          })

        formData = this.sponsorForm.value;
        formData['eventId'] = this.eventId;
        formData['donationType'] = "SPONSOR";

        delete formData['maxUploadSize'];
        delete formData['sponsorAmount'];
        let range = {};
        range['min'] = this.sponsorForm.value.minRange;
        range['max'] = this.sponsorForm.value.maxRange;
        formData['range'] = range;

        if(formData['discountType'] == '')  { formData['discountType'] = null; }
        if(formData['discount'] == '')  { formData['discount'] = null; }
        if(formData['maxDiscount'] == '')  { formData['maxDiscount'] = null; }

        delete formData.minRange;
        delete formData.maxRange;
        this.sponsorForm.value.minRange= range['min'];
        this.sponsorForm.value.maxRange= range['max'];

        }
        if(this.submitSponsorBtn == true) {
          if (this.editId != '' && this.editType == 'sponsor') {
            data = {
              path: "event/sponsorshipCategory/" + this.editId,
              data: formData,
              isAuth: true
            };
          } else {
            data = {
              path: "event/sponsorshipCategory",
              data: formData,
              isAuth: true
            };
          }
        }
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            this.submitSponsorBtn = true;
            this.sponsorList();
            this.sponsorForm.reset();
            this.editId = '';
            this.editType = '';
          } else {
            this.toastrService.success(response['status']['description']);
            this.submitSponsorBtn = false;
          }
        });
      }else{
        this.toastrService.error("Please add valid amount !");
        this.submitSponsorBtn= false;
      }
    }else{
      this.toastrService.error("Please fill all required fields!");
      this.submitSponsorBtn = false;
    }
  }

  resetAccommodation(){
    this.editId='';
    this.accommodationForm.reset();
  }

  submitAccommodation(){
    if (this.accommodationForm.valid) {
      if(this.media_list.length==0)
      {
        this.accommodationForm.patchValue({
          profilePicture:""
        })
      }
      else{
        this.accommodationForm.patchValue({
          profilePicture: this.media_list[0]['responseData']['data']['imageUrl'],
        });
      }
      let formval = this.accommodationForm.value;
      let data = {};
      if (this.editId != '' && this.editType == 'accommodation') {
        data = {
          path: "event/accommodation/"+this.eventId +"/"+this.editId,
          data: formval,
          isAuth: true
        };
      } else {
         data = {
          path: "event/accommodation/"+this.eventId,
          data: formval,
          isAuth: true
        };
      }

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.submitAccommodationBtn = true;
          this.accommodationForm.reset();
          this.accommodationList();
          this.editId = '';
          this.editType = '';
          this.media_list= [];
        } else {
          this.toastrService.error(response['status']['description']);
          this.submitAccommodationBtn = false;
        }
      });
    }else
    {
      this.toastrService.error("Please fill all required fields!");
      this.submitAccommodationBtn= false;
    }
  }

  resetConfiguration(){
    this.participationConfigForm.reset();
  }

  submitConfiguration(){
    if (this.participationConfigForm.valid) {
      let data = {
        "allowedAge": {
          "max": this.participationConfigForm.value.maxAge,
          "min": this.participationConfigForm.value.minAge
        },
        "participation": {
          "max": this.participationConfigForm.value.maxParticipation,
          "min": this.participationConfigForm.value.minParticipation
        },
        "startDate":this.participationConfigForm.value.startDate,
        "endDate":this.participationConfigForm.value.endDate,
        "maxDurationOfPerformance":this.participationConfigForm.value.maxDurationOfPerformance
      }
      let request = {
        path: "event/participationConfig/"+this.eventId,
        data: data,
        isAuth: true
      }

      this.apiService.post(request).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.submitConfigBtn = true;
          // this.participationConfigForm.reset();
        } else {
          this.toastrService.error(response['status']['description']);
          this.submitConfigBtn = false;
        }
      });
    }else
    {
      this.toastrService.error("Please fill all required fields!");
      this.submitConfigBtn= false;
    }
  }
  paymentType(){

    let request = {
      path: "event/configuration/publicInfo",
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.ageList = response['data']['ageRules'];
      this.currency = response['data']['currency'];
    });
  }

  donationType(){
    let request = {
      path: "event/discountRuleType",
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.donationTypeList = response['data'];
      this.donationTypeList.push({name:'None',value:'NONE'})
      console.log(this.donationTypeList)
    });
  }

  priceList(){
    let request = {
      path: "event/eventRules/all/"+this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.price_list = response['data'];
      console.log("price List: ",this.price_list)
      this.register['ticket_list']  = this.price_list
    });
  }

  donationList(){
    let request = {
      path: 'event/getAllSponsorshipCategories/DONATION/'+this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.donation_list = response['data'];
      this.register['donation_list '] = this.donation_list
    });
  }

  vendorList(){
    let request = {
      path: 'event/getAllVendorExpo/'+this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.vendor_list = response['data'];
    });

  }
  sponsorList(){
    let request = {
      path: 'event/getAllSponsorshipCategories/SPONSOR/'+this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.sponsor_list = response['data'];
      console.log(this.configuration['allowSponsorship'])
     // this.pricing['sponsorList']=this.sponsor_list
     if(this.configuration['allowSponsorship']){
      this.register['sponsor_list']=this.sponsor_list
     }
      console.log("qwer",this.register['sponsor_list'])
    });
  }

  accommodationList(){
    let request = {
      path: 'event/accommodation/'+this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.accommodation_list = response['data'];
      this.register['accommodation_list']=this.accommodation_list
    });
  }

  parkingList(){
    let request = {
      path: 'event/eventParkingOptions/'+this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.parking_list = response['data'];
      this.register['parking_list']= this.parking_list
    });

  }

  configurationList(){
    let data = {
      path: "event/details/" + this.eventId,
      isAuth: true
    };
      this.apiService.get(data).subscribe(response => {
        this.userDetailsRequireValue= response['data']['eventConfigurations']['allowUserDetails'];
        if (response['status']['code'] === 'OK') {
          this.participationConfig = response['data']['participationConfig'];
          if(this.participationConfigForm != null){
            this.participationConfigForm.patchValue({
              maxAge: this.participationConfig['allowedAge']['max'],
              minAge: this.participationConfig['allowedAge']['min'],
              maxParticipation: this.participationConfig['participation']['max'],
              minParticipation: this.participationConfig['participation']['min'],
              startDate : this.participationConfig['startDate'],
              endDate : this.participationConfig['endDate'],
              maxDurationOfPerformance : this.participationConfig['maxDurationOfPerformance']
            })
          }
        }
        this.register['performance']=this.participationConfigForm.value
        console.log(this.register['performance'])
        this.getType=response['data']['eventConfigurations']['registrationType']
      });
  }
  
  foodList(){
    let request = {
      path: 'event/eventFoodOptions/'+this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.food_List = response['data'];
      this.register['food_list']=this.food_List
      console.log("foodlist ",this.food_List)
    });

  }

  newVendorList(){
    let request = {
      path: 'event/getAllVendorExpo/'+this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.vendor_list = response['data'];
      this.register['vendor_list']=this.vendor_list
    });

  }

  getEventDetail(){
    let data = {
      path: "event/details/" + this.eventId,
      isAuth: true
    };
    return new Promise((resolve) => {
      this.apiService.get(data).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.eventDetail = response['data'];
          if(this.eventDetail['eventConfigurations']['registrationType'] == 'AGE' && this.eventDetail['ageTicketRules']['ageRulePriceList']){
            this.ageList = this.eventDetail['ageTicketRules']['ageRulePriceList']
          }
        }
        resolve(null);
      });
    });
  }

   invalidUploadFile(){
    // this.notify.notifyUserError('Please upload vaild file');
      this.showError = 'only upload jpg or another specified image'
   }uploadclick(){
    this.showError = ''
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
    this.newVendorForm.patchValue({
      arenaImage: this.mediaList[0]['responseData']['data']['imageUrl'],
    });
  }
  queueComplete() {
    this.accommodationForm.patchValue({
      profilePicture: this.media_list[0]['responseData']['data']['imageUrl'],
    });
    console.log(this.accommodationForm.value.profilePicture)
  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
  edit(data,type)
  {

    this.editType = type;
    this.editId = data.id;
    if(type == 'ticket'){
      console.log("Data: ",data)
      this.pricingForm.patchValue({
        name: data.name,
        capacity: data.capacity,
        allocated: data.allocated,
        startDateTime: data.startDateTime,
        endDateTime:data.endDateTime,
        amount:data.amount,
        maxAge:data.maxAge,
        minAge:data.minAge,
        registrationType:data.registrationType,
        // userDetailsRequired:data.userDetailsRequired,
        seatType:data.seatType,
        allowMember:data.allowMember,
        allowNonMember:data.allowNonMember,
        allowLifeMember: data.allowLifeMember,
        allowAssociateMember: data.allowAssociateMember,
        allowSeniorMember: data.allowSeniorMember,
        allowSeatSelection: data.allowSeatSelection,
      });
      console.log(data.seats);
      this.colorCode = data.color
      this.ageList = data.ageRules;
      this.seatList = data.seats;
      this.allewSeatCat =data.allowSeatSelection;
      // this.lifemem=data.allowMember;
      // this.lifenonmem=data.allowNonMember
    }else if(type == 'donation'){
      this.donationForm.patchValue({
        categoryName:  data.categoryName,
        description:  data.description,
        discount:  data.discount,
        discountType: data.discountType,
        maxDiscount: data.maxDiscount,
        maxRange: data.range.max,
        index: data.index,
        minRange: data.range.min,
      });
    }
    else if(type == 'vendor')
    {
      this.vendorForm.patchValue({
       arenaImage:  data.arenaImage,
        description:  data.description,
        discount:  data.discount,
        discountType:  data.discountType,
        endDateTime:  data.endDateTime,
        maxDiscount:  data.maxDiscount,
        memberAllowed:  data.memberAllowed,
        name:  data.name,
        price:  data.price,
        startDateTime:  data.startDateTime,
      });
    let array = [];

      array.push(data.arenaImage);


    array.forEach((item, index) => {
      this.mediaList[index]=[];this.mediaList[index]['responseData'] = [];this.mediaList[index]['responseData']['data']= [];
      this.mediaList[index]['responseData']['data']['imageUrl'] = item;
    });

    }
    else if(type == 'accommodation')
    {
      this.accommodationForm.patchValue({
        //profilePicture:  data.profilePicture,
        description:  data.description,
        // allowedMembers:  data.allowedMembers,
        // availableRooms:data.availableRooms,
        name:  data.name,
        accommodationUrl:data.accommodationUrl
      });
      if(this.accommodationForm.value.profilePicture!="")
      {
      let array = [];
      array.push(data.profilePicture);
      array.forEach((item, index) => {
        this.media_list[index]=[];this.media_list[index]['responseData'] = [];this.media_list[index]['responseData']['data']= [];
        this.media_list[index]['responseData']['data']['imageUrl'] = item;
      });
    }
    }

    else if(type == 'sponsor')
    {
      this.changeSponDiscount=data.discountType
      this.sponsorForm.patchValue({
        categoryName: data.categoryName,
        description: data.description,
        discount: data.discount,
       discountType: data.discountType,
        maxDiscount: data.maxDiscount,
        maxRange: data.range.max,
        minRange:  data.range.min,
        index:  data.index,
        advertisementDays: data.advertisementDays,
        lowestPriceTicketFree:data.lowestPriceTicketFree
      });
      if(this.sponsorForm.value.discountType=='AMOUNT' && this.sponsorForm.value.discount == 0){
        this.sponsorForm.patchValue({
          discountType:'NONE'
        })
      }
    }
    else if(type == 'food')
    {
      this.foodForm.patchValue({
        foodName: data.foodName,
        price: data.price,
        description: data.description,
      });
    }

    else if(type == 'freefood')
    {
      this.freeFoodForm.patchValue({
        foodName: data.foodName,
        description: data.description,
        default: data.defaultFood
      });
    }
    else if(type == 'new-vendor')
    {
      this.f_List=this.newVendorForm.value.featureList
      this.newVendorForm.patchValue({
        //arenaImage:  data.arenaImage,
        description:  data.description,
        discount:  data.discount,
        discountType:  data.discountType,
        endDateTime:  data.endDateTime,
        maxDiscount:  data.maxDiscount,
        memberAllowed:  data.memberAllowed,
        name:  data.name,
        price:  data.price,
        startDateTime:  data.startDateTime,
        length: data.length ,
        breadth : data.breadth ,
        featureList : data.featureList

      });
      if(this.newVendorForm.value.arenaImage!="")
      {


    let array = [];
    array.push(data.arenaImage);
    array.forEach((item, index) => {
      this.mediaList[index]=[];this.mediaList[index]['responseData'] = [];this.mediaList[index]['responseData']['data']= [];
      this.mediaList[index]['responseData']['data']['imageUrl'] = item;
    });
  }
    }
    else if(type == 'parking')
    {
      this.parkingForm.patchValue({
        title: data.title,
        totalSlots:data.totalSlots,
        description: data.description,
        defaultParking: data.defaultParking,
        price: data.price
      });
    }
    window.scrollTo(0, 0);
  }
  delete(data,type)
  {
    if(type == 'ticket')
    {
      let request = {
        path: "event/eventRule/"+data.id,
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.priceList();
        }else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
    if(type == 'donation')
    {
      let request = {
        path: "event/sponsorshipCategory/"+data.id,
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.donationList();
        }else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
    if(type == 'vendor')
    {
      let request = {
        path: "event/sponsorshipCategory/"+data.id,
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.vendorList();
        }else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
    if(type == 'sponsor')
    {

      let request = {
        path: "event/sponsorshipCategory/"+data.id,
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.sponsorList();
        }else {
          this.toastrService.error(response['status']['description']);

        }
      });
    }
    if(type == 'accommodation')
    {
      let request = {
        path: "event/accommodation/"+this.eventId+"/"+data.id,
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.accommodationList();
        }else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
    if(type == 'food')
    {
      let request = {
        path: "event/food/"+this.eventId+"/"+data.id,
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.foodList();
        }else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
    if(type == 'freefood')
    {
      let request = {
        path: "event/food/"+this.eventId+"/"+data.id,
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.foodList();
        }else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
    if(type == 'vendorNew')
    {
      let request = {
        path: "event/vendorExpo/"+data.id,
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.vendorList();
        }else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
    if(type == 'parking')
    {
      let request = {
        path: "event/parking/"+this.eventId+"/"+data.id,
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.parkingList();
        }else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  onBlur(event){
    if(event.target.value !== '')
     event.target.value = parseFloat(event.target.value).toFixed(2)
    }



    submitFood()
  {

    if (this.foodForm.valid) {

      let data = {};
      let formval = this.foodForm.value;
      if (this.editId != '' && this.editType == 'food') {
        data = {
          path: "event/food/"+this.eventId +"/"+this.editId,
          data: formval,
          isAuth: true
        };
      } else {
         data = {
          path: "event/food/"+this.eventId,
          data: formval,
          isAuth: true
        };
      }

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.foodList();

          this.foodForm.reset();
          // for (let control in this.foodForm.controls) {
          //   this.foodForm.controls[control].setErrors(null);
          // }
          this.submitFoodBtn = true;
          this.editId = '';
          this.editType = '';
          this.media_list= [];

        } else {
          this.toastrService.error(response['status']['description']);
          this.submitFoodBtn = false;
        }
      });
    }else
    {
      this.toastrService.error("Please fill all required fields!");
      this.submitFoodBtn= false;
    }
  }

  checkDef() {
    if(this.freeFoodForm.value.default==true) {
      if(this.count<2){
        this.storeDefault=false;

        this.count=this.count+1;

      }
      else {
        this.storeDefault=true;

      }

    }
  }



  submitFreeFood()
  {
    if (this.freeFoodForm.valid) {
       let data = {};
       let formval ={};
       this.checkDef();

       formval['description'] = this.freeFoodForm.value.description;
       formval['foodName'] = this.freeFoodForm.value.foodName;
       formval['defaultFood'] = this.freeFoodForm.value.default;

       if(this.storeDefault==true && this.freeFoodForm.value.default==true) {
        Swal.fire({
          title: 'Default Food is Already set',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel'
        })
        //  alert("default already set !!");

         formval['defaultFood'] = false;

       }


      if (this.editId != '' && this.editType == 'food') {
        data = {
          path: "event/food/"+this.eventId +"/"+this.editId,
          data: formval,
          isAuth: true
        };
      } else {
         data = {
          path: "event/food/"+this.eventId,
          data: formval,
          isAuth: true
        };
      }

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.foodList();
          this.submitFreeFoodBtn = true;
          this.freeFoodForm.reset();
          this.editId = '';
          this.editType = '';
          this.media_list= [];
        } else {
          this.toastrService.error(response['status']['description']);
          this.submitFreeFoodBtn = false;
        }
      });
    }else
    {
      this.toastrService.error("Please fill all required fields!");
      this.submitFreeFoodBtn= false;
    }
  }



  submitNewVendor()
  {

    if (this.newVendorForm.valid) {
      if (new Date(this.newVendorForm.value.startDateTime) <= new Date(this.newVendorForm.value.endDateTime)) {

          // this.f_List=this.newVendorForm.value.featureList;

        if(this.mediaList.length==0)
        {
          this.newVendorForm.patchValue({
            arenaImage:null
          })
        }
        else{
          this.newVendorForm.patchValue({
            arenaImage: this.mediaList[0]['responseData']['data']['imageUrl'],
          });
        }

       this.f_List=[this.newVendorForm.value.featureList]
        this.newVendorForm.patchValue({
          featureList: this.f_List,
        });
        this.newVendorForm.value.featureList= [].concat.apply([], this.newVendorForm.value.featureList)
        // this.newVendorForm.value.featureList=[this.f_List];
        let formval = this.newVendorForm.value;

        formval['eventId'] = this.eventId;

        let data = {};
        if (this.editId != '' && this.editType == 'new-vendor') {
          data = {
            path: "event/vendorExpo/" + this.editId,
            data: formval,
            isAuth: true
          };
        } else {
          data = {
            path: "event/vendorExpo",
            data: formval,
            isAuth: true
          };
        }
        this.apiService.post(data).subscribe(response => {
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            this.submitNewVendorBtn = true;
            this.newVendorForm.reset();
            this.mediaList = [];
            this.vendorList();
            this.editId = '';
            this.editType = '';
            // this.f_List = [];
            // this.newVendorForm.value.featureList=[];


          } else {
            this.toastrService.error(response['status']['description']);
            this.submitNewVendorBtn = false;
          }
        });
      }else {
        this.toastrService.error("Please add valid date & time !");
        this.submitNewVendorBtn = false;
      }
    }else
    {
      this.toastrService.error("Please fill all required fields!");
      this.submitNewVendorBtn= false;
    }
  }


  doSomething(e){

    this.changeOption=e.value;


  }
  changeSponsorDis(e){
    console.log(e)
    this.changeSponDiscount=e.value
    if(this.changeSponDiscount=='NONE'){

    }
  }
  getRadioValue(e) {
    this.radioOption=e.value;

  }

  changeTicketDis(){
    console.log(this.sponsorForm.get('lowestPriceTicketFree').value);
  }




  myTabSelectedTabChange(changeEvent: MatTabChangeEvent,title) {
    this.submitFoodBtn=true;
    this.submitNewVendorBtn = true;
    this.submitBtn = true;
    this.submitDonationBtn = true;
    this.submitVendorBtn = true;
    this.submitSponsorBtn = true;
    this.submitAccommodationBtn = true;
    this.submitFoodBtn = true;
    this.submitConfigBtn = true;
    this.submitFreeFoodBtn = true;
    this.submitParkingBtn = true;
    this.register['sponsorbtn']= this.submitSponsorBtn

 }

  submitParking(){
    // console.log("parking ",this.configuration['allowParking']);
    // console.log("paid ",this.configuration['paidParking']);
      if(this.configuration['allowParking']==true && this.configuration['paidParking']==false)
      {
        this.parkingForm.patchValue({
          price:0
        });


        // this.parkingForm.value.price = 0 ;

      }

    if (this.parkingForm.valid) {

      let data = {};
      let formval = this.parkingForm.value;
      if (this.editId != '' && this.editType == 'parking') {
        data = {
          path: "event/parking/"+this.eventId +"/"+this.editId,
          data: formval,
          isAuth: true
        };
      } else {
         data = {
          path: "event/parking/"+this.eventId,
          data: formval,
          isAuth: true
        };
      }

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this. parkingList();
          this.submitParkingBtn = true;
          this.parkingForm.reset();
          this.editId = '';
          this.editType = '';
          this.media_list= [];
        } else {
          this.toastrService.error(response['status']['description']);
          this.submitParkingBtn = false;
        }
      });
    }else
    {
      this.toastrService.error("Please fill all required fields!");
      this.submitParkingBtn= false;
    }
  }

  addSeatDynamicField(){
    this.seatList.push({
      name:"",
      start:"",
      end:"",totalSeats:0,})
  }

  addDynamicField(index, cate) {
  this.ageList.push({name:"",
  minAge:"",
  maxAge:"",
  amount:""})
  }

  removeLastOption(i) {
    this.ageList.splice(i,1)
  }

  removeSeatLastOption(i,seat){
    console.log(seat);
    this.seatsId.push(seat.seatId)
    this.seatList.splice(i,1)
  }

  changeValue(value){
    this.ageList.map((item) => {
            return {
              name: item.name,
              minAge: item.minAge,
              maxAge: item.maxAge,

              price:item.price
            };
          });

  }
  
  changeSeatValue(value) {
    console.log(value);
    let total =0;
    if(value.end!="" && value.start!="") {
      total = parseInt(value.end) - parseInt(value.start)
      total = total + 1;
    }
    if(Number.isNaN(total)){
      console.log("fg");
      value.totalSeats =0;
    }else{
      value.totalSeats  = total;
    }
    console.log("asd",total,value.totalSeats)
    this.seatList.map((item) => {
      console.log(item);
      return {
        name: item.name,
        start: item.start,
        end: item.end,
        totalSeats:item.totalSeats
      };
    });
    console.log("foram",this.seatList);
    let totalCapacity =0;
    this.seatList.forEach(element => {
      totalCapacity += element.totalSeats;
    })

    this.pricingForm.patchValue({
      capacity:totalCapacity,
    });
  }

  showSeatCat(event){
    this.allewSeatCat = event.checked;
    console.log(this.allewSeatCat);

  }
}


