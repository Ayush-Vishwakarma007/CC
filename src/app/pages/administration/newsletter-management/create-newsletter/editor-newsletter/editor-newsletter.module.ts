import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorNewsletterComponent } from './editor-newsletter.component';

@NgModule({
  declarations: [EditorNewsletterComponent],
  imports: [
    CommonModule
  ],
  exports: [EditorNewsletterComponent]
})
export class EditorNewsletterModule { }
