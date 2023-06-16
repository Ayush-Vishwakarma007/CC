import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChapterDonationComponent} from "./chapter-donation.component";
import {RouterModule, Routes} from "@angular/router";
import {MatInputModule} from "@angular/material/input";
import {UiSwitchModule} from "ngx-ui-switch";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";
import {ChDonorListComponent} from './ch-donor-list/ch-donor-list.component';
import {ChSettingComponent} from './ch-setting/ch-setting.component';
import {ChDashboardComponent} from './ch-dashboard/ch-dashboard.component';
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
import {MatMomentDatetimeModule} from "@mat-datetimepicker/moment";
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import {DirectiveModule} from "../../../directive/directive.module";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { ChDonationDetailComponent } from './ch-donation-detail/ch-donation-detail.component';
import {NgApexchartsModule} from "ng-apexcharts";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {TranslateModule} from "@ngx-translate/core";
import {ModalModule} from "ngx-bootstrap";

const routes: Routes = [
  {
    path: '',
    component: ChapterDonationComponent
  }
];

@NgModule({
  declarations: [
    ChapterDonationComponent,
    ChDonorListComponent,
    ChSettingComponent,
    ChDashboardComponent,
    ChDonationDetailComponent,
    ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatInputModule,
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
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    GooglePlaceModule,
    MatAutocompleteModule,
    NgApexchartsModule,
    InfiniteScrollModule,
    ModalModule.forRoot(),
    // use this if you want to use native javascript dates and INTL API if available
    // MatNativeDatetimeModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule, FileUploaderEventModule,
    SidebarModule, DirectiveModule, TranslateModule,
  ],
  exports: [ChapterDonationComponent]
})
export class ChapterDonationModule {
}
