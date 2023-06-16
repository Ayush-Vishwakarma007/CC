import { Component, OnInit } from '@angular/core';
import { timeStamp } from 'console';
import { nextTick } from 'process';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-purchase-items',
  templateUrl: './purchase-items.component.html',
  styleUrls: ['./purchase-items.component.scss']
})
export class PurchaseItemsComponent implements OnInit {
  authDetail: any = [];
  showGuest:boolean=false
  activeTabName:any=''
  step:any=0
  submitSubject: Subject<any> = new Subject();
  constructor() { 
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
  }

  ngOnInit() {
  if(this.authDetail){
    this.showGuest=false
  }
  else{
    this.showGuest=true
  }
 
  }
  next(){
    this.submitSubject.next(null);
  }
  nextBackActiveTab(currentTabName, type){
    this.showGuest=false
    if(type=='next'){
      this.activeTabName=this.step+1
    }
    else {
      this.activeTabName=this.step-1
    }
  

  }
}
