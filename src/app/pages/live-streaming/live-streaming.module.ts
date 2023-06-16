import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { LiveStreamingComponent } from './live-streaming.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {TranslateModule} from "@ngx-translate/core";
import {ShareButtonsModule} from "ngx-sharebuttons/buttons";
import {PipesModule} from "../../pipes/pipes.module";
// import {EmbedVideo} from "ngx-embed-video/dist";

const routes: Routes = [
  {
    path: '',
    component: LiveStreamingComponent
  }
];

@NgModule({
  declarations: [LiveStreamingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    ShareButtonsModule,
    TranslateModule,    
    // EmbedVideo.forRoot(),

    PipesModule
  ]
})
export class LiveStreamingModule { }
