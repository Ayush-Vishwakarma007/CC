import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MyContributionComponent } from './my-contribution.component';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [MyContributionComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  exports: [MyContributionComponent]
})
export class MyContributionModule { }
