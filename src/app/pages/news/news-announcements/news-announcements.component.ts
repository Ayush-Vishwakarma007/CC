import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import {SeoService} from "../../../services/seo.service";

@Component({
  selector: 'app-news-announcements',
  templateUrl: './news-announcements.component.html',
  styleUrls: ['./news-announcements.component.css']
})
export class NewsAnnouncementsComponent implements OnInit {

  newsList: any = [];
  news: any = [];
  pageNumber = 0;
  pageSize = 6;
  chapter:any;
  ChapterId:any;

  constructor(private apiService: ApiService, private router: Router, private seo:SeoService,private route: ActivatedRoute) {
    this.route.params.subscribe(params =>{
      this.chapter = JSON.parse(localStorage.getItem('chapter'));
      //this.ChapterId = params['string']
      this.ChapterId = this.chapter.id;
    });
  }

  ngOnInit(): void {
    this.getAllNews();
    this.seo.generateTags({});
  }

  getAllNews() {
    let request = {
      path: "news/current/news?pageNumber=" + this.pageNumber + "&pageSize=" + this.pageSize+"&chapterId="+this.chapter.id,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.news = response['data'];
      this.newsList = response['data']['content'];
      
    });
   
  }

  pagination(type, current = null) {
    if (type == 'prev') {
      this.pageNumber = this.pageNumber - 1;
    } else if (type == 'current') {
      this.pageNumber = current;
    }
    else {
      this.pageNumber = this.pageNumber + 1;
    }
    this.getAllNews();
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }
}
