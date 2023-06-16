import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {configuration} from '../../../../configration';
import {ApiService} from '../../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss']
})
export class AddTicketComponent implements OnInit, OnDestroy {

  @Input() eventId = "";

  @Input() userDetail = [];
  @Input() eventRules = [];

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();

  @Output() finalDetailChange: EventEmitter<any> = new EventEmitter();
  @Output() checkedMembersChange: EventEmitter<any> = new EventEmitter();
  userData: any = [];
  familyData: any = [];
  guestData: any = [];
  @Input() allUser: any = [];
  age: number;
  ageLabel: string = '';
  checkedMember: any = [];
  seatingCategoryId: any = null;
  postData: any = {};
  finalData: any = [];
  totalEntry: any;
  isChecked: boolean = false;
  status: boolean = false;

  constructor(private apiService: ApiService, private toastrService: ToastrService) {
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

  _checkedMembers: any;

  @Input()
  get checkedMembers() {
    return this._checkedMembers;
  }

  set checkedMembers(value) {
    this._checkedMembers = value;
    this.checkedMembersChange.emit(value);
  }

  ngOnInit() {
    if (this.checkedMembers.length != 0) {
      this.allUser.map(t => {
        t.checked = false;
        return t
      });
      this.guestData.map(t => {
        t.checked = false;
        return t
      });
      this.checkedMember = this.checkedMembers;
      this.checkedMembers.forEach((item, index) => {
        let i = this.allUser.findIndex(u => u.id == item.id);
        if (i != -1) {

          this.allUser[i]['checked'] = true;
          let j = this.allUser[i]['ageRules'].findIndex(a => a.id == item.eventRuleId);
          if (j != -1) {
            this.allUser[i]['ageRules'].map(t => {
              t.checked = false;
              return t
            });
            this.allUser[i]['ageRules'][j]['checked'] = true;
          }
        } else {
          let i = this.guestData.findIndex(u => u.id == item.id);
          if (i != -1) {

            this.guestData[i]['checked'] = true;
            let j = this.guestData[i]['ageRules'].findIndex(a => a.id == item.eventRuleId);
            if (j != -1) {
              this.guestData[i]['ageRules'].map(t => {
                t.checked = false;
                return t
              });
              this.guestData[i]['ageRules'][j]['checked'] = true;
            }
          }
        }
      });
      this.feesCalculation();
    }
    this.guestData = this.userDetail['guests'];
    this.saveSubscription = this.save.subscribe(() => {
      this.feesCalculation();
      if (this.status == true) {
        this.finalDetailChange.emit(this.finalData);
        this.checkedMembersChange.emit(this.checkedMember);
        this.checkedMembersChange.emit(this.checkedMember);
        this.completed.emit();
      }

    });

  }

  calculateAge(event, birthYear) {
    this.age = configuration.calculateAge(birthYear);

    this.eventRules.forEach(item => {
      item.ageRules.forEach((ageRule) => {
        let minAge = ageRule.minAge;
        let maxAge = ageRule.maxAge;
        if (this.age >= minAge && this.age <= maxAge)
          this.ageLabel = ageRule.name;
      })
    });
  }

  feesCalculation(type = '', event = [], id = '', detail = []) {
    if (type == 'fee') {
      if (event['checked'] == true) {
        let age = configuration.calculateAge(detail['birthYear']);
        let rule = detail['eventRuleId'];
        if (rule == undefined) {
          rule = null;
        }
        this.checkedMember.push({
          'id': id,
          'age': age,
          'detail': detail,
          'selectedFoodNames': {},
          'selectedFoods': {},
          'eventRuleId': rule,
          'seatNumber': '',
          'seatingCategoryName': '',
          'seat': [],
          'seatCategoryId': null
        });
      } else {
        this.checkedMember = this.checkedMember.filter(item => item.id !== id);
      }
      let totalSelectedMember = this.checkedMember.length;
    }
    let tempArr = [];
    this.checkedMember.forEach(item => {
      tempArr.push({
        "age": item.age,
        "eventRuleId": item.eventRuleId,
        "selectedFoodNames": item.selectedFoodNames,
      });
    });
    this.postData['eventId'] = this.eventId;
    this.postData['type'] = 'USER';
    this.postData['registrations'] = tempArr;
    let data = {
      path: "event/calculateAmount/",
      data: this.postData,
      isAuth: true
    };

    this.apiService.post(data).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.finalData = response['data'];
        this.finalDetailChange.emit(this.finalData);
        this.checkedMembersChange.emit(this.checkedMember);

        this.status = true;
      } else {
        this.toastrService.error(response['status']['description']);
        this.checkedMember = this.checkedMember.filter(item => item.id !== id);
        detail['checked'] = false;
        this.status = false;
      }
    });

  }

  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }

  changeRule(event, user) {
    user['eventRuleId'] = event;
    let index = this.checkedMember.findIndex(item => item.id == user.id);
    if (index != -1) {
      this.checkedMember[index]['eventRuleId'] = event;
      this.feesCalculation();
    }

  }
}
