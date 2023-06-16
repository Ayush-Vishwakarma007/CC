import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScholarshipManagementComponent } from './scholarship-management.component';
import { Routes, RouterModule } from '@angular/router';
import { MatInputModule} from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatetimepickerModule} from "@mat-datetimepicker/core";
import { NgxEditorModule } from 'ngx-editor';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';

const routes: Routes = [
  {
    path:'',
    component: ScholarshipManagementComponent
  }
];

@NgModule({
  declarations: [ScholarshipManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatetimepickerModule,
    NgxEditorModule,
    MatMomentDatetimeModule
    
  ]
})
export class ScholarshipManagementModule { }
