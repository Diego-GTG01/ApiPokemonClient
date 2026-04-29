import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../Interface/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(data: Auth): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, data, {
      responseType: 'text' 
    }).pipe(
      tap((token: string) => {
        console.log('TOKEN:', token);

        localStorage.setItem('token', token);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
