import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllSponsorsComponent } from './all-sponsors.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'chapter-committee/:id',
    component: AllSponsorsComponent
  }
]

@NgModule({
  declarations: [AllSponsorsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AllSponsorsModule { }
