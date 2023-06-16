import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThanksSuccessfulPaymentComponent } from './thanks-successful-payment.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    component: ThanksSuccessfulPaymentComponent
  }
];

@NgModule({
  declarations: [ThanksSuccessfulPaymentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ThanksSuccessfulPaymentModule { }
