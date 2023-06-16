import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent, SafeHtmlPipe} from './home.component';
import {RouterModule, Routes} from "@angular/router";
import {ComponentsModule} from "../../components/components.module";
import {MatCardModule } from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { HttpClientModule } from '@angular/common/http';
import {CarouselModule} from "ngx-bootstrap";
import {TranslateModule} from "@ngx-translate/core";
import {PipesModule} from "../../pipes/pipes.module";
import { GalleryMainModule } from '../../components/gallery-main/gallery-main.module';




const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [HomeComponent,SafeHtmlPipe],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatTabsModule,
    MatCardModule,
    ComponentsModule,
    ShareButtonsModule,
    HttpClientModule,
    TranslateModule,
    CarouselModule,
    PipesModule,
    GalleryMainModule


  ]
})
export class HomeModule { }
