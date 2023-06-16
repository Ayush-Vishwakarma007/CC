import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyEventDonationComponent } from './my-event-donation.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { ModalModule } from "ngx-bootstrap";

const routes: Routes = [
  {
    path: '',
    component: MyEventDonationComponent
  }
];

@NgModule({
  declarations: [MyEventDonationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    TranslateModule,
    ModalModule.forRoot(),
  ]
})
export class MyEventDonationModule { }
