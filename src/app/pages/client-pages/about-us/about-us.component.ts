import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {CommunityDetailsService} from "../../../services/community-details.service";

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  aboutUs: any;
  chapter:any;
  showAboutUs:any;
  aboutUsDetails:any;
  constructor(private apiService: ApiService,public router: Router, public communityService:CommunityDetailsService) { }

  ngOnInit() {
    this.getAboutUs();
  }

  getAboutUs(){
    // let data = {
    //   "name":"ABOUT_US"
    // };
    // let request = {
    //   path: "uiPermission/content",
    //   data: data,
    //   isAuth: true,
    // };

    // this.apiService.post(request).subscribe(response => {
    //   this.aboutUs = response['data'][0]['content'];
    // });
    this.chapter = JSON.parse(localStorage.getItem("chapter"));
    console.log(this.chapter);
    this.showAboutUs = this.chapter['allowAboutUs'];
    this.aboutUsDetails = this.chapter['aboutUs'];
  }
  backToHome(){
    this.router.navigate(['/']);

  }
}
