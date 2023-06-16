// import { splitClasses } from "@angular/compiler";
import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  Output,
  EventEmitter,
} from "@angular/core";
// import { listener } from "@angular/core/src/render3";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  ValidationErrors,
} from "@angular/forms";
// import { element } from "protractor";
import { ApiService } from "../../../services/api.service";
import { Subject, Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { isObjectEmpty } from "ngx-bootstrap/chronos/utils/type-checks";
import { Console } from "console";
@Component({
  selector: "app-parking-selection",
  templateUrl: "./parking-selection.component.html",
  styleUrls: ["./parking-selection.component.scss"],
})
export class ParkingSelectionComponent implements OnInit {
  @Input() eventId: string;
  @Input() reqData: any = [];
  @Output() skipvalue: EventEmitter<any> = new EventEmitter();
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() completenext: EventEmitter<any> = new EventEmitter();
  @Output() registerArraychange: EventEmitter<any> = new EventEmitter();
  @Input() response: string;
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  _register: any = {};
  @Input()
  get register() {
   
    return this._register;
  }

  set register(value) {
    this._register = value;
  
    this.registerArraychange.emit(value);
  }
  parkingForm: FormGroup;
  storeParkingDetail: any = [];
  parkingCategory: any = [];
  storeResponse: any = [];
  price: any;
  total: any = 0;
  category: any = [];
  numberofVehicle: any;
  parkingStore: any = [];
  value: any;
  parking: any = [];
  availableSlot: any;
  constructor(
    private formBuilder: FormBuilder,
    public apiService: ApiService,
    private toastrService: ToastrService
  ) {
    this.parkingForm = this.formBuilder.group({
      numberVechile: [""],
    });
  }

  ngOnInit() {
   
    this.getParking();

    this.saveSubscription = this.save.subscribe(() => {
   
      //console.log("asasa", Object.keys(this.register["parking"]));
      if (
        this._register["parking"] == undefined ||
        Object.keys(this.register["parking"]).length == 0 ||
        this._register["parking"] == null
      ) {
        this.toastrService.error("Please enter number of vehicles ");
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
  getParking() {
    let data = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(data).subscribe((response) => {
      this.parkingCategory =
        response["data"]["eventConfigurations"]["parkingOptions"];
      
      if (this.register["parking"] != undefined) {
     
        this.parkingCategory.forEach((element, index) => {
          
          element.value = this.register["parking"][element.title];
        });

    
      }
    });
  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
  mychange(val, index, title) {
    let tempArr = {};
   
    this.reqData["eventId"] = this.eventId;
    this.parkingCategory.forEach((element, index) => {
      tempArr[element.title] = element.value;
      this.value = element.value;

      this.availableSlot = element.totalSlots;
    
      if (
        tempArr[element.title] == undefined ||
        tempArr[element.title] == null ||
        tempArr[element.title] == ""
      ) {
       
        delete tempArr[element.title];
      }



    });

    this._register["parking"] = tempArr;

    this.completed.emit();

  

  }

  skip() {
   
    this._register["parking"]={}

    this.completed.emit()
    this.skipvalue.emit(true);
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }



}
