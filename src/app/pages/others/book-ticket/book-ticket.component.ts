import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from '../../../services/api.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-book-ticket',
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.scss']
})
export class BookTicketComponent implements OnInit {

  step: any = [
    {stepNo: 1, name: "Add Ticket", step: "ADD_TICKET", class: "addticket-icon"},
    {stepNo: 2, name: "Food Selection", step: "FOOD_SELECTION", class: "food-selection-icon"},
    {stepNo: 3, name: "Payment & Summary", step: "PAYMENT", class: "payment-summary-icon"}
  ];
  submitBasic: boolean = false;
  activeTabName: any;
  eventId = '';
  lastStep = '';
  eventRules: any=[];
  allUser: any;
  showModal: boolean = true;

  userDetail: any = [];
  eventDetail: any = [];
  submitSubject: Subject<any> = new Subject();
  totalAmountArray: any = [];
  totalAmount: any = [];
  checkedMembers: any = [];
  selectedMember: any = [];
  foodOptions: any = [];
  paymentDetail: any = [];
  paymentArray: any = [];
  status: boolean = false;

  constructor(private toastrService: ToastrService, private router: Router, private route: ActivatedRoute, private apiService: ApiService) {

    this.route.params.subscribe(params =>
      this.eventId = params['string']
    );
    if (this.eventId != undefined) {
      this.getPriceList();
      this.getUserDetail();
      this.getFoodOption();

    }

  }

  ngOnInit() {
    this.getStep();
    this.getEventDetail();
    this.activeTabName = this.step[0]['step'];
    let s = this.step.length;
    this.lastStep = this.step[s - 1]['step'];
  }

  getStep() {
    this.activeTabName = this.step[0]['step'];
    let s = this.step.length;
    this.lastStep = this.step[s - 1]['step'];
  }

  openActiveTab(tabName) {
    this.nextBackActiveTab(tabName, 'current');
  }

