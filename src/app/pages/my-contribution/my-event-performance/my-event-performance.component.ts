import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {BsModalService} from "ngx-bootstrap/modal";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, Validators} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {SpinnerService} from "../../../services/spinner.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {EMAIL_PATTERN} from "../../../helpers/validations";

@Component({
  selector: 'app-my-event-performance',
  templateUrl: './my-event-performance.component.html',
  styleUrls: ['./my-event-performance.component.scss']
})
export class MyEventPerformanceComponent implements OnInit {
  eventDetail: any = [];
  eventId: any = '';
  performanceSubject: Subject<any> = new Subject();
  chapterList: any = [];
  selectAllChapter: boolean = false;
  chapterIds: any = [];
  search = ''
  currentTab=''
  constructor(private modalService: BsModalService, public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location) {
  }

  async ngOnInit() {
    await this.getChapterList();
    this.performanceSubject.next(null)
  }

  getChapterList() {
    let request = {
      path: 'community/chapters',
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.chapterList = response['data'];
        if (this.chapterList.length != 0) {
          let id = [];
          this.chapterList.map((item) => {
            id.push(item['id']);
          })
          this.getChapterDetail(id);
        }
      });
      resolve(null);
    });
  }

  getChapterDetail(ids) {
    this.chapterIds = [];
    if (ids.length == 0) {
      this.chapterIds = [this.chapterList[0]['id']];
      this.toastrService.error('At least one chapter must be selected.')
      return false;
    }
    if (ids.length == this.chapterList.length) {
      this.selectAllChapter = true;
    }
    else {
      this.selectAllChapter = false;
    }

    ids.forEach((item) => {
      this.chapterIds.push(item);
    })
  }

  selectAllChange(event) {
    if (event.checked) {
      this.selectAllChapter = true;
      let array = [];
      this.chapterList.forEach((item, index) => {
        array.push(item.id);
      });
      this.chapterIds = array
    } else {
      this.chapterIds = [this.chapterList[0]['id']];
      this.selectAllChapter = false;
    }
  }

}
