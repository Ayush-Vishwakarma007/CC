import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicPageManagementComponent } from './dynamic-page-management.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "../../../../components/components.module";
import {NgApexchartsModule} from "ng-apexcharts";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FileUploaderVerticalModule} from "../../../../components/file-uploader-vertical/file-uploader-vertical.module";
import { TranslateModule } from "@ngx-translate/core";
import {ModalModule} from "ngx-bootstrap";

@NgModule({
  declarations: [DynamicPageManagementComponent],
    imports: [
        CommonModule,
        MatTabsModule,
        MatInputModule,
        MatSelectModule,
        RouterModule,
        FormsModule,
        ComponentsModule,
        NgApexchartsModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        FileUploaderVerticalModule,
        TranslateModule,
        ModalModule.forRoot(),
    ],
  exports:[DynamicPageManagementComponent]
})
export class DynamicPageManagementModule { }
