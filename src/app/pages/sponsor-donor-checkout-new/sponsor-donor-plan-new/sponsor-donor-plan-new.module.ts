import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import { ModalModule } from 'ngx-bootstrap';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { SponsorDonorPlanNewComponent } from './sponsor-donor-plan-new.component';
import {FormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [SponsorDonorPlanNewComponent],
  exports: [
    SponsorDonorPlanNewComponent
  ],
    imports: [
        CommonModule,
        MatTabsModule,
        MatCardModule,
        MatRadioModule,
        ModalModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatSelectModule
    ]
})
export class SponsorDonorPlanNewModule { }
