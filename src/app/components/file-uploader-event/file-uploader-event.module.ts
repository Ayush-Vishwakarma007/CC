import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderEventComponent } from './file-uploader-event.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {PipesModule} from '../../pipes/pipes.module'
@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    PipesModule,
  ],
  declarations: [FileUploaderEventComponent],
  exports:[FileUploaderEventComponent]
})
export class FileUploaderEventModule { }
