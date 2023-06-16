import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateFormComponent } from './create-form.component';
import {RouterModule, Routes} from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import { NativeDateAdapter, MatNativeDateModule } from '@angular/material/core';

const routes: Routes = [
  {
    path: '',
    component: CreateFormComponent
  }
];


@NgModule({
  declarations: [CreateFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SidebarModule,
    ModalModule.forRoot(),
    DragDropModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ]
})
export class CreateFormModule { }
