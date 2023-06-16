import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class MenuService  {
  menuItems(arg0: string, menuItems: any) {
    throw new Error('Method not implemented.');
  }
  menus:any=[];
  communityDetail:any = [];
  currentMenu = 'Dashboard';
  profileDetail:any=[];
 
  constructor(public apiService: ApiService,) {
    this.getMenus();
    this.setProfile();
  }

  setProfile()
  {
     console.log("aaaaa",this.profileDetail)
     
    let userDetail = JSON.parse(localStorage.getItem("authDetail"));
    this.profileDetail = JSON.parse(localStorage.getItem("authDetail"));
    if (userDetail) {
     
      if (userDetail.profilePictureUrl == null || userDetail.profilePictureUrl == '') {
        this.profileDetail['profileShow'] = false;
        this.profileDetail['profileUrl'] = userDetail.firstName[0] + "" + userDetail.lastName[0];
      } else {
        this.profileDetail['profileShow'] = true;
        this.profileDetail['profileUrl']  = userDetail.profilePictureUrl;
      }
    }

   
  
  }
  getMenus() {
    let data = {
      path: "uiPermission/menuByRole/MAIN_SIDE_MENU",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.menus = response['data']['menuItems'];
      this.menus.map((item)=>{
        item['active'] = false
      });
      localStorage.setItem('menu', JSON.stringify(this.menus ));
      
    });
  }
}
