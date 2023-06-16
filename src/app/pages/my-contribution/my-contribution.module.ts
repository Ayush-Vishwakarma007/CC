import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MyChapterDonationComponent } from './my-chapter-donation/my-chapter-donation.component';
import { MyChapterDonationModule } from './my-chapter-donation/my-chapter-donation.module';
import { MyChapterSponsorshipComponent } from './my-chapter-sponsorship/my-chapter-sponsorship.component';
import { MyChapterSponsorshipModule } from './my-chapter-sponsorship/my-chapter-sponsorship.module';
import { MyEventDonationComponent } from './my-event-donation/my-event-donation.component';
import { MyEventDonationModule } from './my-event-donation/my-event-donation.module';
import { MyEventSponsorshipComponent } from './my-event-sponsorship/my-event-sponsorship.component';
import { MyEventSponsorshipModule } from './my-event-sponsorship/my-event-sponsorship.module';
import {MyEventPerformanceModule} from "./my-event-performance/my-event-performance.module";
import {MyEventPerformanceComponent} from "./my-event-performance/my-event-performance.component";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'chapter-my-donation', component: MyChapterDonationComponent },
      { path: 'chapter-my-sponsorship', component: MyChapterSponsorshipComponent },
      { path: 'event-my-donation', component: MyEventDonationComponent },
      { path: 'event-my-sponsorship', component: MyEventSponsorshipComponent },
      { path: 'event-my-performance', component: MyEventPerformanceComponent },
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MyChapterDonationModule,
    MyChapterSponsorshipModule,
    MyEventDonationModule,
    MyEventSponsorshipModule,
    MyEventPerformanceModule
  ]
})
export class MyContributionModule { }
