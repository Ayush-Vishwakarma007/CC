import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RecoverComponent } from './recover.component';
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path:'',
    component: RecoverComponent
  }
];

@NgModule({
  declarations: [RecoverComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule
    ]
})
export class RecoverModule { }
