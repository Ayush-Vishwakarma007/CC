import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyEventPerformanceComponent } from './my-event-performance.component';
import {TranslateModule} from "@ngx-translate/core";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {EventPerformanceModule} from "../../event/admin/dashboard-component/event-performance/event-performance.module";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {DashboardComponentModule} from "../../event/admin/dashboard-component/dashboard-component.module";

@NgModule({
  declarations: [MyEventPerformanceComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule,
    DashboardComponentModule,
  ]
})
export class MyEventPerformanceModule { }
