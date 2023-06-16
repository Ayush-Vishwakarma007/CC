import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllSponsorComponent } from './all-sponsor.component';
import {RouterModule, Routes} from "@angular/router";
import {PipesModule} from "../../pipes/pipes.module";

const routes: Routes = [
  {
    path: '',
    component: AllSponsorComponent
  }
];

@NgModule({
  declarations: [AllSponsorComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        PipesModule,
    ]
})
export class AllSponsorModule { }
