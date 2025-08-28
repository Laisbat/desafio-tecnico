import { TestBed } from '@angular/core/testing';

import { CustomValidatorService } from './custom-validator.service';

describe('#CustomValidatorService', () => {
  let service: CustomValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomValidatorService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('#getValidatorErrorMessage', () => {
    it('deve retornar mensagem de campo obrigatório', () => {
      const message =
        CustomValidatorService.getValidatorErrorMessage('required');
      expect(message).toBe('Campo Obrigatório.');
    });

    it('deve retornar mensagem de valor mínimo com valor fornecido', () => {
      const validatorValue = { min: 5 };
      const message = CustomValidatorService.getValidatorErrorMessage(
        'min',
        validatorValue
      );
      expect(message).toBe('O mínimo para o campo é 5.');
    });

    it('deve retornar mensagem de valor mínimo com valor padrão quando não fornecido', () => {
      const message = CustomValidatorService.getValidatorErrorMessage('min');
      expect(message).toBe('O mínimo para o campo é 0.');
    });

    it('deve retornar mensagem de valor mínimo com valor padrão quando o valor do validador é nulo', () => {
      const message = CustomValidatorService.getValidatorErrorMessage(
        'min',
        null
      );
      expect(message).toBe('O mínimo para o campo é 0.');
    });

    it('deve retornar mensagem de valor máximo com valor fornecido', () => {
      const validatorValue = { max: 100 };
      const message = CustomValidatorService.getValidatorErrorMessage(
        'max',
        validatorValue
      );
      expect(message).toBe('O máximo para o campo é 100');
    });

    it('deve retornar mensagem de valor máximo com valor padrão quando não fornecido', () => {
      const message = CustomValidatorService.getValidatorErrorMessage('max');
      expect(message).toBe('O máximo para o campo é 0');
    });

    it('deve retornar mensagem de tamanho mínimo com valor fornecido', () => {
      const validatorValue = { requiredLength: 8 };
      const message = CustomValidatorService.getValidatorErrorMessage(
        'minlength',
        validatorValue
      );
      expect(message).toBe('Tamanho mínimo 8 caracteres.');
    });

    it('deve retornar mensagem de tamanho máximo com valor fornecido', () => {
      const validatorValue = { requiredLength: 50 };
      const message = CustomValidatorService.getValidatorErrorMessage(
        'maxlength',
        validatorValue
      );
      expect(message).toBe('O Tamanho máximo para o campo é 50 caracteres.');
    });

    it('deve retornar mensagem de tamanho máximo com valor padrão quando não fornecido', () => {
      const message =
        CustomValidatorService.getValidatorErrorMessage('maxlength');
      expect(message).toBe('O Tamanho máximo para o campo é 0 caracteres.');
    });

    it('deve retornar undefined para nome de validador desconhecido', () => {
      const message =
        CustomValidatorService.getValidatorErrorMessage('unknown');
      expect(message).toBeUndefined();
    });

    it('deve lidar com nome de validador vazio', () => {
      const message = CustomValidatorService.getValidatorErrorMessage('');
      expect(message).toBeUndefined();
    });

    it('deve lidar com nome de validador nulo', () => {
      const message = CustomValidatorService.getValidatorErrorMessage(
        null as unknown as string
      );
      expect(message).toBeUndefined();
    });

    it('deve lidar com nome de validador indefinido', () => {
      const message = CustomValidatorService.getValidatorErrorMessage(
        undefined as unknown as string
      );
      expect(message).toBeUndefined();
    });
  });

  describe('#Mock real', () => {
    it('deve lidar com cenários típicos de validação de formulário', () => {
      expect(CustomValidatorService.getValidatorErrorMessage('required')).toBe(
        'Campo Obrigatório.'
      );

      expect(CustomValidatorService.getValidatorErrorMessage('email')).toBe(
        'Endereço de e-mail inválido.'
      );

      expect(
        CustomValidatorService.getValidatorErrorMessage('minlength', {
          requiredLength: 8,
        })
      ).toBe('Tamanho mínimo 8 caracteres.');

      expect(
        CustomValidatorService.getValidatorErrorMessage('min', { min: 18 })
      ).toBe('O mínimo para o campo é 18.');

      expect(
        CustomValidatorService.getValidatorErrorMessage('max', { max: 120 })
      ).toBe('O máximo para o campo é 120');

      expect(
        CustomValidatorService.getValidatorErrorMessage('maxlength', {
          requiredLength: 500,
        })
      ).toBe('O Tamanho máximo para o campo é 500 caracteres.');
    });

    it('deve ser case sensitive para nomes de validadores', () => {
      expect(
        CustomValidatorService.getValidatorErrorMessage('REQUIRED')
      ).toBeUndefined();

      expect(
        CustomValidatorService.getValidatorErrorMessage('Email')
      ).toBeUndefined();

      expect(
        CustomValidatorService.getValidatorErrorMessage('MinLength')
      ).toBeUndefined();
    });
  });
});
