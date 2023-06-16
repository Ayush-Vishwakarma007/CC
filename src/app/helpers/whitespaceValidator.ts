import {AbstractControl, ValidationErrors} from '@angular/forms';

export class UsernameValidator {
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {

    if ((control.value as string).indexOf(' ') >= 0) {
      return {cannotContainSpace: true}
    }
    return null;
  }

  static removeSpaces(c: AbstractControl) {
    if (c && c.value) {
      let removedSpaces = c.value.split(' ').join('');
      c.value !== removedSpaces && c.setValue(removedSpaces);
    }
    return null;
  }
}
