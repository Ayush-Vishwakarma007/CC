import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommunityDetailsService {

  public menu: any[];
  public logo: any;
  public thankYouImageLink: any;
  public communityDetail: any = [];
  public chapterList: any;
  public uiPermission: any = [];

  public isLoaded: boolean = false;
  public contactUsEmail: any;
  publicInfo: any = [];
  loadProviderData: Subject<any> = new Subject<any>();
  loadPermissionProviderData: Subject<any> = new Subject<any>();
  public pagelimit:any
  public pagelist:any=[]
  constructor(private apiService: ApiService,) {


    let communityDetail = JSON.parse(localStorage.getItem('communityDetail'))
    let menu = JSON.parse(localStorage.getItem('menu'))
    let uiPermission = JSON.parse(localStorage.getItem('uiPermission'))
    if (communityDetail) {
      this.communityDetail = communityDetail;
      this.chapterList = communityDetail['chapters'];
      this.logo = communityDetail['basicInformation'];

      // Set Dynamic Colors
      let link = document.getElementById('favIcon');
      this.setDynamicColor(this.communityDetail['basicInformation']["primaryColor"], this.communityDetail['basicInformation']["secondaryColor"])
      if (this.logo.favIcon) {
        link.setAttribute('href', this.logo.favIcon);
      }
    }
    if (menu) {
      this.menu = menu;
    }
    if (uiPermission) {
      this.uiPermission = uiPermission;
    }
    this.getPermission();
    this.getCommunityDetails();
    this.getPublicInfo();
    this.pageLimit()
  }


  init(cb?){
    if (!this.isLoaded) {
      this.isLoaded = true;
      // Call the API's
      this.getPermission();
      this.getCommunityDetails();
    }
  }


  getCommunityDetails() {
    let request = {
      path: "community/communityDetails",
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.communityDetail = response['data'];
        this.chapterList = response['data']['chapters'];
        let menuName = response['data']['basicInformation']['menuName'];
        this.logo = response['data']['basicInformation'];
        this.communityDetail.aboutBannerUrl = encodeURI(this.communityDetail.aboutCommunity.bannerUrl);
        this.getMenus(menuName);
        let communityDetail = JSON.parse(localStorage.getItem('communityDetail'))
        if (!communityDetail) {
          localStorage.setItem('chapter', JSON.stringify(this.chapterList[0]));
        }
        localStorage.setItem('communityDetail', JSON.stringify(this.communityDetail));

        let link = document.getElementById('favIcon');
        this.setDynamicColor(this.communityDetail['basicInformation']["primaryColor"], this.communityDetail['basicInformation']["secondaryColor"])
        if (this.logo.favIcon) {
          link.setAttribute('href', this.logo.favIcon);
        }
        this.loadProviderData.next(null);
        resolve(null);
      });
    });
  }

  getPublicInfo() {
    let request = {
      path: 'auth/configuration/publicInfo',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.publicInfo = response['data'];
    });
  }

  pageLimit(){
    let request = {
      path: 'community/configuration/pageFilterValue',

    };
    console.log(request)
    this.apiService.get(request).subscribe(response => {
      this.pagelimit = response['data'][0];
      
      
      this.pagelist=response['data']
      
     // console.log("fsf",this.pagefilterlist)
    });
   

  
  }


  setDynamicColor(primaryColor, secondaryColor) {
    let style = document.createElement("style");
    style.innerHTML = `:root{
      --primary-color: ${primaryColor['backgroundColorCode']};
      --secondary-color: ${secondaryColor['backgroundColorCode']};
      --red-light-main : ${primaryColor['foregroundColorCode']};
    }`;
    document.head.appendChild(style);
  }


  getMenus(menuName) {
    let data = {
      path: "uiPermission/menuByRole/" + menuName,
      isAuth: true
    };

    this.apiService.get(data).subscribe(response => {
      this.menu = response['data']['menuItems'];
      localStorage.setItem('menu', JSON.stringify(this.menu));

      //console.log(this.menuList);
    });
  }

  getPermission() {
    let req = {
      path: 'uiPermission/getPermissionByRole',
      isAuth: true,
    };
    this.apiService.get(req).subscribe(response => {
      // console.log('123',response);      
      if (response['status']['code'] == 'OK') {
        this.uiPermission = {};
        response['data'].forEach((item, index) => {
          this.uiPermission[item.name] = item;
        });
        localStorage.setItem('uiPermission', JSON.stringify(this.uiPermission));        
        this.loadPermissionProviderData.next(null);
      } else {
      }
    });
  }


}
