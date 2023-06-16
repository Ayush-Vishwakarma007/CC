import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DonationSponsorComponent} from "./donation-sponsor.component";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [DonationSponsorComponent],
  exports: [
    DonationSponsorComponent
  ],
  imports: [
    CommonModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DonationSponsorModule { }
