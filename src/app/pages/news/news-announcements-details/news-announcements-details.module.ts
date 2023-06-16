import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NewsAnnouncementsDetailsComponent, SafeHtmlPipe} from './news-announcements-details.component';

import {PipesModule} from "../../../pipes/pipes.module";

const routes: Routes = [
  {
    path: '',
    component: NewsAnnouncementsDetailsComponent
  }
];


@NgModule({
  declarations: [NewsAnnouncementsDetailsComponent,SafeHtmlPipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PipesModule
  ]
})
export class NewsAnnouncementsDetailsModule { }
