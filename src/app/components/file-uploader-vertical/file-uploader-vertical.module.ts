import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderVerticalComponent } from './file-uploader-vertical.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {PipesModule} from '../../pipes/pipes.module'
@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    PipesModule
  ],
  declarations: [FileUploaderVerticalComponent],
  exports:[FileUploaderVerticalComponent]
})
export class FileUploaderVerticalModule { }
