import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutManagementComponent } from './checkout-management.component';
import {RouterModule, Routes} from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {DonationSponsorModule} from "./donation-sponsor/donation-sponsor.module";
import {PaymentModule} from "./payment/payment.module";
import {TicketModule} from "./ticket/ticket.module";

const routes: Routes = [
  {
    path:'',
    component: CheckoutManagementComponent
  }
];

@NgModule({
  declarations: [CheckoutManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatRadioModule,
    MatCheckboxModule,
    MatExpansionModule,
    DonationSponsorModule,
    PaymentModule,
    TicketModule
  ]
})
export class CheckoutManagementModule { }
