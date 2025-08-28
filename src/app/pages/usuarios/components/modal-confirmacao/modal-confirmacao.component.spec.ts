import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { delay, of, throwError } from 'rxjs';
import { mockUsuarios } from '../../../../utils/__mocks/usuariosMock';
import { UsuariosService } from '../../../../utils/services/usuarios.service';
import { ModalConfirmacaoComponent } from './modal-confirmacao.component';

describe('#ModalConfirmacaoComponent', () => {
  let component: ModalConfirmacaoComponent;
  let fixture: ComponentFixture<ModalConfirmacaoComponent>;
  let usuariosServiceSpy: jasmine.SpyObj<UsuariosService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ModalConfirmacaoComponent>>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockDialogData = {
    id: 1,
    user: mockUsuarios[0],
  };

  beforeEach(async () => {
    const usuariosServiceSpyObj = jasmine.createSpyObj('UsuariosService', [
      'deleteUser',
    ]);
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);
    const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ModalConfirmacaoComponent],
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: UsuariosService, useValue: usuariosServiceSpyObj },
        { provide: MatDialogRef, useValue: dialogRefSpyObj },
        { provide: MatSnackBar, useValue: snackBarSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalConfirmacaoComponent);
    component = fixture.componentInstance;

    usuariosServiceSpy = TestBed.inject(
      UsuariosService
    ) as jasmine.SpyObj<UsuariosService>;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<ModalConfirmacaoComponent>
    >;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture.detectChanges();
  });

  describe('#Criação do Componente', () => {
    it('deve criar o componente', () => {
      expect(component).toBeTruthy();
    });

    it('deve inicializar com loading false', () => {
      expect(component.loading).toBeFalse();
    });
  });

  describe('#Getters de Propriedades', () => {
    it('deve retornar o nome do usuário quando user estiver disponível', () => {
      expect(component.name).toBe('Jack Mota');
    });

    it('deve retornar o email do usuário quando user estiver disponível', () => {
      expect(component.email).toBe('jack@email.com');
    });

    it('deve retornar "Error" quando user for nulo', async () => {
      TestBed.resetTestingModule();

      const usuariosServiceSpyObj = jasmine.createSpyObj('UsuariosService', [
        'deleteUser',
      ]);
      const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);
      const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

      await TestBed.configureTestingModule({
        declarations: [ModalConfirmacaoComponent],
        imports: [
          MatDialogModule,
          MatSnackBarModule,
          MatButtonModule,
          MatProgressSpinnerModule,
          MatCardModule,
          MatIconModule,
          NoopAnimationsModule,
        ],
        providers: [
          { provide: UsuariosService, useValue: usuariosServiceSpyObj },
          { provide: MatDialogRef, useValue: dialogRefSpyObj },
          { provide: MatSnackBar, useValue: snackBarSpyObj },
          { provide: MAT_DIALOG_DATA, useValue: { id: null, user: null } },
        ],
      }).compileComponents();

      const newFixture = TestBed.createComponent(ModalConfirmacaoComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      expect(newComponent.name).toBe('Error');
      expect(newComponent.email).toBe('Error');
    });

    describe('#Método confirmar()', () => {
      it('deve deletar usuário com sucesso', () => {
        usuariosServiceSpy.deleteUser.and.returnValue(of(undefined));

        component.confirmar();

        expect(usuariosServiceSpy.deleteUser).toHaveBeenCalledWith(1);
        expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
        expect(snackBarSpy.open).toHaveBeenCalledWith(
          'Usuário deletado com sucesso!',
          'Fechar',
          {
            duration: 3000,
            verticalPosition: 'top',
          }
        );
        expect(component.loading).toBeFalse();
      });

      it('deve tratar erro ao deletar usuário', () => {
        const errorMessage = 'Erro de rede';
        usuariosServiceSpy.deleteUser.and.returnValue(
          throwError(() => errorMessage)
        );

        component.confirmar();

        expect(usuariosServiceSpy.deleteUser).toHaveBeenCalledWith(1);
        expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
        expect(snackBarSpy.open).toHaveBeenCalledWith(
          `Erro ao deletar usuário, ${errorMessage}`,
          'Fechar',
          {
            duration: 3000,
            verticalPosition: 'top',
          }
        );
        expect(component.loading).toBeFalse();
      });

      it('deve definir loading como false quando a operação for concluída', () => {
        usuariosServiceSpy.deleteUser.and.returnValue(of(undefined));

        component.confirmar();

        expect(component.loading).toBeFalse();
      });

      it('deve controlar o estado loading durante a operação', fakeAsync(() => {
        usuariosServiceSpy.deleteUser.and.returnValue(
          of(undefined).pipe(delay(100))
        );
        expect(component.loading).toBeFalse();
        component.confirmar();
        expect(component.loading).toBeTrue();
        tick(100);
        expect(component.loading).toBeFalse();
      }));
    });

    describe('#Método cancelar()', () => {
      it('deve fechar o modal com valor true', () => {
        component.cancelar();

        expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
      });
    });

    describe('#Integração de Dependências', () => {
      it('deve injetar corretamente todas as dependências', () => {
        expect(component['_ref']).toBeTruthy();
        expect(component['_data']).toBeTruthy();
        expect(component['_snackService']).toBeTruthy();
        expect(component['_usuariosService']).toBeTruthy();
      });

      it('deve ter acesso aos dados do modal', () => {
        expect(component['_data'].id).toBe(1);
        expect(component['_data'].user).toEqual(mockUsuarios[0]);
      });
    });
  });
});
