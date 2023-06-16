import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageManagementComponent } from './page-management.component';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [PageManagementComponent],
    imports: [
      CommonModule,
      FormsModule,
      MatFormFieldModule,
      MatSelectModule,
      RouterModule,
      TranslateModule,
    ],
  exports: [PageManagementComponent],

})
export class PageManagementModule { }
