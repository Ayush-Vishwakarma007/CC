import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicPageComponent, SafeHtmlPipe} from './dynamic-page.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DirectiveModule} from "../../../directive/directive.module";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
const routes: Routes = [
  {
    path: '',
    component: DynamicPageComponent
  }
]

@NgModule({
  declarations: [DynamicPageComponent,SafeHtmlPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DirectiveModule,MatCardModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    RouterModule.forChild(routes)
  ]
})
export class DynamicPageModule { }
