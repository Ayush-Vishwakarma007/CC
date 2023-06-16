import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventSessionComponent } from './event-session.component';
import {MatTabsModule} from "@angular/material/tabs";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [EventSessionComponent],
    imports: [
        CommonModule,
        MatTabsModule,
        TranslateModule,
    ],
  exports:[EventSessionComponent]
})
export class EventSessionModule { }
