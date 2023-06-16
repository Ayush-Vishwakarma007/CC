import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendOtpComponent } from './send-otp.component';
import { Routes, RouterModule } from '@angular/router';
import {PipesModule} from "../../../pipes/pipes.module";
const routes: Routes = [
  {
    path:'',
    component: SendOtpComponent
  }
];
@NgModule({
  declarations: [SendOtpComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        PipesModule,
    ]
})
export class SendOtpModule { }
