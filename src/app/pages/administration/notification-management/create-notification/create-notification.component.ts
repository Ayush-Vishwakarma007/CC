import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import { SpinnerService } from '../../../../services/spinner.service';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.scss']
})
export class CreateNotificationComponent implements OnInit {

  showUser:boolean=false;
  step: any = [
    { stepNo: 1, name: "Basic Information", step: "BASIC_INFO", class: "icon-file" },
    { stepNo: 2, name: "Notification Filter", step: "FILTER", class: "icon-wallet numbericon" },
  ];

  templateStatus: boolean = false;
  submitConfig: BehaviorSubject<any> = new BehaviorSubject(null);
  submitSubject: Subject<any> = new Subject();
  activeTabName: any;
  lastStep = '';
  templateName: '';
  basicInfoId = '';
  submitBasic: boolean = false;
  basicInformation: any = [];
  notificationId = '';
  notificationDetail: any = [];
  filterDetail: any = [];
  communityFilter: any = [];
  eventFilter: any = [];
  isEdit: boolean = false;

  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, public toastrService: ToastrService) {
    this.route.params.subscribe(params =>
      this.notificationId = params['id']
    );
  }

  async ngOnInit() {
    window.scroll(0,0);
    this.activeTabName = this.step[0]['step'];
    let s = this.step.length;
    this.lastStep = this.step[s - 1]['step']
    if (this.notificationId != undefined) {
      await this.getNotificationDetail();
      this.submitBasic = true;
      this.isEdit = true;
    }
  }

  getNotificationDetail() {
    let request = {
      path: "notification/notification/details/" + this.notificationId,
      isAuth: true
    }
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          console.log(response['data'])
          this.notificationDetail = response['data'];
          this.basicInformation = this.notificationDetail;
          this.basicInfoId = this.notificationDetail['id'];
          this.filterDetail = this.notificationDetail['filter'];
          this.communityFilter = this.notificationDetail['communityFilter']
          this.eventFilter = this.notificationDetail['eventFilter']
          this.templateName = this.notificationDetail['notificationFilterType'];
          this.submitConfig.next(this.templateName);
        }
        else {
          this.toastrService.error(response['status']['description']);
        }
        resolve(null);
        window.scroll(0, 0);
      });
    });
  }

  completeConfig() {
    this.templateStatus = true;
  }

  openActiveTab(tabName) {
    this.nextBackActiveTab(tabName, 'current');
  }

  completeStep() {
    this.notificationId = this.basicInformation['id'];
    this.submitBasic = true;
    this.getNotificationDetail();
  }

  nextBackActiveTab(currentTabName, type) {
    if(this.showUser == true){
      this.showUser = false; return false;
    }
    setTimeout(() => {
      let step;
      this.step.filter(function (entry, index) {
        if (entry.step == currentTabName) {
          step = index;
        }
      });
      if (type == 'next') {
        step = step + 1;
      } else if (type == 'back') {
        step = step - 1;
      }
      if (step == -1) {
        this.templateStatus = false;
        this.submitConfig.next(this.templateName);
      }
      else {
        if (this.submitBasic == false) {
          this.toastrService.error('Save the Basic Information!')
        }
        else {
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
        }
      }
    }, 1000);
  }

  save() {
    this.submitSubject.next(null);
  }
}
