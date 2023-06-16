import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import {Routes, RouterModule} from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';

const routes: Routes = [
  {
    path:'',
    component: PaymentComponent
  }
];

@NgModule({
  declarations: [PaymentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatRadioModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ]
})
export class PaymentModule { }
