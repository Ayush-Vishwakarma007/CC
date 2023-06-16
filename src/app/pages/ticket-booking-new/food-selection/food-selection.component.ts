import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { Subject, Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-food-selection",
  templateUrl: "./food-selection.component.html",
  styleUrls: ["./food-selection.component.scss"],
})
export class FoodSelectionComponent implements OnInit {
  @Input() eventId: string;
  @Input() reqData: any = [];
  @Output() foodDetail: EventEmitter<any> = new EventEmitter();
  @Output() summaryFoodChangevalue: EventEmitter<any> = new EventEmitter();
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() registerArraychange: EventEmitter<any> = new EventEmitter();
  @Output() completenext: EventEmitter<any> = new EventEmitter();
  @Output() skipvalue: EventEmitter<any> = new EventEmitter();
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

  foodcategory: any = [];
  numberGuest: any;
  category: any = [];
  storeFooddetail: any = [];
  price: any;
  total: any;

  count: any;

  constructor(
    public apiService: ApiService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getFood();
    this.saveSubscription = this.save.subscribe(() => {
     
      if (
        this.register["food"] == undefined ||
        Object.keys(this.register["food"]).length == 0 ||
        this.register["food"] == null
      ) {
        this.toastrService.error("Please enter number of food items");
      } else {
        this.completenext.emit();
      }
    });
  }
  getFood() {
    let data = {
      path: "event/eventFoodOptions/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(data).subscribe((response) => {
      this.foodcategory = response["data"];
     
      if (this.register["food"] != undefined) {
      
        this.foodcategory.forEach((element, index) => {
        
          element.value = this.register["food"][element.foodName];
        });
   
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
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
  mychange(val, category, i) {
    let tempArr = {};

    this.reqData["eventId"] = this.eventId;
    this.foodcategory.forEach((element, index) => {
      tempArr[element.foodName] = element.value;


      if (
        tempArr[element.foodName] == undefined ||
        tempArr[element.foodName] == null ||
        tempArr[element.foodName] == ""
      ) {
    
        delete tempArr[element.foodName];
      }
    });

    this.register["food"] = tempArr;

    
    this.completed.emit();

    
  }
  skip() {

    this.register["food"]={}
 
    this.completed.emit()
    this.skipvalue.emit(true);
  }


  calculateAmount() {
 

    let req = {
      path: "event/calculateAmount",
      isAuth: true,
      data: this.reqData,
    };

    this.apiService.post(req).subscribe((response) => {
     
      this.summaryFoodChangevalue.emit(response);
    });
  }
}
