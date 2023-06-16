import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateEventComponent} from './create-event.component';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileUploaderVerticalModule} from '../../../components/file-uploader-vertical/file-uploader-vertical.module';
import {CarouselModule} from 'ngx-bootstrap/carousel';
import {MatDatepickerModule } from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ScheduleEventComponent} from './schedule-event/schedule-event.component';
import {SessionComponent} from './session/session.component';
import {AmazingTimePickerModule} from "@jonijnm/amazing-time-picker";

import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime-ex";
// import {AlertModule} from "ngx-alerts";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {TextMaskModule} from 'angular2-text-mask';
import {ToastrModule} from "ngx-toastr";

const routes: Routes = [
  {
    path:'',
    component: CreateEventComponent
  }
];

@NgModule({
  declarations: [CreateEventComponent,ScheduleEventComponent,SessionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FileUploaderVerticalModule,
    CarouselModule.forRoot(),
    MatDatepickerModule, MatInputModule, MatNativeDateModule,
    MatChipsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatIconModule,
    MatChipsModule,
    FormsModule,
    TextMaskModule,
    ReactiveFormsModule,
    AmazingTimePickerModule,
    
    MatDatepickerModule, MatInputModule,MatNativeDateModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    // AlertModule.forRoot({maxMessages: 1, timeout: 5000, position: 'right'}),MatChipsModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    AmazingTimePickerModule,
    
    MatDatepickerModule, MatInputModule,MatNativeDateModule,
    MatIconModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    GooglePlaceModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,

    }),
  ]
})
export class CreateEventModule { }
