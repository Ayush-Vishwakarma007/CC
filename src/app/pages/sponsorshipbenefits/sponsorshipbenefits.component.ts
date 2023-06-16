import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sponsorshipbenefits',
  templateUrl: './sponsorshipbenefits.component.html',
  styleUrls: ['./sponsorshipbenefits.component.scss']
})
export class SponsorshipbenefitsComponent implements OnInit {
  chapter:any;
  constructor() { }

  ngOnInit() {
    this.chapter = JSON.parse(localStorage.getItem('chapter'));

  }

}
