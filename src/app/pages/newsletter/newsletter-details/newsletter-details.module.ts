import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NewsletterDetailsComponent, SafeHtmlPipe} from './newsletter-details.component';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path:'',
    component: NewsletterDetailsComponent
  }
];
@NgModule({
  declarations: [NewsletterDetailsComponent,SafeHtmlPipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    //AnimateOnScrollModule,
  ]
})
export class NewsletterDetailsModule { }
