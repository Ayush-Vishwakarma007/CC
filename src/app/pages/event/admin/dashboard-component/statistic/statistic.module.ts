import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticComponent } from './statistic.component';
import {MatTabsModule} from "@angular/material/tabs";
import {NgApexchartsModule} from "ng-apexcharts";
import {RouterModule} from "@angular/router";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "../../../../../components/components.module";
import { MyContributionModule } from '../statistic/my-contribution/my-contribution.module';

@NgModule({
  declarations: [StatisticComponent],
    imports: [
        CommonModule,
        MatTabsModule,
        NgApexchartsModule,
        RouterModule,
        InfiniteScrollModule,
        TranslateModule,
        ComponentsModule,
        MyContributionModule,
    ],
  exports: [StatisticComponent],
})
export class StatisticModule { }
