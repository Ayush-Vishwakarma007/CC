import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BecomeMemberStepsComponent } from './become-member-steps.component';
import {MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import {FileUploaderVerticalModule} from '../../../components/file-uploader-vertical/file-uploader-vertical.module';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BraintreeGateway } from 'braintree';
import { NgxPayPalModule } from 'ngx-paypal';
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";

const routes: Routes = [
  {
    path:'',
    component: BecomeMemberStepsComponent
  }
];

@NgModule({
  declarations: [BecomeMemberStepsComponent],
  imports: [
    NgxPayPalModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    FileUploaderVerticalModule,
    MatRadioModule,
    // BraintreeGateway,
    SidebarModule


  ]
})
export class BecomeMemberStepsModule { }
