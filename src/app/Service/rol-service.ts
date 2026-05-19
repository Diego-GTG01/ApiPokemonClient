import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../Interface/Result';
import { Rol } from '../Interface/Rol';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  getAllRol(): Observable<Result<Rol[]>> {
    return this.http.get<Result<Rol[]>>(`${this.apiUrl}/usuario/rol`);
  }
}
