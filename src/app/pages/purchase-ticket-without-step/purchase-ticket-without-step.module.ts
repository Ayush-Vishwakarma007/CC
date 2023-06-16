import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseTicketWithoutStepComponent } from './purchase-ticket-without-step.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "../../components/components.module";
import {FileUploaderVerticalModule} from "../../components/file-uploader-vertical/file-uploader-vertical.module";
import { SponsorDonorPlanPaymentNewModule } from '../sponsor-donor-checkout-new/sponsor-donor-plan-payment-new/sponsor-donor-plan-payment-new.module';
import {DirectiveModule} from "../../directive/directive.module";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";
import {MatNativeDateModule} from "@angular/material/core";
import { PipesModule } from 'src/app/pipes/pipes.module';
const routes: Routes = [
  {
    path:'',
    component: PurchaseTicketWithoutStepComponent
  }
];

@NgModule({
  declarations: [PurchaseTicketWithoutStepComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatInputModule,
    MatCheckboxModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SponsorDonorPlanPaymentNewModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    TranslateModule,
    ComponentsModule,
    FileUploaderVerticalModule,
    DirectiveModule,
    NgxDaterangepickerMd.forRoot(),
    PipesModule
  ]
})
export class PurchaseTicketWithoutStepModule { }
