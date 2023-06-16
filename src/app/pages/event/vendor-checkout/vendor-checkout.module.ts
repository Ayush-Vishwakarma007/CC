import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VendorCheckoutComponent } from './vendor-checkout.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {EventRegisterModule} from "../registration-component/event-register.module";

const routes: Routes = [
  {
    path:'',
    component: VendorCheckoutComponent
  }
];

@NgModule({
  declarations: [VendorCheckoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatRadioModule,
    MatInputModule,
    EventRegisterModule

  ]
})
export class VendorCheckoutModule { }
