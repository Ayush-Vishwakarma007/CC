import {ApplicationRef, Injectable, NgZone} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  stack:number = 0;
  constructor(public spinner:NgxSpinnerService,public ngZone:NgZone) { }

  show(){
    this.ngZone.run(()=>{
      // if(this.stack != 0){
      //   this.stack++;
      //   return;
      // }
      this.spinner.show();
      this.stack++;
    });
  }

  hide(){
    this.ngZone.run(()=> {
      // if(this.stack != 1){
      //   this.stack--;
      //   return;
      // }
      this.spinner.hide();
      this.stack--;
    });
  }
}
