import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { GalleryMainComponent } from './gallery-main/gallery-main.component';
import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { NewsComponent } from "./news/news.component";
import { EventComponent } from "./event/event.component";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule, Routes } from '@angular/router';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { PaypalCardComponent } from './paypal-card/paypal-card.component';
import { HttpClientModule } from '@angular/common/http';
import { PaypalComponent } from './paypal/paypal.component';
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { TabsModule } from "ngx-bootstrap/tabs";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgxEditorModule } from "ngx-editor";
import { AffinipayComponent } from './affinipay/affinipay.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CloverComponent } from './clover/clover.component';
import { PipesModule } from "../pipes/pipes.module";
import { AssignFormModalComponent } from './assign-form-modal/assign-form-modal.component';
import { SponsorComponent } from './sponsor/sponsor.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ModalModule } from "ngx-bootstrap";
// import { EmbedVideo } from 'ngx-embed-video';
import { EventModalComponent } from './event-modal/event-modal.component';
import { TranslateModule } from "@ngx-translate/core";
import { DonationListComponent } from './donation-list/donation-list.component';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { AffinyPayNewComponent } from './affiny-pay-new/affiny-pay-new.component';
import { CloverNewComponent } from './clover-new/clover-new.component';
import { ECheckComponent } from './e-check/e-check.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { UiSwitchModule } from "ngx-ui-switch";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SquareComponent } from './square/square.component';
import { CountDownComponent } from './count-down/count-down.component';
import { CountDownModule } from './count-down/count-down.module';
import { MatButtonModule } from '@angular/material/button';
import { NgxPayPalModule } from 'ngx-paypal';
@NgModule({
  declarations: [
   //GalleryMainComponent,
    NewsComponent,
    EventComponent,
    PaypalCardComponent,
    PaypalComponent,
    UserDetailComponent,
    AffinipayComponent,
    CloverComponent,
    AssignFormModalComponent,
    SponsorComponent,
    EventModalComponent,
    DonationListComponent,
    AffinyPayNewComponent,
    CloverNewComponent,
    ECheckComponent,
    FileUploaderComponent,
    SquareComponent,
    CountDownComponent,
  ],
  providers: [DatePipe],
    imports: [
      NgxPayPalModule,
        CommonModule,
        GalleryModule,
        LightboxModule,
        MatCardModule,
        MatTabsModule,
        RouterModule,
        ShareButtonsModule,
        HttpClientModule,
        FormsModule,
        MatSelectModule,
        MatRadioModule,
        MatTooltipModule,
        NgxEditorModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        MatDatepickerModule, MatInputModule, MatNativeDateModule, PipesModule,
        // EmbedVideo.forRoot(),
        TranslateModule, InfiniteScrollModule,
        UiSwitchModule,
        NgxDaterangepickerMd.forRoot(),
        PipesModule,
        CarouselModule,
        SlickCarouselModule,   
        CountDownModule

    ],
  exports: [
    //GalleryMainComponent,
    NewsComponent,
    EventComponent,
    PaypalCardComponent,
    PaypalComponent,
    UserDetailComponent,
    AffinipayComponent,
    CloverComponent,
    AssignFormModalComponent,
    AssignFormModalComponent,
    SponsorComponent,
    EventModalComponent,
    DonationListComponent,
    AffinyPayNewComponent,
    CloverNewComponent,
    ECheckComponent,
    FileUploaderComponent,
    SquareComponent,
    CountDownComponent
  ]
})
export class ComponentsModule { }
