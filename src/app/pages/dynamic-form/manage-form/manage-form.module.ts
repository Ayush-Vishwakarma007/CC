import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageFormComponent } from './manage-form.component';
import {RouterModule, Routes} from "@angular/router";
import {ModalModule} from "ngx-bootstrap/modal";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ComponentsModule} from "../../../components/components.module";

const routes: Routes = [
  {
    path: '',
    component: ManageFormComponent
  }
];


@NgModule({
  declarations: [ManageFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ModalModule.forRoot(),
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    SidebarModule,
    ComponentsModule
    
  ]
})
export class ManageFormModule { }
