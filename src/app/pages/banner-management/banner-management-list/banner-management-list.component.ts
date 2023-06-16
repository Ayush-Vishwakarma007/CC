import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { SpinnerService } from "../../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

@Component({
  selector: 'app-banner-management-list',
  templateUrl: './banner-management-list.component.html',
  styleUrls: ['./banner-management-list.component.scss']
})
export class BannerManagementListComponent implements OnInit {

  chapterList: any = [];
  chapterId = '';
  bannerList: any = [];

  constructor(private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) { }

  ngOnInit() {
    this.getChapterList();
  }

  getChapterList() {
    let request = {
      path: 'community/chapters/access',
      isAuth: true,
    };
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.chapterList = response['data'];
        if (this.chapterList[0]) {
          this.getChapterDetail(this.chapterList[0]['id']);
        }
        resolve(null);
      });
    });
  }

  getChapterDetail(id) {
    this.chapterId = id;
    this.getBannerList();
  }

  getBannerList() {

    let request = {
      path: "community/banner/getAll/" + this.chapterId,
      isAuth: true
    }

    this.apiService.get(request).subscribe(response => {
      this.bannerList = response['data'];
    });
  }

  deleteBanner(bannerId){
    let message = '';
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Banner!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path : "community/banner/" + bannerId,
          isAuth: true,
        };
        this.apiService.get(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Deleted!',
              'Banner has been deleted.',
              'success'
            );
            this.getBannerList();
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
            'Banner has been safe.',
            'error'
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Banner has been safe.',
          'error'
        );
      }
    })
  }
}
