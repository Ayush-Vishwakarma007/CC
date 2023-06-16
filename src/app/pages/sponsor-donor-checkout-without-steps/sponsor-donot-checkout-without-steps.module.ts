import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SponsorDonorCheckoutWithoutStepsComponent } from "./sponsor-donor-checkout-without-steps.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ComponentsModule } from "src/app/components/components.module";
import { DirectiveModule } from "src/app/directive/directive.module";
import { MatTabsModule } from "@angular/material/tabs";
import { NgxSpinnerModule } from "ngx-spinner";
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
import { CurrencyDirective } from './currency.directive';


export const customCurrencyMaskConfig = {
  align: "left",
  allowNegative: false,
  allowZero: false,
  decimal: ".",
  precision: 2,
  prefix: "$ ",
  suffix: "",
  thousands: ",",
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.NATURAL
};

const routes: Routes = [
    {
      path: '',
      component: SponsorDonorCheckoutWithoutStepsComponent,
    }
  ];

@NgModule({
    declarations:[SponsorDonorCheckoutWithoutStepsComponent,CurrencyDirective],
    imports:[
      RouterModule.forChild(routes),
      CommonModule,
      FormsModule,
      MatCardModule,
      MatTabsModule,
      MatRadioModule,
      MatFormFieldModule,
      MatInputModule,
      MatCheckboxModule,
      ReactiveFormsModule,
      DirectiveModule,
      ComponentsModule,
      GooglePlaceModule,
      NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
      NgxSpinnerModule.forRoot(),
    ],
    providers: [CurrencyPipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SponsorDonorCheckoutWithoutStepsModule {

}