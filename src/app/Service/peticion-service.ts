import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../Interface/Result';
import { Peticion } from '../Interface/peticion';

@Injectable({
  providedIn: 'root',
})
export class PeticionService {
  private url = 'http://localhost:8080/peticion';
  constructor(private http: HttpClient) {}

  addPeticion(peticion: Peticion): Observable<Result<Peticion>> {
    return this.http.post<Result<Peticion>>(this.url, peticion);
  }
  getById(idUsuario: Number) {
    return this.http.get<Result<Peticion>>(this.url + '/' + idUsuario);
  }
  getAll() {
    return this.http.get<Result<Peticion>>(this.url);
  }
  accept(peticion: Peticion) {
    return this.http.put<Result<Peticion>>(this.url + '/accept', peticion);
  }
  decline(peticion: Peticion) {
    return this.http.put<Result<Peticion>>(this.url + '/decline', peticion);
  }
}
