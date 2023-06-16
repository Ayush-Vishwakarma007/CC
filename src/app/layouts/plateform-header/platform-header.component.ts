import {Component, HostListener, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {CommunityDetailsService} from "../../services/community-details.service";
import {MenuService} from "../../services/menu.service";

@Component({
  selector: 'app-platform-header',
  templateUrl: './platform-header.component.html',
  styleUrls: ['./platform-header.component.scss']
})
export class PlatformHeaderComponent implements OnInit {

  menu: any[] = [];
  userDetail: any;
  profileShow:boolean = false;
  profileUrl:string;
  userPermisssion : any = [];
  isSticky: boolean = false;
  constructor(public apiService: ApiService,public menuService: MenuService,public communityService:CommunityDetailsService, public router: Router, public authService: AuthenticationService) {

  }
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 300;
  }
  ngOnInit(): void {
    this.communityService.init();
    this.authService.CheckLoginSession();
    this.getPermission();
    this.getMenus();

    let userDetail = JSON.parse(localStorage.getItem("authDetail"));

    if (userDetail) {
      if (userDetail.profilePictureUrl == null || userDetail.profilePictureUrl == '') {
        this.profileShow = false;
        this.profileUrl = userDetail.firstName[0]+""+userDetail.lastName[0];
      }else{
        this.profileShow = true;
        this.profileUrl = userDetail.profilePictureUrl;
      }
    }
  }

  logout() {
    this.apiService.logout();
    this.authService.CheckLoginSession();
    this.router.navigate(['/']);
  }
  getMenus() {
    let data = {
      path: "uiPermission/menuByRole/HEADER",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.menu = response['data']['menuItems'];
    });
  }
  getPermission() {
    let req = {
      path: 'uiPermission/getPermissionByRole',
      isAuth: true,
    };
    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.userPermisssion = [];
        response['data'].forEach((item, index) => {
          this.userPermisssion[item.name] = item;
        });
      } else {
      }
    });
  }

}
