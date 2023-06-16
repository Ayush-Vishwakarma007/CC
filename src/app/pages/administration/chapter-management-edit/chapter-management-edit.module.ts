import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChapterManagementEditComponent } from './chapter-management-edit.component';
import { Routes, RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { UiSwitchModule } from "ngx-ui-switch";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {FileUploaderVerticalModule} from "../../../components/file-uploader-vertical/file-uploader-vertical.module";
import {FileUploaderEventModule} from "../../../components/file-uploader-event/file-uploader-event.module";
import {NgxEditorModule} from "ngx-editor";
import {MccColorPickerModule} from "material-community-components/color-picker";
import {MatButtonModule} from "@angular/material/button";
import {ColorPickerModule } from 'ngx-color-picker';
import {TranslateModule} from "@ngx-translate/core";
import { ModalModule } from 'ngx-bootstrap';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TextMaskModule} from "angular2-text-mask";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path:'',
    component: ChapterManagementEditComponent,
  }
];


@NgModule({
  declarations: [ChapterManagementEditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    UiSwitchModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxEditorModule,
    FileUploaderVerticalModule,
    FileUploaderEventModule,
    MccColorPickerModule.forRoot({}),
    MatButtonModule,
    ColorPickerModule,
    TranslateModule,
    ModalModule,
    MatTooltipModule,
    TextMaskModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PipesModule,
  ]
})
export class ChapterManagementEditModule { }
