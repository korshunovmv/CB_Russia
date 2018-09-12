import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { NumberFloatValidator } from '../shared/validators/number.directive';

@Component({
  selector: 'dialog-set-chance',
  templateUrl: './dialog-set-chance-html.component.html',
  styleUrls: ['./dialog-set-chance-scss.component.scss']
})
export class DialogChanceSetComponent {
  chance: number;
  options: FormGroup;
  busy: boolean;
  public form: FormGroup;

  constructor(
    fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogChanceSetComponent>,
  ) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
    this.chance = 0.1;
    this.form = new FormGroup({
      chance: new FormControl(this.chance, [Validators.required, Validators.min(0.01), Validators.max(0.99), NumberFloatValidator]),
    });
    this.form.valueChanges.subscribe((data) => {
      this.chance = typeof data.chance === 'string' ? parseFloat(data.chance) : data.chance;
    });
  }
  getErrorMessageChance() {
    const control = this.form.controls.chance;
    if (control.hasError('required')) {
      return 'Пустое значение';
    }
    if (control.hasError('numberFloatValidator')) {
      return 'Не валидно';
    }
    if (control.hasError('min')) {
      return 'Не должно быть меньше 0.01';
    }
    if (control.hasError('max')) {
      return 'Не должно быть больше 0.99';
    }
    return '';
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
