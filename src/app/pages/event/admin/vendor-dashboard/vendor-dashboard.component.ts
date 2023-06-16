import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss']
})
export class VendorDashboardComponent implements OnInit {

  sideMenuLarge: boolean = true;
  constructor() { }

  ngOnInit() {
  }

  collapsButton() {
    if (this.sideMenuLarge == true) {
      this.sideMenuLarge = false;
    } else {
      this.sideMenuLarge = true;
    }
  }

}
