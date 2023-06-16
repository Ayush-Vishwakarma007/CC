import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AboutUsComponent} from './about-us.component';
import {CommitteeListingComponent} from "../committee-listing/committee-listing.component";
import {ChapterCommitteeComponent} from "../chapter-committee/chapter-committee.component";
import {CommitteeListingModule} from "../committee-listing/committee-listing.module";
import {TranslateModule} from "@ngx-translate/core";
import {ChapterCommitteeModule} from "../chapter-committee/chapter-committee.module";
import {PipesModule} from "../../../pipes/pipes.module";

const routes: Routes = [
  {
    path: '',
    component: AboutUsComponent,
    children: [
      {
        path: "",
        component: CommitteeListingComponent
      },
      {
        path: "",
        component: ChapterCommitteeComponent
      }
    ]
  }
];

@NgModule({
  declarations: [AboutUsComponent],

  imports: [
    CommonModule,
    CommitteeListingModule,
    ChapterCommitteeModule,
    RouterModule.forChild(routes),
    TranslateModule,
    PipesModule
  ]
})
export class AboutUsModule {
}
