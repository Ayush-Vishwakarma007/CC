import { Injectable } from '@angular/core';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class NavbarToogleService {
  isClosed:boolean = false;
  constructor(public common:CommonService) {
    this.checkMobileOrNot();
  }

  checkMobileOrNot(){
    if(this.common.isServer){
      return;
    }
    if( navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ){
      this.isClosed=true;
    }
    else{
      this.isClosed=false;
    }
  }
  toggle(){
    this.isClosed = !this.isClosed;
  }
}
