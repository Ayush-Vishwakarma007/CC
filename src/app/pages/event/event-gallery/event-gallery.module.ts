import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EventGalleryComponent } from './event-gallery.component';
import { SidebarModule } from "../../../layouts/sidebar/sidebar.module";
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FileUploaderEventModule } from "../../../components/file-uploader-event/file-uploader-event.module";
import { MatDatetimepickerModule } from "@mat-datetimepicker/core";
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDatetimeModule } from "@mat-datetimepicker/moment";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUploaderVerticalModule } from "../../../components/file-uploader-vertical/file-uploader-vertical.module";
// import { EmbedVideo } from 'ngx-embed-video';
import {ComponentsModule} from "../../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {PipesModule } from '../../../pipes/pipes.module'

const routes: Routes = [
  {
    path: '',
    component: EventGalleryComponent
  }
];

@NgModule({
  declarations: [EventGalleryComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SidebarModule,
        MatTabsModule,
        MatSelectModule,
        MatInputModule,
        MatDatetimepickerModule,
        MatNativeDateModule,
        FileUploaderEventModule,
        MatMomentDatetimeModule,
        FormsModule,
        ReactiveFormsModule,
        FileUploaderVerticalModule,
        // EmbedVideo.forRoot(),
        ComponentsModule,
        TranslateModule,
        MatAutocompleteModule,
        PipesModule
    ]
})
export class EventGalleryModule { }
