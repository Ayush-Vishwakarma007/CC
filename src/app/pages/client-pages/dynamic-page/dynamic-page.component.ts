import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {Gallery} from "@ngx-gallery/core";
import {ActivatedRoute, Router,NavigationEnd} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {galleryService} from "../../../services/gallery.service";
import {SpinnerService} from "../../../services/spinner.service";
import {DomSanitizer} from "@angular/platform-browser";
import { filter } from 'rxjs/operators';


@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
@Component({
  selector: 'app-dynamic-page',
  templateUrl: './dynamic-page.component.html',
  styleUrls: ['./dynamic-page.component.scss']
})
export class DynamicPageComponent implements OnInit {
  path:any = '';
  pageDetail:any=[];
  constructor(private route: ActivatedRoute, public router: Router, public apiService: ApiService,public spinner: SpinnerService) {
    this.router.events.subscribe((val) =>{
      if (val instanceof NavigationEnd ){
        this.path = val.url;
        this.getPageDetail();
      }
    });
    this.path = this.router.url;
    this.getPageDetail();
  }

  ngOnInit() {

  }
  getPageDetail()
  {
    this.path=  this.path.replace('/dynamic-page', '');
    let request = {
      path: "uiPermission/uiPage/path",
      data:{path:this.path },
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      this.pageDetail = response['data'];
    });
  }
}
