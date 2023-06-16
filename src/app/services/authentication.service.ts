import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public isLogin: boolean = false;

  constructor() { }

  CheckLoginSession() {
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    let isLogin = JSON.parse(localStorage.getItem("login"));
    if (authDetail) {
      if (isLogin == true) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    }
    else {
      this.isLogin = false;
    }
  }
}
