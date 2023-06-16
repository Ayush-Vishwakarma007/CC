import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FooterComponent,SafeHtmlPipe} from './footer.component';
import {RouterModule} from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PipesModule} from "../../pipes/pipes.module";
import {TranslateModule} from "@ngx-translate/core";
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';

@NgModule({
  declarations: [FooterComponent,SafeHtmlPipe],
    imports: [
        CommonModule,
        RouterModule,
        MatTabsModule,
        MatDatepickerModule,
        MatInputModule,
        MatNativeDateModule,
        MatSelectModule,
        MatRadioModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        PipesModule,
        MatPasswordStrengthModule.forRoot()
    ],
  exports: [
    FooterComponent

  ]
})
export class FooterModule { }
