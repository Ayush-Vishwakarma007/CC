import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { ContactUsComponent } from './contact-us.component';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import { AlertModule } from 'ngx-alerts';
import { DirectiveModule } from '../../../directive/directive.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {TranslateModule} from "@ngx-translate/core";
import {PipesModule} from "../../../pipes/pipes.module";

const routes: Routes = [
  {
    path: '',
    component: ContactUsComponent
  }
];
@NgModule({
  declarations: [ContactUsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    DirectiveModule,
    MatAutocompleteModule,
    TranslateModule,
    PipesModule
  ]
})
export class ContactUsModule { }
