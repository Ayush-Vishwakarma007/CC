import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EventFundComponent } from './event-fund.component';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path:'',
    component:EventFundComponent,
  }
];

@NgModule({
  declarations: [EventFundComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],

})
export class EventFundModule { }
