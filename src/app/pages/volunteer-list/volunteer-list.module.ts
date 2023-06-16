import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolunteerListComponent } from './volunteer-list.component';
import { Routes, RouterModule } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgxEditorModule} from 'ngx-editor';
import { PipesModule } from '../../pipes/pipes.module';
import {DirectiveModule} from "../../directive/directive.module";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path:'',
    component: VolunteerListComponent
  }
];

@NgModule({
  declarations: [VolunteerListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    NgxEditorModule,
    FormsModule,
    DirectiveModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    PipesModule
  ]
})
export class VolunteerListModule { }
