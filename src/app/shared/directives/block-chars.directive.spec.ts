import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { BlockCharsDirective } from './block-chars.directive';

@Component({
  template: `
    <input
      type="text"
      [formControl]="testControl"
      [appBlockChars]="blockedChars"
    />
  `,
  standalone: false,
})
class TestHostComponent {
  blockedChars: string[] = ['a', 'b', 'c'];
  testControl = new FormControl('');
}

describe('#BlockCharsDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: DebugElement;
  let directiveInstance: BlockCharsDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockCharsDirective, TestHostComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.directive(BlockCharsDirective));
    directiveInstance = inputEl.injector.get(BlockCharsDirective);
    fixture.detectChanges();
  });

  it('deve criar a diretiva', () => {
    expect(directiveInstance).toBeTruthy();
  });

  it('deve ter a propriedade de caracteres bloqueados', () => {
    expect(directiveInstance.blocked).toEqual(['a', 'b', 'c']);
  });

  describe('#prevenção de evento keydown', () => {
    it('deve prevenir keydown para caracteres bloqueados', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      const preventSpy = spyOn(event, 'preventDefault');

      directiveInstance.onKeyDown(event);

      expect(preventSpy).toHaveBeenCalled();
    });

    it('não deve prevenir keydown para caracteres permitidos', () => {
      const event = new KeyboardEvent('keydown', { key: 'd' });
      const preventSpy = spyOn(event, 'preventDefault');

      directiveInstance.onKeyDown(event);

      expect(preventSpy).not.toHaveBeenCalled();
    });

    it('deve prevenir múltiplos caracteres bloqueados', () => {
      const blockedKeys = ['a', 'b', 'c'];

      blockedKeys.forEach((key) => {
        const event = new KeyboardEvent('keydown', { key });
        const preventSpy = spyOn(event, 'preventDefault');

        directiveInstance.onKeyDown(event);

        expect(preventSpy).toHaveBeenCalled();
      });
    });

    it('deve permitir teclas especiais como Backspace, Delete, teclas de seta', () => {
      const allowedKeys = [
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'Tab',
        'Enter',
      ];

      allowedKeys.forEach((key) => {
        const event = new KeyboardEvent('keydown', { key });
        const preventSpy = spyOn(event, 'preventDefault');

        directiveInstance.onKeyDown(event);

        expect(preventSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('#sanitização de input', () => {
    it('deve sanitizar o valor do input no evento input', () => {
      const mockInput = {
        value: 'teste abc com 123',
      } as HTMLInputElement;

      const inputEvent = {
        target: mockInput,
      } as any;

      const controlSpy = spyOn(component.testControl, 'setValue');

      directiveInstance.onKeyUp(inputEvent);

      expect(mockInput.value).toBe('teste  om 123');
      expect(controlSpy).toHaveBeenCalledWith('teste  om 123');
    });

    it('deve lidar com valor vazio no input', () => {
      const mockInput = {
        value: '',
      } as HTMLInputElement;

      const inputEvent = {
        target: mockInput,
      } as any;

      expect(() => {
        directiveInstance.onKeyUp(inputEvent);
      }).not.toThrow();

      expect(mockInput.value).toBe('');
    });

    it('deve lidar com input com apenas caracteres bloqueados', () => {
      const mockInput = {
        value: 'abc',
      } as HTMLInputElement;

      const inputEvent = {
        target: mockInput,
      } as any;

      const controlSpy = spyOn(component.testControl, 'setValue');

      directiveInstance.onKeyUp(inputEvent);

      expect(mockInput.value).toBe('');
      expect(controlSpy).toHaveBeenCalledWith('');
    });

    it('deve lidar com input sem caracteres bloqueados', () => {
      const mockInput = {
        value: 'teste 123 xyz',
      } as HTMLInputElement;

      const inputEvent = {
        target: mockInput,
      } as any;

      directiveInstance.onKeyUp(inputEvent);

      expect(mockInput.value).toBe('teste 123 xyz');
    });

    it('deve lidar com caracteres bloqueados consecutivos', () => {
      const mockInput = {
        value: 'tesaaabbbcccte',
      } as HTMLInputElement;

      const inputEvent = {
        target: mockInput,
      } as any;

      const controlSpy = spyOn(component.testControl, 'setValue');

      directiveInstance.onKeyUp(inputEvent);

      expect(mockInput.value).toBe('teste');
      expect(controlSpy).toHaveBeenCalledWith('teste');
    });
  });

  describe('#casos de borda', () => {
    it('deve lidar com target nulo no evento input', () => {
      const inputEvent = {
        target: null,
      } as any;

      expect(() => {
        directiveInstance.onKeyUp(inputEvent);
      }).not.toThrow();
    });

    it('deve lidar com target indefinido no evento input', () => {
      const inputEvent = {
        target: undefined,
      } as any;

      expect(() => {
        directiveInstance.onKeyUp(inputEvent);
      }).not.toThrow();
    });

    it('deve atualizar os caracteres bloqueados dinamicamente', () => {
      component.blockedChars = ['x', 'y', 'z'];
      fixture.detectChanges();

      expect(directiveInstance.blocked).toEqual(['x', 'y', 'z']);

      const event = new KeyboardEvent('keydown', { key: 'x' });
      const preventSpy = spyOn(event, 'preventDefault');

      directiveInstance.onKeyDown(event);

      expect(preventSpy).toHaveBeenCalled();
    });

    it('deve lidar com array vazio de caracteres bloqueados', () => {
      component.blockedChars = [];
      fixture.detectChanges();

      expect(directiveInstance.blocked).toEqual([]);

      const event = new KeyboardEvent('keydown', { key: 'a' });
      const preventSpy = spyOn(event, 'preventDefault');

      directiveInstance.onKeyDown(event);

      expect(preventSpy).not.toHaveBeenCalled();
    });

    it('deve lidar com bloqueio case-sensitive', () => {
      component.blockedChars = ['A', 'B', 'C'];
      fixture.detectChanges();

      const upperEvent = new KeyboardEvent('keydown', { key: 'A' });
      const upperPreventSpy = spyOn(upperEvent, 'preventDefault');
      directiveInstance.onKeyDown(upperEvent);
      expect(upperPreventSpy).toHaveBeenCalled();

      const lowerEvent = new KeyboardEvent('keydown', { key: 'a' });
      const lowerPreventSpy = spyOn(lowerEvent, 'preventDefault');
      directiveInstance.onKeyDown(lowerEvent);
      expect(lowerPreventSpy).not.toHaveBeenCalled();
    });

    it('deve bloquear caracteres especiais', () => {
      component.blockedChars = ['*', '&', ';', '!', '?'];
      fixture.detectChanges();

      const specialChars = ['*', '&', ';', '!', '?'];

      specialChars.forEach((char) => {
        const event = new KeyboardEvent('keydown', { key: char });
        const preventSpy = spyOn(event, 'preventDefault');

        directiveInstance.onKeyDown(event);

        expect(preventSpy).toHaveBeenCalled();
      });
    });

    it('deve sanitizar input com caracteres especiais', () => {
      component.blockedChars = ['*', '&', ';', '!', '?'];
      fixture.detectChanges();

      const mockInput = {
        value: 'user*name&email;domain!com?',
      } as HTMLInputElement;

      const inputEvent = {
        target: mockInput,
      } as any;

      const controlSpy = spyOn(component.testControl, 'setValue');

      directiveInstance.onKeyUp(inputEvent);

      expect(mockInput.value).toBe('usernameemaildomaincom');
      expect(controlSpy).toHaveBeenCalledWith('usernameemaildomaincom');
    });
  });
});
