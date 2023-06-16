import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import {RouterModule} from '@angular/router';
// import { AlertModule } from 'ngx-alerts';
import {FooterModule} from "../footer/footer.module";

@NgModule({
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
    imports: [
        CommonModule,
        RouterModule,
        FooterModule,
    ]
})
export class SidebarModule { }
