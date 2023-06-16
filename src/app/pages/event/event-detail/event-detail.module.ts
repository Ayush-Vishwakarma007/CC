import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EventDetailComponent } from './event-detail.component';
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { GalleryImageComponent } from './gallery-image/gallery-image.component';
import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';

import {PipesModule} from "../../../pipes/pipes.module";
import {ComponentsModule} from "../../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";
import {NgxCountdownModule} from "../../../components/ngx-countdown/ngx-countdown.module";
import { GalleryMainModule } from '../../../components/gallery-main/gallery-main.module';

const routes: Routes = [
  {
    path:'',
    component: EventDetailComponent
  }
];

@NgModule({
  declarations: [EventDetailComponent, GalleryImageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SidebarModule,
    CarouselModule,
    TabsModule,
    MatExpansionModule,
    GalleryModule,
    ShareButtonsModule,
    LightboxModule,
    //AnimateOnScrollModule.forRoot(),
    PipesModule,
    ComponentsModule,
    TranslateModule,
    NgxCountdownModule,
    GalleryMainModule
  ]
})
export class EventDetailModule { }
