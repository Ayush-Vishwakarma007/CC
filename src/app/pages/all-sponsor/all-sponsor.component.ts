import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {CommunityDetailsService} from "../../services/community-details.service";
import {SeoService} from "../../services/seo.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-all-sponsor',
  templateUrl: './all-sponsor.component.html',
  styleUrls: ['./all-sponsor.component.scss']
})
export class AllSponsorComponent implements OnInit {

  sponsorList:any=[];
  chapterId:any;
  constructor(private apiService: ApiService, public communityService: CommunityDetailsService, public seo: SeoService,
              public activate: ActivatedRoute, public router: Router,
              private change: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.activate.params.subscribe((params) => {
      this.chapterId = params['id'];
    })
    this.getsponsorList();
  }
  getsponsorList() {
    let data = {
      "chapterId": this.chapterId
    }

    let request = {
      path: "event/chapter/sponsors/active/getAll",
      data: data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      this.sponsorList = response['data'];
      this.sponsorList.forEach((item) => {
        item.sponsors.forEach((s) => {

          if (s.logo == null || s.logo == '') {
            s['profileShow'] = false;
            s['logo'] = s.displayName;
          } else {
            s['profileShow'] = true;
            s['logo'] = s.logo;
          }

        })
      })
    });
  }


}
