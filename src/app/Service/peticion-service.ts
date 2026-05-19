import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../Interface/Result';
import { Peticion } from '../Interface/peticion';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PeticionService {
  private url = environment.apiUrl;
  constructor(private http: HttpClient) {}

  addPeticion(peticion: Peticion): Observable<Result<Peticion>> {
    return this.http.post<Result<Peticion>>(this.url, peticion);
  }
  getById(idUsuario: Number) {
    return this.http.get<Result<Peticion>>(this.url + '/peticion/' + idUsuario);
  }
  getAll() {
    return this.http.get<Result<Peticion>>(this.url);
  }
  accept(peticion: Peticion) {
    return this.http.put<Result<Peticion>>(this.url + '/peticion/accept', peticion);
  }
  decline(peticion: Peticion) {
    return this.http.put<Result<Peticion>>(this.url + '/peticion/decline', peticion);
  }
}
