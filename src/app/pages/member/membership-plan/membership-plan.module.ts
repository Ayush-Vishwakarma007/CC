import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipPlanComponent } from './membership-plan.component';
import {RouterModule, Routes} from "@angular/router";
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";

const routes: Routes = [
  {
    path:'',
    component: MembershipPlanComponent
  }
];
@NgModule({
  declarations: [MembershipPlanComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatRadioModule,
    MatInputModule,
    MatSelectModule,
    SidebarModule
  ]
})
export class MembershipPlanModule { }
