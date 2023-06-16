import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EventNotFoundComponent } from './event-not-found.component';
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import {TranslateModule} from "@ngx-translate/core";
import { ImageCropperModule } from 'ngx-image-cropper';
import {ModalModule} from "ngx-bootstrap";

const routes: Routes = [
  {
    path:'',
    component: EventNotFoundComponent
  }
];

@NgModule({
  declarations: [EventNotFoundComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SidebarModule,
    TranslateModule,
    ImageCropperModule,
    ModalModule.forRoot(),
  ]
})
export class EventNotFoundModule { }
