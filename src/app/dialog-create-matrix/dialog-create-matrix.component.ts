import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { MatrixLength } from '../model/matrix.model';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { NumberIntValidator } from '../shared/validators/number.directive';

@Component({
  selector: 'dialog-create-matrix',
  templateUrl: './dialog-create-matrix-html.component.html',
  styleUrls: ['./dialog-create-matrix-scss.component.scss']
})
export class DialogCreateMatrixComponent {
  matrixLength: MatrixLength;
  options: FormGroup;
  busy: boolean;
  public form: FormGroup;

  constructor(
    fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogCreateMatrixComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
    if (data && data.matrixLength) {
      this.matrixLength = data.matrixLength;
    }
    this.form = new FormGroup({
      n: new FormControl((this.matrixLength) ? this.matrixLength.n : 0, [Validators.required, Validators.min(1), Validators.max(40), NumberIntValidator]),
      m: new FormControl((this.matrixLength) ? this.matrixLength.m : 0, [Validators.required, Validators.min(1), Validators.max(40), NumberIntValidator]),
    });
    this.form.valueChanges.subscribe((data) => {
      this.matrixLength = {
        n : typeof data.n === 'string' ? parseInt(data.n, 10) : data.n,
        m : typeof data.m === 'string' ? parseInt(data.m, 10) : data.m,
      }
    });
  }
  getErrorMessage(control: AbstractControl) {
    if (control.hasError('required')) {
      return 'Пустое значение';
    }
    if (control.hasError('numberIntValidator')) {
      return 'Не валидно';
    }
    if (control.hasError('min')) {
      return 'Не должно быть меньше 1';
    }
    if (control.hasError('max')) {
      return 'Не должно быть больше 40';
    }
    return '';
  }
  getErrorMessageN(): string {
    return this.getErrorMessage(this.form.controls.n);
  }
  getErrorMessageM(): string {
    return this.getErrorMessage(this.form.controls.m);
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
