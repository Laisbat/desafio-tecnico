import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthSuccessResponse } from '../../shared/interfaces/auth-success-response';
import { ILoginSuccessResponse } from '../../shared/interfaces/login-success-response';
import { Usuario } from '../../shared/interfaces/usuarios';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly _URL: string = 'https://jsonplaceholder.typicode.com';

  private readonly _http = inject(HttpClient);

  validateUser(): Observable<IAuthSuccessResponse> {
    return this._http.get<IAuthSuccessResponse>(
      'http://localhost:3000/api/protected'
    );
  }

  login(email: string, password: string): Observable<ILoginSuccessResponse> {
    const body = { email, password };

    return this._http.post<ILoginSuccessResponse>(
      'http://localhost:3000/api/users/login',
      body
    );
  }

  getUsuarios(): Observable<Usuario[]> {
    return this._http.get<Usuario[]>(`${this._URL}/users`);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this._http.get<Usuario>(`${this._URL}/users/${id}`);
  }

  addUsuario(userData: Usuario): Observable<Usuario> {
    return this._http.post<Usuario>(`${this._URL}/users`, userData);
  }

  updateUser(id: number, userData: Partial<Usuario>): Observable<Usuario> {
    return this._http.put<Usuario>(`${this._URL}/users/${id}`, userData);
  }

  deleteUser(id: number): Observable<void> {
    return this._http.delete<void>(`${this._URL}/users/${id}`);
  }
}
