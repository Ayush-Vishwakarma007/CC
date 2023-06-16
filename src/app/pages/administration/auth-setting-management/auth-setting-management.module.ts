import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthSettingManagementComponent } from './auth-setting-management.component';
import { RouterModule, Routes } from "@angular/router";
import { UiSwitchModule } from "ngx-ui-switch";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import {TranslateModule} from "@ngx-translate/core";
import {MatSelectModule} from "@angular/material/select";

const routes: Routes = [
  {
    path: '',
    component: AuthSettingManagementComponent
  }
];

@NgModule({
  declarations: [AuthSettingManagementComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        UiSwitchModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        TranslateModule,
        MatSelectModule,
    ]
})
export class AuthSettingManagementModule { }
