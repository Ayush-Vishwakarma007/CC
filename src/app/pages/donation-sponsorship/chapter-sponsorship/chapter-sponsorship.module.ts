import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChapterSponsorshipComponent } from './chapter-sponsorship.component';
import {RouterModule, Routes} from "@angular/router";
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { ChSponsorDashboardComponent } from './ch-sponsor-dashboard/ch-sponsor-dashboard.component';
import { ChSponsorListComponent } from './ch-sponsor-list/ch-sponsor-list.component';
import { ChSponsorDetailComponent } from './ch-sponsor-detail/ch-sponsor-detail.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {FileUploaderEventModule} from "../../../components/file-uploader-event/file-uploader-event.module";
import {FileUploaderVerticalModule} from "../../../components/file-uploader-vertical/file-uploader-vertical.module";
import {NgxEditorModule} from "ngx-editor";
import {MatChipsModule} from "@angular/material/chips";
import {MatRadioModule} from "@angular/material/radio";
import {TextMaskModule} from "angular2-text-mask";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {NgApexchartsModule} from "ng-apexcharts";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {MatMomentDatetimeModule} from "@mat-datetimepicker/moment";
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import {DirectiveModule} from "../../../directive/directive.module";
import {ComponentsModule} from "../../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";
import { PipesModule } from 'src/app/pipes/pipes.module';


const routes: Routes = [
  {
    path: '',
    component: ChapterSponsorshipComponent
  }
];
@NgModule({
  declarations: [ChapterSponsorshipComponent, ChSponsorDashboardComponent, ChSponsorListComponent, ChSponsorDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule, MatNativeDateModule,
    FileUploaderEventModule,
    FileUploaderVerticalModule,
    NgxEditorModule,
    MatChipsModule,
    MatRadioModule,
    TextMaskModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    GooglePlaceModule,
    ComponentsModule,
    MatAutocompleteModule,
    NgApexchartsModule,
    InfiniteScrollModule,
    // use this if you want to use native javascript dates and INTL API if available
    // MatNativeDatetimeModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule, FileUploaderEventModule,
    SidebarModule, DirectiveModule, TranslateModule,
    PipesModule
  ]
})
export class ChapterSponsorshipModule { }
