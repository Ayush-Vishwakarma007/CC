import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { GalleryNewComponent } from './gallery-new.component';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { CarouselModule } from 'ngx-bootstrap/carousel';

const routes: Routes = [
  {
    path: '',
    component: GalleryNewComponent
  }
];

@NgModule({
  declarations: [GalleryNewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LightboxModule,
    CarouselModule,
  ]
})
export class GalleryNewModule { }
