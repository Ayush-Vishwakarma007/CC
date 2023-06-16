import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventPerformanceComponent } from './event-performance.component';
import { MatTabsModule } from "@angular/material/tabs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { NgxEditorModule } from "ngx-editor";
import { TranslateModule } from "@ngx-translate/core";
import { MatDatetimepickerModule } from "@mat-datetimepicker/core";
import { MatNativeDateModule } from '@angular/material/core';
import { FileUploaderVerticalModule } from '../../../../../components/file-uploader-vertical/file-uploader-vertical.module';
import {ModalModule} from "ngx-bootstrap";

@NgModule({
  declarations: [EventPerformanceComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgxEditorModule,
    TranslateModule,
    MatDatetimepickerModule,
    MatNativeDateModule,
    FileUploaderVerticalModule,
    ModalModule.forRoot()
  ],
  exports: [EventPerformanceComponent],
})
export class EventPerformanceModule { }
