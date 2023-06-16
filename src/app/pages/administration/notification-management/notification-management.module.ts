import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { NotificationManagementComponent, SafeHtmlPipe } from "./notification-management.component";
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CreateNotificationModule } from './create-notification/create-notification.module';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { PipesModule } from '../../../pipes/pipes.module';
import {DomSanitizer} from "@angular/platform-browser";
const routes: Routes = [
  {
    path: '',
    component: NotificationManagementComponent
  }
];

@NgModule({
  declarations: [NotificationManagementComponent, NotificationListComponent,SafeHtmlPipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    RouterModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    FormsModule, 
    MatCheckboxModule,
    CreateNotificationModule,
    PipesModule,
  

  ],
  exports: [NotificationManagementComponent]
})
export class NotificationManagementModule { }
