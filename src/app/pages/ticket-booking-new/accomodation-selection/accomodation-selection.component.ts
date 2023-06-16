import { Component, OnInit, Input, Output,
  EventEmitter, } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { Subject, Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-accomodation-selection",
  templateUrl: "./accomodation-selection.component.html",
  styleUrls: ["./accomodation-selection.component.scss"],
})
export class AccomodationSelectionComponent implements OnInit {
  @Input() eventId: string;
  @Output() completenext: EventEmitter<any> = new EventEmitter();
  @Output() skipvalue: EventEmitter<any> = new EventEmitter();
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() registerArraychange: EventEmitter<any> = new EventEmitter();
  _register: any;
  @Input()
  get register() {
    return this._register;
  }

  set register(value) {
    this._register = value;
    this.registerArraychange.emit(value);
  }
  accomodationForm: FormGroup;
  storeAccomodationDetail: any = [];
  accomodationContent: any = []
  category :any=[]
  price:any
  total:any
  accomodationDetail:any=[]
 store:any=[]

  constructor(
    private formBuilder: FormBuilder,
    public apiService: ApiService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getAccomodation();
    this.accomodationForm = this.formBuilder.group({
      numberOfGuest: [""],
      guestCno: [""],
     
    });
    this.saveSubscription = this.save.subscribe(() => {
      
      this.submit()
      
       this.completenext.emit()
     
    })
  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
  getAccomodation() {
    let data = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(data).subscribe((response) => {
      this.accomodationContent = response["data"]["accommodations"];
     
      if (this.register["accommodationsRequest"] != undefined) {
      
        this.register["accommodationsRequest"].forEach(element => {
          
          this.accomodationContent.forEach(item => {
            
            if(element.accommodationId==item.id)
            {
            item.numberOfGuest=element.guestCount
            item.guestCno =element.contactNo
          
            }
          });
        });
      }
      
    });
   
  }
  submit() {
  
    
    this.accomodationContent.forEach(element => {
      this.accomodationDetail.push({ accommodationId: element.id, guestCount:  element.numberOfGuest,contactNo:element.guestCno });  
    });
   
      this.accomodationDetail= this.accomodationDetail.filter(function (element) {
        return element.guestCount != undefined;
      });
    this.register["accommodationsRequest"]=this.accomodationDetail
   
    
    

  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
  mychange(val, category, i) {
  let tempArr=[]
  this.store=category

  
   
    //this.storeAccomodationDetail.push(category);
    //this.calculateAmount();
  
  }
 
  skip(){
    this.register["accommodationsRequest"]=[]
    this.skipvalue.emit(true)
  }
}
