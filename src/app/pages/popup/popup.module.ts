import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup.component';
import { Routes, RouterModule } from '@angular/router';
 
const routes: Routes = [
  {
    path:'',
    component: PopupComponent
  }
]

@NgModule({
  declarations: [PopupComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class PopupModule { }
