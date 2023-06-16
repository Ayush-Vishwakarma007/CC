import { Component, HostListener, OnInit } from '@angular/core';
import { CommunityDetailsService } from "../../services/community-details.service";
import { MenuService } from "../../services/menu.service";
import { ApiService } from "../../services/api.service";
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  isSticky: boolean = false;

  constructor(public apiService: ApiService,public authService: AuthenticationService, public router: Router, public communityService:CommunityDetailsService,public menuService: MenuService,) {
    this.communityService.init();
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 50;
  }
  ngOnInit() {
    this.communityService.init();

  }
  logout() {

    this.apiService.logout();
    this.menuService.setProfile()
    this.authService.CheckLoginSession();
    this.router.navigate(['/']);

  }
}
