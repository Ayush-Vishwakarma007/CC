import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FileUploaderVerticalModule} from '../../../components/file-uploader-vertical/file-uploader-vertical.module';
import {NgxEditorModule} from 'ngx-editor';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {MatMomentDatetimeModule} from "@mat-datetimepicker/moment";
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import {FileUploaderEventModule} from "../../../components/file-uploader-event/file-uploader-event.module";
import {DonorSponsorModule} from "./donor-sponsor/donor-sponsor.module";
import {DonorSponsorComponent} from "./donor-sponsor/donor-sponsor.component";
import {PaymentDetailComponent} from "./payment-detail/payment-detail.component";
import {PaymentDetailModule} from "./payment-detail/payment-detail.module";
import {BookTicketsComponent} from "./book-tickets/book-tickets.component";
import {BookTicketsModule} from "./book-tickets/book-tickets.module";
import {BookVendorsComponent} from './book-vendors/book-vendors.component';
import {BookVendorsModule} from "./book-vendors/book-vendors.module";
import {AgewiseBookingComponent} from './agewise-booking/agewise-booking.component';
import {AgewiseBookingModule} from "./agewise-booking/agewise-booking.module";
import {NewUserRegisterComponent} from "./new-user-register/new-user-register.component";
import {NewUserRegisterModule} from "./new-user-register/new-user-register.module";
import {DonationSponsorshipComponent} from "./donation-sponsorship/donation-sponsorship.component";
import {DonationSponsorshipModule} from "./donation-sponsorship/donation-sponsorship.module";
import {ParticipantRegisterComponent} from "./participant-register/participant-register.component";
import {ParticipantRegisterModule} from "./participant-register/participant-register.module";


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
    MatMomentDatetimeModule,
    MatDatetimepickerModule, FileUploaderEventModule,
    DonorSponsorModule,
    PaymentDetailModule,
    BookTicketsModule,
    BookVendorsModule,
    AgewiseBookingModule,
    NewUserRegisterModule,
    DonationSponsorshipModule,
    ParticipantRegisterModule,
  ],
  exports: [
    DonationSponsorshipComponent,
    NewUserRegisterComponent,
    AgewiseBookingComponent,
    BookTicketsComponent,
    BookVendorsComponent,
    DonorSponsorComponent,
    PaymentDetailComponent,
    ParticipantRegisterComponent,
  ],
})


export class EventRegisterModule {
}
