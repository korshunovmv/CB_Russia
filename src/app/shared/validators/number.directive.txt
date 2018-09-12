import { Validator, AbstractControl, NG_VALIDATORS, FormControl, ValidatorFn } from '@angular/forms';

export function NumberIntValidator(control: AbstractControl): {[key: string]: any} {
  const v = parseInt(control.value, 10);
  return control.value.toString() !== v.toString() ? {'numberIntValidator': {value: v}} : null;
}

export function NumberFloatValidator(control: AbstractControl): {[key: string]: any} {
  const v = parseFloat(control.value);
  return control.value.toString() !== v.toString() ? {'numberFloatValidator': {value: v}} : null;
}