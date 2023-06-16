import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MembershipPlanDetailsNewComponent} from './membership-plan-details-new.component';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DirectiveModule} from "../../../../directive/directive.module";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
/*const routes: Routes = [
  {
    path:'',
    component: MembershipPlanDetailsNewComponent
  }
];*/


@NgModule({
  declarations: [MembershipPlanDetailsNewComponent],
  exports: [
    MembershipPlanDetailsNewComponent
  ],
    imports: [
        CommonModule,
        MatCardModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        DirectiveModule,
        MatCheckboxModule,
        MatSelectModule,
        GooglePlaceModule,
        MatAutocompleteModule
    ]
})
export class MembershipPlanDetailsNewModule {
}
