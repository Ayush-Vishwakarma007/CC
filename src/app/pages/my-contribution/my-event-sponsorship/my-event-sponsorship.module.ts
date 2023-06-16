import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyEventSponsorshipComponent } from './my-event-sponsorship.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { MatInputModule } from "@angular/material/input";
import { RouterModule, Routes } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: MyEventSponsorshipComponent
  }
];

@NgModule({
  declarations: [MyEventSponsorshipComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    TranslateModule,
    MatInputModule,
    PipesModule,
  ]
})
export class MyEventSponsorshipModule { }
