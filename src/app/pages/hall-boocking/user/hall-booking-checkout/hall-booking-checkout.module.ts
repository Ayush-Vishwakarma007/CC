import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { HallBookingCheckoutComponent } from './hall-booking-checkout.component';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';

const routes: Routes = [
  {
    path: '',
    component: HallBookingCheckoutComponent
  }
];

@NgModule({
  declarations: [HallBookingCheckoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatInputModule
  ]
})
export class HallBookingCheckoutModule { }
