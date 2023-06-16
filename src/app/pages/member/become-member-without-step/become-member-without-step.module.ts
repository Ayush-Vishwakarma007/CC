import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BecomeMemberWithoutStepComponent } from './become-member-without-step.component';
import { MatSelectModule } from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule,ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "../../../components/components.module";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DirectiveModule } from 'src/app/directive/directive.module';


const routes: Routes = [
  {
    path:'',
    component: BecomeMemberWithoutStepComponent
  }
];

@NgModule({
  declarations: [BecomeMemberWithoutStepComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatCardModule,
    MatTabsModule,
    ComponentsModule,
    MatCheckboxModule,    
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    GooglePlaceModule,
    PipesModule,
    DirectiveModule
  ]
})
export class BecomeMemberWithoutStepModule { }
