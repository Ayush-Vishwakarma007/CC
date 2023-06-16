import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";
import { SponsorshipbenefitsComponent } from './sponsorshipbenefits.component';

const routes: Routes = [
  {
    path:'',
    component: SponsorshipbenefitsComponent
  }
];


@NgModule({
  declarations: [SponsorshipbenefitsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule
  ]
})
export class SponsorshipbenefitsModule { }
