import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContactQueryManagementComponent} from "./contact-query-management.component";

@NgModule({
  declarations: [ContactQueryManagementComponent],
  imports: [
    CommonModule
  ],
  exports:[ContactQueryManagementComponent]
})
export class ContactQueryManagementModule { }
