import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { MembershipBenefitsComponent } from './membership-benefits.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";


const routes: Routes = [
  {
    path:'',
    component: MembershipBenefitsComponent
  }
];

@NgModule({
  declarations: [MembershipBenefitsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatRadioModule,
    MatInputModule,
    MatSelectModule,
    SidebarModule

  ]
})
export class MembershipBenefitsModule { }
