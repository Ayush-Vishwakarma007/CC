import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {ModalModule} from "ngx-bootstrap";
@NgModule({
  declarations: [PaymentComponent],
  exports: [
    PaymentComponent
  ],
  imports: [
    CommonModule,
    MatRadioModule,
    MatCheckboxModule,
    FormsModule,
    ModalModule.forRoot()
  ]
})
export class PaymentModule { }
