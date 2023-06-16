import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TermConditionManagementComponent} from "./term-condition-management.component";
import {RouterModule, Routes} from "@angular/router";
import {TextMaskModule} from "angular2-text-mask";
import {MatInputModule} from "@angular/material/input";
import {FileUploaderVerticalModule} from "../../../components/file-uploader-vertical/file-uploader-vertical.module";
import {MatButtonModule} from "@angular/material/button";
import {MccColorPickerModule} from "material-community-components/color-picker";
import {FileUploaderEventModule} from "../../../components/file-uploader-event/file-uploader-event.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {NgxEditorModule} from "ngx-editor";
import {MatChipsModule} from "@angular/material/chips";
import {MatRadioModule} from "@angular/material/radio";
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
import {TranslateModule} from "@ngx-translate/core";
const routes: Routes = [
  {
    path: '',
    component: TermConditionManagementComponent
  }
];

@NgModule({
  declarations: [TermConditionManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TextMaskModule,

    MatInputModule,
    FileUploaderVerticalModule,
    MatButtonModule,
    MccColorPickerModule.forRoot({}),
    // NgxMatColorPickerModule,
    FileUploaderEventModule,
    FormsModule,
    MatSelectModule,
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
  ],
  exports:[TermConditionManagementComponent]
})
export class TermConditionManagementModule { }
