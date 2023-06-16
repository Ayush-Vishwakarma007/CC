import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {EventRegisterModule} from "../../event/registration-component/event-register.module";
import {ChapterDonationSponsershipComponent} from "./chapter-donation-sponsership.component";

const routes : Routes = [
  {
    path: '',
    component: ChapterDonationSponsershipComponent
  }
];

@NgModule({
  declarations: [ChapterDonationSponsershipComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    EventRegisterModule,
  ]
})
export class ChapterDonationSponsershipModule { }
