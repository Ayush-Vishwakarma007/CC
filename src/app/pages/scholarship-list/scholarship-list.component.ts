import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scholarship-list',
  templateUrl: './scholarship-list.component.html',
  styleUrls: ['./scholarship-list.component.scss']
})
export class ScholarshipListComponent implements OnInit {
  listType = 'card';
  constructor() { }

  ngOnInit() {
  }
  changeList(type) {
    this.listType = type;
    // this.memberData();
  }
}
