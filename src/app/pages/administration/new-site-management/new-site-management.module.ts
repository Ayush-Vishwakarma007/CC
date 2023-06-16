import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NewSiteManagementComponent} from "./new-site-management.component";

@NgModule({
  declarations: [NewSiteManagementComponent],
  imports: [
    CommonModule
  ],
  exports:[NewSiteManagementComponent]
})
export class NewSiteManagementModule { }
