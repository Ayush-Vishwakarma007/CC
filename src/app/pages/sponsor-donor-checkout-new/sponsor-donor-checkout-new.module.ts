import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SponsorDonorCheckoutNewComponent} from './sponsor-donor-checkout-new.component';
import {RouterModule, Routes} from "@angular/router";
import {SponsorDonorPlanNewModule} from "./sponsor-donor-plan-new/sponsor-donor-plan-new.module";
import {SponsorDonorPlanDetailsNewModule} from "./sponsor-donor-plan-details-new/sponsor-donor-plan-details-new.module";
import {SponsorDonorPlanPaymentNewModule} from "./sponsor-donor-plan-payment-new/sponsor-donor-plan-payment-new.module";
import {ModalModule} from "ngx-bootstrap";
import {MembershipAsGuestModule} from "../member/membership-checkout-new/membership-as-guest/membership-as-guest.module";


const routes: Routes = [
  {
    path: '',
    component: SponsorDonorCheckoutNewComponent,
  }
];

@NgModule({
  declarations: [SponsorDonorCheckoutNewComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SponsorDonorPlanNewModule,
        SponsorDonorPlanDetailsNewModule,
        SponsorDonorPlanPaymentNewModule,
        ModalModule.forRoot(),
        MembershipAsGuestModule,
    ]
})
export class SponsorDonorCheckoutNewModule {
}
