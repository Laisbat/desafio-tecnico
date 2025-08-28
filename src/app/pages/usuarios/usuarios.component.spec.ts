import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { mockUsuarios } from '../../utils/__mocks/usuariosMock';
import { UsuariosService } from '../../utils/services/usuarios.service';
import { ModalConfirmacaoComponent } from './components/modal-confirmacao/modal-confirmacao.component';
import { UsuariosComponent } from './usuarios.component';

describe('#UsuariosComponent', () => {
  let component: UsuariosComponent;
  let fixture: ComponentFixture<UsuariosComponent>;
  let usuariosService: jasmine.SpyObj<UsuariosService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const usuariosServiceSpy = jasmine.createSpyObj('UsuariosService', [
      'getUsuarios',
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [UsuariosComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: UsuariosService, useValue: usuariosServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosComponent);
    component = fixture.componentInstance;
    usuariosService = TestBed.inject(
      UsuariosService
    ) as jasmine.SpyObj<UsuariosService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    usuariosService.getUsuarios.and.returnValue(of(mockUsuarios));
  });

  it('deve criar componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve inicializar com displayedColumns corretos', () => {
    expect(component.displayedColumns).toEqual([
      'id',
      'name',
      'email',
      'username',
      'actions',
    ]);
  });

  it('deve inicializar dataSource como vazio', () => {
    expect(component.dataSource.data).toEqual([]);
  });

  it('deve inicializar isLoading como falso', () => {
    expect(component.isLoading).toBeFalse();
  });

  it('deve chamar loadUsers no ngOnInit', () => {
    component.ngOnInit();
    expect(usuariosService.getUsuarios).toHaveBeenCalled();
  });

  it('deve definir paginator e sort no ngAfterViewInit', () => {
    component.ngAfterViewInit();

    expect(component.dataSource.paginator).toBe(component.paginator);
    expect(component.dataSource.sort).toBe(component.sort);
  });

  it('deve carregar usuários com sucesso', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(usuariosService.getUsuarios).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockUsuarios);
    expect(component.isLoading).toBeFalse();
  });

  it('deve tratar erro ao carregar usuários', () => {
    spyOn(console, 'error');
    usuariosService.getUsuarios.and.returnValue(
      throwError(() => new Error('Erro de rede'))
    );

    component.ngOnInit();
    fixture.detectChanges();

    expect(usuariosService.getUsuarios).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Erro ao listar usuários:',
      jasmine.any(Error)
    );
    expect(component.isLoading).toBeFalse();
  });

  it('deve chamar getUsuarios do serviço ao carregar usuários', () => {
    component.ngOnInit();
    expect(usuariosService.getUsuarios).toHaveBeenCalled();
  });

  it('deve aplicar filtro corretamente', () => {
    component.dataSource.data = mockUsuarios;
    const event = { target: { value: 'Jack' } } as unknown as Event;

    component.applyFilter(event);

    expect(component.dataSource.filter).toBe('jack');
  });

  it('deve recarregar usuários quando reloadUsers é chamado', () => {
    usuariosService.getUsuarios.calls.reset();

    component.reloadUsers();

    expect(usuariosService.getUsuarios).toHaveBeenCalledTimes(1);
  });

  it('deve abrir modal quando deleteUser é chamado', () => {
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of(false));
    dialog.open.and.returnValue(mockDialogRef);

    component.deleteUser(mockUsuarios[0]);

    expect(dialog.open).toHaveBeenCalledWith(ModalConfirmacaoComponent, {
      data: { user: mockUsuarios[0] },
    });
  });
});
