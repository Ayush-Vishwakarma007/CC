import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkTicketQtyTicketsComponent } from './bulk-ticket-qty-tickets.component';
import { Routes, RouterModule } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

const routes: Routes = [
  {
    path:'',
    component: BulkTicketQtyTicketsComponent,
  }
];

@NgModule({
  declarations: [BulkTicketQtyTicketsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class BulkTicketQtyTicketsModule { }
