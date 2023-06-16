import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { PhoneMaskDirective } from './phone-mask.directive';
import { AutofocusDirective } from './autofocus.directive';
import { NgModelPhoneMaskDirective } from './ng-model-phone-mask.directive';
@NgModule({
  declarations: [
    PhoneMaskDirective,
    AutofocusDirective,
    NgModelPhoneMaskDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    PhoneMaskDirective,
    AutofocusDirective,
    NgModelPhoneMaskDirective
  ]
})
export class DirectiveModule { }
