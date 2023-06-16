import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventGalleryComponent } from './event-gallery.component';
import {FileUploaderEventModule} from '../../../../../components/file-uploader-event/file-uploader-event.module';
import {ImageUploaderModule} from '../../../../../components/image-uploader/image-uploader.module';

@NgModule({
  declarations: [EventGalleryComponent],
  imports: [
    CommonModule,
    FileUploaderEventModule,
    ImageUploaderModule
  ],
  exports: [EventGalleryComponent],
})
export class EventGalleryModule { }
