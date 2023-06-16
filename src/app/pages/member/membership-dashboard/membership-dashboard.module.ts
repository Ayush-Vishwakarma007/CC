import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { MembershipDashboardComponent } from './membership-dashboard.component';
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import {ComponentsModule} from "../../../components/components.module";

import {TranslateModule} from "@ngx-translate/core";


const routes: Routes = [
  {
    path:'',
    component: MembershipDashboardComponent
  }
];

@NgModule({
  declarations: [MembershipDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SidebarModule,
    ShareButtonsModule,
    ComponentsModule,
    //AnimateOnScrollModule,
    TranslateModule,
  ]
})
export class MembershipDashboardModule { }
