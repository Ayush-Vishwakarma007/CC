import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { NewsAnnouncementsComponent } from './news-announcements.component';
import {MatCardModule} from '@angular/material/card';
import {ComponentsModule} from '../../../components/components.module';
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: NewsAnnouncementsComponent
  }
];

@NgModule({
  declarations: [NewsAnnouncementsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatCardModule,
        ComponentsModule,
        TranslateModule
    ]
})
export class NewsAnnouncementsModule { }
