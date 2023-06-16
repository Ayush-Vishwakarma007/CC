import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { BannerManagementListComponent } from './banner-management-list.component';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';

const routes: Routes = [
  {
    path: '',
    component: BannerManagementListComponent
  }
]

@NgModule({
  declarations: [BannerManagementListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatInputModule
  ]
})
export class BannerManagementListModule { }
