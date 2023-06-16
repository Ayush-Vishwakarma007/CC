import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunitySettingsComponent } from './community-settings.component';
import { Routes, RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { UiSwitchModule } from "ngx-ui-switch";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [
  {
    path: '',
    component: CommunitySettingsComponent,
  }
];

@NgModule({
  declarations: [CommunitySettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    UiSwitchModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CommunitySettingsModule { }
