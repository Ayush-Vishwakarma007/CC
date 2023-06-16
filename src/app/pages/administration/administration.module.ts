import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {CommunityManagementComponent} from "./community-management/community-management.component";
import {CommunityManagementModule} from "./community-management/community-management.module";
import {PaymentConfigurationComponent} from "./payment-configuration/payment-configuration.component";
import {PaymentConfigurationModule} from "./payment-configuration/payment-configuration.module";
import {InvoiceManagementComponent} from "./invoice-management/invoice-management.component";
import { InvoiceManagementModule } from './invoice-management/invoice-management.module';
import {UserManagementComponent} from "./user-management/user-management.component";
import {UserManagementModule} from "./user-management/user-management.module";
import {TermConditionManagementComponent} from "./term-condition-management/term-condition-management.component";
import {TermConditionManagementModule} from "./term-condition-management/term-condition-management.module";
import {NewsletterManagementComponent} from "./newsletter-management/newsletter-management.component";
import {NewsletterManagementModule} from "./newsletter-management/newsletter-management.module";
import { CreateNewsletterComponent } from './newsletter-management/create-newsletter/create-newsletter.component';
import {MatInputModule} from '@angular/material/input';
import { NgxEditorModule } from 'ngx-editor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {ChapterManagementComponent} from "./chapter-management/chapter-management.component";
import {ChapterManagementModule} from "./chapter-management/chapter-management.module";
import {ChapterManagementEditModule} from "./chapter-management-edit/chapter-management-edit.module";
import {MenuManagementModule} from "./menu-management/menu-management.module";
import {MenuManagementComponent} from "./menu-management/menu-management.component";
import {DynamicPageManagementComponent} from "./page-management/dynamic-page-management/dynamic-page-management.component";
import {DynamicPageManagementModule} from "./page-management/dynamic-page-management/dynamic-page-management.module";
import {PageManagementModule} from "./page-management/page-management.module";
import {PageManagementComponent} from "./page-management/page-management.component";
import {EditorNewsletterModule} from './newsletter-management/create-newsletter/editor-newsletter/editor-newsletter.module';
import {NotificationManagementComponent} from './notification-management/notification-management.component';
import {NotificationManagementModule} from './notification-management/notification-management.module';
import {CreateNotificationComponent} from './notification-management/create-notification/create-notification.component';
import { CreateNotificationModule } from './notification-management/create-notification/create-notification.module';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {AuthSettingManagementComponent} from './auth-setting-management/auth-setting-management.component';
import {AuthSettingManagementModule} from './auth-setting-management/auth-setting-management.module';
import {TranslateModule} from "@ngx-translate/core";
import {CommunitySettingsComponent} from "./community-settings/community-settings.component";
import {CommunitySettingsModule} from "./community-settings/community-settings.module";
import {ChapterManagementEditComponent} from "./chapter-management-edit/chapter-management-edit.component";
import {MatRadioModule} from "@angular/material/radio";
import { StoreItemComponent } from './store-item/store-item.component';
import {StoreItemModule} from "./store-item/store-item.module";
import { DirectiveModule } from '../../directive/directive.module';

const routes: Routes = [
  {
    path: '',
    children: [
      {path : 'auth-management',component:AuthSettingManagementComponent },
      {path: 'community-management', component: CommunityManagementComponent},
      {path: 'payment-configuration', component: PaymentConfigurationComponent},
      {path: 'invoice-management', component: InvoiceManagementComponent},
      {path: 'user-management', component: UserManagementComponent},
      {path: 'chapter-management', component: ChapterManagementComponent},
      {path: 'menu-management', component: MenuManagementComponent},
      {path: 'term-condition-management', component:  TermConditionManagementComponent},
      {path : 'newsletter-management',component:NewsletterManagementComponent },
      {path : 'create-newsletter',component:CreateNewsletterComponent },
      {path : 'page-management',component:PageManagementComponent },
      {path : 'edit-newsletter/:id',component:CreateNewsletterComponent },
      {path : 'copy-newsletter/:id',component:CreateNewsletterComponent },
      {path : 'create-page',component:DynamicPageManagementComponent },
      {path : 'edit-page/:id',component:DynamicPageManagementComponent },
      {path : 'notification-management', component: NotificationManagementComponent},
      {path : 'create-notification', component: CreateNotificationComponent},
      {path : 'edit-notification/:id',component:CreateNotificationComponent },
      {path : 'community-settings',component:CommunitySettingsComponent },
      {path : 'chapter-management-edit/:id',component:ChapterManagementEditComponent },
      {path : 'store-item',component:StoreItemComponent },
    ]
  }
];

@NgModule({
  declarations: [CreateNewsletterComponent],
    imports: [
        CommonModule,
        CommunityManagementModule,
        PaymentConfigurationModule,
        InvoiceManagementModule,
        NewsletterManagementModule,
        UserManagementModule,
        PageManagementModule,
        TermConditionManagementModule,
        DynamicPageManagementModule,
        MenuManagementModule,
        RouterModule.forChild(routes),
        MatInputModule,
        ChapterManagementModule,
        NgxEditorModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDatetimepickerModule,
        ReactiveFormsModule,
        MatSelectModule,
        FormsModule,
        EditorNewsletterModule,
        NotificationManagementModule,
        CreateNotificationModule,
        MatCheckboxModule,
        AuthSettingManagementModule,
        TranslateModule,
        CommunitySettingsModule,
        ChapterManagementEditModule,
        MatRadioModule,
        StoreItemModule,
        DirectiveModule,
  
    ]
})
export class AdministrationModule {
}
