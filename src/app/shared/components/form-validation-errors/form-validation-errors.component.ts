/* eslint-disable @angular-eslint/prefer-standalone */
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CustomValidatorService } from './custom-validator.service';

@Component({
  selector: 'app-form-validation-errors',
  standalone: false,
  templateUrl: './form-validation-errors.component.html',
})
export class FormValidationErrorsComponent {
  @Input() control!: AbstractControl | null;

  get errorMessage() {
    if (this.control) {
      for (const error in this.control.errors) {
        if (
          this.control.errors[error] &&
          this.control.touched &&
          this.control.enabled
        ) {
          return CustomValidatorService.getValidatorErrorMessage(
            error,
            this.control.errors[error]
          );
        }
      }
    }
    return '';
  }
}
