import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuestVerificationComponent } from './guest-verification/guest-verification.component';
import { SearchComponent } from './search/search.component';
import { WelcomeEmailComponent } from './welcome-email/welcome-email.component';

const routes: Routes = [

  { path: '', component: WelcomeEmailComponent },
  { path: 'search', component: SearchComponent },
  { path: 'verification', component: GuestVerificationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VolunteerRoutingModule { }
