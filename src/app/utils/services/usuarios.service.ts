import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly _URL: string = 'https://jsonplaceholder.typicode.com';

  constructor(private readonly _http: HttpClient) {}

  listarUsuarios(): Observable<any> {
    return this._http.get(`${this._URL}/users`);
  }

  getUsuario(id: number): Observable<any> {
    return this._http.get(`${this._URL}/users/${id}`);
  }
}
