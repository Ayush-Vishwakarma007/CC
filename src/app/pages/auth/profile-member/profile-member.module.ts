import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { ProfileMemberComponent } from './profile-member.component';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ImageCropperModule} from "ngx-image-cropper";

import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import {MatSelectModule} from "@angular/material/select";
import {FileUploaderVerticalModule} from "../../../components/file-uploader-vertical/file-uploader-vertical.module";
import {MatRadioModule} from "@angular/material/radio";
import {BraintreeGateway} from "braintree";
import { NgxPayPalModule } from 'ngx-paypal';
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import {MatMomentDatetimeModule} from "@mat-datetimepicker/moment";
import {ModalModule, TooltipModule} from "ngx-bootstrap";
import {MatFormFieldModule} from '@angular/material/form-field';
import {DirectiveModule} from "../../../directive/directive.module";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {PipesModule} from '../../../pipes/pipes.module'
import {NgOtpInputModule} from "ng-otp-input";

// import {ProfileComponent} from '../profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileMemberComponent
  }
];

@NgModule({
  declarations: [ProfileMemberComponent],
    imports: [
      NgxPayPalModule,
        CommonModule,
        RouterModule.forChild(routes),
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        ImageCropperModule,
        SidebarModule,
        MatSelectModule,
        FileUploaderVerticalModule,
        MatRadioModule,
        // BraintreeGateway,
        MatDatetimepickerModule,
        MatMomentDatetimeModule,
        ModalModule,
        MatFormFieldModule,
        TooltipModule.forRoot(),
        DirectiveModule,
        MatDatepickerModule,
        PipesModule,
        NgOtpInputModule


    ]
})
export class ProfileMemberModule { }
