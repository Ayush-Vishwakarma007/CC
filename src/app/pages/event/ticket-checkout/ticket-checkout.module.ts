import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TicketCheckoutComponent } from './ticket-checkout.component';
import {EventRegisterModule} from "../registration-component/event-register.module";
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";

const routes: Routes = [
  {
    path:'',
    component: TicketCheckoutComponent
  }
];

@NgModule({
  declarations: [TicketCheckoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatRadioModule,
    MatInputModule,
    EventRegisterModule
  ]
})
export class TicketCheckoutModule { }
