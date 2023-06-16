import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationSponsorshipComponent } from './donation-sponsorship.component';
import {FormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [DonationSponsorshipComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    TranslateModule,

  ],
  exports: [DonationSponsorshipComponent],

})
export class DonationSponsorshipModule { }
