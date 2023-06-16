import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TicketBookingNewComponent } from './ticket-booking-new.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { TicketSelectionComponent } from './ticket-selection/ticket-selection.component';
import { ParkingSelectionComponent } from './parking-selection/parking-selection.component';
import { AccomodationSelectionComponent } from './accomodation-selection/accomodation-selection.component';
import { FoodSelectionComponent } from './food-selection/food-selection.component';
import { SponsorDonorSelectionComponent } from './sponsor-donor-selection/sponsor-donor-selection.component';
import { ParticipateSelectionComponent } from './participate-selection/participate-selection.component';
import { VolunteerSelectionComponent } from './volunteer-selection/volunteer-selection.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "../../components/components.module";
import {FileUploaderVerticalModule} from "../../components/file-uploader-vertical/file-uploader-vertical.module";
import { VendorSelectionComponent } from './vendor-selection/vendor-selection.component';
import { GuestLoginComponent } from './guest-login/guest-login.component';
import { TicketBookingPayementComponent } from './ticket-booking-payement/ticket-booking-payement.component';
import { SponsorDonorPlanPaymentNewModule } from '../sponsor-donor-checkout-new/sponsor-donor-plan-payment-new/sponsor-donor-plan-payment-new.module';
import {DirectiveModule} from "../../directive/directive.module";
import { SelectionTicketComponent } from './selection-ticket/selection-ticket.component';
import { AdditionalInformationComponent } from './additional-information/additional-information.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";
import {MatNativeDateModule} from "@angular/material/core";
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path:'',
    component: TicketBookingNewComponent
  }
];

@NgModule({
  declarations: [TicketBookingNewComponent, TicketSelectionComponent, ParkingSelectionComponent, AccomodationSelectionComponent, FoodSelectionComponent, SponsorDonorSelectionComponent, ParticipateSelectionComponent, VolunteerSelectionComponent, VendorSelectionComponent, GuestLoginComponent, TicketBookingPayementComponent, SelectionTicketComponent, AdditionalInformationComponent,],
  providers: [DatePipe],
  imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatTabsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatRadioModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        SponsorDonorPlanPaymentNewModule,
        ReactiveFormsModule,
        FormsModule,
        ModalModule.forRoot(),
        TranslateModule,
        ComponentsModule,
        FileUploaderVerticalModule,
        DirectiveModule,
        NgxDaterangepickerMd.forRoot(),
        PipesModule
    ]
})
export class TicketBookingNewModule { }
