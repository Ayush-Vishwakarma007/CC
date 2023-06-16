import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BookTicketsComponent} from "./book-tickets.component";
import {SocialLoginModule} from "@abacritt/angularx-social-login";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {DirectiveModule} from "../../../../directive/directive.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [BookTicketsComponent],
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
  exports: [BookTicketsComponent],
})
export class BookTicketsModule { }
