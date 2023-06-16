import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewsManagementComponent } from './news-management.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { MatDatetimepickerModule } from "@mat-datetimepicker/core";
import { ModalModule } from 'ngx-bootstrap';
import {SidebarModule} from "../../layouts/sidebar/sidebar.module";
import {MatTabsModule} from "@angular/material/tabs";
import {FileUploaderEventModule} from "../../components/file-uploader-event/file-uploader-event.module";
import {MatMomentDatetimeModule} from "@mat-datetimepicker/moment";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FileUploaderVerticalModule} from "../../components/file-uploader-vertical/file-uploader-vertical.module";
import {ComponentsModule} from "../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {OwlDateTimeModule,OwlNativeDateTimeModule} from "ng-pick-datetime-ex";
import {NgxEditorModule} from "ngx-editor";
import { PipesModule } from '../../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: NewsManagementComponent,
  }
];

@NgModule({
  declarations: [NewsManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatInputModule,
    MatDatetimepickerModule,
    ModalModule.forRoot(),
    SidebarModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatDatetimepickerModule,
    FileUploaderEventModule,
    MatMomentDatetimeModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploaderVerticalModule,
    ComponentsModule,
    TranslateModule,
    MatAutocompleteModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxEditorModule,
    PipesModule,


  ]
})
export class NewsManagementModule { }
