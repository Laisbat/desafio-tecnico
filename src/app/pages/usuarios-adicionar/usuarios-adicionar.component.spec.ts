import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { FormValidationErrorsComponent } from '../../shared/components/form-validation-errors/form-validation-errors.component';
import { BlockCharsDirective } from '../../shared/directives/block-chars.directive';
import { mockUsuarios } from '../../utils/__mocks/usuariosMock';
import { UsuariosService } from '../../utils/services/usuarios.service';
import { UsuariosAdicionarComponent } from './usuarios-adicionar.component';

describe('#UsuariosAdicionarComponent', () => {
  let component: UsuariosAdicionarComponent;
  let fixture: ComponentFixture<UsuariosAdicionarComponent>;
  let usuariosService: jasmine.SpyObj<UsuariosService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

  const mockUser = mockUsuarios[2];

  beforeEach(async () => {
    const usuariosServiceSpy = jasmine.createSpyObj('UsuariosService', [
      'getUsuario',
      'addUsuario',
      'updateUser',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({}),
    });

    await TestBed.configureTestingModule({
      declarations: [
        UsuariosAdicionarComponent,
        FormValidationErrorsComponent,
        BlockCharsDirective,
      ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatIconModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: UsuariosService, useValue: usuariosServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosAdicionarComponent);
    component = fixture.componentInstance;
    usuariosService = TestBed.inject(
      UsuariosService
    ) as jasmine.SpyObj<UsuariosService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    activatedRoute = TestBed.inject(
      ActivatedRoute
    ) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('deve renderizar o componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com a estrutura correta', () => {
    fixture.detectChanges();

    expect(component.userForm.get('name')).toBeTruthy();
    expect(component.userForm.get('username')).toBeTruthy();
    expect(component.userForm.get('email')).toBeTruthy();
    expect(component.userForm.get('phone')).toBeTruthy();
    expect(component.userForm.get('website')).toBeTruthy();
    expect(component.userForm.get('address')).toBeTruthy();
    expect(component.userForm.get('company')).toBeTruthy();
  });

  it('deve inicializar com isLoading como falso', () => {
    expect(component.isLoading).toBeFalse();
  });

  it('deve inicializar com id como nulo', () => {
    expect(component.id).toBeNull();
  });

  it('deve ter o array de caracteres bloqueados correto', () => {
    const expectedChars = [
      '*',
      '&',
      ';',
      ',',
      'ˆ',
      '!',
      '?',
      '{',
      '}',
      ']',
      '[',
      '(',
      ')',
      '+',
      '=',
      '/',
      '%',
      '$',
      '#',
      '@',
      '<',
      '>',
    ];
    expect(component.blockedCharacterName).toEqual(expectedChars);
  });

  it('deve retornar o FormGroup address corretamente', () => {
    const addressGroup = component.address;
    expect(addressGroup).toBeTruthy();
    expect(addressGroup.get('street')).toBeTruthy();
    expect(addressGroup.get('suite')).toBeTruthy();
    expect(addressGroup.get('city')).toBeTruthy();
    expect(addressGroup.get('zipcode')).toBeTruthy();
  });

  it('deve retornar o FormGroup geo corretamente', () => {
    const geoGroup = component.geo;
    expect(geoGroup).toBeTruthy();
    expect(geoGroup.get('lat')).toBeTruthy();
    expect(geoGroup.get('lng')).toBeTruthy();
  });

  it('deve retornar o FormGroup company corretamente', () => {
    const companyGroup = component.company;
    expect(companyGroup).toBeTruthy();
    expect(companyGroup.get('name')).toBeTruthy();
    expect(companyGroup.get('catchPhrase')).toBeTruthy();
    expect(companyGroup.get('bs')).toBeTruthy();
  });

  it('deve retornar falso para isEdit quando id for nulo', () => {
    component.id = null;
    expect(component.isEdit).toBeFalse();
  });

  it('deve retornar verdadeiro para isEdit quando id não for nulo', () => {
    component.id = 1;
    expect(component.isEdit).toBeTrue();
  });

  it('deve retornar falso para isEdit quando id for nulo', () => {
    component.id = null;
    expect(component.isEdit).toBeFalse();
  });

  it('deve retornar verdadeiro para isEdit quando id não for nulo', () => {
    component.id = 1;
    expect(component.isEdit).toBeTrue();
  });

  it('deve lidar com parâmetros de rota sem id', () => {
    Object.defineProperty(activatedRoute, 'params', {
      value: of({}),
    });

    component.ngOnInit();

    expect(component.id).toBeNull();
    expect(usuariosService.getUsuario).not.toHaveBeenCalled();
  });

  it('deve lidar com parâmetros de rota com id e carregar usuário', () => {
    Object.defineProperty(activatedRoute, 'params', {
      value: of({ id: '1' }),
    });
    usuariosService.getUsuario.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(component.id).toBe(1);
    expect(usuariosService.getUsuario).toHaveBeenCalledWith(1);
  });

  it('deve carregar dados do usuário e preencher o formulário', () => {
    usuariosService.getUsuario.and.returnValue(of(mockUser));

    component.getUsuarioById(1);

    expect(usuariosService.getUsuario).toHaveBeenCalledWith(1);
    expect(component.userForm.get('name')?.value).toBe(mockUser.name);
    expect(component.userForm.get('email')?.value).toBe(mockUser.email);
  });

  it('deve lidar com erro ao carregar dados do usuário', () => {
    const error = 'Erro de rede';
    usuariosService.getUsuario.and.returnValue(throwError(() => error));

    component.getUsuarioById(1);

    expect(usuariosService.getUsuario).toHaveBeenCalledWith(1);
    expect(snackBar.open).toHaveBeenCalledWith(
      `Erro ao carregar dados do usuário, ${error}`,
      'Fechar',
      {
        duration: 3000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
      }
    );
  });

  it('deve validar campos obrigatórios', () => {
    component.userForm.patchValue({
      name: '',
      username: '',
      email: '',
      phone: '',
    });

    expect(component.userForm.get('name')?.hasError('required')).toBeTrue();
    expect(component.userForm.get('username')?.hasError('required')).toBeTrue();
    expect(component.userForm.get('email')?.hasError('required')).toBeTrue();
    expect(component.userForm.get('phone')?.hasError('required')).toBeTrue();
  });

  it('deve validar formato de email', () => {
    component.userForm.get('email')?.setValue('email-invalido');

    expect(component.userForm.get('email')?.hasError('email')).toBeTrue();
  });

  it('deve validar padrão do telefone', () => {
    component.userForm.get('phone')?.setValue('123456789');

    expect(component.userForm.get('phone')?.hasError('pattern')).toBeTrue();
  });

  it('deve validar padrão do nome de usuário', () => {
    component.userForm.get('username')?.setValue('usuário@123');

    expect(component.userForm.get('username')?.hasError('pattern')).toBeTrue();
  });

  it('deve validar padrão do nome (apenas letras e espaços)', () => {
    component.userForm.get('name')?.setValue('João123');

    expect(component.userForm.get('name')?.hasError('pattern')).toBeTrue();
  });

  it('deve submeter o formulário para criar um novo usuário com sucesso', () => {
    component.id = null;

    const validFormData = {
      name: 'João Silva',
      username: 'joao_silva',
      email: 'joao.silva@email.com',
      phone: '(62) 99999-9999',
      website: 'https://www.joao.silva.dev',
      address: {
        street: 'Rua A, 123',
        suite: 'Apt 101',
        city: 'São Paulo',
        zipcode: '01000-000',
        geo: {
          lat: '-23.5505',
          lng: '-46.6333',
        },
      },
      company: {
        name: 'Tech Corp',
        catchPhrase: 'Innovation first',
        bs: 'technology solutions',
      },
    };

    component.userForm.setValue(validFormData);

    usuariosService.addUsuario.and.returnValue(of(mockUser));

    component.onSubmit();

    expect(component.isLoading).toBeTrue();
    expect(usuariosService.addUsuario).toHaveBeenCalledWith(
      component.userForm.value
    );
    expect(snackBar.open).toHaveBeenCalledWith(
      'Usuário cadastrado com sucesso!',
      'Fechar',
      {
        duration: 3000,
        panelClass: ['success-snackbar'],
        verticalPosition: 'top',
      }
    );
    expect(router.navigate).toHaveBeenCalledWith(['/usuarios']);
  });

  it('deve submeter o formulário para atualizar usuário existente com sucesso', () => {
    component.id = 1;

    const validFormData = {
      name: 'João Silva',
      username: 'joao_silva',
      email: 'joao.silva@email.com',
      phone: '(62) 99999-9999',
      website: 'https://www.joao.silva.dev',
      address: {
        street: 'Rua A, 123',
        suite: 'Apt 101',
        city: 'São Paulo',
        zipcode: '01000-000',
        geo: {
          lat: '-23.5505',
          lng: '-46.6333',
        },
      },
      company: {
        name: 'Tech Corp',
        catchPhrase: 'Innovation first',
        bs: 'technology solutions',
      },
    };

    component.userForm.setValue(validFormData);

    usuariosService.updateUser.and.returnValue(of(mockUser));

    component.onSubmit();

    expect(component.isLoading).toBeTrue();
    expect(usuariosService.updateUser).toHaveBeenCalledWith(
      1,
      component.userForm.value
    );
    expect(snackBar.open).toHaveBeenCalledWith(
      'Usuário atualizado com sucesso!',
      'Fechar',
      {
        duration: 3000,
        panelClass: ['success-snackbar'],
        verticalPosition: 'top',
      }
    );
    expect(router.navigate).toHaveBeenCalledWith(['/usuarios']);
  });

  it('deve lidar com erro ao criar usuário', () => {
    component.id = null;

    const validFormData = {
      name: 'João Silva',
      username: 'joao_silva',
      email: 'joao.silva@email.com',
      phone: '(62) 99999-9999',
      website: 'https://www.joao.silva.dev',
      address: {
        street: 'Rua A, 123',
        suite: 'Apt 101',
        city: 'São Paulo',
        zipcode: '01000-000',
        geo: {
          lat: '-23.5505',
          lng: '-46.6333',
        },
      },
      company: {
        name: 'Tech Corp',
        catchPhrase: 'Innovation first',
        bs: 'technology solutions',
      },
    };

    component.userForm.setValue(validFormData);

    const error = 'Erro de servidor';
    usuariosService.addUsuario.and.returnValue(throwError(() => error));

    component.onSubmit();

    expect(usuariosService.addUsuario).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(
      `Erro ao cadastrar usuário, ${error}`,
      'Fechar',
      {
        duration: 3000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
      }
    );
    expect(component.isLoading).toBeFalse();
  });

  it('deve lidar com erro ao atualizar usuário', () => {
    component.id = 1;

    const validFormData = {
      name: 'João Silva',
      username: 'joao_silva',
      email: 'joao.silva@email.com',
      phone: '(62) 99999-9999',
      website: 'https://www.joao.silva.dev',
      address: {
        street: 'Rua A, 123',
        suite: 'Apt 101',
        city: 'São Paulo',
        zipcode: '01000-000',
        geo: {
          lat: '-23.5505',
          lng: '-46.6333',
        },
      },
      company: {
        name: 'Tech Corp',
        catchPhrase: 'Innovation first',
        bs: 'technology solutions',
      },
    };

    component.userForm.setValue(validFormData);

    const error = 'Erro de servidor';
    usuariosService.updateUser.and.returnValue(throwError(() => error));

    component.onSubmit();

    expect(usuariosService.updateUser).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(
      `Erro ao atualizar usuário, ${error}`,
      'Fechar',
      {
        duration: 3000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
      }
    );
    expect(component.isLoading).toBeFalse();
  });

  it('deve mostrar mensagem de validação quando o formulário for inválido', () => {
    component.userForm.patchValue({
      name: '',
      username: '',
      email: '',
      phone: '',
    });

    component.onSubmit();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Por favor, preencha todos os campos obrigatórios',
      'Fechar',
      {
        duration: 3000,
        panelClass: ['warning-snackbar'],
        verticalPosition: 'top',
      }
    );
    expect(usuariosService.addUsuario).not.toHaveBeenCalled();
    expect(usuariosService.updateUser).not.toHaveBeenCalled();
  });

  it('deve navegar para a página de usuários ao cancelar', () => {
    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/usuarios']);
  });

  it('deve marcar todos os campos como tocados ao enviar', () => {
    spyOn(component.userForm, 'markAllAsTouched');

    component.onSubmit();

    expect(component.userForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('deve validar o padrão do CEP', () => {
    component.userForm.get('address.zipcode')?.setValue('12345678');

    expect(
      component.userForm.get('address.zipcode')?.hasError('pattern')
    ).toBeTrue();

    component.userForm.get('address.zipcode')?.setValue('12345-678');

    expect(
      component.userForm.get('address.zipcode')?.hasError('pattern')
    ).toBeFalse();
  });

  it('deve validar o padrão das coordenadas geográficas', () => {
    component.userForm.get('address.geo.lat')?.setValue('invalid');
    component.userForm.get('address.geo.lng')?.setValue('invalid');

    expect(
      component.userForm.get('address.geo.lat')?.hasError('pattern')
    ).toBeTrue();
    expect(
      component.userForm.get('address.geo.lng')?.hasError('pattern')
    ).toBeTrue();

    component.userForm.get('address.geo.lat')?.setValue('-23.5505');
    component.userForm.get('address.geo.lng')?.setValue('-46.6333');

    expect(
      component.userForm.get('address.geo.lat')?.hasError('pattern')
    ).toBeFalse();
    expect(
      component.userForm.get('address.geo.lng')?.hasError('pattern')
    ).toBeFalse();
  });

  it('deve validar o padrão do website', () => {
    component.userForm.get('website')?.setValue('invalid-url');

    expect(component.userForm.get('website')?.hasError('pattern')).toBeTrue();

    component.userForm.get('website')?.setValue('https://example.com');

    expect(component.userForm.get('website')?.hasError('pattern')).toBeFalse();
  });
});
