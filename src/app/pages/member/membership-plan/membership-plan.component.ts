import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {ApiService} from "../../../services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SeoService} from "../../../services/seo.service";
import {getSortHeaderNotContainedWithinSortError} from "@angular/material/sort/typings/sort-errors";

@Component({
  selector: 'app-membership-plan',
  templateUrl: './membership-plan.component.html',
  styleUrls: ['./membership-plan.component.scss']
})
export class MembershipPlanComponent implements OnInit {
  membershipDetail: any = [];
  userId = '';
  planType = '';
  currentArray: any = [];
  durationTypeList: any = [];
  checkArray: any = [];
  count=0;
  constructor(private toastrService: ToastrService, public apiService: ApiService, public router: Router, private route: ActivatedRoute, private seo: SeoService) {
    this.route.params.subscribe(params =>
      this.userId = params['id']
    );
  }

 async ngOnInit() {
   this.getMembershipList();
  }

  getMembershipList() {
    let request = {
      path: 'auth/membershipType/getAll',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.membershipDetail = response['data'];
      setTimeout(() => {
         this.getDurationType();
      }, 300);
    });
  }

  getDurationType() {
    let request = {
      path: 'auth/durationType',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.durationTypeList = response['data'];
        this.durationTypeList.forEach((type, t) => {
          this.durationTypeList[t]['count'] = false;
        });
        this.membershipDetail.forEach((item, index) => {
          item['plans'].forEach((i, j) => {
            this.durationTypeList.forEach((type, t) => {
              if (i['durationType'] == type['value']) {
                this.durationTypeList[t]['count'] = true;
              }
            });
          });
        });
        let isDefaultPlanSelected = false;
        this.durationTypeList.forEach((type, t) => {

          if(type['count'] == true)
          {
            this.count ++;
          }
          if(isDefaultPlanSelected){
            return;
          }
          // if(type['value'] == 'LIFETIME' && type['count'] == true){
          //   this.planType = 'LIFETIME';
          // }else if(type['value'] == 'YEAR' && type['count'] == true){
          //     this.planType = 'YEAR';
          // }else{
          //   this.planType = 'MONTH';
          // }
          if(type['count']){
            this.planType = type['value'];
            isDefaultPlanSelected = true;
          }
          console.log(type['count'],type['value'])

        });
        console.log(this.planType);
         this.membershipWithPlan();
        resolve();
      });
    });

  }

  membershipWithPlan() {
    this.currentArray = [];
    this.membershipDetail.forEach((item, index) => {
      item['plans'].forEach((i, j) => {
        if (i['durationType'] == this.planType) {
          item['currentPlan'] = i;
          this.currentArray.push(item);
        }
      });
    });
    let part = this.chunkArray(this.currentArray, 3)
    this.currentArray = part;
    this.currentArray.forEach((t, i) => {
      t.forEach((a) => {
        a.checked = false;
      });
    });
    console.log( this.membershipDetail)
  }

  chunkArray(myArray, chunk_size) {
    let results = [];

    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }

    return results;
  }

  changePlanType(list) {
    this.planType = list['value'];
    this.membershipWithPlan();
  }

  changeMembership(list) {
    this.currentArray.map((t, i) => {
      t.map((a) => {
        a.checked = false;
      });
    });
    this.checkArray = list;
    list['checked'] = true;
  }

  redirectPayment() {
    let list = this.checkArray;
    if (list.length != 0) {
      this.router.navigate(['/membership-checkout/new/' + list['currentPlan']['id']]);
    } else {
      this.toastrService.error('Please select membership plan');
    }

  }
}
