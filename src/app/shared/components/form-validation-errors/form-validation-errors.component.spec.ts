import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CustomValidatorService } from './custom-validator.service';
import { FormValidationErrorsComponent } from './form-validation-errors.component';

describe('#FormValidationErrorsComponent', () => {
  let component: FormValidationErrorsComponent;
  let fixture: ComponentFixture<FormValidationErrorsComponent>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CustomValidatorService', [
      'getValidatorErrorMessage',
    ]);

    await TestBed.configureTestingModule({
      declarations: [FormValidationErrorsComponent],
      imports: [MatFormFieldModule, NoopAnimationsModule],
      providers: [{ provide: CustomValidatorService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(FormValidationErrorsComponent);
    component = fixture.componentInstance;
    TestBed.inject(
      CustomValidatorService
    ) as jasmine.SpyObj<CustomValidatorService>;

    fixture.detectChanges();
  });

  describe('#Criação do Componente', () => {
    it('deve renderizar o componente', () => {
      expect(component).toBeTruthy();
    });

    it('deve ter a propriedade control como undefined inicialmente', () => {
      expect(component.control).toBeUndefined();
    });
  });

  describe('#Input control', () => {
    it('deve aceitar um FormControl como input', () => {
      const control = new FormControl('');
      component.control = control;

      expect(component.control).toBe(control);
    });

    it('deve aceitar null como input', () => {
      component.control = null;

      expect(component.control).toBeNull();
    });
  });

  describe('#errorMessage getter', () => {
    beforeEach(() => {
      spyOn(CustomValidatorService, 'getValidatorErrorMessage').and.returnValue(
        'Mensagem de erro mock'
      );
    });

    it('deve retornar string vazia quando control for null', () => {
      component.control = null;

      expect(component.errorMessage).toBe('');
    });

    it('deve retornar string vazia quando control for undefined', () => {
      component.control = undefined as unknown as FormControl;

      expect(component.errorMessage).toBe('');
    });

    it('deve retornar string vazia quando control não tiver erros', () => {
      const control = new FormControl('valor válido');
      component.control = control;

      expect(component.errorMessage).toBe('');
    });

    it('deve retornar string vazia quando control não foi tocado', () => {
      const control = new FormControl('', [Validators.required]);
      control.markAsUntouched();
      component.control = control;

      expect(component.errorMessage).toBe('');
    });

    it('deve retornar string vazia quando control está desabilitado', () => {
      const control = new FormControl('', [Validators.required]);
      control.markAsTouched();
      control.disable();
      component.control = control;

      expect(component.errorMessage).toBe('');
    });

    it('deve retornar mensagem de erro quando control tem erro, foi tocado e está habilitado', () => {
      const control = new FormControl('', [Validators.required]);
      control.markAsTouched();
      component.control = control;

      const result = component.errorMessage;

      expect(
        CustomValidatorService.getValidatorErrorMessage
      ).toHaveBeenCalledWith('required', true);
      expect(result).toBe('Mensagem de erro mock');
    });

    it('deve retornar mensagem do primeiro erro encontrado quando há múltiplos erros', () => {
      const control = new FormControl('ab', [
        Validators.required,
        Validators.minLength(5),
      ]);
      control.markAsTouched();
      component.control = control;

      const result = component.errorMessage;

      expect(
        CustomValidatorService.getValidatorErrorMessage
      ).toHaveBeenCalled();
      expect(result).toBe('Mensagem de erro mock');
    });

    it('deve chamar CustomValidatorService.getValidatorErrorMessage com parâmetros corretos', () => {
      const control = new FormControl('', [Validators.minLength(5)]);
      control.setValue('abc');
      control.markAsTouched();
      component.control = control;

      component.errorMessage;

      expect(
        CustomValidatorService.getValidatorErrorMessage
      ).toHaveBeenCalledWith('minlength', {
        requiredLength: 5,
        actualLength: 3,
      });
    });

    it('deve funcionar com diferentes tipos de validadores', () => {
      const testCases = [
        {
          name: 'required',
          control: new FormControl('', [Validators.required]),
          expectedError: 'required',
          expectedValue: true,
        },
        {
          name: 'email',
          control: new FormControl('email-inválido', [Validators.email]),
          expectedError: 'email',
          expectedValue: true,
        },
        {
          name: 'maxlength',
          control: new FormControl('texto muito longo', [
            Validators.maxLength(5),
          ]),
          expectedError: 'maxlength',
          expectedValue: { requiredLength: 5, actualLength: 17 },
        },
      ];

      testCases.forEach((testCase) => {
        testCase.control.markAsTouched();
        component.control = testCase.control;

        component.errorMessage;

        expect(
          CustomValidatorService.getValidatorErrorMessage
        ).toHaveBeenCalledWith(testCase.expectedError, testCase.expectedValue);
      });
    });
  });

  describe('#Integração com Template', () => {
    it('deve renderizar a mensagem de erro no template', () => {
      spyOn(CustomValidatorService, 'getValidatorErrorMessage').and.returnValue(
        'Campo obrigatório'
      );

      const control = new FormControl('', [Validators.required]);
      control.markAsTouched();
      component.control = control;

      fixture.detectChanges();
      expect(component.errorMessage).toBe('Campo obrigatório');
    });
  });

  describe('#Estados do FormControl', () => {
    let control: FormControl;

    beforeEach(() => {
      control = new FormControl('', [Validators.required]);
      spyOn(CustomValidatorService, 'getValidatorErrorMessage').and.returnValue(
        'Erro de teste'
      );
    });

    it('deve considerar control.touched = true', () => {
      control.markAsTouched();
      component.control = control;

      expect(component.errorMessage).toBe('Erro de teste');
    });

    it('deve considerar control.enabled = true', () => {
      control.markAsTouched();
      control.enable();
      component.control = control;

      expect(component.errorMessage).toBe('Erro de teste');
    });

    it('deve verificar todas as condições em conjunto', () => {
      control.markAsTouched();
      control.enable();
      component.control = control;

      expect(component.errorMessage).toBe('Erro de teste');

      control.markAsUntouched();
      expect(component.errorMessage).toBe('');

      control.markAsTouched();
      control.disable();
      expect(component.errorMessage).toBe('');
    });
  });
});
