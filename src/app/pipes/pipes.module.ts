import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StripHtmlPipe} from "./strip-html.pipe";
import {SafePipe} from '../pipes/safe.pipe'
import { RemoveSpecialPipe } from './removeSpecial.pipe';
import { GalleryImagePipePipe } from './gallery-image-pipe.pipe';

import { AuthImagesPipe } from './auth-images.pipe';
import { EventImagesPipe } from './event-images.pipe';
import { NotificationImagesPipe } from './notification-images.pipe';
import { CommunityImagesPipe } from './community-images.pipe';
import {EventPipe} from '../pipes/event.pipe';
import { YoutubePipe } from './youtube.pipe'


@NgModule({
  declarations: [StripHtmlPipe, SafePipe,RemoveSpecialPipe, GalleryImagePipePipe, AuthImagesPipe, EventImagesPipe, NotificationImagesPipe, CommunityImagesPipe,EventPipe, YoutubePipe],
    exports: [
        StripHtmlPipe, RemoveSpecialPipe,EventPipe,
        SafePipe, GalleryImagePipePipe, EventImagesPipe, CommunityImagesPipe, NotificationImagesPipe, AuthImagesPipe, YoutubePipe
    ],
  imports: [
    CommonModule,
  ]
})
export class PipesModule {}
