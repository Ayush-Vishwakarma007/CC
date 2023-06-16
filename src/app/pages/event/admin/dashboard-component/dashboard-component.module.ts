import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatisticModule} from "./statistic/statistic.module";
import {StatisticComponent} from "./statistic/statistic.component";
import {RouterModule, Routes} from "@angular/router";
import {ParticipantVendorDetailModule} from "./participant-vendor-detail/participant-vendor-detail.module";
import {ParticipantVendorDetailComponent} from "./participant-vendor-detail/participant-vendor-detail.component";
import {DonationSponsorDetailComponent} from "./donation-sponsor-detail/donation-sponsor-detail.component";
import {DonationSponsorDetailModule} from "./donation-sponsor-detail/donation-sponsor-detail.module";
import {SettingComponent} from "./setting/setting.component";
import {SettingModule} from "./setting/setting.module";
import {EventGalleryComponent} from './event-gallery/event-gallery.component';
import {EventGalleryModule} from './event-gallery/event-gallery.module';
import {FileUploaderVerticalModule} from '../../../../components/file-uploader-vertical/file-uploader-vertical.module';
import {ComponentsModule} from "../../../../components/components.module";
import {FileUploaderEventModule} from '../../../../components/file-uploader-event/file-uploader-event.module';
import {EventPerformanceComponent} from './event-performance/event-performance.component';
import {EventPerformanceModule} from './event-performance/event-performance.module';
import {EventSessionModule} from "./event-session/event-session.module";
import {EventSessionComponent} from "./event-session/event-session.component";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StatisticModule,
    ParticipantVendorDetailModule,
    DonationSponsorDetailModule,
    SettingModule,
    EventGalleryModule,
    ComponentsModule,
    FileUploaderVerticalModule,
    FileUploaderEventModule,
    EventPerformanceModule,
    EventSessionModule
  ],
  exports: [StatisticComponent,
    ParticipantVendorDetailComponent,
    DonationSponsorDetailComponent,
    SettingComponent,
    EventGalleryComponent,
    EventPerformanceComponent,
    EventSessionComponent
  ]
})
export class DashboardComponentModule {
}
