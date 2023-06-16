import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipDonationComponent } from './membership-donation.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
  //LinkedinLoginProvider
} from '@abacritt/angularx-social-login';
import {DirectiveModule} from "../../../../directive/directive.module";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";


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
  declarations: [MembershipDonationComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    SocialLoginModule,
    GooglePlaceModule,
    FormsModule,
    DirectiveModule,
  ],
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

  exports: [MembershipDonationComponent]
})
export class MembershipDonationModule { }
