import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../../../services/api.service";
import {SpinnerService} from "../../../../services/spinner.service";
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {pagination} from "../../../../pagination";
import * as $ from "jquery";
import Swal from "sweetalert2";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {CommunityDetailsService} from "../../../../services/community-details.service";


@Component({
  selector: 'app-ch-sponsor-list',
  templateUrl: './ch-sponsor-list.component.html',
  styleUrls: ['./ch-sponsor-list.component.scss']
})
export class ChSponsorListComponent implements OnInit {
  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;

  @Input()
  userPermisssion: any = [];

  @Input()
  currentTab = '';

  @Input()
  reqData: any = [];
  modalRef: BsModalRef;

  @Input()
  type = '';
  _sponsor:any;
  @Output()sponsorChange: EventEmitter<any> = new EventEmitter();
  @Output()completed: EventEmitter<any> = new EventEmitter();
  @Input()
  get sponsor(){
    return this._sponsor;
  }
  set sponsor(value){
    this._sponsor = value;
    this.sponsorChange.emit(value);
  }
  search = '';
  refundreason='';
  searchString: string = '';
  memberList:any= [];
  totalPages: any = [];
  totalMember = 0;
  webDateformate:any
  pagelimit1:any=[]
  refundmemberList:any=[]
  refundReqData:any=[]
  sponsorid=''
  editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "auto",
    "minHeight": "250px",
    "width": "auto",
    "minWidth": "0",
    "translate": "yes",
    "enableToolbar": true,
    "showToolbar": true,
    "placeholder": "Enter text here...",
    "imageEndPoint": "",
    "toolbar": [
      ["bold", "italic", "underline"],
      [{'header': 1}, {'header': 2}],
      ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
      ["link"]

    ]
  };

  constructor(private modalService: BsModalService, public Http: HttpClient, private formBuilder: FormBuilder, public apiService: ApiService, public spinner: SpinnerService, private toastrService: ToastrService, private route: ActivatedRoute, public router: Router, public _location: Location,public communityService: CommunityDetailsService) {

  }

  ngOnInit() {

    this.saveSubscription = this.save.subscribe(() => {

      this.reqData['page'] = {
        "pageLimit": this.communityService.pagelimit,
        "pageNumber": 0
      };
      this.sponsorData();
    });
    this.refundReqData={
      "refundReason": this.refundreason
    }

  }
  sponsorData(search = "") {
    this.reqData['filter']['search'] = this.search;
    this.searchString = search;
    if(search != ""){
      this.reqData['page']['pageNumber'] = 0
    }

    let req = {
      path: 'event/chapter/sponsor/getAll',
      data: this.reqData,
      isAuth: true,
    };
    this.spinner.show();
    this.apiService.post(req).subscribe(response => {
      if( response['status']['code'] =='OK')
      {
        this.memberList = response['data'];
        console.log(this.memberList)
        this.totalPages = pagination.arrayTwo(this.memberList['totalPages'], this.reqData.page.pageNumber);
        this.totalMember = response['data']['totalElements'];
      }



      this.spinner.hide();

    });
  }
  edit(list)
  {
    this.sponsor =list;
    this.completed.emit();
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
    }else if (type == 'amount') {
      this.reqData['sort']['sortBy'] = 'TOTAL_PAYMENT';
    }else if (type == 'paymentStatus') {
      this.reqData['sort']['sortBy'] = 'PAYMENT';
    } else if (type == 'date') {
      this.reqData['sort']['sortBy'] = 'DATE';
    }
    if (this.reqData['sort']['orderBy'] == 'ASC') {
      this.reqData['sort']['orderBy'] = 'DESC';
    } else if (this.reqData['sort']['orderBy'] == 'DESC') {
      this.reqData['sort']['orderBy'] = 'ASC';
    }
    this.sponsorData();
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
      document.getElementById("page_form").scrollIntoView();
      this.sponsorData();

    }
  }
  selected_pagelimit(event) {
    this.pagelimit1=event.value
    console.log(this.pagelimit1)
    this.reqData.page.pageLimit= this.pagelimit1;
    console.log(this.reqData.page.pageLimit)
    this. sponsorData();

  }
  getCurrentDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //because January is 0!
    let yyyy = today.getFullYear();

    let date = '';
    let mon = '';

    if (dd < 10) {
      date = '0' + dd;
    }
    if (mm < 10) {
      mon = '0' + mm;
    }
    return (date + mon + yyyy);
  }

  export()
  {

    let memberStatus = "";
    let fileName = this.currentTab+"_";

    let req = {
      path: "event/chapter/sponsors/excel",
      data: this.reqData,
      isAuth: true,
    };

    let currentDate = this.getCurrentDate();

    let Exportfilename = fileName + currentDate;

    this.apiService.ExportReqBody(req, Exportfilename);
  }

  arrayTwo(n: number) {
    return Array(n).fill(0).map((x, i) => i);
  }
  alredyRefund(){
    this.toastrService.error('You already refunded');
  }
  viewNotificationReceipt(id){
    this.spinner.show();
    let req = {
      path: "event/chapter/sponsorship/getReceipt/"+id,
      isAuth: true,
    };
    this.apiService.getPDF(req);
  }
  getNotificationReceipt(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want send receipt!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Send it!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        let req = {
          path: "event/chapter/sponsorship/sendReceipt/"+id,
          isAuth: true,
        };
        this.apiService.get(req).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Success!',
              //response['status']['description'],
              response['status']['description'],
              'success'
            );
          } else {
            Swal.fire(
              'Cancelled',
              'Receipt not send.',
              'error'
            );
          }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Receipt not send.',
          'error'
        )
      }
    })


  }

  deleteSponosr(id) {
    $("#delete_btn").click();
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this sponsor!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "event/chapter/sponsor/delete/" + id,
          isAuth: true,
        }
        this.apiService.get(request).subscribe(response => {
          if (response['status']['code'] == 'OK') {
            Swal.fire(
              'Success!',
              //response['status']['description'],
              'Sponsor has been deleted.',
              'success'
            );
            this.search = '';
            this.sponsorData();
          } else {
            Swal.fire(
              'Cancelled',
              'Sponsor is safe.',
              'error'
            );
          }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Sponsor is safe.',
          'error'
        )
      }
    })
  }

  // deleteSponosr(id){
  //   let request = {
  //     path : "event/chapter/sponsor/delete/" + id,
  //     isAuth: true
  //   }
  //
  //   this.apiService.get(request).subscribe(response => {
  //     if (response['status']['code'] == 'OK') {
  //       this.toastrService.success(response['status']['description']);
  //       this.sponsorData();
  //     }else
  //     {
  //       this.toastrService.error(response['status']['description']);
  //     }
  //   });
  // }
  closeModel(){
    this.modalRef.hide();
    this.refundreason='';
  }
  openModalWithClass(template: TemplateRef<any>,id) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg editdonor popop-common-center' })
    );
    this.sponsorid=id
  }


  refundReason(){
    if(this.refundreason!='') {
      this.refundReqData['refundReason'] = this.refundreason
      let req = {
        path: "event/sponsorship/refund/" + this.sponsorid,
        data: this.refundReqData,
        isAuth: true,
      };

      this.apiService.post(req).subscribe(response => {
        //this.refundmemberList = response['data']['content']
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.refundreason='';
          this.modalRef.hide();
          this.sponsorData();
        }
      });
    }else{
      this.toastrService.error('Please enter valid reason');

    }
  }


}
