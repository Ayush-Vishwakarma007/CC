import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { MemberBenefitsComponent } from './member-benefits.component';
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path:'',
    component: MemberBenefitsComponent
  }
];


@NgModule({
  declarations: [MemberBenefitsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule
  ]
})
export class MemberBenefitsModule { }
