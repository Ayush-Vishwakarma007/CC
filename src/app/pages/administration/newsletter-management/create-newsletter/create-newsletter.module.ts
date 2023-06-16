import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {EditorNewsletterModule} from '../create-newsletter/editor-newsletter/editor-newsletter.module';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatCheckboxModule,
    EditorNewsletterModule,
    FormsModule,
    
  ],

})
export class CreateNewsletterModule { }
