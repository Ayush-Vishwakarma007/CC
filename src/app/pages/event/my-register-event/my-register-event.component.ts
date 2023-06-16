import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import {CommunityDetailsService} from "../../../services/community-details.service";
@Component({
  selector: 'app-my-register-event',
  templateUrl: './my-register-event.component.html',
  styleUrls: ['./my-register-event.component.scss']
})
export class MyRegisterEventComponent implements OnInit {
  activeTab = 0;
  eventList: any = [];
  data: any = [];
  type = 'ongoing';
  chapterList: any = [];
  selectAllChapter: boolean = false;
  chapterIds: any = [];
  pagelimit:any=[]
  search=""
  constructor(private route: ActivatedRoute, public router: Router, private fb: FormBuilder, public apiService: ApiService, private toastrService: ToastrService,

    public communityService: CommunityDetailsService) {
    this.data = {
      "filter": {
        "search": "",
      },
      "page": {
        "pageLimit": this.communityService.pagelimit,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "DATE_TIME"
      }
    };
    this.route.params.subscribe(params => {
      if (params['type'] != undefined) {
        this.type = params['type'];
        if (this.type == 'ongoing') {
          this.activeTab = 0;
        }
        if (this.type == 'upcoming') {
          this.activeTab = 1;
        }
        if (this.type == 'past') {
          this.activeTab = 2;
        }
      }
    });
    this.onLoad(this.type);

  }

  async ngOnInit() {
    await this.getChapterList();
  }
  
  getChapterList() {
   
    let request = {
        path: "community/chapters",
        isAuth: true
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
    this.onLoad(this.type);
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
    this.onLoad(this.type);
  }

  onLoad(type = '') {
    if (type == 'ongoing') {
      this.data['filter'] = { 'eventTiming': 'ONGOING', "chapterIds" : this.chapterIds };
    }
    if (type == 'upcoming') {
      this.data['filter'] = { 'eventTiming': 'UPCOMING', "chapterIds" : this.chapterIds };
    }
    if (type == 'past') {
      this.data['filter'] = { 'eventTiming': 'PAST', "chapterIds" : this.chapterIds };

    }
    this.data['filter']['search']=this.search
    let request = {
      path: "event/myRegistered",
      data: this.data,
      isAuth: true,
    };

    this.apiService.post(request).subscribe(response => {
      this.eventList = response['data'];
    });

  }
  clearSearch(){
    this.search=""
    this.data['filter']['search']=this.search 
    this.onLoad()
  }
  selected_pagelimit(event) {
    this.pagelimit=event.value
    //console.log(this.pagelimit1)
    this.data.page.pageLimit= this.pagelimit;
    console.log(this.data.page.pageLimit)
    this.onLoad();

  }

  pagination(type, current = null) {
    if (type == 'prev') {
      this.data.page.pageNumber = this.data.page.pageNumber - 1;
    } else if (type == 'current') {
      this.data.page.pageNumber = current;
    } else {
      this.data.page.pageNumber = this.data.page.pageNumber + 1;
    }
    this.onLoad();
    document.getElementById("page_form").scrollIntoView();
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }

  //for changing pagination tab wise
  changeTab(data) {
    let tab = data.tab.textLabel;
    this.type = tab;
    if (tab == 'ongoing' || tab == 'upcoming' || tab == 'past' || tab == 'draft') {
      if(tab=='ongoing') {this.router.navigate(['/my-register-event/ongoing'])};
      if(tab=='upcoming') {this.router.navigate(['/my-register-event/upcoming'])};
      if(tab=='past') {this.router.navigate(['/my-register-event/past'])};
      
      this.data.page.pageNumber = 0;
      this.onLoad(tab);
    }
  }
}
