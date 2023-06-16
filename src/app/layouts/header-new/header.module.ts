import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";
import {HeaderComponent} from "./header.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {ModalModule} from "ngx-bootstrap";
import {DirectiveModule} from "../../directive/directive.module";
import {PipesModule} from '../../pipes/pipes.module'
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent
  }
];

@NgModule({
  declarations: [HeaderComponent],
  exports: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    ModalModule.forRoot(),
    DirectiveModule,
    PipesModule,
    NgxExtendedPdfViewerModule
  ]
})
export class HeaderModule { }
