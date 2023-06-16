import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import { DonationDashboardComponent } from './donation-dashboard.component';
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import {MatTabsModule} from '@angular/material/tabs';
import {NgApexchartsModule} from "ng-apexcharts";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "../../../components/components.module";

const routes : Routes = [
  {
    path: '',
    component: DonationDashboardComponent
  }
];

@NgModule({
  declarations: [DonationDashboardComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SidebarModule,
        MatTabsModule,
        NgApexchartsModule,
        InfiniteScrollModule,
        TranslateModule,
        ComponentsModule,

    ]
})
export class DonationDashboardModule { }
