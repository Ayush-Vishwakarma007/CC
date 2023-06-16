import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import {RouterModule, Routes} from "@angular/router";
import {ComponentsModule} from "../../components/components.module";


const routes: Routes = [
  {
    path: '',
    component: EditorComponent
  }
];

@NgModule({
  declarations: [EditorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ]
})
export class EditorModule { }
