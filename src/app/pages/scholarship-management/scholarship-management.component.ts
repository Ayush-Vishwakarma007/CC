import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scholarship-management',
  templateUrl: './scholarship-management.component.html',
  styleUrls: ['./scholarship-management.component.scss']
})
export class ScholarshipManagementComponent implements OnInit {

  step: any = [
    {stepNo: 1, name: "Basic Information", step: "BASIC_INFO", class: "icon-file"},
    {stepNo: 2, name: "Membership Number", step: "MEMBERSHIP_NUMBER", class: "icon-wallet numbericon"},
  ];
  activeTabName: any;
  constructor() { }

  
  // ngOnInit() {
  // }

  async ngOnInit() {
    this.activeTabName = this.step[0]['step'];
  }

  nextBackActiveTab(currentTabName, type) {
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
  openActiveTab(tabName) {
    this.nextBackActiveTab(tabName, 'current');
  }
}
