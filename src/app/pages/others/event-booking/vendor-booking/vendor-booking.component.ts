import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-vendor-booking',
  templateUrl: './vendor-booking.component.html',
  styleUrls: ['./vendor-booking.component.scss']
})
export class VendorBookingComponent implements OnInit, OnDestroy  {
  @Input() eventId = "";
  @Input() sponsor_list: any = [];
  @Input() type= "";

  @Input()
  save: Subject<any>;
  saveSubscription: Subscription;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Output() changeId: EventEmitter<any> = new EventEmitter();

  categoryId: any;
  detail: any = {};
  response: any = [];

  @Output() sponsorDetailChange: EventEmitter<any> = new EventEmitter();
  _sponsorDetail: any;
  @Input()
  get sponsorDetail() {
    return this._sponsorDetail;
  }
  set sponsorDetail(value) {
    this._sponsorDetail = value;
    this.sponsorDetailChange.emit(value);
  }

  @Output() sponsorIdChange: EventEmitter<any> = new EventEmitter();
  _sponsorId: any;
  @Input()
  get sponsorId() {
    return this._sponsorId;
  }
  set sponsorId(value) {
    this._sponsorId = value;
    this.sponsorIdChange.emit(value);
  }
  constructor(private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
 }

  ngOnInit() {
    this.categoryId= this.sponsorId;
    let index = this.sponsor_list.findIndex(x => x.id ===  this.sponsorId);
    this.sponsorChange(true, index,true);
    this.saveSubscription = this.save.subscribe(() => {
      let detail = [];
      detail = this.sponsor_list.filter(t => t.id == this.categoryId)[0];
      if(detail != undefined)
      {
        let tempArr = [];
          tempArr.push({
            "categoryId": detail['id'],
            "count": 1,
          });
        this.detail['expoCategories'] = tempArr;
        this.detail['eventId'] = this.eventId;
        this.detail['registrations'] =[];
        this.detail['role'] ='VENDOR';
        this.detail["sponsorshipCategoryId"]=null;
        this.detail["sponsorshipDiscount"]=true;
        if (this.detail['amount'] != '' && this.detail['amount'] != 0) {

          let data = {
            path: "event/calculateAmount",
            data: this.detail,
            isAuth: true,
          };
          this.apiService.post(data).subscribe(response => {
            if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
              this.response['finalAmount'] = response['data']['finalAmount'];
              this.response['eventId'] = response['data']['eventId'];
              this.response['tax'] = response['data']['tax'];
              this.response['amount'] = response['data']['totalExpoAmount'];
              this.response['successfulPayment'] = false;
              this.response['type'] = this.type;
              this.response['category'] = detail;
              this.toastrService.success(response['status']['description']);
              this.sponsorDetailChange.emit(this.response);
              this.completed.emit();
            } else {
              this.toastrService.error(response['status']['description']);
            }
          });
        } else {
          this.toastrService.error("Please Add Valid Amount !");
        }
      }else {
        this.toastrService.error("Please Select Valid Sponsor  !");
      }

    });
  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
  sponsorChange(check, index,onload = false) {
    if(onload == false)
    {
      this.sponsor_list.map(t => {
        t.amount = 0;
        t.checked = false;
        return t
      });
    }
    this.sponsor_list[index]['checked'] = check;
    this.categoryId = this.sponsor_list[index]['id'];
    this.sponsorIdChange.emit(this.categoryId);
    this.changeId.emit();
  }
}
