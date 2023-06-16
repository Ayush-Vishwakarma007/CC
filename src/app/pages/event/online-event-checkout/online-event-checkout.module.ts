import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineEventCheckoutComponent } from './online-event-checkout.component';
import {RouterModule, Routes} from "@angular/router";
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";
import {EventRegisterModule} from "../registration-component/event-register.module";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
const routes: Routes = [
  {
    path:'',
    component: OnlineEventCheckoutComponent
  }
];

@NgModule({
  declarations: [OnlineEventCheckoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatRadioModule,
    MatInputModule,
    EventRegisterModule,
    ReactiveFormsModule,
    TranslateModule,
  ]
})
export class OnlineEventCheckoutModule { }
