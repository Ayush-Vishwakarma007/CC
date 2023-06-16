import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MembershipPlanNewComponent} from './membership-plan-new.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {ModalModule} from 'ngx-bootstrap';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";


@NgModule({
  declarations: [MembershipPlanNewComponent],
  exports: [
    MembershipPlanNewComponent
  ],
    imports: [
        CommonModule,
        MatTabsModule,
        MatCardModule,
        MatRadioModule,
        ModalModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatSelectModule
    ]
})
export class MembershipPlanNewModule { }
