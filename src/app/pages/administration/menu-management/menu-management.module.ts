import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuManagementComponent } from './menu-management.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TreeModule } from '@circlon/angular-tree-component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path:'',
    component: MenuManagementComponent
  }
];

@NgModule({
  declarations: [MenuManagementComponent],
    imports: [
        CommonModule,
        FormsModule,
        TreeModule,  // .forRoot(),
        MatFormFieldModule,
        MatSelectModule,
        RouterModule,
        MatInputModule,
        ReactiveFormsModule,
        TranslateModule,

    ],
  exports:[MenuManagementComponent]
})
export class MenuManagementModule { }
