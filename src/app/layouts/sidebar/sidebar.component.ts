import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {MenuModel, topMenu} from '../menus';
import {configuration} from '../../configration';
import {ADMIN, MEMBER, VENDOR} from '../../helpers/roles';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NavbarToogleService} from '../navbar-toogle.service';
import {ApiService} from '../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {MenuService} from "../../services/menu.service";
import {CommunityDetailsService} from "../../services/community-details.service";
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  topMenu: MenuModel[] = topMenu;
  configuration = configuration;

  showProfile: any;
  logoName: any;
  profilesrc: any;
  username: any;
  menus: any;
  isSticky: boolean = false;

  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() collapseMenuChange: EventEmitter<any> = new EventEmitter();
  @Output() profileShowChange: EventEmitter<any> = new EventEmitter();



  dashboardMenu: MenuModel = {
    icon: "mdi mdi-cart",
    title: 'Dashboard',
    allowRole: [ADMIN],
    activeOnRoutes: ['/dashboard'],
    link: '/dashboard',
  };
  logoutMenu: MenuModel = {
    icon: "mdi mdi-logout-variant",
    title: 'Logout',
    allowRole: [ADMIN, VENDOR, MEMBER],
    activeOnRoutes: [],
    link: '',
  };
  authDetail = JSON.parse(localStorage.getItem("authDetail"));
  isShow = false;
  urlPath:any;
  constructor(public route: ActivatedRoute,public communityService:CommunityDetailsService, public menuService: MenuService, public router: Router, public navbarService: NavbarToogleService, public apiService: ApiService, public toastrService: ToastrService, public common:CommonService) {

  }

  _collapseMenu: any;

  @Input()
  get collapseMenu() {
    return this._collapseMenu;
  }

  set collapseMenu(value) {
    this._collapseMenu = value;
    this.collapseMenuChange.emit(value);
  }
  _showProfileMenu: any;

  @Input()
  get showProfileMenu() {
    return this._showProfileMenu;
  }

  set showProfileMenu(value) {
    this._showProfileMenu = value;
    this.profileShowChange.emit(value);
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 50;
  }

  ngOnInit() {
    let u ='';
    this.route.url.subscribe(url => {
      if(url[1]){
        u = '/'+url[0]['path']+'/'+url[1]['path'];
        this.urlPath = url[1].path;
        this.activeMenu(u);
      }
    });
    let authDetail = JSON.parse(localStorage.getItem("authDetail"));
    if (authDetail) {
      this.getProfileDetail();
    }
    this.isShow = false;

    this.route.url.subscribe(url => {
      let path = url[0].path;
      if (path == 'profile') {
        this.showProfileMenu = true;

      }


    });

    this.menuService.menus.map((item, index) => {
      item['active'] = false
      if (item['link'] == this.router.url) {
        item['active'] = true
        this.menuService.currentMenu = item['iconClass'];
        this.isShow = true;
      }

      item['menuItems'].map((i) => {
        if (i['link'] == this.router.url) {
          i['active'] = true
          item['active'] = true
          this.menuService.currentMenu = item['iconClass'];
          this.isShow = true;
        }
        if(i['link']==u){
          i['active'] = true
          item['active'] = true
          this.menuService.currentMenu = item['iconClass'];
          this.isShow = true;
        }
      });
    });
    if (this.isShow == false) {
      setTimeout(() => {
        this.collapseMenu = false;
        this.changeCollapseMenu();
        this.route.url.subscribe(url => {
          let path = url[0].path;
          if (path == 'profile') {
            this.openProfile();
          }
         // console.log(path,this.showProfileMenu,this.collapseMenu);

        });
      }, 200);

    }

  }

  getProfileDetail() {
    let data = {
      path: "auth/user/getUserDetail",
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      if (response['data']['user']['profilePictureUrl'] == '' || response['data']['user']['profilePictureUrl'] == null) {
        this.showProfile = false;
      } else {
        this.showProfile = true;
      }

      this.logoName = response['data']['user']['firstName'][0] + "" + response['data']['user']['lastName'][0];
      this.profilesrc = response['data']['user']['profilePictureUrl'];
      this.username = response['data']['user']['firstName'] + " " + response['data']['user']['lastName'];

    });
  }

  canShow(menu: MenuModel) {

  }

  isActive(menu: MenuModel) {
  }

  logout() {
    this.apiService.logout();
    localStorage.removeItem('authDetail');
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
    localStorage.setItem('login','false');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  Logout() {
    this.toastrService.success("Logout Successfull");
    localStorage.removeItem('authDetail');
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  openPage(menu) {

  }

  showAlerts(): void {
    // For normal messages
    this.toastrService.info('this is an info alert');
    this.toastrService.error('this is a danger alert');
    this.toastrService.success('this is a success alert');
    this.toastrService.warning('this is a warning alert');

    // For html messages:
    // this.toastrService.warning({html: '<b>This message is bold</b>'});
  }

  alert() {
    this.toastrService.error('Notification Comming Soon!');
  }

  openMenu(i) {
    localStorage.removeItem("search")
    this.showProfileMenu = false;
    this.isShow = true;
    this.collapseMenu = false;
    this.menuService.menus.map((item) => {
      item['active'] = false
    });
    if (this.menuService.menus[i]['link']) {
      this.router.navigate([this.menuService.menus[i]['link']]);
    } else {
      if (this.menuService.menus[i]['menuItems'][0]) {
        this.router.navigate([this.menuService.menus[i]['menuItems'][0]['link']]);

      }

    }
    this.menuService.menus[i]['active'] = true;
  }

  openProfile() {
    this.showProfileMenu = true;
    this.collapseMenu = false;
  }

  changeCollapseMenu() {
    this.showProfileMenu = false;
    this.completed.emit();
  }

  linkActive(i, j: any,name:any='') {
    if(name != ''){      
    let tab  = name;
    localStorage.setItem('eventselect', tab);  
    }
   this.menuService.menus.map((item) => {
      item['menuItems'].map((i) => {
        i['active'] = false
        // console.log("000",i)
      });
    });
    this.isShow = true;
    if (j != undefined) {
      this.menuService.menus[i]['menuItems'][j]['active'] = true;
    }
     else {
      this.menuService.menus[i]['active'] = true;
    }
  }

  child:string;
  parent(data){
    this.child=data;
  }

  public doSomething():void {
    console.log('Picked date: ');
}

// getEventData(a){

//   let b= this.common.getData(a);
//   console.log("side ",b)

// }
activeMenu(url) {
  this.menuService.menus.map((item,index) => {
    item['menuItems'].map((i,j) => {
    //  console.log('path2',i['link'],url,i['link'] == url);
      if(i['link']==url){
       this.linkActive(index, j);
      }
    });
  });
}
}

