import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChapterManagementComponent } from './chapter-management.component';
import {MatSelectModule} from "@angular/material/select";
import {RouterModule} from "@angular/router";
import {TextMaskModule} from "angular2-text-mask";
import {MatInputModule} from "@angular/material/input";
import {FileUploaderVerticalModule} from "../../../components/file-uploader-vertical/file-uploader-vertical.module";
import {MatButtonModule} from "@angular/material/button";
import {MccColorPickerModule} from "material-community-components/color-picker";
import {FileUploaderEventModule} from "../../../components/file-uploader-event/file-uploader-event.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ColorPickerModule} from "ngx-color-picker";
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
@NgModule({
  declarations: [ChapterManagementComponent],
  imports: [
    CommonModule,
    CommonModule,
    TextMaskModule,
    MatInputModule,
    FileUploaderVerticalModule,
    MatButtonModule,
    MccColorPickerModule.forRoot({}),
    FileUploaderEventModule,
    FormsModule,
    MatSelectModule,
    ColorPickerModule,
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
    MatMomentDatetimeModule,
    MatDatetimepickerModule, FileUploaderEventModule,
    SidebarModule, DirectiveModule, TranslateModule,
  ],
  exports: [ChapterManagementComponent],
})
export class ChapterManagementModule { }
