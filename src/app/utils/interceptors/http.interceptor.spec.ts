import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpInterceptor } from './http.interceptor';

describe('HttpInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpInterceptor,
          multi: true,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
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
});
