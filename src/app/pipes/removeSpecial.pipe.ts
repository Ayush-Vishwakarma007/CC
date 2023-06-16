import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSpecial'
})
export class RemoveSpecialPipe implements PipeTransform {

  transform(value: string): any {
    return value.replace('#', ''); // replace tags
  }

}
