import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ModalModule } from 'ngx-bootstrap';
import { SponsorDonorPlanPaymentNewComponent } from './sponsor-donor-plan-payment-new.component'; 
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
  declarations: [SponsorDonorPlanPaymentNewComponent],
  exports: [
    SponsorDonorPlanPaymentNewComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatRadioModule,
    MatTabsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule,
  ]
})
export class SponsorDonorPlanPaymentNewModule { }
