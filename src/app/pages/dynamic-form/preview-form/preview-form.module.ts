import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewFormComponent } from './preview-form.component';
import {RouterModule, Routes} from "@angular/router";
import {ModalModule} from "ngx-bootstrap/modal";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatNativeDateModule} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ComponentsModule} from "../../../components/components.module";
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";


const routes: Routes = [
  {
    path: '',
    component: PreviewFormComponent
  }
];
@NgModule({
  declarations: [PreviewFormComponent],
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
    FormsModule,
    ComponentsModule,
    //NgxMaterialTimepickerModule
  ]
})
export class PreviewFormModule { }
