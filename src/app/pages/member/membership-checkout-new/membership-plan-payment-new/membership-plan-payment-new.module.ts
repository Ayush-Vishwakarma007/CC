import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipPlanPaymentNewComponent } from './membership-plan-payment-new.component';
import { Routes, RouterModule } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "../../../../components/components.module";
import { ModalModule } from 'ngx-bootstrap';
/*

const routes: Routes = [
  {
    path:'',
    component: MembershipPlanPaymentNewComponent,
  }
];
*/


@NgModule({
    declarations: [MembershipPlanPaymentNewComponent],
    exports: [
        MembershipPlanPaymentNewComponent
    ],
    imports: [
        CommonModule,
        MatCardModule,
        MatRadioModule,
        MatTabsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ComponentsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
    ]
})
export class MembershipPlanPaymentNewModule { }
