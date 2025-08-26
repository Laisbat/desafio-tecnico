import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../shared/interfaces/usuarios.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly _URL: string = 'https://jsonplaceholder.typicode.com';

  constructor(private readonly _http: HttpClient) {}

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
