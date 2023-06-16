import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorRegisterComponent } from './vendor-register.component';
import { RouterModule, Routes } from '@angular/router';

import {MatCheckboxModule} from '@angular/material/checkbox';
import { FileUploaderVerticalModule } from '../../../components/file-uploader-vertical/file-uploader-vertical.module';
import {MatRadioModule} from '@angular/material/radio';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path:'',
    component: VendorRegisterComponent
  }
];

@NgModule({
  declarations: [VendorRegisterComponent],
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
export class VendorRegisterModule { }
