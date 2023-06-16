import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorDashboardComponent } from './vendor-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path:'',
    component: VendorDashboardComponent
  }
];

@NgModule({
  declarations: [VendorDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatExpansionModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class VendorDashboardModule { }