  nextBackActiveTab(currentTabName, type) {
    if (this.step[0]['step'] == currentTabName && type == 'back') {
      this.router.navigate(['event-detail/' + this.eventId]);
      return false;
    }
    if (this.selectedMember.length == 0 && this.paymentArray['type'] != 'donate') {
      this.toastrService.error('Select any Category First!');
    } else {
      let step;
      this.step.filter(function (entry, index) {
        if (entry.step == currentTabName) {
          step = index;
        }
      });
      if (type == 'next') {
        step = step + 1;
        if (this.paymentArray['type'] == 'donate') {
          this.paymentArray['type'] = '';
          step = 0;
        }
      } else if (type == 'back') {
        step = step - 1;
        if (this.paymentArray['type'] == 'donate') {
          this.paymentArray['type'] = '';
          step = 0;
        }
      }

      this.step.forEach((item, index) => {
        if (this.activeTabName == item['step']) {
          this.step[index]['active'] = true;
        }
      });
      if (step >= 0 && step < this.step.length) {
        let tab;
        tab = this.step[step]['step'];
        this.activeTabName = tab;
      }
      if (type == 'finish') {
        if (this.paymentDetail['paymentMethodUsed'] == undefined || this.paymentDetail['paymentMethodUsed'] == '') {
          this.toastrService.error('Select Payment Method');
        } else {
          if (this.paymentArray['type'] == 'donate') {
            let detail = {
              "amount": this.paymentArray['finalAmount'],
              "categoryId": this.paymentArray['category']['id'],
              "eventId": this.eventId
            };
            let data = {
              path: "event/sponsorship/request",
              data: detail,
              isAuth: true
            };
            this.apiService.post(data).subscribe(response => {
              if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
                this.toastrService.success(response['status']['description']);
                this.nextBackActiveTab(this.step[0]['step'], 'current');
              } else {
                this.toastrService.error(response['status']['description']);
              }
            });
          } else {
            let tempArr = [];
            this.checkedMembers.forEach(item => {

              tempArr.push({
                "age": item.age,
                "eventRuleId": item.eventRuleId,
                "selectedFoods": item['selectedFoodNames'],
              });
            });
            let detail = {};
            detail['eventId'] = this.eventId;
            detail['registrations'] = tempArr;
            detail['role'] = 'USER';
            detail['paymentMethodUsed'] = this.paymentDetail['paymentMethodUsed'];
            detail["sponsorshipCategoryId"] = null;
            detail["sponsorshipDiscount"] = true;
            let data = {
              path: "event/event/registration/",
              data: detail,
              isAuth: true
            };
            this.apiService.post(data).subscribe(response => {
              if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
                this.toastrService.success(response['status']['description']);
                if (this.eventDetail.eventConfigurations.freeEvent == true)
                {
                  this.router.navigate(['event-detail/' + this.eventId]);
                  return false;
                }else {
                  window.location.href = response['data']['url'];
                }
              } else {
                this.toastrService.error(response['status']['description']);
              }
            });
          }

        }
      }
    }
  }

  getEventDetail() {
    let request = {
      path: "event/details/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.eventDetail = response['data'];
      if (this.eventDetail.venueType == 'ONLINE') {
       this.step.splice(1,1);
      }
    });
  }

  getPriceList() {
    let request = {
      path: "event/eventRules/" + this.eventId,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.eventRules = response['data'];
      this.eventRules.forEach((item, index) => {
        item.checked = false;
        // if (index == 0) {
        //   item.checked = true;
        //   console.log(item);
        // }
      });
    });
  }

  getUserDetail() {
    let data = {
      path: "auth/user/getUserDetail",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.allUser = response['data']['familyMembers'].concat(response['data']['user']);
      this.allUser.forEach(item => {
        item['ageRules'] = this.eventRules;
      });
      response['data']['guests'].forEach(item => {
        item['ageRules'] = this.eventRules;
      });
      this.userDetail = response['data'];
      this.status = true;
    });
  }

  getFoodOption() {
    let data = {
      path: "event/eventFoodOptions/" + this.eventId,
      isAuth: true
    };
    this.apiService.get(data).subscribe(response => {
      this.foodOptions = response['data'];
    });
  }

  completeStep() {
    this.totalAmountArray['totalAgeFees'] = this.totalAmount['totalAgeFees'];
    this.selectedMember = [];
    if (this.checkedMembers.length != 0) {
      this.checkedMembers.forEach(item => {
        this.selectedMember.push(item);
      })
    }
    this.paymentArray['finalAmount'] = this.totalAmount['finalAmount'];
    this.paymentArray['successfulPayment'] = this.totalAmount['successfulPayment'];
    this.paymentArray['display'] = [];

    let tax = [];
    tax['name'] = 'Taxes';
    tax['value'] = this.totalAmount['tax'];
    tax['info'] = false;
    tax['description'] = '';

    let food = [];

    food['name'] = 'Food Fees';
    food['value'] = this.totalAmount['totalFoodFees'];
    food['info'] = false;
    food['description'] = '';

    let amount = [];
    amount['name'] = 'Age Fees';
    amount['value'] = this.totalAmount['totalAgeFees'];
    amount['info'] = false;
    amount['description'] = '';


    this.paymentArray['display'].push(amount);
    this.paymentArray['display'].push(food);
    this.paymentArray['display'].push(tax);

    this.paymentArray['category'] = this.totalAmount['category'];
    this.paymentArray['amount'] = this.totalAmount['amount'];

    this.nextBackActiveTab(this.activeTabName, 'next');
  }

  completepayment() {
    this.paymentArray['finalAmount'] = this.totalAmount['finalAmount'];
    this.paymentArray['successfulPayment'] = this.totalAmount['successfulPayment'];
    this.paymentArray['display'] = [];

    let tax = [];
    tax['name'] = 'Taxes';
    tax['value'] = this.totalAmount['tax'];
    tax['info'] = false;
    tax['description'] = '';

    let amount = [];

    if (this.totalAmount['type'] == 'donate') {
      amount['name'] = this.totalAmount['category']['categoryName'];
      amount['value'] = this.totalAmount['amount'];
      amount['info'] = true;
      amount['description'] = '';
    }
    this.paymentArray['display'].push(amount);
    this.paymentArray['display'].push(tax);
    this.paymentArray['type'] = this.totalAmount['type'];
    this.paymentArray['category'] = this.totalAmount['category'];
    this.paymentArray['amount'] = this.totalAmount['amount'];

    this.nextBackActiveTab('PAYMENT', 'current');
  }

}
