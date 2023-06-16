import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { BasicInformationComponent } from "./basic-information/basic-information.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgxEditorModule } from 'ngx-editor';
import { FileUploaderVerticalModule } from '../../../../components/file-uploader-vertical/file-uploader-vertical.module';
import { MatDatetimepickerModule } from "@mat-datetimepicker/core";
import { MatNativeDateModule } from '@angular/material/core';
import { NotificationTemplateComponent } from './notification-template/notification-template.component';
import { NotificationFilterComponent } from './notification-filter/notification-filter.component';
import { TranslateModule } from "@ngx-translate/core";
import { MatRadioModule } from "@angular/material/radio";
import { CreateNotificationComponent } from './create-notification.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {UserSelectionComponent} from "./user-selection/user-selection.component";
import {ModalModule} from "ngx-bootstrap";
import { QuillModule } from "ngx-quill"

const routes: Routes = [
  {
    path: '',
    component: CreateNotificationComponent
  }
];

@NgModule({
  declarations: [CreateNotificationComponent, BasicInformationComponent, UserSelectionComponent,NotificationFilterComponent, NotificationTemplateComponent],
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    NgxEditorModule,
    FileUploaderVerticalModule,
    MatDatetimepickerModule,
    MatNativeDateModule,AngularEditorModule,
    TranslateModule,
    MatRadioModule,
    ModalModule.forRoot(),
    QuillModule.forRoot(),
  ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CreateNotificationModule { }
