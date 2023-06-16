import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormControl} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {SpinnerService} from "../../../services/spinner.service";
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Observable} from "rxjs";
import {startWith} from "rxjs/internal/operators/startWith";
import {map} from "rxjs/operators";
import * as $ from "jquery";
import Swal from "sweetalert2";
import {pagination} from "../../../pagination";
import {CommunityDetailsService} from "../../../services/community-details.service";

@Component({
  selector: 'app-committee-members',
  templateUrl: './committee-members.component.html',
  styleUrls: ['./committee-members.component.scss']
})
export class CommitteeMembersComponent implements OnInit {
  committeeMemberList: any = [];
  chapterList: any = [];
  memberDesignation: any = [];
  newMemberList: any = [];
  reqData: any = [];
  search = '';
  search_member = '';
  reqNewData: any = [];
  addMemberData: any = [];
  subjectList: any;
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  committeeList: any = [];
  committeeListing: any = [];
  chapterId = '';
  committeeId = '';
  searchString = '';
  totalPages: any = [];
  constructor(public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location,
    public communityService: CommunityDetailsService) {
    this.reqData = {
      "filter": {
        "search": ""
      },
      "page": {
        "pageLimit": 10,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "INDEX"
      }
    };
    this.reqNewData = {
      "filter": {
        "roles": [
          "USER",
          "MEMBER"
        ],
        "approved": true,
        "search": ''
      },
      "page": {
        "limit": 5,
        "page": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "FIRST_NAME"
      }
    };
  }

