import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventFeedbackUserSideComponent } from './event-feedback-user-side.component';
import { RouterModule, Routes } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { ModalModule } from 'ngx-bootstrap';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';


const routes: Routes = [
  {
    path:'',
    component: EventFeedbackUserSideComponent,
  }
];

@NgModule({
  declarations: [EventFeedbackUserSideComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatChipsModule,
    ModalModule.forRoot(),
    MatRadioModule,
    MatCheckboxModule,
    MatSliderModule
  ]
})
export class EventFeedbackUserSideModule { }
