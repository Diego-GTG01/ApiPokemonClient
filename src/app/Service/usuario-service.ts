import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Result } from '../Interface/Result';
import { Usuario } from '../Interface/Usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  apiUrl = 'http://localhost:8080/usuario';

  constructor(private http: HttpClient) {}
  getAllUsers(): Observable<Result<Usuario[]>> {
    return this.http.get<Result<Usuario[]>>(this.apiUrl);
  }
  getById(idUsuario: Number): Observable<Result<Usuario>> {
    return this.http.get<Result<Usuario>>(this.apiUrl + '/' + idUsuario);
  }
  addUser(user: Usuario): Observable<Result<Usuario[]>> {
    return this.http.post<Result<Usuario[]>>(this.apiUrl + '/add', user);
  }
  registerUser(user: Usuario): Observable<Result<Usuario[]>>{
    return this.http.post<Result<Usuario[]>>(this.apiUrl + '/register', user);
  }
  updateUser(user: Usuario): Observable<Result<Usuario[]>> {
    return this.http.put<Result<Usuario[]>>(this.apiUrl + '/update', user);
  }
  deleteUser(idUser: Number): Observable<HttpResponse<Result<any>>> {
    return this.http.delete<Result<any>>(this.apiUrl + '/delete?idUsuario=' + idUser, {
      observe: 'response',
    });
  }
}
