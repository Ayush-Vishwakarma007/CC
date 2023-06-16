import {Component, ElementRef} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {SpinnerService} from "./services/spinner.service";
import {MenuService} from "./services/menu.service";
import {CommunityDetailsService} from "./services/community-details.service";
import {SeoService} from "./services/seo.service";
import {LanguageService} from "./services/language.service";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "./services/api.service";
const MINUTES_UNITL_AUTO_LOGOUT = 300 // in mins
const CHECK_INTERVAL = 15000 // in ms
const STORE_KEY =  'lastAction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'saasoa-admin';
   show : boolean = true;
   onActivate(e, outlet){
    outlet.scrollTop = 0;
  }

  template: string = `<img src="../assets/images/loader.gif" class="p-center" alt=" " />`;
  constructor(public apiService: ApiService,  public menuService:MenuService,public communityService:CommunityDetailsService, private toastrService: ToastrService, private languageService : LanguageService, private router: Router, public spinner: SpinnerService, private elementRef:ElementRef) {
    this.check();
    this.initListener();
    this.initInterval();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
      this.communityService.getPermission();
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.spinner.show();
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.spinner.hide();
      }
    }, () => {
      this.spinner.hide();
    });

    let redirect = localStorage.getItem("cookies");
    if(redirect =='true')
    {
      this.show = false;
    }

    this.languageService.setInitialAppLanguage();

  }
  public getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY));
  }
  public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }
  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover',()=> this.reset());
    document.body.addEventListener('mouseout',() => this.reset());
    document.body.addEventListener('keydown',() => this.reset());
    document.body.addEventListener('keyup',() => this.reset());
    document.body.addEventListener('keypress',() => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    //if (isTimeout && this.auth.loggedIn)
    if (isTimeout)  {
      // alert('logout');
      //this.toastrService.error('Your session has been expired!');
      // code for redirect if session expired
      //this.apiService.logout();
      //this.router.navigate(['/']);
    }
  }
  setCookies()
  {
     localStorage.setItem("cookies",'true');
     this.show = false;
  }

  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'yourColor';
 }
}
