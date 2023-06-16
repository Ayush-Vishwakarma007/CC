import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ApiService } from "../../../services/api.service";
import { SpinnerService } from "../../../services/spinner.service";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from "@angular/router";
import {CommunityDetailsService} from "../../../services/community-details.service";

@Component({
  selector: 'app-my-chapter-sponsorship',
  templateUrl: './my-chapter-sponsorship.component.html',
  styleUrls: ['./my-chapter-sponsorship.component.scss']
})
export class MyChapterSponsorshipComponent implements OnInit {

  reqData: any = [];
  userList: any = [];
  totalUser = 0;
  editId = ''
  plan_list_donation: any = [];
  paymentType_list: any = [];
  isSubmit: boolean = false;
  chapterList: any = [];
  selectAllChapter: boolean = false;
  chapterIds: any = [];
  listType = 'table';
  search = '';
  pagelimit1:any=[]

  constructor(public Http: HttpClient, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router,
    public communityService: CommunityDetailsService) {

    this.reqData = {
      "filter": {
        "donationType": 'SPONSOR',
      },
      "page": {
        "pageLimit": this.communityService.pagelimit,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "DESC",
        "sortBy": "DATE"
      }
    };
   }

  async ngOnInit() {
    await this.getChapterList();
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
    this.memberData();
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
    this.memberData();
  }


  memberData(search = '') {
    this.reqData['filter']['chapterIds'] = this.chapterIds
    this.reqData['filter']['search'] = this.search
    if(search != ''){
      this.reqData['page']['pageNumber'] = 0
    }

    let req = {
      path: "event/chapter/sponsorship/self",
      data: this.reqData,
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.post(req).subscribe(response => {
      this.userList = response['data'];
      console.log(this.userList)
      this.userList['content'].forEach((item, index) => {
        if (item.firstName) {
          if (item.profilePictureUrl == null || item.profilePictureUrl == '') {
            item['profileShow'] = false;
            item['profileUrl'] = item.firstName[0] + "";
            if (item.lastName != null) { item['profileUrl'] += item.lastName[0] }
          } else {
            item['profileShow'] = true;
            item['profileUrl'] = item.profilePictureUrl;
          }
        } else {
          item['profileShow'] = false;
          item['profileUrl'] = '';
        }

      });
      this.totalUser = response['data']['totalElements'];
      this.spinner.hide();
    });
  }
  searchClick(){
    this.memberData(this.search);
  }
  selected_pagelimit(event) {
    this.pagelimit1=event.value
    console.log(this.pagelimit1)
    this.reqData.page.pageLimit= this.pagelimit1;
    console.log(this.reqData.page.pageLimit)
    this.memberData();

  }
  getNotificationReceipt(id) {
    let req = {
      path: "event/chapter/sponsorship/sendReceipt/" + id,
      isAuth: true,
    };
    this.apiService.get(req).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }
  editSponsorship(id){
    this.router.navigate(['/my-chapter-sponsorship/edit/', id]);
  }

  sort(type) {
    if (type == 'name') {
      this.reqData['sort']['sortBy'] = 'FIRST_NAME';
    } else if (type == 'address') {
      this.reqData['sort']['sortBy'] = 'FIRST_NAME';
    } else if (type == 'email') {
      this.reqData['sort']['sortBy'] = 'EMAIL';
    } else if (type == 'phone') {
      this.reqData['sort']['sortBy'] = 'PHONE';
    } else if (type == 'totalPayment') {
      this.reqData['sort']['sortBy'] = 'TOTAL_PAYMENT';
    } else if (type == 'paymentStatus') {
      this.reqData['sort']['sortBy'] = 'PAYMENT';
    }
    if (this.reqData['sort']['orderBy'] == 'ASC') {
      this.reqData['sort']['orderBy'] = 'DESC';
    } else if (this.reqData['sort']['orderBy'] == 'DESC') {
      this.reqData['sort']['orderBy'] = 'ASC';
    }
    this.memberData();
  }

  pagination(type, data, current = null) {
    if (data == 'user') {
      if (type == 'prev') {
        this.reqData.page.pageNumber = this.reqData.page.pageNumber - 1;
      } else if (type == 'current') {
        this.reqData.page.pageNumber = current;
      } else {
        this.reqData.page.pageNumber = this.reqData.page.pageNumber + 1;
      }
      this.memberData();
      document.getElementById("page_form").scrollIntoView();

    }
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }

  changeList(type) {
    this.listType = type;
    this.memberData();
  }

}
