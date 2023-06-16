import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {FormsModule} from "@angular/forms";
import {DonorSponsorComponent} from "./donor-sponsor.component";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [DonorSponsorComponent],

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
  exports: [DonorSponsorComponent]
})
export class DonorSponsorModule { }
