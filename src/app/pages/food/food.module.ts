import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodComponent } from './food.component';
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {CarouselModule, TabsModule} from "ngx-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import {AmazingTimePickerModule} from "@jonijnm/amazing-time-picker";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime-ex";
import {GalleryModule} from "@ngx-gallery/core";
//import {LightboxModule} from "ngx-lightbox";
import {ComponentsModule} from "../../components/components.module";
import {ShareButtonsModule} from "ngx-sharebuttons/buttons";

import {NgxEditorModule} from "ngx-editor";
import {SidebarModule} from "../../layouts/sidebar/sidebar.module";

@NgModule({
  declarations: [FoodComponent],
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
    SidebarModule, RouterModule, TranslateModule,
  ],
  exports:[FoodComponent]
})
export class FoodModule { }
