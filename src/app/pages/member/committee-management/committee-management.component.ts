import { Component, OnInit, TemplateRef  } from '@angular/core';
import { Subject } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SpinnerService } from "../../../services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import * as $ from "jquery";
import Swal from "sweetalert2";

@Component({
  selector: 'app-committee-management',
  templateUrl: './committee-management.component.html',
  styleUrls: ['./committee-management.component.scss']
})
export class CommitteeManagementComponent implements OnInit {
  modalRef: BsModalRef;
  chapterList: any = [];
  chapterId = '';
  committeeList: any = [];
  committeeForm: FormGroup;
  submitBtn = true;
  editId = '';
  search = '';
  searchString: string = '';
  totalPages: any = [];
  reqData: any = [];
  isShow: boolean = false;

  constructor( private modalService: BsModalService, private formBuilder: FormBuilder, public spinner: SpinnerService, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.reqData = {
      "filter": {
        "search": ""
      },
      "page": {
        "pageLimit": 5,
        "pageNumber": 0
      },
      "sort": {
        "orderBy": "ASC",
        "sortBy": "NAME"
      }
    };
    this.committeeForm = this.formBuilder.group({
      description: [''],
      name: ['', Validators.required],
      displayPriority: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getChapterList();
    this.getAllCommittee();
  }

  getChapterList() {
    let request = {
      path: 'community/chapters/access',
      isAuth: true,
    };
    this.spinner.show();
    return new Promise((resolve) => {
      this.apiService.get(request).subscribe(response => {
        this.chapterList = response['data'];
        if (this.chapterList[0]) {
          this.getChapterDetail(this.chapterList[0]['id']);
        }
        resolve(null);
        this.spinner.hide();
      });
    });
  }

  getChapterDetail(id) {
    if(id == ''){
      this.isShow = true;
    }
    else{
      this.isShow = false;
    }
    this.chapterId = id;
    this.getAllCommittee();
  }

  getAllCommittee(search = '') {

    this.reqData['filter']['search'] = search;
    this.reqData['filter']['chapterId'] = this.chapterId;
    this.searchString = search;

    let request = {
      path: 'community/committee/getAll',
      data: this.reqData,
      isAuth: true,
    };
    this.apiService.post(request).subscribe(response => {
      this.committeeList = response['data'];
      let committee_length = this.committeeList['content'].length;
        let page_no = this.reqData.page.pageNumber;
        if (committee_length == 0) {
          if (page_no != 0) {
            this.reqData.page.pageNumber = page_no - 1;
            this.getAllCommittee(this.searchString);
          }
        }
    });
  }

  submitcommittee() {
    if (this.committeeForm.valid) {

      let formData = this.committeeForm.value;
      //formData['highPriority'] = false;
      formData['chapterId'] = this.chapterId;

      let data = {};
      if (this.editId != '') {
        data = {
          path: "community/committee/" + this.editId,
          data: formData,
          isAuth: true
        };
      } else {
        data = {
          path: "community/committee/",
          data: formData,
          isAuth: true
        };
      }

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.submitBtn = true;
          this.committeeForm.reset();
          this.getAllCommittee();
          this.modalRef.hide();
          $('#closeModel').click();
          this.editId = '';
        } else {
          this.toastrService.error(response['status']['description']);
          this.submitBtn = false;
        }
      });
    } else {
      this.toastrService.error("Please fill all required fields!");
      this.submitBtn = false;
    }
  }

  edit(data) {
    console.log(data);
    this.editId = data.id;
    this.committeeForm.patchValue({
      description:  data.description,
      name:  data.name,
      displayPriority: data.displayPriority,
    });
    $('#openEditCommitteeModel').click();
    window.scrollTo(0, 0);
  }

  delete(data) {
    $("#delete_btn").click();
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Committee !',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "community/committee/"+ data.id,
          isAuth: true,
        }
        this.apiService.get(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Success!',
              //response['status']['description'],
              'Committee has been deleted.',
              'success'
            );
            this.search = '';
            this.getAllCommittee();
          } else {
            Swal.fire(
              'Cancelled',
              'Committee  is safe.',
              'error'
            );
          }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Committee  is safe.',
          'error'
        )
      }
    })
  }

  // delete(data)
  // {
  //   let request = {
  //     path: "community/committee/"+ data.id,
  //     isAuth: true,
  //   };
  //   this.apiService.get(request).subscribe(response => {
  //     if (response['status']['code'] == 'OK') {
  //       this.toastrService.success(response['status']['description']);
  //       this.getAllCommittee();
  //     }else {
  //       this.toastrService.error(response['status']['description']);
  //     }
  //   });
  // }

  onChange(event, data) {
    this.editId = data.id
    let list = {
      "chapterId": data.chapterId,
      "description": data.description,
      "displayPriority": data.displayPriority,
      "highPriority": event,
      "name": data.name
    }
    let request = {
      path: "community/committee/" + this.editId,
      data: list,
      isAuth: true
    };

    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.getAllCommittee();
        this.editId = '';
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }
  onChange1(event, data) {
    this.editId = data.id
    let list = {
      "chapterId": data.chapterId,
      "description": data.description,
      "displayPriority": data.displayPriority,
      
      "includeInContactUs":event,
      "name": data.name
    }
    let request = {
      path: "community/committee/" + this.editId,
      data: list,
      isAuth: true
    };

    this.apiService.post(request).subscribe(response => {
      if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
        this.toastrService.success(response['status']['description']);
        this.getAllCommittee();
        this.editId = '';
      } else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }


  pagination(type, current = null) {
    if (type == 'prev') {
      this.reqData.page.pageNumber = this.reqData.page.pageNumber - 1;
    } else if (type == 'current') {
      this.reqData.page.pageNumber = current;
    }
    else {
      this.reqData.page.pageNumber = this.reqData.page.pageNumber + 1;
    }
    this.getAllCommittee();
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }

  sort(type) {
    if (type == 'name') {
      this.reqData['sort']['sortBy'] = 'NAME';
    } else if (type == 'description') {
      this.reqData['sort']['sortBy'] = 'DESCRIPTION';
    } else if (type == 'priority') {
      this.reqData['sort']['sortBy'] = 'DISPLAY_PRIORITY';
    } else if (type == 'hightpriority') {
      this.reqData['sort']['sortBy'] = 'HIGH_PRIORITY';
    }
    if (this.reqData['sort']['orderBy'] == 'ASC') {
      this.reqData['sort']['orderBy'] = 'DESC';
    } else if (this.reqData['sort']['orderBy'] == 'DESC') {
      this.reqData['sort']['orderBy'] = 'ASC';
    }
    this.getAllCommittee();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  formReset(){
    this.submitBtn = true;
    this.editId = '';
    this.committeeForm.reset();
  }
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg add-donation-bg addcmt' })
    );
  }
}
