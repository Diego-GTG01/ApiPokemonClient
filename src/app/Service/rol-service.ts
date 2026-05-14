import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../Interface/Result';
import { Rol } from '../Interface/Rol';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  constructor(private http: HttpClient) {}

  apiUrl = 'http://192.167.0.171:8080/usuario/rol';

  getAllRol(): Observable<Result<Rol[]>> {
    return this.http.get<Result<Rol[]>>(this.apiUrl);
  }
}
