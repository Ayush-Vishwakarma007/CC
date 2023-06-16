import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditComponent } from './user-edit.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { EmbedVideo } from 'ngx-embed-video';
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path:'',
    component: UserEditComponent
  }
];

@NgModule({
  declarations: [UserEditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    // EmbedVideo.forRoot(),
    TranslateModule,
  ]
})
export class UserEditModule { }
