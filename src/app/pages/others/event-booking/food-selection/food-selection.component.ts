import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import { ActivatedRoute, Router } from "@angular/router";
import { configuration } from "../../../../configration";
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-food-selection',
  templateUrl: './food-selection.component.html',
  styleUrls: ['./food-selection.component.scss']
})
export class FoodSelectionComponent implements OnInit,OnDestroy {

  isShow = false;
  @Input() eventId = "";
  @Input() foodOptions: any = [];
  @Input() selectedMember: any = [];

  foodList: any = [];
  finalData: any = [];
  checkedMember: any = [];
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  postData: any = {};
  totalEntry: any;

  @Output() finalDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() checkedMembersChange: EventEmitter<any> = new EventEmitter();
  _checkedMembers: any;

  @Input()
  get checkedMembers() {
    return this._checkedMembers;
  }

  set checkedMembers(value) {
    this._checkedMembers = value;
    this.checkedMembersChange.emit(value);
  }

  _finalDetail: any;

  @Input()
  get finalDetail() {
    return this._finalDetail;
  }

  set finalDetail(value) {
    this._finalDetail = value;
    this.finalDetailChange.emit(value);
  }
  constructor(private apiService: ApiService, private toastrService: ToastrService) {
    this.foodList.forEach(item => {
      item.count = 0;
      item.totalPrice = '';
    });
  }

  ngOnInit() {

    this.foodList = this.foodOptions;
    this.foodList.map(t => {
      t.count = 0;
      t.totalPrice= 0;
      return t
    });
    this.selectedMember.map(s => {
      s.selectedFood = [];
      return s
    });
    this.postData['eventId'] = this.eventId;
    this.postData['role'] = "USER";
    this.saveSubscription = this.save.subscribe(() => {
      this.checkedMembersChange.emit(this.checkedMembers);
      this.completed.emit();
    });
  }

  saveCheckedMember(event, member, i) {

    this.checkedMember = member;
    if (event.source.checked) {
      this.foodList.forEach(item => {
        if(this.checkedMembers[i]['selectedFoodNames'][item.foodName] == '' ||
          this.checkedMembers[i]['selectedFoodNames'][item.foodName] == undefined)
        {
          item.count = 0;
          item.totalPrice = 0;
        }else
        {
          item.count = this.checkedMembers[i]['selectedFoodNames'][item.foodName];
          this.incrementFoodItem(item,false);
        }
        //item.count = this.checkedMember[i]['selectedFood'].filter((j,index) =>{index== item.foodName});
      });
    }
  }
  decrementFoodItem(food) {
    if (this.checkedMember != '') {
      if (!food['count']) {
        food['count'] = 0;
        food['totalPrice'] = 0;
      }
      food['count'] = food['count'] - 1;
      food['totalPrice'] = food['count'] * food['price'];
      let data = [];
      data[food['foodName']] = food['count'];
      this.checkedMember['selectedFoodNames'][food['foodName']] = food['count'];
      if( food['count'] == 0)
      {
        delete  this.checkedMember['selectedFoodNames'][food['foodName']];
      }
      this.checkedMember['selectedFoods'] =  this.checkedMember['selectedFoods'];
      this.feesCalculation('decrement',food['foodName']);
    }
    else { this.toastrService.error('Select Member First.!'); }
  }

  incrementFoodItem(food,status = true) {
        if (this.checkedMember != '') {
          if (!food['count']) {
            food['count'] = 0;
            food['totalPrice'] = 0;
          }
          if(status == true)
          {
            food['count'] = food['count'] + 1;
          }

          food['totalPrice'] = food['count'] * food['price'];
          let data = [];
          data[food['foodName']] = food['count'];
          this.checkedMember['selectedFoodNames'][food['foodName']] = food['count'];
          if( food['count'] == 0)
          {
            delete  this.checkedMember['selectedFoodNames'][food['foodName']];
          }
          this.checkedMember['selectedFoods'] =  this.checkedMember['selectedFoodNames'];
          this.feesCalculation('increment',food);
        }
        else { this.toastrService.error('Select Member First.!'); }

  }

  feesCalculation(status = "",food = []) {
    let tempArr = [];
    this.checkedMembers.forEach(item => {
      tempArr.push({
        "age": item.age,
        "eventRuleId": item.eventRuleId,
        "selectedFoods":item['selectedFoodNames'],
      });
    });

    this.postData['registrations'] = tempArr;
    let data = {
      path: "event/calculateAmount/",
      data: this.postData,
      isAuth: true
    };

    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.finalData = response['data'];
        this.totalEntry = 0;
        this.finalData['userAgeFees'].forEach(item => {
          this.totalEntry = this.totalEntry + item['members'];
        });
        this.finalData = response['data'];
        this.finalDetailChange.emit(this.finalData);
        this.checkedMembersChange.emit(this.checkedMembers);
      //  this.completed.emit();
      } else {
        if(status == 'increment')
        {
          food['count'] = food['count'] -1;
          this.checkedMember['selectedFoodNames'][food['foodName']] = this.checkedMember['selectedFoodNames'][food['foodName']]-1;

        }else if(status == 'decrement')
        {
          food['count'] = food['count']+1;

          this.checkedMember['selectedFoodNames'][food['foodName']] = this.checkedMember['selectedFoodNames'][food['foodName']] +1;
        }
        this.toastrService.error(response['status']['description']);
      }
    });
  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
}
