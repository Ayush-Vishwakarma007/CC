import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventPreviewComponent } from './event-preview.component';
import {  RouterModule, Routes} from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';


const routes: Routes = [
  {
    path:'',
    component: EventPreviewComponent
  }
];


@NgModule({
  declarations: [EventPreviewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CarouselModule
  ]
})
export class EventPreviewModule { }
