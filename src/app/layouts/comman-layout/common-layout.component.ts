import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {NavbarToogleService} from "../navbar-toogle.service";
import {ApiService} from "../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {CommunityDetailsService} from "../../services/community-details.service";
import {SeoService} from "../../services/seo.service";

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.scss']
})
export class CommonLayoutComponent implements OnInit {
  profilesrc: any;
  username: any;
  showProfile: boolean = false;
  menus:any= [];

  logoName:any;
  constructor(public router:Router,public communityService:CommunityDetailsService,public seo:SeoService,public navbarService:NavbarToogleService,public apiService: ApiService,private toastrService: ToastrService) {

  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    let isLogin = JSON.parse(localStorage.getItem("login"));
    if (authDetail) {
        this.getProfileDetail();
    }

  }
  showDiv(data)
  {

  }
  getMenus(){
    let data = {
      path: "uiPermission/menuByRole/HEADER",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.menus = response['data']['menuItems'];
      //console.log(this.menus);
    });

  }
  getProfileDetail() {

    let data = {
      path: "auth/user/getUserDetail",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {

      if(response['data']['user']['profilePictureUrl'] == '' || response['data']['user']['profilePictureUrl'] == null){
        this.showProfile = false;
      }else{
        this.showProfile = true;
      }

      this.logoName = response['data']['user']['firstName'][0] + "" + response['data']['user']['lastName'][0];
      this.profilesrc = response['data']['user']['profilePictureUrl'];
      this.username = response['data']['user']['firstName'] + " " + response['data']['user']['lastName'];
    });
  }
  Logout() {
    this.toastrService.success("Logout Successfull");
    localStorage.removeItem('authDetail');
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
    localStorage.removeItem('login');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cookies');
    localStorage.removeItem('showPopup');
    this.router.navigate(['/']);
  }
}
