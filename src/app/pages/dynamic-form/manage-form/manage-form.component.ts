import { Component, OnInit } from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Subject} from "rxjs";
import {ApiService} from "../../../services/api.service";
import {Location} from "@angular/common";
import {FormBuilder} from "@angular/forms";
// import {AlertService} from "ngx-alerts";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../../services/authentication.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-form-list',
  templateUrl: './manage-form.component.html',
  styleUrls: ['./manage-form.component.scss']
})
export class ManageFormComponent implements OnInit {
  modalRef: BsModalRef;
  businessId: any;
  formList: any = [];
  reqData: any = [];
  openModelSubject: Subject<any> = new Subject();
  progressBar :any =[];
  constructor(public apiService: ApiService, public location: Location, private modalService: BsModalService, private fb: FormBuilder,
              //private alertService: AlertService,
              public r: Router, public router: ActivatedRoute, public authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.authService.CheckLoginSession();
    this.router.params.subscribe(params => {
      this.businessId = "cc_id"
      this.reqData = {
        "filter": {
          "businessId": this.businessId,
        },
        "page": {
          "pageSize": 10,
          "pageNumber": 0
        },
        "sort": {
          "orderBy": 1,
          "sortBy": "FORECAST_NAME"
        }
      }
      this.getFormList()
    });
  }
  getFormList() {
    let data = {
      path: "survey/survey/getAllData",
      data: this.reqData,
      isAuth: true
    };
    this.apiService.post(data).subscribe(response => {
      this.formList = response['data'];
      this.progressBar = this.formList['totalActive'] * 100 / this.formList['totalElements']
    })
  }
  assignForm(data){
    this.openModelSubject.next(data);
  }
  editForm(id){
    localStorage.setItem('formId', id);
    this.r.navigate(['/create-form/']);
  }
  addForm(){
    this.r.navigate(['/create-form/']);
  }
  deleteForm(id) {
    let request = {
      path: "survey/assignSurvey/findByFormId/" + id,
      isAuth: true,
    }
    this.apiService.get(request).subscribe(response => {
      let titletxt ;
      if(response['data']!=null){
        titletxt ='This Form is assigned to users by deleting this the assigned and filed data will be lost are you sure ?'
      }else{
        titletxt ='Are you sure want to delele !'
      }
      Swal.fire({
        title: 'Are you sure?',
        text: titletxt,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          let request = {
            path: "survey/survey/delete/" + id,
            isAuth: true,
          }
          this.apiService.delete(request).subscribe(response => {
            Swal.fire(
              'Deleted!',
              'Form has been deleted.',
              'success'
            )
            this.getFormList();
            if (this.formList.content.length ==1 && this.reqData['page']['pageNumber']!=0) {
              this.reqData['filter']['search'] = "";
              this.reqData['page']['pageNumber'] = this.reqData['page']['pageNumber'] - 1;
              this.reqData['page']['pageSize'] = 10;
              this.getFormList();
            }else{
              this.getFormList()
              ;
            }

          }, error => {
            Swal.fire(
              'Cancelled',
              'Form is safe.',
              'error'
            )
          });

        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Your Form is safe.',
            'error'
          )
        }
      })
    })
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
      this.getFormList();
    }
  }
}
