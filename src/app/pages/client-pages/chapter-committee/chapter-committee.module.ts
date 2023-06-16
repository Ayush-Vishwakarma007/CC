import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { ChapterCommitteeComponent } from './chapter-committee.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DirectiveModule} from "../../../directive/directive.module";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {TranslateModule} from "@ngx-translate/core";
import {PipesModule} from "../../../pipes/pipes.module";

const routes: Routes = [
  {
    path: 'chapter-committee/:id',
    component: ChapterCommitteeComponent
  }
]
@NgModule({
  declarations: [ChapterCommitteeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DirectiveModule, MatCardModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    RouterModule.forChild(routes), PipesModule
  ]
})
export class ChapterCommitteeModule { }
