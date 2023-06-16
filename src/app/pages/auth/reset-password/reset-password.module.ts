import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './reset-password.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";
import {PipesModule} from "../../../pipes/pipes.module";

const routes: Routes = [
  {
    path:'',
    component: ResetPasswordComponent
  }
];

@NgModule({
  declarations: [ResetPasswordComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        PipesModule,
    ]
})

export class ResetPasswordModule { }
