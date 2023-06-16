import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryInnerComponent } from './gallery-inner.component';
import {RouterModule, Routes} from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import {ComponentsModule} from '../../../components/components.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { GalleryMainModule } from '../../../components/gallery-main/gallery-main.module';

const routes: Routes = [
  {
    path: '',
    component: GalleryInnerComponent
  }
];

@NgModule({
  declarations: [GalleryInnerComponent],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    GalleryModule,
    LightboxModule,
    ComponentsModule,
    GalleryMainModule,
  ]
})
export class GalleryInnerModule { }
