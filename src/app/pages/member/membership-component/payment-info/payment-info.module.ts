import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaymentInfoComponent} from './payment-info.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
  declarations: [PaymentInfoComponent],
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
        ComponentsModule
    ],
  exports: [PaymentInfoComponent]
})
export class PaymentInfoModule {
}
