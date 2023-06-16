import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommitteeManagementComponent } from './committee-management.component';
import { RouterModule, Routes } from "@angular/router";
import { SidebarModule } from "../../../layouts/sidebar/sidebar.module";
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from '@angular/material/select';
import {UiSwitchModule} from "ngx-ui-switch";
import {ModalModule} from "ngx-bootstrap";

const routes: Routes = [
  {
    path: '',
    component: CommitteeManagementComponent
  }
];

@NgModule({
  declarations: [CommitteeManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SidebarModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    UiSwitchModule,
    ModalModule.forRoot()
  ]
})
export class CommitteeManagementModule { }
