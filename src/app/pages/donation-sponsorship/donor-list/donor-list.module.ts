import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { DonorListComponent } from './donor-list.component';
import {NgApexchartsModule} from "ng-apexcharts";
import {MatTabsModule} from '@angular/material/tabs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


const routes: Routes = [
  {
    path: '',
    component: DonorListComponent
  }
];

@NgModule({
  declarations: [DonorListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgApexchartsModule,
    MatTabsModule,
    InfiniteScrollModule,
  ]
})
export class DonorListModule { }
