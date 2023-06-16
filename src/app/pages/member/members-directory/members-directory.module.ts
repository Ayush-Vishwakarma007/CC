import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersDirectoryComponent } from './members-directory.component';
import {RouterModule, Routes} from "@angular/router";
import {ComponentsModule} from "../../../components/components.module";
import {MemberListModule} from "../member-list/member-list.module";
import {MatTabsModule} from "@angular/material/tabs";
import {NgApexchartsModule} from "ng-apexcharts";
import {StatisticsComponent} from "./statistics/statistics.component";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path:'',
    component: MembersDirectoryComponent
  }
];
@NgModule({
  declarations: [MembersDirectoryComponent,StatisticsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    MatTabsModule,
    NgApexchartsModule,
    TranslateModule,
  ]
})
export class MembersDirectoryModule { }
