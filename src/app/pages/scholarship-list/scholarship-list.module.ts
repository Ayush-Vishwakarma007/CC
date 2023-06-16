import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScholarshipListComponent } from './scholarship-list.component';
import { Routes, RouterModule } from '@angular/router';
import {MatInputModule} from '@angular/material/input';

const routes: Routes = [
  {
    path:'',
    component: ScholarshipListComponent
  }
];

@NgModule({
  declarations: [ScholarshipListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule

  ]
})
export class ScholarshipListModule { }