  async ngOnInit() {
    await this.getChapterList();
    await this.getCommitteeMemberList();
    await this.getMemberDesignation();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  getChapterList() {
    let req = {
      path: 'community/chapters/access',
      isAuth: true,
    };
  
    return new Promise((resolve) => {
      this.apiService.get(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.chapterList = response['data'];
          if(this.chapterList[0])
          {
            this.getChapterDetail(this.chapterList[0]['id']);
          }
        } else {
          this.toastrService.error(response['status']['description']);
        }
        resolve(null);
      });
    });
  }

  getChapterDetail(id) {
    this.chapterId = id;
    this.getCommitteeList();
    this.getCommitteeMemberList(this.searchString);
  }

  getCommitteeDetail(cid){
    this.committeeId = cid;
    this.getCommitteeMemberList(this.searchString);
  }

  getOnlyCommittee(id){
    let request = {
      path: 'community/committee/getAll?chapterId=' + id,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.committeeListing = response['data'];

      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }
  getCommitteeList() {
    let request = {
      path: 'community/committee/getAll?chapterId=' + this.chapterId,
      isAuth: true,
    };

    this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.committeeList = response['data'];
          if(this.committeeList[0])
          {
            this.getCommitteeDetail(this.committeeList[0]['id']);
          }
        } else {
          this.toastrService.error(response['status']['description']);
        }
    });
  }

  getCommitteeMemberList(search = '') {
    this.reqData['filter']['search'] = search;
    if(search != ''){
      this.reqData['page']['pageNumber'] = 0;
    }
    this.reqData['filter']['chapterId'] = this.chapterId;
    if(this.committeeId == '' || this.committeeId == undefined){
      this.reqData['filter']['committeeId'] = null;
    }else{
      this.reqData['filter']['committeeId'] = this.committeeId;
    }
    this.searchString = search;
    let req = {
      path: 'community/committeeMembers',
      data: this.reqData,
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.post(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.committeeMemberList = response['data']; 
          this.committeeMemberList['content'] = this.committeeMemberList['content'].filter((item, index) => item.firstName != '');
          this.committeeMemberList['content'].map((item, index) => {
            if (item.profilePictureUrl == null || item.profilePictureUrl == '') {
              item['profileShow'] = false;
              item['profileUrl'] = item.firstName[0] + "" + item.lastName[0];
            } else {
              item['profileShow'] = true;
              item['profileUrl'] = item.profilePictureUrl;
            }
            let chapter = this.chapterList.filter((list) => {
              return list['id'] == item['chapterId'];
            })[0]['name'];
            item['chapterName'] = chapter;
          });
        } else {
          this.toastrService.error(response['status']['description']);
        }
        resolve(null);
      });
    });
  }

  searchClick(){
    this.getCommitteeMemberList(this.search);
  }
  getNewMember() {
    if (this.search_member == '') {
      this.newMemberList = [];
    } else {
      this.reqNewData['filter']['search'] = this.search_member;
      this.reqNewData['filter']['search'] = this.search_member;
      let req = {
        path: "auth/user/getUsers",
        data: this.reqNewData,
        isAuth: true,
      };
      this.spinner.show();
      this.apiService.post(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.newMemberList = response['data'];
          this.totalPages = pagination.arrayTwo(this.newMemberList['totalPages'], this.reqNewData.page.page);
          this.newMemberList['content'].map((item, index) => {
            if (item.profilePictureUrl == null || item.profilePictureUrl == '') {
              item['profileShow'] = false;
              item['profileUrl'] = item.firstName[0] + "" + item.lastName[0];
            } else {
              item['profileShow'] = true;
              item['profileUrl'] = item.profilePictureUrl;
            }
          });
        }
        this.spinner.hide();
      });
    }
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getMemberDesignation() {
    let req = {
      path: 'community/designation/getAll',
      isAuth: true,
    };

    return new Promise((resolve) => {
      this.apiService.get(req).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.memberDesignation = response['data'];
          this.options = [];
          this.memberDesignation.forEach((item, index) => {
            this.options.push(item.name);
        });
        } else {
          this.toastrService.error(response['status']['description']);
        }
        resolve(null);
      });
    });
  }
  
  editMember(list) {
    this.getOnlyCommittee(list.chapterId);
    list['edit'] = !list['edit'];
  }

  submitMember(list, id = '') {
    let data = {
      "activeMember": list['activeMember'],
      "chapterId": list['chapterId'],
      "designation": list['designation'],
      "endDate": list['endDate'],
      "startDate": list['startDate'],
      "userId": list['userId'],
      "committeeId": list['committeeId'],
      "index": list['index']
    }
    let req = {};
    if (id == '') {
      req = {
        path: 'community/committeeMember',
        data: data,
        isAuth: true,
      };
    } else {
      req = {
        path: 'community/committeeMember/' + id,
        data: data,
        isAuth: true,
      };
    }

    this.apiService.post(req).subscribe(response => {
      if (response['status']['code'] == 'OK' || response['status']['code'] == 'CREATED') {
        this.toastrService.success(response['status']['description']);
        this.addMemberData = [];
        this.getCommitteeMemberList();
        this.search = '';
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }

  deleteMember(id) {
    $("#delete_btn").click();
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this member!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "community/committeeMember/" + id,
          isAuth: true,
        }
        this.apiService.get(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Success!',
              //response['status']['description'],
              'Committee Member has been deleted.',
              'success'
            );
            this.search = '';
            this.getCommitteeMemberList();
          } else {
            Swal.fire(
              'Cancelled',
              'Member is safe.',
              'error'
            );
          }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Member is safe.',
          'error'
        )
      }
    })
  }

  addMember(list) {
    list['activeMember'] = true;
    list['chapterId']=this.chapterId;
    list['designation'] = "";
    list['committeeId']=this.committeeId;
    list['startDate'] = "";
    list['endDate'] = "";
    list['add'] = true;
    list['index'] = "";
    list['userId'] = list['id'];
    this.addMemberData = list;
    $('#closeModal').trigger('click');
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
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
      this.getCommitteeMemberList();
    }
  }

  searchNewData() {
    console.log(this.search_member)
    this.reqNewData.page.page = 0;
    this.reqNewData['filter']['search'] = this.search_member;
    this.getNewMember();
    //this.paginationNewMember('current', 'user', 0);
  }

  paginationNewMember(type, data, current = null) {
    if (data == 'user') {
      if (type == 'prev') {
        this.reqNewData.page.page = this.reqNewData.page.page - 1;
      } else if (type == 'current') {
        this.reqNewData.page.page = current;
      } else {
        this.reqNewData.page.page = this.reqNewData.page.page + 1;
      }
      this.getNewMember();
      document.getElementById("page_form").scrollIntoView();

    }
  }

  sort(type) {
    if (type == 'name') {
      this.reqData['sort']['sortBy'] = 'FIRST_NAME';
    } else if (type == 'address') {
      this.reqData['sort']['sortBy'] = 'ADDRESS';
    } else if (type == 'email') {
      this.reqData['sort']['sortBy'] = 'EMAIL';
    } else if (type == 'phone') {
      this.reqData['sort']['sortBy'] = 'PHONE';
    } else if (type == 'designation') {
      this.reqData['sort']['sortBy'] = 'DESIGNATION';
    } else if (type == 'index') {
      this.reqData['sort']['sortBy'] = 'INDEX';
    } else if (type == 'year') {
      this.reqData['sort']['sortBy'] = 'START_YEAR';
    } else if (type == 'status') {
      this.reqData['sort']['sortBy'] = 'STATUS';
    }
    if (this.reqData['sort']['orderBy'] == 'ASC') {
      this.reqData['sort']['orderBy'] = 'DESC';
    } else if (this.reqData['sort']['orderBy'] == 'DESC') {
      this.reqData['sort']['orderBy'] = 'ASC';
    }
    this.getCommitteeMemberList();
  }

  numberOnly(event)
    :
    boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
}
