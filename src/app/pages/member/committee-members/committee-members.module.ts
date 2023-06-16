import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommitteeMembersComponent} from "./committee-members.component";
import {RouterModule, Routes} from "@angular/router";
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from "@angular/forms";
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import {MatMomentDatetimeModule} from "@mat-datetimepicker/moment";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
const routes: Routes = [
  {
    path: '',
    component: CommitteeMembersComponent
  }
];

@NgModule({
  declarations: [CommitteeMembersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SidebarModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule,
    MatDatetimepickerModule,
    MatMomentDatetimeModule,
    MatAutocompleteModule,
    MatDatepickerModule,
  ]
})
export class CommitteeMembersModule {
}
