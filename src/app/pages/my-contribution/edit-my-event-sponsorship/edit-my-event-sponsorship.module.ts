import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditMyEventSponsorshipComponent } from './edit-my-event-sponsorship.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { MatMomentDatetimeModule } from "@mat-datetimepicker/moment";
import { MatDatetimepickerModule } from "@mat-datetimepicker/core";
import { FileUploaderVerticalModule } from "../../../components/file-uploader-vertical/file-uploader-vertical.module";
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: EditMyEventSponsorshipComponent
  }
];

@NgModule({
  declarations: [EditMyEventSponsorshipComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    TranslateModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule,
    FileUploaderVerticalModule,
    PipesModule,
  ]
})
export class EditMyEventSponsorshipModule { }
