// Currently not in use

import { Directive, ElementRef, HostListener } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Directive({
  selector: '[appCurrency]',
})
export class CurrencyDirective {
  private previousValue = '';
  private regex = /^(\d+(?:\.\d{0,2})?).*$/;

  constructor(private el: ElementRef, private currencyPipe: CurrencyPipe) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let newValue = event.target.value.replace(/[^0-9.]/g, '');
    if (newValue !== this.previousValue) {
      const formattedValue = this.formatInput(newValue);
      this.el.nativeElement.value = formattedValue;
      this.previousValue = formattedValue;
      event.stopPropagation();
      this.triggerOnChange();
    }
  }

  private formatInput(value: string): string {
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    let formattedValue = `$${parts[0]}`;
    if (parts.length === 2) {
      formattedValue += `.${parts[1]}`;
    }
    return formattedValue;
  }

  private triggerOnChange() {
    const event = new Event('input', { bubbles: true });
    this.el.nativeElement.dispatchEvent(event);
  }
}
