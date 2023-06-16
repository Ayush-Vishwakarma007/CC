import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkTicketInfoComponent } from './bulk-ticket-info.component';
import { RouterModule, Routes } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';

const routes: Routes = [
  {
    path:'',
    component: BulkTicketInfoComponent,
  }
];

@NgModule({
  declarations: [BulkTicketInfoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ]
})
export class BulkTicketInfoModule { }
