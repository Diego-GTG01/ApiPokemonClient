import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from '../../Service/auth-service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {

  token = '';

  password = '';
  confirmPassword = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.token =
      this.route.snapshot.queryParamMap.get('token') || '';
  }

  savePassword() {

    if (this.password !== this.confirmPassword) {

      Swal.fire({
        icon: 'warning',
        title: 'Las contraseñas no coinciden'
      });

      return;
    }

    this.authService
      .resetPassword(this.token, this.password)
      .subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada',
            text: 'Tu contraseña fue actualizada correctamente'
          });

          this.router.navigate(['/login']);
        },

        error: (err) => {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error || 'Token inválido o expirado'
          });
        }
      });
  }
}