import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { ChapterHomeComponent } from './chapter-home.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {ComponentsModule} from '../../../components/components.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {TranslateModule} from "@ngx-translate/core";
import {CarouselModule} from "ngx-bootstrap";
import { PipesModule } from 'src/app/pipes/pipes.module';
import { GalleryMainModule } from '../../../components/gallery-main/gallery-main.module';

const routes: Routes = [
  {
    path:"",
    component: ChapterHomeComponent
  }
];

@NgModule({
  declarations: [ChapterHomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatCardModule,
    ComponentsModule,
    SlickCarouselModule,
    TranslateModule,
    CarouselModule,
    PipesModule,
    GalleryMainModule,
  ]
})
export class ChapterHomeModule { }
