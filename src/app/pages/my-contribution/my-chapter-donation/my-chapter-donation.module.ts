import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyChapterDonationComponent } from './my-chapter-donation.component';
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
    component: MyChapterDonationComponent
  }
];

@NgModule({
  declarations: [MyChapterDonationComponent],
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
  ],
  exports: [MyChapterDonationComponent]
})
export class MyChapterDonationModule { }
