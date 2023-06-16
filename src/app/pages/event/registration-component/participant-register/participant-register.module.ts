import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantRegisterComponent } from './participant-register.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatMomentDatetimeModule} from "@mat-datetimepicker/moment";
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {TranslateModule} from "@ngx-translate/core";
import {FileUploaderVerticalModule} from "../../../../components/file-uploader-vertical/file-uploader-vertical.module";
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [ParticipantRegisterComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
    FileUploaderVerticalModule,
    PipesModule,
  ],
  exports: [ParticipantRegisterComponent]
})
export class ParticipantRegisterModule { }
