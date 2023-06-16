import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnandBazzarComponent } from './anand-bazzar.component';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '',
    component: AnandBazzarComponent
  }
];

@NgModule({
  declarations: [AnandBazzarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class AnandBazzarModule { }
