import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventListDetailComponent } from './event-list-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
// import { AlertModule } from 'ngx-alerts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import { AmazingTimePickerModule } from '@jonijnm/amazing-time-picker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';

import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from 'ngx-lightbox';
import {ComponentsModule} from '../../../components/components.module';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import {EventBookingModule} from "../../others/event-booking/event-booking.module";
import { DonateEventsComponent } from './donate-event/donate-event.component';
import {MatTabsModule} from '@angular/material/tabs';
import { GalleryMainComponent } from '../../../components/gallery-main/gallery-main.component';
import { GalleryMainModule } from '../../../components/gallery-main/gallery-main.module';
const routes: Routes = [
  {
    path:'',
    component: EventListDetailComponent
  }
];

@NgModule({
  declarations: [EventListDetailComponent,DonateEventsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CarouselModule.forRoot(),
    TabsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    
    MatDatepickerModule, MatInputModule,MatNativeDateModule,
    AmazingTimePickerModule,
    OwlDateTimeModule,
    MatExpansionModule,
    OwlNativeDateTimeModule,
    GalleryModule,
    LightboxModule,
    ComponentsModule,
    MatTabsModule,
    MatRadioModule,
    MatCheckboxModule,
    ShareButtonsModule,
    EventBookingModule,
    MatSelectModule,
    GalleryMainModule,
  ],
})
export class EventListDetailModule { }
