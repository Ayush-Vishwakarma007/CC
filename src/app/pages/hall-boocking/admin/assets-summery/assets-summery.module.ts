import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { AssetsSummeryComponent } from './assets-summery.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MatInputModule } from "@angular/material/input";

const routes: Routes = [
  {
    path: '',
    component: AssetsSummeryComponent
  }
];

@NgModule({
  declarations: [AssetsSummeryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatInputModule
  ]
})
export class AssetsSummeryModule { }
