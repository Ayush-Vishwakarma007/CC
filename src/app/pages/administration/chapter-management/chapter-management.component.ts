import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {pagination} from "../../../pagination";
import Swal from "sweetalert2";

@Component({
  selector: 'app-chapter-management',
  templateUrl: './chapter-management.component.html',
  styleUrls: ['./chapter-management.component.scss']
})
export class ChapterManagementComponent implements OnInit {
  chapterList:any = [];
  totalPages:any=[];
  chapterTypeList:any= [];
  reqData:any = [];
  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.reqData= {
      "filter": {
        "search": ""
      },
      "page": {
        "pageLimit": 10,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "NAME"
      }
    };
  }

  ngOnInit() {
    this.getChapterType();
    this.getChapterList();

  }

  getChapterList()
  {
    this.spinner.show();
    let request = {
      path: 'community/chapters/access',
      data:this.reqData,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if( response['status']['code'] =='OK') {
        this.chapterList = response['data'];
        this.totalPages = pagination.arrayTwo(this.chapterList['totalPages'], this.reqData.page.pageNumber);
        this.spinner.hide();
      }else{
        this.toastrService.error( response['status']['description']);
        this.spinner.hide();
      }

    });
  }
  getChapterType()
  {
    let request = {
      path: '/community/chapterType',
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.chapterTypeList = response['data'];
    });
  }
  sort(type) {
    if (type == 'name') {
      this.reqData['sort']['sortBy'] = 'NAME';
    }
    if (this.reqData['sort']['orderBy'] == 'ASC') {
      this.reqData['sort']['orderBy'] = 'DESC';
    } else if (this.reqData['sort']['orderBy'] == 'DESC') {
      this.reqData['sort']['orderBy'] = 'ASC';
    }
    this.getChapterList();
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
      this.getChapterList();
      document.getElementById("page_form").scrollIntoView();
    }
  }

  editChapter(id){
    this.router.navigate(['/management/chapter-management-edit/'+id]);

  }
  deleteChapter(id) {
    let message = '';
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Chapter!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "community/chapter/" + id,
          isAuth: true,
        };
        this.apiService.get(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Deleted!',
              'Chapter has been deleted.',
              'success'
            );
            this.getChapterList();
          } else {
            Swal.fire(
              'Cancelled',
              response['status']['description'],
              'error'
            );
          }

        }, error => {

          Swal.fire(
            'Cancelled',
            'Chapter has been safe.',
            'error'
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Chapter has been safe.',
          'error'
        );
      }
    })
  }
}
