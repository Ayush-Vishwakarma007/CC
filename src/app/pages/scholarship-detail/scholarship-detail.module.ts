import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScholarshipDetailComponent } from './scholarship-detail.component';
import { Routes, RouterModule } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {ModalModule} from "ngx-bootstrap";



const routes: Routes = [
  {
    path:'',
    component: ScholarshipDetailComponent
  }
];

@NgModule({
  declarations: [ScholarshipDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatTabsModule,
    ModalModule.forRoot()
  ]
})
export class ScholarshipDetailModule { }
