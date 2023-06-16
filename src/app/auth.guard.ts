import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public router: Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let authDetail = JSON.parse(localStorage.getItem("authDetail"));
      let isLogin = JSON.parse(localStorage.getItem("login"));
      //console.log(authDetail);
      if (authDetail) {
          //console.log('true');
          return true;
          this.router.navigate(['/Profile']);
        } else {
          //console.log('false');
          this.router.navigate(['/']);
          return false;
        }
   // return true;
  }

}
