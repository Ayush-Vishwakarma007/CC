import { Component, Input, OnInit } from '@angular/core';
import { Subject, Subscription, interval  } from "rxjs";
@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.scss']
})
export class CountDownComponent implements OnInit {

  constructor() { }
  @Input() time:Subject<any>;
  datasubscription: Subscription;
  dDay:any=[];
  public dateNow = new Date();
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  display:boolean=false
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;
  getTime:any=[]
  public timeDifference:any=[];
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;
  getArray:any=[]
  ngOnInit() {
    this.datasubscription = this.time.subscribe((array) => {
      array.forEach((element,index) => {
        this.getTime.push(element.startDateTime);
        this.display=true
        array[index]['newDate']=(new Date(element.startDateTime));
      });
      this.getArray=array
      });
      
     this.datasubscription = interval(100).subscribe(x => { this.getTimeDifference(); });
     console.log(this.display, this.getArray)
  }

  
  ngOnDestroy() {
    this.datasubscription.unsubscribe();
}

private getTimeDifference () {
  
  this.getArray.forEach(element => {
let date=( Math.floor((new Date(element.newDate).getTime() - new  Date().getTime())/1000)) 
this.dhms(date);
  });;
  //this.allocateTimeUnits(this.timeDifference);
  

}

private allocateTimeUnits (timeDifference) {
  this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
  this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
  this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
  this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
}

dhms(t) {
  console.log("time diff",t)
  this.daysToDday = Math.floor(t / 86400);
  t -= this.daysToDday * 86400;
  this.hoursToDday = Math.floor(t / 3600) % 24;
  t -= this.hoursToDday * 3600;
  this.minutesToDday = Math.floor(t / 60) % 60;
  t -= this.minutesToDday * 60;
  this.secondsToDday = t % 60;
 
}

}
