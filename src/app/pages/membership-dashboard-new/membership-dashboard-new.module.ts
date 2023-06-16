import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipDashboardNewComponent } from './membership-dashboard-new.component';
import { RouterModule, Routes} from "@angular/router";
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime-ex";
import { UiSwitchModule } from "ngx-ui-switch";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path:'',
    component: MembershipDashboardNewComponent
  }
];

@NgModule({
  declarations: [MembershipDashboardNewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule,
    MatChipsModule,
    MatIconModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    UiSwitchModule,
    MatDatepickerModule,
    PipesModule
  ]
})
export class MembershipDashboardNewModule { }
