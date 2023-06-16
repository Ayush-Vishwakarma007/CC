import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NewUserRegisterComponent} from './new-user-register.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatTabsModule} from "@angular/material/tabs";
import {MatRadioModule} from "@angular/material/radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {TranslateModule} from "@ngx-translate/core";

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
  //LinkedinLoginProvider
} from '@abacritt/angularx-social-login';
import {DirectiveModule} from "../../../../directive/directive.module";


// social login 25-04-2020 | pradip kor
// const CONFIG = new AuthServiceConfig([
//   {
//     id: GoogleLoginProvider.PROVIDER_ID,
//     provider: new GoogleLoginProvider('962813096808-p4vjcqtta9coglshhsfasfkqre6cfvv5.apps.googleusercontent.com')
//   },
//   {
//     id: FacebookLoginProvider.PROVIDER_ID,
//     provider: new FacebookLoginProvider('234245014480637')
//   }
//   // ,
//   // {
//   //   id: LinkedinLoginProvider.PROVIDER_ID,
//   //   provider: new LinkedinLoginProvider('LINKEDIN_CLIENT_ID')
//   // }
// ], false);

// export function provideConfig() {
//   return CONFIG;
// }


@NgModule({
  declarations: [NewUserRegisterComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    SocialLoginModule,
    MatAutocompleteModule,
    GooglePlaceModule,
    DirectiveModule,
    TranslateModule,
  ],
  exports: [NewUserRegisterComponent],
  // providers: [
  //   {
  //     provide: AuthServiceConfig,
  //     useFactory: provideConfig
  //   }
  // ],

  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('962813096808-p4vjcqtta9coglshhsfasfkqre6cfvv5.apps.googleusercontent.com')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('234245014480637')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],

})
export class NewUserRegisterModule {
}
