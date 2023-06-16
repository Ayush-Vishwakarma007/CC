import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyRegisterEventComponent } from './my-register-event.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {AmazingTimePickerModule} from "@jonijnm/amazing-time-picker";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime-ex";
import {CarouselModule} from "ngx-bootstrap/carousel";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSelectModule} from "@angular/material/select";
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {PipesModule} from "../../../pipes/pipes.module";
import {TranslateModule} from "@ngx-translate/core";
import { MatCheckboxModule } from '@angular/material/checkbox';

const routes: Routes = [
  {
    path:'',
    component: MyRegisterEventComponent
  }
];

@NgModule({
  declarations: [MyRegisterEventComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        
        MatDatepickerModule, MatInputModule, MatNativeDateModule,
        AmazingTimePickerModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        CarouselModule.forRoot(),
        MatTabsModule,
        MatSelectModule,
        SidebarModule, PipesModule, TranslateModule, MatCheckboxModule,
        PipesModule
    ]
})
export class MyRegisterEventModule { }
