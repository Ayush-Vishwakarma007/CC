import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {EventRegisterModule} from "../registration-component/event-register.module";
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";
import { ParticipateCheckoutComponent } from './participate-checkout.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path:'',
    component: ParticipateCheckoutComponent
  }
];

@NgModule({
  declarations: [ParticipateCheckoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatRadioModule,
    MatInputModule,
    EventRegisterModule
  ]
})
export class ParticipateCheckoutModule { }
