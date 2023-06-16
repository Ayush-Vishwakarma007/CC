import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// import { AlertModule } from 'ngx-alerts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import { AmazingTimePickerModule } from '@jonijnm/amazing-time-picker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import {TranslateModule} from "@ngx-translate/core";

import {RegisterDoneComponent} from './register-done.component';
const routes: Routes = [
  {
    path:'',
    component: RegisterDoneComponent
  }
];
@NgModule({
  declarations: [RegisterDoneComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    
    MatDatepickerModule, MatInputModule,MatNativeDateModule,
    AmazingTimePickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CarouselModule.forRoot(),
    NgxSliderModule,
    ShareButtonsModule,
    TranslateModule,
  ]
})
export class RegisterDoneModule { }
