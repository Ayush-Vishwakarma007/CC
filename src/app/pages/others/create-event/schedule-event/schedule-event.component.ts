import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AmazingTimePickerService} from '@jonijnm/amazing-time-picker'; // this line you need
import Swal from 'sweetalert2';
import * as $ from "jquery";
import {Subject} from 'rxjs';
// import {stripSummaryForJitFileSuffix} from '@angular/compiler/src/aot/util';
import {ApiService} from 'src/app/services/api.service';
import {SpinnerService} from 'src/app/services/spinner.service';
import {configuration} from 'src/app/configration';
import {Location} from '@angular/common';

@Component({
  selector: 'app-schedule-event',
  templateUrl: './schedule-event.component.html',
  styleUrls: ['./schedule-event.component.scss']
})
export class ScheduleEventComponent implements OnInit {
  scheduleForm: FormGroup;
  @Input()
  eventId: string;

  @Output() submitSchedule:EventEmitter<any> = new EventEmitter();
  @Output() openActiveTab:EventEmitter<any> = new EventEmitter();

  submitted: boolean = false;
  dtTrigger = new Subject();
  dtOptions: any = {};
  scheduleArray: any;
  arrayLength: number;
  shrebaseLink: string;
  selfCreated: string;
  mediaUploadUrl = "event/uploadPicture";
  mediaList = [];
  mediaUrl = '';
  formatedAddress = '';
  editTime :boolean = false;
  maploc = {
    componentRestrictions: {country: 'US'}
  };
  public handleAddressChange(address: any) {
    this.formatedAddress = address.formatted_address;
    this.scheduleForm.patchValue({
        locationMap :  address.url,
        address : this.formatedAddress
      }
    );
  }
  public phoneMask = [ /\w/, /\w/, /\w/, '-', /\w/, /\w/, /\w/, '-',/\d/, /\d/, /\d/, /\d/];

  constructor(public location: Location, private fb: FormBuilder, public apiService: ApiService, private atp: AmazingTimePickerService, public spinner: SpinnerService, private toastrService: ToastrService, public router: Router) {
    this.scheduleForm = this.fb.group({
      name: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      locationMap: ['',[Validators.required]],
      eventId : [''],
      imageUrl:['',[Validators.required]],
      scheduleDate: ['', [Validators.required]],
      id: [''],
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      buttons: [
        'excel'
      ]
    };
    this.onLoad();
  }

   onLoad() {
    let request = {
      path: "event/schedules/" + this.eventId,
      isAuth: true
    };

    this.apiService.get(request).subscribe(response => {
      this.scheduleArray = response['data'];
      if (response['status']['code'] == 'OK') {
        this.spinner.hide();
        this.scheduleArray = response['data'];
        this.scheduleArray.forEach((item, index) => {
          this.scheduleArray[index]['scheduleDate'] = configuration.dateFormat(item['scheduleDate']);
        });
        this.arrayLength = this.scheduleArray.length;
      }
    });
  }

  get f() {
    return this.scheduleForm.controls;
  }

  submit() {
    this.submitted = true;
    let dataValue = {};
    this.scheduleForm.patchValue({
        eventId :  this.eventId
      }
    );
    if(this.scheduleForm.valid)
    {
      this.scheduleForm.value.scheduleDate = this.scheduleForm.value.scheduleDate.toISOString();
      if( this.editTime == true)
      {
        dataValue = {
          path: "event/schedule/"+this.scheduleForm.value.id,
          data: this.scheduleForm.value,
          isAuth: true
        };
      }else {
        dataValue = {
          path: "event/schedule/",
          data: this.scheduleForm.value,
          isAuth: true
        };
      }


      this.apiService.post(dataValue).subscribe(response => {
        this.toastrService.success(response['status']['description']);
        if (response['status']['code'] == "CREATED" ||response['status']['code'] == "OK") {
          this.toastrService.success(response['status']['description']);
          this.onLoad();
          this.mediaList = [];
          this.mediaUrl = '';
          this.submitted = false;
          this.scheduleForm.reset();
          this.editTime =false;
        } else {
          this.toastrService.error(response['status']['description']);
        }
      });
    }else {
      this.toastrService.error('Please fill all required fields!');
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  uploadStarted() {
  }

  fileSizeError() {
  }

  invalidUploadFile() {
  }

  queueCompleted() {
      if (this.mediaList.length > 0) {
        this.mediaList.forEach(item => {
          this.mediaUrl = item.responseData.data;
        });
      }
      this.scheduleForm.patchValue({
         imageUrl :  this.mediaUrl['profilePictureUrl']
      }
    );
  }

  maxFileError() {
  }
  edit(data)
  {
    this.mediaUrl = data.imageUrl;
    this.editTime =true;

    this.scheduleForm.patchValue({
        name :  data.name,
        contactNumber : data.contactNumber,
        scheduleDate : new Date(data.scheduleDate),
        locationMap:data.locationMap,
        address : data.address,
        imageUrl:data.imageUrl,
        id:data.id,
      }
    );
  }
  delete(id)
  {
    let request = {
      path: "event/schedule/delete/"+id,
      isAuth: true
    };
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.spinner.hide();
        this.toastrService.success(response['status']['description']);
        this.onLoad();
      }else {
        this.toastrService.error(response['status']['description']);
      }
    });
  }
  next()
  {
    this.submitSchedule.emit();
  }
  openTab()
  {
    this.openActiveTab.emit();
  }
}
