import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardEventComponent } from "./dashboard-event.component";
import { DashboardComponentModule } from "../dashboard-component/dashboard-component.module";
import { RouterModule, Routes } from "@angular/router";
import { SidebarModule } from "../../../../layouts/sidebar/sidebar.module";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
// import { AlertModule } from "ngx-alerts";
import { MatTabsModule } from "@angular/material/tabs";
import { TranslateModule } from "@ngx-translate/core";
import { FoodModule } from "../../../food/food.module";
import { ParkingModule } from "../../../parking/parking.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import {ToastrModule} from "ngx-toastr";

import { ListVolunteerModule } from "../dashboard-component/list-volunteer/list-volunteer.module";
const routes: Routes = [
  {
    path: "",
    component: DashboardEventComponent,
  },
];

@NgModule({
  declarations: [DashboardEventComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DashboardComponentModule,
    SidebarModule,
    // AlertModule.forRoot({ maxMessages: 1, timeout: 5000, position: "right" }),
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTabsModule,
    TranslateModule,
    FoodModule,
    ParkingModule,
    PipesModule,
    ListVolunteerModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,

    }),
  ],
})
export class DashboardEventModule {}
