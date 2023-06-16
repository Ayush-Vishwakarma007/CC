import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BecomeSponsorComponent } from './become-sponsor.component';
import { Routes, RouterModule } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {EventBookingModule} from "../event-booking/event-booking.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path:'',
    component: BecomeSponsorComponent
  }
];

@NgModule({
  declarations: [BecomeSponsorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    EventBookingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BecomeSponsorModule { }
