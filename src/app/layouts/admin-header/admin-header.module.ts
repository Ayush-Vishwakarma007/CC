import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { AdminHeaderComponent } from './admin-header.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [AdminHeaderComponent],
  exports: [
    AdminHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
  ]
})
export class AdminHeaderModule { }
