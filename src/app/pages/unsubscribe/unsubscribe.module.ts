import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UnsubscribeComponent } from './unsubscribe.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DirectiveModule} from "../../directive/directive.module";


const routes: Routes = [
  {
    path:'',
    component: UnsubscribeComponent
  }
];

@NgModule({
  declarations: [UnsubscribeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatInputModule, FormsModule,
    ReactiveFormsModule,
    DirectiveModule,
    
    MatInputModule
  ]
})
export class UnsubscribeModule { }
