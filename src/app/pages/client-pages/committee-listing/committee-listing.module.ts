import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommitteeListingComponent } from './committee-listing.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DirectiveModule } from '../../../directive/directive.module';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {CarouselModule} from "ngx-bootstrap";
import {PipesModule} from "../../../pipes/pipes.module";

const routes: Routes = [
  {
    path: 'committee',
    component: CommitteeListingComponent
  }
]

@NgModule({
  declarations: [CommitteeListingComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DirectiveModule, MatCardModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        RouterModule.forChild(routes), CarouselModule, PipesModule
    ]
})
export class CommitteeListingModule { }
