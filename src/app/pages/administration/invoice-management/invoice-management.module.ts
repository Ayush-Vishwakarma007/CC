import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InvoiceManagementComponent} from "./invoice-management.component";
import {RouterModule, Routes} from "@angular/router";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FileUploaderEventModule} from "../../../components/file-uploader-event/file-uploader-event.module";
import {FileUploaderVerticalModule} from "../../../components/file-uploader-vertical/file-uploader-vertical.module";
import {NgxEditorModule} from "ngx-editor";
import {MatChipsModule} from "@angular/material/chips";
import {MatRadioModule} from "@angular/material/radio";
import {TextMaskModule} from "angular2-text-mask";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTabsModule} from "@angular/material/tabs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatMomentDatetimeModule} from "@mat-datetimepicker/moment";
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import {DirectiveModule} from "../../../directive/directive.module";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {TranslateModule} from "@ngx-translate/core";
const routes: Routes = [
  {
    path:'',
    component: InvoiceManagementComponent
  }
];

@NgModule({
  declarations: [InvoiceManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule, MatNativeDateModule,
    FileUploaderEventModule,
    FileUploaderVerticalModule,
    NgxEditorModule,
    MatChipsModule,
    MatRadioModule,
    TextMaskModule,
    MatCheckboxModule,
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    GooglePlaceModule,
    MatAutocompleteModule,

    // use this if you want to use native javascript dates and INTL API if available
    // MatNativeDatetimeModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule, FileUploaderEventModule,
    SidebarModule, DirectiveModule, TranslateModule

  ],exports:[InvoiceManagementComponent]
})
export class InvoiceManagementModule { }
