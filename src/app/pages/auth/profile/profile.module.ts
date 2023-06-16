import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ProfileComponent} from './profile.component';

// import {AlertModule} from 'ngx-alerts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {AmazingTimePickerModule} from '@jonijnm/amazing-time-picker';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime-ex';
import {DirectiveModule} from '../../../directive/directive.module';
import {SidebarModule} from "../../../layouts/sidebar/sidebar.module";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";
import {FileUploaderVerticalModule} from "../../../components/file-uploader-vertical/file-uploader-vertical.module";
import {MatRadioModule} from "@angular/material/radio";
import {BraintreeGateway} from "braintree";
import { NgxPayPalModule } from 'ngx-paypal';
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import {MatMomentDatetimeModule} from "@mat-datetimepicker/moment";
import {ImageCropperModule} from "ngx-image-cropper";
import {ModalModule} from "ngx-bootstrap";
import {MatFormFieldModule} from '@angular/material/form-field';
import { TooltipModule } from 'ngx-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent
  }
];

@NgModule({
  declarations: [ProfileComponent],
    imports: [
      NgxPayPalModule,
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        DirectiveModule,
        
        MatDatepickerModule, MatInputModule, MatNativeDateModule,
        AmazingTimePickerModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        SidebarModule, MatCheckboxModule,
        MatSelectModule,
        FileUploaderVerticalModule,
        MatRadioModule,
        // BraintreeGateway,
        MatDatetimepickerModule,
        ModalModule.forRoot(),
        MatFormFieldModule,
        MatMomentDatetimeModule, ImageCropperModule,
        TooltipModule.forRoot(),
    ]
})
export class ProfileModule {
}
