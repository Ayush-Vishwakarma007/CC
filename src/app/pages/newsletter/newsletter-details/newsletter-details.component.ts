import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {DomSanitizer} from "@angular/platform-browser";
import {SpinnerService} from "../../../services/spinner.service";
import {ToastrService} from 'ngx-toastr';

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-newsletter-details',
  templateUrl: './newsletter-details.component.html',
  styleUrls: ['./newsletter-details.component.scss']
})
export class NewsletterDetailsComponent implements OnInit {

  newsLetterId = '';
  newsLetterDetail: any = [];

  constructor(private route: ActivatedRoute, public spinner: SpinnerService, private apiService: ApiService, private toastrService: ToastrService) {
    this.newsLetterDetail.template = '';
  }

  ngOnInit(): void {
    this.route.params.subscribe(params =>
      this.newsLetterId = params['id']
    );
    this.getNewsLetterDetail();
  }

  getNewsLetterDetail() {
    this.spinner.show();
    let request = {
      path: "notification/newsLetter/details/" + this.newsLetterId,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.spinner.hide();
        this.newsLetterDetail = response['data'];
      } else {
        this.toastrService.error(response['status']['description']);
        this.spinner.hide();
      }
    });
  }

}
