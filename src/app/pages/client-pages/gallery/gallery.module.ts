import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './gallery.component';
import {RouterModule, Routes} from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import { LightboxModule } from '@ngx-gallery/lightbox';
import {ComponentsModule} from '../../../components/components.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { GalleryAllComponent } from './gallery-all/gallery-all.component';
import {FileUploaderVerticalModule} from "../../../components/file-uploader-vertical/file-uploader-vertical.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {PipesModule} from "../../../pipes/pipes.module";
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { GalleryMainModule } from '../../../components/gallery-main/gallery-main.module';
const routes: Routes = [
  {
    path: '',
    component: GalleryComponent
  }
];


@NgModule({
  declarations: [GalleryComponent,
  GalleryAllComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatTabsModule,
        LightboxModule,
        ComponentsModule,
        InfiniteScrollModule,
        FileUploaderVerticalModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatInputModule,
        PipesModule,
        CarouselModule,
        GalleryMainModule

    ],
  exports: [GalleryComponent, GalleryAllComponent, GalleryAllComponent]
})
export class GalleryModule { }
