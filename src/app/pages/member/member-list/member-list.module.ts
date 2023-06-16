import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  MemberListComponent } from './member-list.component';
import { Routes, RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
// import { AlertModule } from 'ngx-alerts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import { AmazingTimePickerModule } from '@jonijnm/amazing-time-picker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';

import { GalleryModule } from '@ngx-gallery/core';
//import { LightboxModule } from 'ngx-lightbox';
import {ComponentsModule} from '../../../components/components.module';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import {MatTabsModule} from '@angular/material/tabs';
import { NgxEditorModule } from 'ngx-editor';
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import { MemberDetailComponent } from './member-detail/member-detail.component';
import {NgApexchartsModule} from "ng-apexcharts";
import {StatisticsComponent} from "./statistics/statistics.component";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path:'',
    component: MemberListComponent
  }
];

@NgModule({
    declarations: [MemberListComponent, StatisticsComponent, MemberDetailComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        CarouselModule.forRoot(),
        TabsModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        
        MatDatepickerModule, MatInputModule, MatNativeDateModule,
        AmazingTimePickerModule,
        OwlDateTimeModule,
        MatExpansionModule,
        OwlNativeDateTimeModule,
        GalleryModule,
        //LightboxModule,
        NgApexchartsModule,
        ComponentsModule,
        MatRadioModule,
        MatCheckboxModule,
        ShareButtonsModule,
        MatSelectModule,
        MatTabsModule,
        NgxEditorModule,
        SidebarModule,
        TranslateModule,

    ]
})
export class  MemberListModule { }
