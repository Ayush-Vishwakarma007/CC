import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloverDemoComponent } from './clover-demo.component';
import {RouterModule, Routes} from "@angular/router";
import {ComponentsModule} from "../../components/components.module";

const routes: Routes = [
  {
    path: '',
    component: CloverDemoComponent
  }
];

@NgModule({
  declarations: [CloverDemoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ]
})
export class CloverDemoModule { }
