import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { NavbarToogleService } from "../navbar-toogle.service";
import { ApiService } from "../../services/api.service";
import { ToastrService } from 'ngx-toastr';
// import {MenuService} from "../../services/menu.service";
import { SeoService } from "../../services/seo.service";
import { CommunityDetailsService } from "../../services/community-details.service";
import { SidebarLayoutToggleService } from "../../services/sidebar-layout-toggle.service"
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { __values } from 'tslib';

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.scss']
})
export class SidebarLayoutComponent implements OnInit, OnDestroy {

  collapseMenu: boolean = false;
  authDetail: any = [];
  showProfileMenu: boolean = false;
  _cleanup$ = new Subject();

  constructor(public router: Router, public seo: SeoService, public communityService: CommunityDetailsService, private route: ActivatedRoute, public navbarService: NavbarToogleService, public apiService: ApiService, public toastrService: ToastrService, public sidebarService: SidebarLayoutToggleService) {
    this.authDetail = JSON.parse(localStorage.getItem("authDetail"));
    if (!this.authDetail) {
      this.collapseMenu = true;
    }
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });

    this.route.url.subscribe(url => {
      let path = url[0].path;
      if (path == 'create-event-new' ||
        path == 'edit-event-new' ||
        path == 'create-membership' ||
        path == 'create-membership-new' ||
        path == 'event-details' ||
        path == 'event-detail' ||
        path == 'create-newsletter' ||
        path == 'edit-newsletter' ||
        path == 'copy-newsletter' ||
        path == 'create-notification' ||
        path == 'edit-notification' ||
        path == 'membership-dashboard'
      ) {
        this.collapseMenu = true;
      }
      if (this.router.url == '/management/create-notification') {
        this.collapseMenu = true;
      }
      if (this.router.url == '/profile/' ||
        this.router.url == '/profile/Additional' ||
        this.router.url == '/profile/Family' ||
        this.router.url == '/profile/Guest'
      ) {

      }
    });
  }

  ngOnDestroy(): void {
    this._cleanup$.next(null);
    this._cleanup$.complete()
  }

  ngOnInit() {
    this.communityService.init();
    let isLogin = JSON.parse(localStorage.getItem("login"));

    this.sidebarService.collapseMenu.pipe(takeUntil(this._cleanup$)).subscribe((isCollapse) => {
      this.collapseMenu = isCollapse;
    });
    // let ExpriyTime =localStorage.getItem("ExpriyTime");
    // let currentTime =new Date().getHours();
    // if (parseInt(ExpriyTime) <= currentTime){
    //   this.toastrService.error('Your session has been expired');
    //   setTimeout(() => {
    //     this.Logout();
    //   },10000);
    // }
  }

  Logout() {
    this.toastrService.success("Logout Successfull");
    localStorage.removeItem('authDetail');
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
    localStorage.removeItem('login');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }
}
