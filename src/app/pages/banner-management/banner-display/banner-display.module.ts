import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BannerDisplayComponent } from './banner-display.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MccColorPickerModule } from "material-community-components/color-picker";
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUploaderVerticalModule } from "../../../components/file-uploader-vertical/file-uploader-vertical.module";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {TranslateModule} from "@ngx-translate/core";
import {ModalModule} from "ngx-bootstrap";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: BannerDisplayComponent
  }
]

@NgModule({
  declarations: [BannerDisplayComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatInputModule,
    UiSwitchModule,
    MccColorPickerModule.forRoot({}),
    ColorPickerModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploaderVerticalModule,
    MatAutocompleteModule,
    TranslateModule,
    ModalModule.forRoot(),
    MatCheckboxModule,
    PipesModule
  ]
})
export class BannerDisplayModule { }
