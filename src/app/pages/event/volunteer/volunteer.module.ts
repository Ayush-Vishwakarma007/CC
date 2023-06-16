import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VolunteerRoutingModule } from './volunteer-routing.module';
import { WelcomeEmailComponent } from './welcome-email/welcome-email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgOtpInputModule } from 'ng-otp-input';
import { SearchComponent } from './search/search.component';
import { GuestVerificationComponent } from './guest-verification/guest-verification.component';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [WelcomeEmailComponent, SearchComponent, GuestVerificationComponent],
  imports: [
    CommonModule,
    VolunteerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgOtpInputModule,
    MatRadioModule

  ]
})
export class VolunteerModule { }
