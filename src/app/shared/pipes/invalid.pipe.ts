import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from "@angular/forms";

@Pipe({
  name: 'invalid'
})
export class InvalidPipe implements PipeTransform {

  constructor() {
  }

  transform(control: AbstractControl) {
    return control.errors && (control.dirty || control.touched);
  }
}
