import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SurveyFormCreateComponent } from './survey-form-create.component';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';

const routes: Routes = [
  {
    path:'',
    component: SurveyFormCreateComponent
  }
];

@NgModule({
  declarations: [SurveyFormCreateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule
  ]
})
export class SurveyFormCreateModule { }
