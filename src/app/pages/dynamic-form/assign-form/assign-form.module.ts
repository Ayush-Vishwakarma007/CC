import { NgModule } from '@angular/core';
import { CommonModule ,DatePipe} from '@angular/common';
import { AssignFormComponent } from './assign-form.component';
import {RouterModule, Routes} from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import { NativeDateAdapter, MatNativeDateModule } from '@angular/material/core';
import {MatRadioModule} from "@angular/material/radio";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {ComponentsModule} from "../../../components/components.module";
const routes: Routes = [
  {
    path: '',
    component: AssignFormComponent
  }
];
@NgModule({
  declarations: [AssignFormComponent],
  providers: [DatePipe],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ModalModule.forRoot(),
        SidebarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatNativeDateModule,
        FormsModule,
        DragDropModule,
        ReactiveFormsModule,
        GooglePlaceModule,
        MatDatepickerModule,
        MatRadioModule,
        ComponentsModule
    ]
})
export class AssignFormModule { }
