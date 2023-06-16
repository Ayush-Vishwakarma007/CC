import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from './services/api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SpinnerService } from './services/spinner.service';
//import {Ng4LoadingSpinnerModule} from 'ngx-loading-spinner';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonLayoutModule } from './layouts/comman-layout/common-layout.module';
// import {AlertModule} from 'ngx-alerts';
import { AuthGuard } from './auth.guard';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxEditorModule } from 'ngx-editor';
import { ToastrModule } from "ngx-toastr";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
//import { PaymentComponent } from './payment/payment.component';
// import { ServiceWorkerModule } from '@angular/service-worker';
// import { environment } from '../environments/environment';
// import { PaymentComponent } from './payment/payment.component';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { MatRadioModule } from '@angular/material/radio';
import { AuthenticationService } from "./services/authentication.service";
import { SidebarModule } from "./layouts/sidebar/sidebar.module";
import { SidebarLayoutModule } from "./layouts/sidebar-layout/sidebar-layout.module";
import { configuration } from "./configration";
import { FormsModule } from '@angular/forms';
import { VolunteerModule } from './pages/event/volunteer/volunteer.module';

// import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UiSwitchModule } from 'ngx-ui-switch';
import { CreateAuditoriumComponent } from './pages/event/admin/create-auditorium/create-auditorium.component';

export function HttpLoaderFactory(http: HttpClient) {
  // return new TranslateHttpLoader(http,'assets/i18n/','.json');
  return new TranslateHttpLoader(http, configuration.BASE_URL + 'community/translation/web/', '');

}
//import { AngularFirestoreModule } from '@angular/fire/firestore';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    UiSwitchModule,
    MatIconModule,
    MatButtonModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    //Ng4LoadingSpinnerModule,
    NgxSpinnerModule,
    CommonLayoutModule,
    SidebarLayoutModule,
    // AlertModule.forRoot({ maxMessages:1, timeout: 5000, position: 'right' }),
    CarouselModule.forRoot(),
    AccordionModule.forRoot(),
    TextMaskModule,
    NgxEditorModule,
    GalleryModule,
    LightboxModule,
    MatRadioModule,
    SidebarModule,
    UiSwitchModule,

    // AngularFirestoreModule ,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    LightboxModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    VolunteerModule,
  ],
  providers: [
    AuthGuard,
    ApiService,
    SpinnerService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]

})

export class AppModule { }
