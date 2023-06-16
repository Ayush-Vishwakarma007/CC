import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberRegisterComponent } from './member-register.component';
import { RouterModule, Routes} from '@angular/router';
// import { NgProgressModule } from 'ngx-progressbar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FileUploaderVerticalModule } from '../../../components/file-uploader-vertical/file-uploader-vertical.module';
import {MatRadioModule} from '@angular/material/radio';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path:'',
    component: MemberRegisterComponent
  }
];

@NgModule({
  declarations: [MemberRegisterComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatCheckboxModule,
    FileUploaderVerticalModule,
    MatRadioModule,
    AccordionModule.forRoot()

  ]
})
export class MemberRegisterModule { }
