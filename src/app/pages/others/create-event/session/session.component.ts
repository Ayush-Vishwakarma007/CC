import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner.service';
import {ToastrService} from 'ngx-toastr';
import { AmazingTimePickerService } from '@jonijnm/amazing-time-picker'; // this line you need
import { configuration } from 'src/app/configration';
import Swal from 'sweetalert2';
import * as $ from "jquery";
import { Subject } from 'rxjs';

// import { stripSummaryForJitFileSuffix } from '@angular/compiler/src/aot/util';


@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {
  speakers = [];
  speckerName = "";
  sessionForm: FormGroup;
  sessionArray: any[];
  attendeeArray: any[];
  scheduleArray :any [];
  arrayLength = 0;
  editId = 0;
  submitted = false;
  stTime = '';
  endTime = '';
  @Output() submitSession:EventEmitter<any> = new EventEmitter();
  @Output() openActiveTab:EventEmitter<any> = new EventEmitter();


  @Input()
  eventId: string;
  removable: any;
  selectable: any;
  formatedAddress = '';
  editTime :boolean = false;
  maploc = {
    componentRestrictions: {country: 'US'}
  };
  public handleAddressChange(address: any) {
    this.formatedAddress = address.formatted_address;
    this.sessionForm.patchValue({
        locationMap :  address.url,
        address : this.formatedAddress,
        eventId : this.eventId
      }
    );
  }
  public phoneMask = [ /\w/, /\w/, /\w/, '-', /\w/, /\w/, /\w/, '-',/\d/, /\d/, /\d/, /\d/];

  constructor(private fb: FormBuilder, public apiService: ApiService, private atp: AmazingTimePickerService, public spinner: SpinnerService, private toastrService: ToastrService, public router: Router) {
    this.sessionForm = this.fb.group({
      name: ['', [Validators.required]],
      capacity: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      speakers: [''],
      address: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      eventId: [this.eventId],
      scheduleId: ['', [Validators.required]],
      timeEnds: ['', [Validators.required]],
      timeStarts: ['', [Validators.required]],
      locationMap: ['', [Validators.required]],
      timingType: ['Morning', [Validators.required]]
    });
  }
  ngOnInit() {
    this.onLoad();
    this.schedules();
     }
  get f() { return this.sessionForm.controls; }
  onLoad() {
    let request = {
      path: "event/sessions/"+this.eventId,
      // data: { 'eventId': this.eventId }
    };
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.sessionArray = response['data'];
        this.sessionArray.forEach((item, index) => {
          this.sessionArray[index]['eTime'] = item['timeEnds'];
          this.sessionArray[index]['sTime'] = item['timeStarts'];
          this.sessionArray[index]['scheduleDate'] = configuration.dateFormat(item['scheduleDate']);
          this.sessionArray[index]['timeEnd'] = configuration.getTime(item['timeEnds']);
          this.sessionArray[index]['timeStart'] = configuration.getTime(item['timeStarts']);

          this.sessionArray[index]['timeEnds'] = configuration.getTime(item['timeEnds'], false);
          this.sessionArray[index]['timeStarts'] = configuration.getTime(item['timeStarts'], false);

          if (item['speakers']) {
            this.sessionArray[index]['speaker'] = item['speakers'].join(' , ');
          }
        });

        this.arrayLength = this.sessionArray.length;
      }
    });

  }
  schedules() {
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
      }
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  submit() {

    this.submitted = true;
    if (this.sessionForm.invalid) {
      this.toastrService.error('Please fill all required fields!');

      return;
    }
    else {
      let scheduleId= this.sessionForm.value.scheduleId;
      let data = this.scheduleArray.filter(function (entry) { return entry.id == scheduleId; })[0];
       let st = data.scheduleDate +' '+ this.sessionForm.value.timeStarts;
       let et = data.scheduleDate +' '+ this.sessionForm.value.timeEnds;
// console.log(st,et);return;
      if (new Date(et) < new Date(st)) {
        this.sessionForm.value.timeEnds = '';
        this.toastrService.error('Select Valid Time');
        this.endTime = '';

      } else {

        //   console.log(this.sessionForm.value.scheduleDate);
        if(this.sessionForm.value.speakers == "")
        {
          this.sessionForm.value.speakers = [];
        }
          this.sessionForm.value.timeStarts = new Date(st).toISOString();
          this.sessionForm.value.timeEnds = new Date(et).toISOString();

        let request = {};
        if (this.editId != 0) {
          request = {
            path: "event/session/" + this.editId,
            data: this.sessionForm.value,
            isAuth: true,
          }
        } else {
          request = {
            path: "event/session/",
            data: this.sessionForm.value,
            isAuth: true,
          }
        }

        this.apiService.post(request).subscribe(response => {
          
          if (response['status']['code'] == 'CREATED' || response['status']['code'] == 'OK') {
            this.toastrService.success(response['status']['description']);
            this.resetForm();
            this.onLoad();
          }else
          {
            this.toastrService.error(response['status']['description']);
            this.sessionForm.value.timeStarts = configuration.getTime(st,true);
            this.sessionForm.value.timeEnds = configuration.getTime(et,true);
          }
        });
      }


    }
  }
  edit(data) {
    this.editId = 0;
    // var data = this.sessionArray.filter(function(item) {
    //   return item.id === id;
    // })[0];

    //console.log(new Date(data.timeEnd));
    this.editId = data.id;
    this.sessionForm.patchValue({
      name: data.name,
      eventId: this.eventId,
      address: data.address,
      capacity: data.capacity,
      scheduleId: data.scheduleId,
      contactNumber:data.contactNumber,
      speakers: data.speakers,
      timingType:data.timingType,
      locationMap:data.locationMap,
      timeEnds:configuration.get_time(data.eTime),
      timeStarts: configuration.get_time(data.sTime)
    });
    this.speakers = data.speakers;
    //this.endTime = data.timeEnds;
    //this.stTime = data.timeStarts;
    $('.plus-top-btn').trigger('click');
  }
  delete(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Session!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let request = {
          path: "event/session/delete/" + id,
          isAuth: true,
        }
        this.apiService.get(request).subscribe(response => {

          Swal.fire(
            'Deleted!',
            'Your Session has been deleted.',
            'success'
          )
          this.onLoad();

        }, error => {
          Swal.fire(
            'Cancelled',
            'Your Session is safe :)',
            'error'
          )
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Event Schedule is safe :)',
          'error'
        )
      }
    })
  }
  resetForm() {
    this.submitted = false;
    this.sessionForm.reset();
    this.speckerName = "";
    this.speakers = [];
    this.sessionForm.patchValue({ eventId: this.eventId});
  }

  addSpeakers(e) {
    this.speakers.push(e.value);
    this.speckerName = "";
    this.sessionForm.patchValue({
      speakers: this.speakers
    });
    $('.mat-input-element').val('');
  }
  remove(i) {
    this.speakers.splice(i, 1);
    this.sessionForm.patchValue({
      speakers: this.speakers
    });
  }

  open(i) {
    const amazingTimePicker = this.atp.open();
    $('.plus-top-btn').trigger('click');
    amazingTimePicker.afterClose().subscribe(time => {
      if (i == 'start') {
        this.stTime = time;
      } else {
        this.endTime = time;
      }
      this.sessionForm.patchValue({
        timeStarts: this.stTime,
        timeEnds: this.endTime,
      });
      $('.plus-top-btn').trigger('click');
    });
  }
  attendeeList(id) {
    let request = {
      path: "session/attendees/" + id,
      isAuth: true,
    }
    this.apiService.get(request).subscribe(response => {
      if (response['status']['code'] == 'OK') {
        this.attendeeArray = response['data'];
      }
    });
  }
  next()
  {
    this.submitSession.emit();
  }
  back()
  {
    this.openActiveTab.emit();
  }
}
