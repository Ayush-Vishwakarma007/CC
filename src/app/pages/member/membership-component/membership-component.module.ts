import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PaymentInfoComponent} from "./payment-info/payment-info.component";
import {PaymentInfoModule} from "./payment-info/payment-info.module";
import {MembershipDonationComponent} from "./membership-donation/membership-donation.component";
import {MembershipDonationModule} from "./membership-donation/membership-donation.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PaymentInfoModule,
    MembershipDonationModule
  ],
  exports:[PaymentInfoComponent,MembershipDonationComponent]
})
export class MembershipComponentModule { }
