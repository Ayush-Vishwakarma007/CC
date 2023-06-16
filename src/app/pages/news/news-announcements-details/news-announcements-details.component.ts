import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../services/api.service';
import {DomSanitizer} from '@angular/platform-browser'
import {PipeTransform, Pipe} from "@angular/core";
import {SpinnerService} from "../../../services/spinner.service";

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-news-announcements-details',
  templateUrl: './news-announcements-details.component.html',
  styleUrls: ['./news-announcements-details.component.scss']
})
export class NewsAnnouncementsDetailsComponent implements OnInit {

  newdId = '';
  newsDetail: any = [];

  constructor(private route: ActivatedRoute, public spinner: SpinnerService, private apiService: ApiService) {
    this.route.params.subscribe(params =>
      this.newdId = params['string']
    );
    this.getNewsDetail();
  }

  ngOnInit(): void {

  }

  getNewsDetail() {
    this.spinner.show();
    let request = {
      path: "news/details/" + this.newdId,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      this.newsDetail = response['data'];
      console.log(response)
      this.spinner.hide();
    });
  }

}
