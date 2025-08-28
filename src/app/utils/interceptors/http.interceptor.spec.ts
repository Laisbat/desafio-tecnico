import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpInterceptor } from './http.interceptor';

describe('#HttpInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let interceptor: HttpInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpInterceptor,
          multi: true,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    interceptor = TestBed.inject(HttpInterceptor);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(interceptor).toBeTruthy();
  });

  it('deve adicionar os headers Content-Type e Accept em todas as requisições', () => {
    http.get('/api/teste').subscribe();

    const req = httpMock.expectOne('/api/teste');

    expect(req.request.headers.has('Content-Type')).toBeTrue();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    expect(req.request.headers.has('Accept')).toBeTrue();
    expect(req.request.headers.get('Accept')).toBe('application/json');

    req.flush({});
  });

  it('não deve remover outros headers já existentes', () => {
    http
      .get('/api/teste', {
        headers: { Authorization: 'Bearer token123' },
      })
      .subscribe();

    const req = httpMock.expectOne('/api/teste');

    expect(req.request.headers.get('Authorization')).toBe('Bearer token123');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accept')).toBe('application/json');

    req.flush({});
  });

  it('deve funcionar com requisições POST', () => {
    const testData = { name: 'João', email: 'joao@teste.com' };

    http.post('/api/usuarios', testData).subscribe();

    const req = httpMock.expectOne('/api/usuarios');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(testData);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accept')).toBe('application/json');

    req.flush({ id: 1, ...testData });
  });

  it('deve funcionar com requisições PUT', () => {
    const testData = { id: 1, name: 'Maria', email: 'maria@teste.com' };

    http.put('/api/usuarios/1', testData).subscribe();

    const req = httpMock.expectOne('/api/usuarios/1');

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(testData);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accept')).toBe('application/json');

    req.flush(testData);
  });

  it('deve funcionar com requisições DELETE', () => {
    http.delete('/api/usuarios/1').subscribe();

    const req = httpMock.expectOne('/api/usuarios/1');

    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accept')).toBe('application/json');

    req.flush({});
  });

  it('deve sobrescrever Content-Type se já existir', () => {
    http
      .post(
        '/api/teste',
        {},
        {
          headers: { 'Content-Type': 'text/plain' },
        }
      )
      .subscribe();

    const req = httpMock.expectOne('/api/teste');

    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush({});
  });

  it('deve lidar com múltiplas requisições simultâneas', () => {
    const urls = ['/api/usuarios', '/api/posts', '/api/comentarios'];

    urls.forEach((url) => {
      http.get(url).subscribe();
    });

    urls.forEach((url) => {
      const req = httpMock.expectOne(url);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Accept')).toBe('application/json');
      req.flush({});
    });
  });

  it('deve preservar headers customizados junto com os padrão', () => {
    const customHeaders = {
      Authorization: 'Bearer token123',
      'X-Custom-Header': 'valor-customizado',
      'X-Request-ID': 'req-123',
    };

    http.get('/api/teste', { headers: customHeaders }).subscribe();

    const req = httpMock.expectOne('/api/teste');

    expect(req.request.headers.get('Authorization')).toBe('Bearer token123');
    expect(req.request.headers.get('X-Custom-Header')).toBe(
      'valor-customizado'
    );
    expect(req.request.headers.get('X-Request-ID')).toBe('req-123');

    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accept')).toBe('application/json');

    req.flush({});
  });

  it('deve lidar com erros de requisição mantendo os headers', () => {
    http.get('/api/erro').subscribe({
      next: () => fail('Deveria ter falhado'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne('/api/erro');

    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accept')).toBe('application/json');

    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });

  it('deve passar a requisição adiante corretamente', () => {
    const expectedResponse = { message: 'sucesso', data: [] };

    http.get('/api/sucesso').subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne('/api/sucesso');
    req.flush(expectedResponse);
  });
});
