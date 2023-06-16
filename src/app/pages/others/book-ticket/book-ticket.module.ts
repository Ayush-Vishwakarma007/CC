import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookTicketComponent } from './book-ticket.component';
import { Routes, RouterModule } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {AddTicketComponent }from '../event-booking/add-ticket/add-ticket.component';
import {FoodSelectionComponent} from '../event-booking/food-selection/food-selection.component';
import {PaymentComponent} from '../event-booking/payment/payment.component';
import {VendorBookingComponent} from '../event-booking/vendor-booking/vendor-booking.component';
import {DonationSponsorComponent} from '../event-booking/donation-sponsor/donation-sponsor.component';
import { from } from 'rxjs';
import {EventBookingModule} from "../event-booking/event-booking.module";

const routes: Routes = [
  {
    path:'',
    component: BookTicketComponent
  }
];

@NgModule({
  declarations: [BookTicketComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    EventBookingModule
  ]
})
export class BookTicketModule { }
