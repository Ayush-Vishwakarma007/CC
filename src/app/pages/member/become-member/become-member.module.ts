import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BecomeMemberComponent } from './become-member.component';
import { BraintreeGateway } from 'braintree';
import { NgxPayPalModule } from 'ngx-paypal';
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";

const routes: Routes = [
  {
    path:'',
    component: BecomeMemberComponent
  }
];

@NgModule({
  declarations: [BecomeMemberComponent],
  imports: [
    NgxPayPalModule,
    CommonModule,
    // BraintreeGateway,
    RouterModule.forChild(routes),
    SidebarModule
  ]
})
export class BecomeMemberModule { }
