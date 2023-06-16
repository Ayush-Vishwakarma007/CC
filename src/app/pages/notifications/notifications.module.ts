import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { Routes, RouterModule } from '@angular/router';
import { FileUploaderVerticalModule } from '../../components/file-uploader-vertical/file-uploader-vertical.module';

// import { AlertModule } from 'ngx-alerts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AmazingTimePickerModule } from '@jonijnm/amazing-time-picker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';

import { CarouselModule } from 'ngx-bootstrap/carousel';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';


const routes: Routes = [
  {
    path:'',
    component: NotificationsComponent
  }
];

@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FileUploaderVerticalModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    
    MatDatepickerModule, MatInputModule,MatNativeDateModule,
    AmazingTimePickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CarouselModule.forRoot(),
    MatChipsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
  ]
})
export class NotificationsModule { }
