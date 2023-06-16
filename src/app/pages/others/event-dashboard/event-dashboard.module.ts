import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDashboardComponent } from './event-dashboard.component';
import { Routes, RouterModule} from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgxEditorModule } from 'ngx-editor';
import {MatCheckboxModule} from '@angular/material/checkbox';

// import { AlertModule } from 'ngx-alerts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import {ComponentsModule} from '../../../components/components.module';
import {DonateComponent} from "./donate/donate.component";

const routes: Routes = [
  {
    path:'',
    component: EventDashboardComponent
  }
];

 @NgModule({
  declarations: [EventDashboardComponent,DonateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatExpansionModule,
    NgxEditorModule,
    MatCheckboxModule,
    SidebarModule,
    ComponentsModule
  ]
})
export class EventDashboardModule { }

