import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FileUploaderVerticalModule} from '../../../components/file-uploader-vertical/file-uploader-vertical.module';
import { NgxEditorModule } from 'ngx-editor';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {AddTicketComponent} from './add-ticket/add-ticket.component';
import {FoodSelectionComponent} from './food-selection/food-selection.component';
import {PaymentComponent} from './payment/payment.component';
import {VendorBookingComponent} from './vendor-booking/vendor-booking.component';
import {DonationSponsorComponent} from './donation-sponsor/donation-sponsor.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {MatMomentDatetimeModule} from "@mat-datetimepicker/moment";
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import {FileUploaderEventModule} from "../../../components/file-uploader-event/file-uploader-event.module";
import {addTicketModule} from "./add-ticket/add-ticket.module";
import {DonationSponsorModule} from "./donation-sponsor/donation-sponsor.module";
import {FoodSelectionModule} from "./food-selection/food-selection.module";
import {PaymentModule} from "./payment/payment.module";
import {VendorBookingModule} from "./vendor-booking/vendor-booking.module";
import { DonateEventModule } from './donate-event/donate-event.module';
import { DonateEventComponent } from './donate-event/donate-event.component';



@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule, MatNativeDateModule,
    FileUploaderEventModule,
    FileUploaderVerticalModule,
    NgxEditorModule,
    MatChipsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    GooglePlaceModule,
    MatDatepickerModule,
    // use this if you want to use native javascript dates and INTL API if available
    // MatNativeDatetimeModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule, FileUploaderEventModule,
    addTicketModule,
    DonationSponsorModule,
    FoodSelectionModule,
    PaymentModule,
    VendorBookingModule,
    DonateEventModule,

  ],
  exports: [AddTicketComponent,DonateEventComponent,DonationSponsorComponent,FoodSelectionComponent,PaymentComponent,VendorBookingComponent],
})


export class EventBookingModule { }
