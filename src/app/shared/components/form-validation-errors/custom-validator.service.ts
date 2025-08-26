import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomValidatorService {
  static getValidatorErrorMessage(
    validatorName: string,
    validatorValue?: any
  ): string {
    const config: any = {
      required: 'Campo Obrigatório.',
      min: `O mínimo para o campo é ${validatorValue?.min ?? '0'}.`,
      max: `O máximo para o campo é ${validatorValue?.max ?? '0'}`,
      minlength: `Tamanho mínimo ${
        validatorValue?.requiredLength ?? '0'
      } caracteres.`,
      maxlength: `O Tamanho máximo para o campo é ${
        validatorValue?.requiredLength ?? '0'
      } caracteres.`,
      email: 'Endereço de e-mail inválido.',
    };
    return config[validatorName];
  }
}
