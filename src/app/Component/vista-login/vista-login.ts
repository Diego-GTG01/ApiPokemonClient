import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Service/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vista-login',
  imports: [FormsModule],
  templateUrl: './vista-login.html',
  styleUrls: ['./vista-login.css'],
})
export class VistaLogin {
  username = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  login() {
    this.auth
      .login({
        email: this.username,
        password: this.password,
      })
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: () => alert('Credenciales incorrectas'),
      });
  }
}

