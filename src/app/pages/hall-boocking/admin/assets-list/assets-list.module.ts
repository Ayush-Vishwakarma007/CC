import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsListComponent } from './assets-list.component';
import {RouterModule, Routes} from "@angular/router";
import { MatInputModule } from "@angular/material/input";
import {ModalModule} from "ngx-bootstrap";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {FileUploaderEventModule} from "../../../../components/file-uploader-event/file-uploader-event.module";
import {FileUploaderVerticalModule} from '../../../../components/file-uploader-vertical/file-uploader-vertical.module';

const routes: Routes = [
  {
    path: '',
    component: AssetsListComponent
  }
];

@NgModule({
  declarations: [ AssetsListComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    ModalModule.forRoot(),
    MatSlideToggleModule,
    MatSelectModule,
    FileUploaderEventModule,
    FileUploaderVerticalModule
  ]
})
export class AssetsListModule { }
