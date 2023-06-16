import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GalleryMediaDetailComponent } from './gallery-media-detail.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { EmbedVideo } from 'ngx-embed-video'; 
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {TranslateModule} from "@ngx-translate/core";
import {PipesModule} from "../../../pipes/pipes.module";

const routes: Routes = [
  {
    path: '',
    component: GalleryMediaDetailComponent
  }
];

@NgModule({
  declarations: [GalleryMediaDetailComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatTabsModule,
        FormsModule,
        // EmbedVideo.forRoot(),
        InfiniteScrollModule,
        TranslateModule,
        PipesModule,

    ]
})
export class GalleryMediaDetailModule { }
