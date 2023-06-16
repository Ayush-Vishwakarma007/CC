import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploaderComponent} from './image-uploader.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [ImageUploaderComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
  ],
  exports: [ImageUploaderComponent]
})
export class ImageUploaderModule { }
