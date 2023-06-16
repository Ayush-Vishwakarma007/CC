import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import { CreateMembershipNewComponent } from './create-membership-new.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FileUploaderEventModule} from "../../../components/file-uploader-event/file-uploader-event.module";
import {FileUploaderVerticalModule} from "../../../components/file-uploader-vertical/file-uploader-vertical.module";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";


const routes : Routes = [
  {
    path: '',
    component: CreateMembershipNewComponent
  }
];

@NgModule({
  declarations: [CreateMembershipNewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,

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
    MatIconModule,
    GooglePlaceModule,
    MatDatepickerModule,
    MatAutocompleteModule,

    SidebarModule,

  ]
})
export class CreateMembershipNewModule { }
