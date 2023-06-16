import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaymentDetailComponent} from "./payment-detail.component";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {ComponentsModule} from "../../../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [PaymentDetailComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatAutocompleteModule,
    GooglePlaceModule,
    ReactiveFormsModule,
    ComponentsModule,
    TranslateModule,
  ],
  exports: [PaymentDetailComponent],
})
export class PaymentDetailModule { }
