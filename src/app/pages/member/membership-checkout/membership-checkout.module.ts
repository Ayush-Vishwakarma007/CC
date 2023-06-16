import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipCheckoutComponent } from './membership-checkout.component';
import {RouterModule, Routes} from "@angular/router";
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";
import {MembershipComponentModule} from "../membership-component/membership-component.module";
const routes: Routes = [
  {
    path:'',
    component: MembershipCheckoutComponent
  }
];
@NgModule({
  declarations: [MembershipCheckoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatRadioModule,
    MatInputModule,
    MembershipComponentModule
  ]
})
export class MembershipCheckoutModule { }
