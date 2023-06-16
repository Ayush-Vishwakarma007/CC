import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventlistComponent } from './eventlist.component';
import { RouterModule, Routes} from '@angular/router';

// import { AlertModule } from 'ngx-alerts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import { AmazingTimePickerModule } from '@jonijnm/amazing-time-picker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import {ComponentsModule} from "../../../components/components.module";

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {TranslateModule} from "@ngx-translate/core";
import { PipesModule } from '../../../pipes/pipes.module';

const routes: Routes = [
  {
    path:'',
    component: EventlistComponent
  }
];

@NgModule({
  declarations: [EventlistComponent],
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
        NgxSliderModule,
        ShareButtonsModule,
        GooglePlaceModule,
        ComponentsModule,
        AngularMultiSelectModule,
        PipesModule,
        MatSelectModule, MatCheckboxModule, TranslateModule,

    ]
})
export class EventlistModule {


}
