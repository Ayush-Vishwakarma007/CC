import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FileUploaderVerticalModule} from '../../../components/file-uploader-vertical/file-uploader-vertical.module';
import { NgxEditorModule } from 'ngx-editor';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {MatMomentDatetimeModule} from "@mat-datetimepicker/moment";
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import {FileUploaderEventModule} from "../../../components/file-uploader-event/file-uploader-event.module";
import {CreateMembershipComponent} from "./create-membership.component";
import { BasicInformationComponent } from './basic-information/basic-information.component';
import { MembershipNumberComponent } from './membership-number/membership-number.component';
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import { UiSwitchModule } from "ngx-ui-switch";
const routes : Routes = [
  {
    path: '',
    component: CreateMembershipComponent
  }
];

@NgModule({
  declarations: [CreateMembershipComponent, BasicInformationComponent, MembershipNumberComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule, MatNativeDateModule,
    FileUploaderEventModule,
    FileUploaderVerticalModule,
    NgxEditorModule,
    MatChipsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    GooglePlaceModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    // use this if you want to use native javascript dates and INTL API if available
    // MatNativeDatetimeModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule, FileUploaderEventModule,
    SidebarModule,
    UiSwitchModule
  ]
})
export class CreateMembershipModule { }
