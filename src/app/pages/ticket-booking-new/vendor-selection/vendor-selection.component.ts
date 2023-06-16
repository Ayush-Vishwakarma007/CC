import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { SpinnerService } from "../../../services/spinner.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from "ngx-toastr";
import { SeoService } from "../../../services/seo.service";
import { Subject, Subscription } from "rxjs";
@Component({
  selector: "app-vendor-selection",
  templateUrl: "./vendor-selection.component.html",
  styleUrls: ["./vendor-selection.component.scss"],
})
export class VendorSelectionComponent implements OnInit {
  @Input() eventId: string;
  @Output() registerArraychange: EventEmitter<any> = new EventEmitter();
  @Output() skipvalue: EventEmitter<any> = new EventEmitter();
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() completenext: EventEmitter<any> = new EventEmitter();
  @Input() response: string;
  @Input() authDetail: any = [];
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  vendorDetail: any = [];
  defaultBooth: any;
  selectBooth: any;
  changeamt: any = [];
  _register: any = {};
  storeVendor: any = [];
  storevendorInfo: any = [];
  countMem: any
  //count:any
  @Input()
  get register() {
    return this._register;
  }

  set register(value) {
    this._register = value;
    this.registerArraychange.emit(value);
  }
  constructor(
    public spinner: SpinnerService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    public apiService: ApiService,
    private toastrService: ToastrService,
    private seo: SeoService
  ) { }
  ngOnInit() {

    this.saveSubscription = this.save.subscribe(() => {
      if (this.register["expoCategories"] == undefined) {
        this.toastrService.error("please select one booth");
      } else {
        if (this.response["status"] == 'ERROR') {
          this.toastrService.error(this.response["description"]);
        }
        else {
          this.completenext.emit();
        }

      }
    });
    this.getVendor();
  this.countMem=this.register['employeeCount']
    console.log("asd",this.selectBooth,this.changeamt);
  }
  getVendor() {

    let data = {
      path: "event/getAllVendorExpo/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(data).subscribe((response) => {
      this.vendorDetail = response["data"];
    });
    this.register["expoCategories"].filter((item, index) => {
      this.changeamt.push({
        price: item.price,
        discount: item.discount,
        description: item.description,
      });
     this.selectBooth=item.categoryId
    });
  }
  selected_Booth(event) {
    if(event.value!=undefined)
    {
    this.selectBooth = event.value;

      if( this.register["expoCategories"]!=undefined){
        this.changeAmount()
        this.storeVendor= this.storeVendor.map((item) => {
          //this.userState=item.userState
         console.log(item)
           return {
            categoryId:item.categoryId,
             count: this.countMem,
             name:item.name,
             price:item.price,
             discount:item.discount,
             description:item.description
             
            
           };
         });
         this.register["expoCategories"] = this.storeVendor;
        this.completed.emit();
      }
    }
  }
  mychange(count){
   
    this.countMem= count
    this.changeAmount()
    this.storeVendor= this.storeVendor.map((item) => {
      //this.userState=item.userState
     console.log(item)
       return {
        categoryId:item.categoryId,
         count: this.countMem,
         name:item.name,
         price:item.price,
         discount:item.discount,
         description:item.description
         
        
       };
     });
    // this.register['employeeCount']=this.countMem
    this.register["expoCategories"] = this.storeVendor;
    this.register["expoCategories"].forEach(element => {
      if(element.count!='' )
      {
        this.completed.emit();
      }
    });
   

  }
  changeAmount() {
    this.changeamt = [];
    this.storeVendor = [];
    this.vendorDetail.forEach((element) => {
      console.log(this.selectBooth,element.id)
      if (this.selectBooth == element.id) {
        this.changeamt.push({
          price: element.price,
          discount: element.discount,
          description: element.description,
        });
        this.storeVendor.push({ categoryId: element.id,name:element.name,price:element.price,discount:element.discount,description:element.description });
        console.log(this.storeVendor)
      }
    });
    /*this.storevendorInfo=[]
   this.authDetail["eventRuleId"]="",
    this.storevendorInfo.push(this.authDetail)
    console.log(this.storevendorInfo)*/
    this.register["ticket"] = this.storevendorInfo;
    this.register["registrations"] = this.storevendorInfo;
   
    this.register['employeeCount'] = this.countMem
    //this.completed.emit();
  }
  skip() {
    this.skipvalue.emit(true);
  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
}
