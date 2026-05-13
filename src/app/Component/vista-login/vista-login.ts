import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Service/auth-service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vista-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './vista-login.html',
  styleUrls: ['./vista-login.css'],
})

export class VistaLogin {
  username = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router, 
  ) {
    localStorage.clear();
    
  }

  login() {
    this.auth
      .login({
        email: this.username,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/main']);
        },
        error: (err) => {
          if (err.status === 403) {
            this.router.navigate(['/verify-pending']);
          } else {
            Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Credenciales incorrectas'
                      });
          }
        },
      });
  }
}