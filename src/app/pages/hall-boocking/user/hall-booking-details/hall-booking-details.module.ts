import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { HallBookingDetailsComponent } from './hall-booking-details.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';

const routes: Routes = [
  {
    path: '',
    component: HallBookingDetailsComponent
  }
];

@NgModule({
  declarations: [HallBookingDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CarouselModule
  ]
})
export class HallBookingDetailsModule { }
