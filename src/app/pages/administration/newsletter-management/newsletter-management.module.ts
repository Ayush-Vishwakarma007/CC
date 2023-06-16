import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {NewsletterDashboardComponent} from './newsletter-dashboard/newsletter-dashboard.component';
import {NewsletterManagementComponent, SafeHtmlPipe} from './newsletter-management.component';
import {RouterModule} from "@angular/router";
import {NewsletterListComponent} from "./newsletter-list/newsletter-list.component";
import {FormsModule} from "@angular/forms";
import {ComponentsModule} from "../../../components/components.module";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgApexchartsModule} from "ng-apexcharts";
import { ModalModule } from "ngx-bootstrap";
import {MatRadioModule} from "@angular/material/radio";


@NgModule({
  declarations: [NewsletterManagementComponent,
    NewsletterDashboardComponent,
    NewsletterListComponent,SafeHtmlPipe

  ],
  exports: [NewsletterManagementComponent],
    imports: [
        CommonModule,
        MatTabsModule,
        MatInputModule,
        MatSelectModule,
        RouterModule,
        FormsModule,
        ComponentsModule,
        NgApexchartsModule,
        ModalModule,
        MatCheckboxModule,
        MatRadioModule

    ]
})
export class NewsletterManagementModule {
}
