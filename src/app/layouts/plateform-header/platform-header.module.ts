import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformHeaderComponent } from './platform-header.component';
import {RouterModule, Routes} from "@angular/router";
import {HeaderComponent} from "../header-new/header.component";
const routes: Routes = [
  {
    path: '',
    component: HeaderComponent
  }
];

@NgModule({
  declarations: [PlatformHeaderComponent],
  exports: [
    PlatformHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
})
export class PlatformHeaderModule { }
