import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import { CreateEventNewComponent } from './create-event-new.component';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FileUploaderVerticalModule} from '../../../../components/file-uploader-vertical/file-uploader-vertical.module';
import { NgxEditorModule } from 'ngx-editor';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {BasicInfoComponent} from './basic-information/basic-information.component';
import {ConfigurationComponent} from './configuration/configuration.component';
import {CustomInfoComponent} from './custom-information/custom-information.component';
import {DiscountRefundComponent} from './discount-refund/discount-refund.component';
import {ImageDescriptionComponent} from './image-description/image-description.component';
import {PricingComponent} from './pricing/pricing.component';
import {SessionComponent} from './session/session.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {MatMomentDatetimeModule} from "@mat-datetimepicker/moment";
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import {FileUploaderEventModule} from "../../../../components/file-uploader-event/file-uploader-event.module";
import {ConfigurationPricingComponent} from './configuration-pricing/configuration-pricing.component';
import {SidebarModule} from "../../../../layouts/sidebar/sidebar.module";
// import {AlertModule} from "ngx-alerts";
import { PaymentConfigurationComponent } from './payment-configuration/payment-configuration.component';
import {EventConfigComponent} from "./event-config/event-config.component";
import { InvoiceConfigurationComponent } from './invoice-configuration/invoice-configuration.component';
import {TextMaskModule} from "angular2-text-mask";
import {DirectiveModule} from "../../../../directive/directive.module";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime-ex";
import {TranslateModule} from "@ngx-translate/core";
import { AdditionalInformationComponent } from "./additional-information/additional-information.component"
import { PipesModule } from 'src/app/pipes/pipes.module';
import { UiSwitchModule } from 'ngx-ui-switch'
import { ColorPickerModule } from 'ngx-color-picker';

const routes: Routes = [
  {
    path:'',
    component: CreateEventNewComponent
  }
];

@NgModule({
  declarations: [ CreateEventNewComponent,
                  ConfigurationPricingComponent,
                  BasicInfoComponent,
                  ConfigurationComponent,
                  PricingComponent,
                  CustomInfoComponent,
                  DiscountRefundComponent,
                  ImageDescriptionComponent,
                  SessionComponent,
                  PaymentConfigurationComponent,
                  EventConfigComponent,
                  InvoiceConfigurationComponent,
                  AdditionalInformationComponent
                ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule, MatNativeDateModule,
    FileUploaderEventModule,
    FileUploaderVerticalModule,
    NgxEditorModule,
    MatChipsModule,
    MatRadioModule,
    TextMaskModule,
    MatCheckboxModule,
    MatTabsModule,
    MatFormFieldModule,
    ColorPickerModule,
    MatIconModule,
    GooglePlaceModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    PipesModule,
    // use this if you want to use native javascript dates and INTL API if available
    // MatNativeDatetimeModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule, FileUploaderEventModule,
    SidebarModule, DirectiveModule,TranslateModule,
    UiSwitchModule
  ]
})


export class CreateEventNewModule { }
