import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Result } from '../Interface/Result';
import { Usuario } from '../Interface/Usuario';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getAllUsers(): Observable<Result<Usuario[]>> {
    return this.http.get<Result<Usuario[]>>(`${this.apiUrl}/usuario`);
  }
  getById(idUsuario: Number): Observable<Result<Usuario>> {
    return this.http.get<Result<Usuario>>(this.apiUrl + '/usuario/' + idUsuario);
  }
  addUser(user: Usuario): Observable<Result<Usuario[]>> {
    return this.http.post<Result<Usuario[]>>(this.apiUrl + '/usuario/add', user);
  }
  registerUser(user: Usuario): Observable<Result<Usuario[]>>{
    return this.http.post<Result<Usuario[]>>(this.apiUrl + '/usuario/register', user);
  }
  updateUser(user: Usuario): Observable<Result<Usuario[]>> {
    return this.http.put<Result<Usuario[]>>(this.apiUrl + '/usuario/update', user);
  }
  deleteUser(idUser: Number): Observable<HttpResponse<Result<any>>> {
    return this.http.delete<Result<any>>(this.apiUrl + '/usuario/delete?idUsuario=' + idUser, {
      observe: 'response',
    });
  }
}
