import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { timer } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-countdown',
  templateUrl: './ngx-countdown.component.html',
  styleUrls: ['./ngx-countdown.component.scss']
})
export class NgxCountdownComponent implements OnInit {

  @Input() interval: number;

  @Output() onComplete = new EventEmitter();

  public countdown: any[];

  private completed: boolean;

  constructor() { }

  ngOnInit() {

    this.countdown = this.getTime();
    const countdownObservable = timer(1000, 1000).subscribe(val => {
      this.manipulateInterval();
      this.countdown = this.getTime();
      if (this.interval === 0) {
        this.countdownCompleted();
      }
    });
  }

  private getTime():any[] {
    if (this.interval < 0) {
      this.interval = Math.abs(this.interval);
      this.completed = true;
    }
    const hours = Math.floor(this.interval / 3600);
    const minutes = Math.floor((this.interval - (hours * 3600)) / 60);
    const seconds = (this.interval - (hours * 3600) - (minutes * 60));
    let array=[];
    array['hours']=hours.toString().padStart(2, '0');
    array['minutes']=minutes.toString().padStart(2, '0');
    array['seconds']=seconds.toString().padStart(2, '0');
    //console.log(array)
    return array;
  }

  private manipulateInterval() {
    if (this.completed) {
      this.interval++;
    } else {
      this.interval--;
    }
  }

  countdownCompleted() {
    this.completed = true;
    this.onComplete.emit();
  }

}
