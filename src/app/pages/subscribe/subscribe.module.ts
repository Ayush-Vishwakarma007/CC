import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SubscribeComponent } from './subscribe.component';
import {FormsModule} from "@angular/forms";


const routes: Routes = [
  {
    path:'',
    component: SubscribeComponent
  }
];

@NgModule({
  declarations: [SubscribeComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule
    ]
})
export class SubscribeModule { }
