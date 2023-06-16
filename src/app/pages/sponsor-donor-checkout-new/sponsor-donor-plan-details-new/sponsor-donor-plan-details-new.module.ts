import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { SponsorDonorPlanDetailsNewComponent } from './sponsor-donor-plan-details-new.component';
import { Routes, RouterModule } from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ReactiveFormsModule} from "@angular/forms";
import {DirectiveModule} from "../../../directive/directive.module";
import {ComponentsModule} from "../../../components/components.module";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";

@NgModule({
  declarations: [SponsorDonorPlanDetailsNewComponent],
  exports: [
    SponsorDonorPlanDetailsNewComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    DirectiveModule,
    ComponentsModule,
    GooglePlaceModule
  ]
})
export class SponsorDonorPlanDetailsNewModule { }
