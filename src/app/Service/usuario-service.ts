import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Result } from '../Interface/Result';
import { Usuario } from '../Interface/Usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  apiUrl = 'http://localhost:8080/usuario';

  constructor(private http: HttpClient) {}
  getPokemonFavorite(): Observable<Result<Usuario[]>> {
    return this.http.get<Result<Usuario[]>>(this.apiUrl);
  }
}
