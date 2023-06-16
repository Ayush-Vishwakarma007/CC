import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarLayoutComponent } from './sidebar-layout.component';
import {HeaderModule} from "../header-new/header.module";
import {SidebarModule} from "../sidebar/sidebar.module";
import {RouterModule} from "@angular/router";
import {FooterModule} from "../footer/footer.module";
// import {AlertModule} from "ngx-alerts";
import {PlatformHeaderModule} from "../plateform-header/platform-header.module";
import { AdminHeaderModule } from '../admin-header/admin-header.module';

@NgModule({
  declarations: [SidebarLayoutComponent],
    imports: [
        CommonModule,
        RouterModule,
        SidebarModule,
        HeaderModule,
        FooterModule,
        AdminHeaderModule,
        PlatformHeaderModule
    ],
  exports: [
    SidebarLayoutComponent
  ]
})
export class SidebarLayoutModule { }
