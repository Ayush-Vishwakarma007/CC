import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyOtpComponent } from './verify-otp.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path:'',
    component: VerifyOtpComponent
  }
]; 
@NgModule({
  declarations: [VerifyOtpComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class VerifyOtpModule { }
