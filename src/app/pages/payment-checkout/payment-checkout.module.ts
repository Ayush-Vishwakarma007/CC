import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentCheckoutComponent } from './payment-checkout.component';
import {RouterModule, Routes} from "@angular/router";
import {ComponentsModule} from "../../components/components.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardModule} from "@angular/material/card";
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";
import {ModalModule} from "ngx-bootstrap";
const routes: Routes = [
  {
    path:'',
    component: PaymentCheckoutComponent
  }
];
@NgModule({
  declarations: [PaymentCheckoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatRadioModule,
    MatTabsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
  ]
})
export class PaymentCheckoutModule { }
