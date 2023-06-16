import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { GalleryMainComponent } from './gallery-main.component';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [GalleryMainComponent],
  imports: [
    CommonModule,
    CarouselModule,
    PipesModule,
  ],
  exports: [GalleryMainComponent],
})
export class GalleryMainModule { }
