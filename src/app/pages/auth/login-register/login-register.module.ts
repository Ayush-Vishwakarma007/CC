import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRegisterComponent } from './login-register.component';
import { RouterModule, Routes } from '@angular/router';

//import { LoginRoutingModule } from './login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
// import { AlertModule } from 'ngx-alerts';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { DirectiveModule } from '../../../directive/directive.module';
import { MatInputModule } from '@angular/material/input';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';





import {SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, //LinkedinLoginProvider
} from '@abacritt/angularx-social-login';
import {TranslateModule} from "@ngx-translate/core";
import {PipesModule} from "../../../pipes/pipes.module";


// social login 25-04-2020 | pradip kor
// const CONFIG = new AuthServiceConfig([
//   {
//     id: GoogleLoginProvider.PROVIDER_ID,
//     provider: new GoogleLoginProvider('962813096808-p4vjcqtta9coglshhsfasfkqre6cfvv5.apps.googleusercontent.com')
//   },
//   {
//     id: FacebookLoginProvider.PROVIDER_ID,
//     provider: new FacebookLoginProvider('438031010469811')
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


const routes: Routes = [
  {
    path: '',
    component: LoginRegisterComponent
  }
];

@NgModule({
  declarations: [LoginRegisterComponent],
  exports: [
  ],

    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        MatSelectModule,
        SocialLoginModule,
        ReactiveFormsModule,
        TextMaskModule,
        AngularMultiSelectModule,
        MatRadioModule,
        DirectiveModule,
        TranslateModule,
        MatAutocompleteModule,
        MatInputModule,
        MatPasswordStrengthModule.forRoot(),
        PipesModule,
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
            provider: new FacebookLoginProvider('438031010469811')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
})
export class LoginRegisterModule { }
