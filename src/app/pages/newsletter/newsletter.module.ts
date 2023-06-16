import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { NewsletterComponent } from './newsletter.component';

import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import { ModalModule } from 'ngx-bootstrap'
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path:'',
    component: NewsletterComponent
  }
];

@NgModule({
  declarations: [NewsletterComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        //AnimateOnScrollModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatInputModule,
        ModalModule.forRoot(),
        TranslateModule,
    ]
})
export class NewsletterModule { }
