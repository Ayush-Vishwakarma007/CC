import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipCheckoutNewComponent } from './membership-checkout-new.component';
import {RouterModule, Routes} from "@angular/router";
import {MembershipPlanNewModule} from "./membership-plan-new/membership-plan-new.module";
import {MembershipPlanDetailsNewModule} from "./membership-plan-details-new/membership-plan-details-new.module";
import {MembershipPlanPaymentNewModule} from "./membership-plan-payment-new/membership-plan-payment-new.module";
import {MembershipAsGuestModule} from "./membership-as-guest/membership-as-guest.module";

const routes: Routes = [
  {
    path:'',
    component: MembershipCheckoutNewComponent
  }
];
@NgModule({
  declarations: [MembershipCheckoutNewComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MembershipPlanNewModule,
        MembershipPlanDetailsNewModule,
        MembershipPlanPaymentNewModule,
        MembershipAsGuestModule,

    ]
})
export class MembershipCheckoutNewModule { }
