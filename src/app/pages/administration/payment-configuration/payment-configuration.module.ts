import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PaymentConfigurationComponent} from "./payment-configuration.component";
import {RouterModule, Routes} from "@angular/router";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {UiSwitchModule} from "ngx-ui-switch";
import {TranslateModule} from "@ngx-translate/core";
const routes: Routes = [
  {
    path:'',
    component: PaymentConfigurationComponent
  }
];
@NgModule({
  declarations: [PaymentConfigurationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    UiSwitchModule,
    MatSelectModule,
    FormsModule,
    TranslateModule,

  ],
  exports:[PaymentConfigurationComponent]
})
export class PaymentConfigurationModule { }
