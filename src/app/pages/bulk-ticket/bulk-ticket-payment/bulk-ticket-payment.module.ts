import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkTicketPaymentComponent } from './bulk-ticket-payment.component';
import { Routes, RouterModule } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ModalModule } from 'ngx-bootstrap';

const routes: Routes = [
  {
    path:'',
    component: BulkTicketPaymentComponent,
  }
];

@NgModule({
  declarations: [BulkTicketPaymentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatRadioModule,
    MatTabsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    ModalModule.forRoot(),
  ]
})
export class BulkTicketPaymentModule { }
