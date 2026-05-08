import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from '../../Service/auth-service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  email = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  sendRecovery() {

    this.authService
      .forgotPassword(this.email)
      .subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Correo enviado',
            text: 'Revisa tu correo para recuperar tu contraseña'
          });

          this.router.navigate(['/login']);
        },

        error: () => {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo procesar la solicitud'
          });
        }
      });
  }
}