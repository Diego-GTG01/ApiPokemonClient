import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../Interface/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://192.167.0.61:8080/auth';

  constructor(private http: HttpClient) {}

  login(data: Auth) {
    return this.http.post(`${this.apiUrl}/login`, data, {
      withCredentials: true,
      responseType: 'text',
    });
  }

  logout() {
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  checkAuth() {
    return this.http.get(`${this.apiUrl}/me`, {
      withCredentials: true,
    });
  }

  forgotPassword(email: string) {
    return this.http.post(
      `${this.apiUrl}/forgot-password`,
      { email },
      {
        responseType: 'text',
      },
    );
  }

  resetPassword(token: string, password: string) {
    return this.http.post(
      `${this.apiUrl}/reset-password?token=${token}`,
      { password },
      {
        responseType: 'text',
      },
    );
  }
}
