import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormValidationErrorsComponent } from './components/form-validation-errors/form-validation-errors.component';
import { BlockCharsDirective } from './directives/block-chars.directive';

@NgModule({
  declarations: [
    BlockCharsDirective,
    FormValidationErrorsComponent,
    FormValidationErrorsComponent,
  ],
  imports: [CommonModule, MatFormFieldModule],
  exports: [
    BlockCharsDirective,
    FormValidationErrorsComponent,
    FormValidationErrorsComponent,
  ],
})
export class SharedModule {}
