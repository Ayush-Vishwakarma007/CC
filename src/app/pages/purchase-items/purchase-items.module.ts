import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseItemsComponent } from './purchase-items.component';
import { Routes, RouterModule } from '@angular/router';
import { BuyItemsComponent } from './buy-items/buy-items.component';
import { BuyItemsPaymentComponent } from './buy-items-payment/buy-items-payment.component';
import { BuyItemsGuestLoginComponent } from './buy-items-guest-login/buy-items-guest-login.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TranslateModule } from '@ngx-translate/core';
const routes: Routes = [
  {
    path:'',
    component:PurchaseItemsComponent 
  }
];
@NgModule({
  declarations: [PurchaseItemsComponent, BuyItemsComponent, BuyItemsPaymentComponent, BuyItemsGuestLoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class PurchaseItemsModule { }
