import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreateAuditoriumComponent } from './create-auditorium.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BasicAuditoriumDetailComponent } from './basic-auditorium-detail/basic-auditorium-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateAuditoriumRowComponent } from './basic-auditorium-detail/create-auditorium-row/create-auditorium-row.component';
const routes: Routes = [
  {
    path: '',
    component: CreateAuditoriumComponent
  }
];

@NgModule({
  declarations: [
    CreateAuditoriumComponent,
    BasicAuditoriumDetailComponent,
    CreateAuditoriumRowComponent,
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class CreateAuditoriumModule { }
