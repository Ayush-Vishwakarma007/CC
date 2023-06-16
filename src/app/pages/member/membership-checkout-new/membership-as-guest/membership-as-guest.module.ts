import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipAsGuestComponent } from './membership-as-guest.component';
import { Routes, RouterModule } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ModalModule } from 'ngx-bootstrap';
import {ReactiveFormsModule} from "@angular/forms";
import {DirectiveModule} from "../../../../directive/directive.module";
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
@NgModule({
    declarations: [MembershipAsGuestComponent],
    exports: [
        MembershipAsGuestComponent
    ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    DirectiveModule,
    MatSelectModule,
    MatAutocompleteModule,
    GooglePlaceModule
  ]
})
export class MembershipAsGuestModule { }
