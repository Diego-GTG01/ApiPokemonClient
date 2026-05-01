import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../Interface/auth';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(data: Auth) {
    return this.http.post(`${this.apiUrl}/login`, data, {
      withCredentials: true,
      responseType: 'text'
    });
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    });
  }

  checkAuth() {
    return this.http.get(`${this.apiUrl}/me`, {
      withCredentials: true
    });
  }
}

