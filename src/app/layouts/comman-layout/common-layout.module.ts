import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommonLayoutComponent} from './common-layout.component';
import {RouterModule} from '@angular/router';
import {SidebarModule} from '../sidebar/sidebar.module';
import {HeaderModule} from "../header-new/header.module";
import { FooterModule } from '../footer/footer.module';
import {PlatformHeaderModule} from "../plateform-header/platform-header.module";

@NgModule({
  declarations: [CommonLayoutComponent],
    imports: [
        CommonModule,
        RouterModule,
        SidebarModule,
        HeaderModule,
        FooterModule,
        PlatformHeaderModule
    ],
  exports: [
    CommonLayoutComponent
  ]
})
export class CommonLayoutModule { }
