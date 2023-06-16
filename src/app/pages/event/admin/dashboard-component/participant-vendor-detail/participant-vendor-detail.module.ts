import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantVendorDetailComponent } from './participant-vendor-detail.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {CarouselModule} from "ngx-bootstrap/carousel";
import {TabsModule} from "ngx-bootstrap/tabs";

import {AmazingTimePickerModule} from "@jonijnm/amazing-time-picker";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime-ex";
import {MatExpansionModule} from "@angular/material/expansion";
import {GalleryModule} from "@ngx-gallery/core";
//import {LightboxModule} from "ngx-lightbox";
import {ComponentsModule} from "../../../../../components/components.module";
import {MatRadioModule} from "@angular/material/radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ShareButtonsModule} from "ngx-sharebuttons/buttons";
import {MatSelectModule} from "@angular/material/select";

import {MatTabsModule} from "@angular/material/tabs";
import {NgxEditorModule} from "ngx-editor";
import {SidebarModule} from "../../../../../layouts/sidebar/sidebar.module";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {TranslateModule} from "@ngx-translate/core";
import {PipesModule} from "../../../../../pipes/pipes.module";

@NgModule({
  declarations: [ParticipantVendorDetailComponent],
    imports: [
        CommonModule,
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
        // LightboxModule,
        ComponentsModule,
        MatRadioModule,
        MatCheckboxModule,
        ShareButtonsModule,
        MatSelectModule,
        //AnimateOnScrollModule.forRoot(),
        MatTabsModule,
        NgxEditorModule,
        SidebarModule, RouterModule, TranslateModule, PipesModule,
    ],
  exports:[ParticipantVendorDetailComponent]
})
export class ParticipantVendorDetailModule { }
