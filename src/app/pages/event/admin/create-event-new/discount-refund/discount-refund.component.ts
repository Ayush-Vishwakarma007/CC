import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {configuration} from '../../../../../configration';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-discount-refund',
  templateUrl: './discount-refund.component.html',
  styleUrls: ['./discount-refund.component.scss']
})

export class DiscountRefundComponent implements OnInit,OnDestroy {

  @Input()
  save:Subject<any>;
  @Input() eventId = "";

  _discountRefund:any;
  @Output()discountRefundChange: EventEmitter<any> = new EventEmitter();
  @Output() completed:EventEmitter<any> = new EventEmitter();

  @Input()
  get discountRefund(){
    return this._discountRefund;
  }
  set discountRefund(value){
    this._discountRefund = value;
    this.discountRefundChange.emit(value);
  }
  mediaUploadUrl = "event/uploadPicture";
  saveSubscription:Subscription;
  submitBtn = true;
  submitRefundBtn = true;
  donationTypeList : any = [];
  discount_list : any = [];
  discountForm: FormGroup;

  refund_list : any = [];
  refundForm: FormGroup;

  editId = '';
  editType = '';

  constructor(private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute, private apiService: ApiService, private toastrService: ToastrService) {
    this.discountForm = this.formBuilder.group({
      code: ['', Validators.required],
      discountType: ['', Validators.required],
      discountValue: ['', Validators.required],
      maxDate: ['', Validators.required],
      maxDiscount: ['', Validators.required],
      maxUsage: ['', Validators.required],
      minDate: ['', Validators.required],
      purchaseType: ['', Validators.required],
      purchaseValue: ['', Validators.required]
    });
    this.refundForm = this.formBuilder.group({
      beforeDateTime: ['', Validators.required],
      name: ['', Validators.required],
      refundPercentage: ['', Validators.required],
    });
  }


  ngOnInit() {
    this.donationType();
    this.discountList();
    this.refundList();
    this.saveSubscription = this.save.subscribe(()=>{
      this.discountRefundChange.emit(this.discountRefund);
      this.completed.emit();
    });
  }
  submitDiscount()
  {
    if (this.discountForm.valid) {
      if (new Date(this.discountForm.value.minDate) <= new Date(this.discountForm.value.maxDate)) {

        let formval = this.discountForm.value;
      formval['eventId'] = this.eventId;
      let data = {};
      if(this.editId != '' && this.editType =='discount')
      {
        data = {
          path: "event/discountCode/"+this.editId,
          data: formval,
          isAuth: true
        };
      }else {
        data = {
          path: "event/discountCode/",
          data: formval,
          isAuth: true
        };
      }

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.submitBtn = true;
          this.discountForm.reset();
          this.discountList();
          this.editId = '';
          this.editType = '';
        } else {
          this.toastrService.error(response['status']['description']);
          this.submitBtn = false;
        }
      });
      }else
      {
        this.toastrService.error("Please add Valid Date !");
        this.submitBtn= false;
      }
    }else
    {
      this.toastrService.error("Please fill all required fields!");
      this.submitBtn= false;
    }
  }
  submitRefund()
  {
    if (this.refundForm.valid) {
      let formval = this.refundForm.value;
      let data = {};
      if(this.editId != '' && this.editType =='refund')
      {
        data = {
          path: "event/refundRule/"+this.eventId+"/"+this.editId,
          data: formval,
          isAuth: true
        };
      }else {
        data = {
          path: "event/refundRule/"+this.eventId,
          data: formval,
          isAuth: true
        };
      }

      this.apiService.post(data).subscribe(response => {
        if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.submitRefundBtn = true;
          this.refundForm.reset();
          this.editId = '';
          this.editType = '';
        } else {
          this.toastrService.error(response['status']['description']);
          this.submitRefundBtn = false;
        }
      });
    }else
    {
      this.toastrService.error("Please fill all required fields!");
      this.submitRefundBtn= false;
    }
  }
  donationType() {
    let request = {
      path: "event/discountRuleType",
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.donationTypeList = response['data'];
    });
  }
  discountList()
  {
    let request = {
      path: "event/discountCodes/"+this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.discount_list = response['data'];
    });
  }
  refundList()
  {
    let request = {
      path: "event/refundRule/"+this.eventId,
      isAuth: true,
    };
    this.apiService.get(request).subscribe(response => {
      this.refund_list = response['data'];
    });
  }
  ngOnDestroy(): void {
    this.saveSubscription.unsubscribe();
  }
  edit(data,type) {
    this.editType = type;
    this.editId = data.id;
    if(type == 'discount') {
      this.discountForm.patchValue({
        code: data.code,
        discountType:  data.discountType,
        discountValue: data.discountValue,
        maxDate:  data.maxDate,
        maxDiscount:  data.maxDiscount,
        maxUsage: data.maxUsage,
        minDate:  data.minDate,
        purchaseType: data.purchaseType,
        purchaseValue:  data.purchaseValue
      });
    }
    if(type == 'refund') {
      this.refundForm.patchValue({
          beforeDateTime: data.beforeDateTime,
          name: data.name,
          refundPercentage:data.refundPercentage
      });
    }
  }
  delete(data,type) {
    if (type == 'discount') {
      let request = {
        path: "event/discountCode/" + data.id,
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.discountList();
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
    if (type == 'refund') {
      let request = {
        path: "event/refundRule/"+this.eventId+"/" + data.id,
        isAuth: true,
      };
      this.apiService.get(request).subscribe(response => {
        if (response['status']['code'] == 'OK') {
          this.toastrService.success(response['status']['description']);
          this.refundList();
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
}
