import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { MemberDetailsComponent } from './member-details.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DirectiveModule} from "../../../directive/directive.module";

import {AmazingTimePickerModule} from "@jonijnm/amazing-time-picker";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime-ex";
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";
import {FileUploaderVerticalModule} from "../../../components/file-uploader-vertical/file-uploader-vertical.module";
import {MatRadioModule} from "@angular/material/radio";
import {BraintreeGateway} from "braintree";
import { NgxPayPalModule } from 'ngx-paypal';
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import {ModalModule} from "ngx-bootstrap";
import {ComponentsModule} from "../../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {NgxEditorModule} from "ngx-editor";
import { UiSwitchModule } from "ngx-ui-switch";

const routes: Routes = [
  {
    path:'',
    component: MemberDetailsComponent
  }
];
@NgModule({
  declarations: [MemberDetailsComponent],
  imports: [
    NgxPayPalModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatInputModule, FormsModule,
    ReactiveFormsModule,
    DirectiveModule,
    
    MatInputModule,
    AmazingTimePickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SidebarModule, MatCheckboxModule,
    MatSelectModule,
    FileUploaderVerticalModule,
    MatRadioModule,
    // BraintreeGateway,
    NgxEditorModule,
    MatDatetimepickerModule,
    ModalModule.forRoot(), ComponentsModule, TranslateModule, MatDatepickerModule, MatChipsModule, MatIconModule,
    UiSwitchModule
  ]
})
export class MemberDetailsModule { }
