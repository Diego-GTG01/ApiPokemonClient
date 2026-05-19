import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../Interface/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: Auth) {
    return this.http.post(`${this.apiUrl}/auth/login`, data, {
      withCredentials: true,
      responseType: 'text',
    });
  }

  logout() {
    return this.http.post(
      `${this.apiUrl}/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  checkAuth() {
    return this.http.get(`${this.apiUrl}/auth/me`, {
      withCredentials: true,
    });
  }

  forgotPassword(email: string) {
    return this.http.post(
      `${this.apiUrl}/auth/forgot-password`,
      { email },
      {
        responseType: 'text',
      },
    );
  }

  resetPassword(token: string, password: string) {
    return this.http.post(
      `${this.apiUrl}/auth/reset-password?token=${token}`,
      { password },
      {
        responseType: 'text',
      },
    );
  }
}
