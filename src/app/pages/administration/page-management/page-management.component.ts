import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import {FormBuilder} from "@angular/forms";
import {SpinnerService} from "../../../services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {ToastrService} from 'ngx-toastr';
import {pagination} from 'src/app/pagination';

@Component({
  selector: 'app-page-management',
  templateUrl: './page-management.component.html',
  styleUrls: ['./page-management.component.scss']
})
export class PageManagementComponent implements OnInit {
  reqData: any = [];
  pageList: any = [];
  totalPages: any = [];

  search = '';
  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.reqData = {
      "filter": {
        "search": "",
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
    this.getPageList();
  }
  getPageList()
  {
    this.spinner.show();
    this.reqData['filter']['search'] = this.search;
    let request = {
      path: 'uiPermission/uiPage/getAll',
      data: this.reqData,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.pageList = response['data'];
        let member_length = this.pageList['content'].length;
        let page_no = this.reqData.page.pageNumber;
        if (member_length == 0) {
          if (page_no != 0) {
            this.reqData.page.page = page_no - 1;
            this.getPageList();
          }
        }
        this.totalPages = pagination.arrayTwo(this.pageList['totalPages'], this.reqData.page.pageNumber);
        this.spinner.hide();
      } else {
        this.toastrService.error(response['status']['description']);
        this.spinner.hide();
      }
    });
  }
  deletePage(id) {
    let message = '';
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Page!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "uiPermission/uiPage/" + id,
          isAuth: true,
        };
        this.apiService.get(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Deleted!',
              'Page has been deleted.',
              'success'
            );
            this.getPageList();
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
            'Page has been safe.',
            'error'
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Page has been safe.',
          'error'
        );
      }
    })
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
      this.getPageList();
      document.getElementById("page_form").scrollIntoView();

    }
  }
}
