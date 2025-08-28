import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Usuario } from '../../shared/interfaces/usuarios.interface';
import { mockUsuarios } from '../__mocks/usuariosMock';
import { UsuariosService } from './usuarios.service';

describe('#UsuariosService', () => {
  let service: UsuariosService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const baseUrl = 'https://jsonplaceholder.typicode.com/users';

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', [
      'get',
      'post',
      'put',
      'delete',
    ]);

    TestBed.configureTestingModule({
      providers: [UsuariosService, { provide: HttpClient, useValue: spy }],
    });

    service = TestBed.inject(UsuariosService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('deve criar o serviço', () => {
    expect(service).toBeTruthy();
  });

  describe('#getUsuarios', () => {
    it('deve recuperar todos os usuários da API', () => {
      httpClientSpy.get.and.returnValue(of(mockUsuarios));

      service.getUsuarios().subscribe((usuarios) => {
        expect(usuarios).toEqual(mockUsuarios);
        expect(usuarios.length).toBe(3);
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(baseUrl);
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });

    it('deve lidar com array vazio de usuários', () => {
      const emptyUsers: Usuario[] = [];
      httpClientSpy.get.and.returnValue(of(emptyUsers));

      service.getUsuarios().subscribe((usuarios) => {
        expect(usuarios).toEqual(emptyUsers);
        expect(usuarios.length).toBe(0);
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(baseUrl);
    });

    it('deve lidar com erros HTTP', () => {
      const errorResponse = {
        status: 500,
        statusText: 'Server Error',
      };
      httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

      service.getUsuarios().subscribe({
        next: () => fail('deve falhar com o erro 500'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Server Error');
        },
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(baseUrl);
    });
  });

  describe('#getUsuario', () => {
    it('deve recuperar um único usuário por id', () => {
      const userId = 1;
      httpClientSpy.get.and.returnValue(of(mockUsuarios[0]));

      service.getUsuario(userId).subscribe((usuario) => {
        expect(usuario).toEqual(mockUsuarios[0]);
        expect(usuario.id).toBe(userId);
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${baseUrl}/${userId}`);
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });

    it('deve lidar com diferentes ids de usuário', () => {
      const userId = 5;
      const expectedUser = { ...mockUsuarios[0], id: userId };
      httpClientSpy.get.and.returnValue(of(expectedUser));

      service.getUsuario(userId).subscribe((usuario) => {
        expect(usuario.id).toBe(userId);
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${baseUrl}/${userId}`);
    });

    it('deve lidar com usuário não encontrado (404)', () => {
      const userId = 999;
      const errorResponse = {
        status: 404,
        statusText: 'Not Found',
      };
      httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

      service.getUsuario(userId).subscribe({
        next: () => fail('deve falhar com o erro 404'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        },
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${baseUrl}/${userId}`);
    });

    it('deve lidar com ids zero e negativos', () => {
      const userId = 0;
      httpClientSpy.get.and.returnValue(of(null));

      service.getUsuario(userId).subscribe();

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${baseUrl}/${userId}`);
    });
  });

  describe('#addUsuario', () => {
    it('deve criar um novo usuário', () => {
      const newUser: Usuario = { ...mockUsuarios[0], id: 0 };
      const createdUser: Usuario = { ...newUser, id: 11 };
      httpClientSpy.post.and.returnValue(of(createdUser));

      service.addUsuario(newUser).subscribe((usuario) => {
        expect(usuario).toEqual(createdUser);
        expect(usuario.id).toBe(11);
      });

      expect(httpClientSpy.post).toHaveBeenCalledWith(baseUrl, newUser);
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    });

    it('deve enviar corpo de requisição correto', () => {
      const createdUser = { ...mockUsuarios[0], id: 12 };
      httpClientSpy.post.and.returnValue(of(createdUser));

      service.addUsuario(mockUsuarios[0]).subscribe();

      expect(httpClientSpy.post).toHaveBeenCalledWith(baseUrl, mockUsuarios[0]);
    });

    it('deve lidar com erros de validação', () => {
      const invalidUser: Usuario = {
        ...mockUsuarios[0],
        email: 'invalid-email',
      };
      const errorResponse = {
        status: 400,
        statusText: 'Bad Request',
      };
      httpClientSpy.post.and.returnValue(throwError(() => errorResponse));

      service.addUsuario(invalidUser).subscribe({
        next: () => fail('deve falhar com erro de validação'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
        },
      });

      expect(httpClientSpy.post).toHaveBeenCalledWith(baseUrl, invalidUser);
    });
  });

  describe('#updateUser', () => {
    it('deve atualizar um usuário existente', () => {
      const userId = 1;
      const updateData: Partial<Usuario> = {
        name: 'Roberto Cardoso',
        email: 'roberto.cardoso@test.com',
      };
      const updatedUser: Usuario = { ...mockUsuarios[0], ...updateData };
      httpClientSpy.put.and.returnValue(of(updatedUser));

      service.updateUser(userId, updateData).subscribe((usuario) => {
        expect(usuario).toEqual(updatedUser);
        expect(usuario.name).toBe('Roberto Cardoso');
        expect(usuario.email).toBe('roberto.cardoso@test.com');
      });

      expect(httpClientSpy.put).toHaveBeenCalledWith(
        `${baseUrl}/${userId}`,
        updateData
      );
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
    });

    it('deve lidar com atualizações parciais', () => {
      const userId = 1;
      const partialUpdate: Partial<Usuario> = { name: 'Novo nome' };
      httpClientSpy.put.and.returnValue(
        of({ ...mockUsuarios[0], ...partialUpdate })
      );

      service.updateUser(userId, partialUpdate).subscribe();

      expect(httpClientSpy.put).toHaveBeenCalledWith(
        `${baseUrl}/${userId}`,
        partialUpdate
      );
    });

    it('deve lidar com usuário não encontrado para atualização', () => {
      const userId = 999;
      const updateData: Partial<Usuario> = { name: 'Updated Name' };
      const errorResponse = {
        status: 404,
        statusText: 'Not Found',
      };
      httpClientSpy.put.and.returnValue(throwError(() => errorResponse));

      service.updateUser(userId, updateData).subscribe({
        next: () => fail('deve falhar com erro 404'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      expect(httpClientSpy.put).toHaveBeenCalledWith(
        `${baseUrl}/${userId}`,
        updateData
      );
    });

    it('deve lidar com dados vazios para atualização', () => {
      const userId = 1;
      const emptyUpdate: Partial<Usuario> = {};
      httpClientSpy.put.and.returnValue(of(mockUsuarios[1]));

      service.updateUser(userId, emptyUpdate).subscribe();

      expect(httpClientSpy.put).toHaveBeenCalledWith(
        `${baseUrl}/${userId}`,
        emptyUpdate
      );
    });
  });

  describe('#deleteUser', () => {
    it('deve deletar um usuário por id', () => {
      const userId = 1;
      httpClientSpy.delete.and.returnValue(of(null));

      service.deleteUser(userId).subscribe((result) => {
        expect(result).toBeNull();
      });

      expect(httpClientSpy.delete).toHaveBeenCalledWith(`${baseUrl}/${userId}`);
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1);
    });

    it('deve lidar com exclusão bem-sucedida com diferentes IDs de usuário', () => {
      const userId = 5;
      httpClientSpy.delete.and.returnValue(of(null));

      service.deleteUser(userId).subscribe();

      expect(httpClientSpy.delete).toHaveBeenCalledWith(`${baseUrl}/${userId}`);
    });

    it('deve lidar com exclusão de usuário não encontrado', () => {
      const userId = 999;
      const errorResponse = {
        status: 404,
        statusText: 'Not Found',
      };
      httpClientSpy.delete.and.returnValue(throwError(() => errorResponse));

      service.deleteUser(userId).subscribe({
        next: () => fail('deve falhar com erro 404'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      expect(httpClientSpy.delete).toHaveBeenCalledWith(`${baseUrl}/${userId}`);
    });

    it('deve lidar com erros do servidor durante a exclusão', () => {
      const userId = 1;
      const errorResponse = {
        status: 500,
        statusText: 'Internal Server Error',
      };
      httpClientSpy.delete.and.returnValue(throwError(() => errorResponse));

      service.deleteUser(userId).subscribe({
        next: () => fail('deve falhar com erro do servidor'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      expect(httpClientSpy.delete).toHaveBeenCalledWith(`${baseUrl}/${userId}`);
    });
  });

  describe('#configuração do serviço', () => {
    it('deve usar a URL base correta', () => {
      httpClientSpy.get.and.returnValue(of([]));

      service.getUsuarios().subscribe();

      expect(httpClientSpy.get).toHaveBeenCalledWith(baseUrl);
    });

    it('deve lidar com requisições concorrentes', () => {
      httpClientSpy.get.and.returnValue(of(mockUsuarios));

      service.getUsuarios().subscribe();
      service.getUsuario(1).subscribe();
      service.getUsuario(2).subscribe();

      expect(httpClientSpy.get).toHaveBeenCalledTimes(3);
      expect(httpClientSpy.get).toHaveBeenCalledWith(baseUrl);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${baseUrl}/1`);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${baseUrl}/2`);
    });

    it('deve ser injetável', () => {
      expect(service).toBeDefined();
      expect(service instanceof UsuariosService).toBeTruthy();
    });
  });

  describe('#tratamento de erros', () => {
    it('deve lidar com erros de rede', () => {
      const errorResponse = {
        error: new ErrorEvent('Network error'),
        status: 0,
        statusText: 'Unknown Error',
      };
      httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

      service.getUsuarios().subscribe({
        next: () => fail('deve falhar com erro de rede'),
        error: (error) => {
          expect(error.error).toBeDefined();
        },
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(baseUrl);
    });

    it('deve lidar com erros de timeout', () => {
      const errorResponse = {
        error: new ErrorEvent('Timeout'),
        status: 0,
        statusText: 'Timeout',
      };
      httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

      service.getUsuarios().subscribe({
        next: () => fail('deve falhar com erro de timeout'),
        error: (error) => {
          expect(error.status).toBe(0);
        },
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(baseUrl);
    });
  });
});
