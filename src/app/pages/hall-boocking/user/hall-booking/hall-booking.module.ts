import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { HallBookingComponent } from './hall-booking.component';
import { MatInputModule } from "@angular/material/input";
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';

const routes: Routes = [
  {
    path: '',
    component: HallBookingComponent
  }
];

@NgModule({
  declarations: [HallBookingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ]
})
export class HallBookingModule { }
