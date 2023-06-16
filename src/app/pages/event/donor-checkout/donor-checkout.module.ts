import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import { DonorCheckoutComponent } from './donor-checkout.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {EventRegisterModule} from "../registration-component/event-register.module";

const routes : Routes = [
  {
    path: '',
    component: DonorCheckoutComponent
  }
];

@NgModule({
  declarations: [DonorCheckoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatRadioModule,
    MatInputModule,
    EventRegisterModule
  ],
})
export class DonorCheckoutModule { }
