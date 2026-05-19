import { Component } from '@angular/core';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Service/auth-service';
import { UsuarioService } from '../../Service/usuario-service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vista-login',
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './vista-login.html',
  styleUrls: ['./vista-login.css'],
})
export class VistaLogin {
  username = '';
  password = '';

  registerForm!: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
  ) {
    localStorage.clear();
  }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  private initRegisterForm(): void {
    this.registerForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$'),
        ],
      ],

      apellidoPaterno: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$'),
        ],
      ],

      apellidoMaterno: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$'),
        ],
      ],

      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          Validators.pattern('^[A-Za-z][A-Za-z0-9_]{3,19}$'),
        ],
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
        ],
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&._-])[A-Za-z\\d@$!%*?&._-]{8,}$',
          ),
        ],
      ],

      confirmPassword: ['', Validators.required],

      celular: ['', [Validators.required, Validators.pattern('^((\\+\\d{1,4}\\s?)?\\d{10})$')]],

      telefono: ['', [Validators.required, Validators.pattern('^((\\+\\d{1,4}\\s?)?\\d{10})$')]],
    });
  }

  passwordsMatch(): boolean {
    const password = this.registerForm.get('password')?.value;

    const confirmPassword = this.registerForm.get('confirmPassword')?.value;

    return password === confirmPassword;
  }

  allowPhoneInput(event: KeyboardEvent): void {
    const allowedChars = /[0-9+\s]/;

    const key = event.key;

    if (!allowedChars.test(key)) {
      event.preventDefault();
    }
  }

  onlyLetters(event: KeyboardEvent): void {
    const pattern = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]$/;

    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  registrarUsuario(): void {
    if (this.registerForm.invalid) {
      if (!this.passwordsMatch()) {
        Swal.fire({
          title: 'Contraseñas diferentes',
          text: 'Las contraseñas no coinciden',
          icon: 'warning',
          confirmButtonText: 'OK',
        });

        return;
      }
      this.registerForm.markAllAsTouched();

      Swal.fire({
        title: 'Formulario invalido',
        text: 'Completa todos los campos',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    const formValue = this.registerForm.value;

    const usuario = {
      idUsuario: 0,

      nombre: formValue.nombre,

      apellidoPaterno: formValue.apellidoPaterno,

      apellidoMaterno: formValue.apellidoMaterno,

      userName: formValue.userName,

      email: formValue.email,

      password: formValue.password,

      celular: formValue.celular,

      telefono: formValue.telefono,

      verified: 0,

      rol: {
        idRol: 2,
        nombre: 'Entrenador',
      },
    };

    this.usuarioService.registerUser(usuario).subscribe({
      next: (result: any) => {
        if (result.correct) {
          Swal.fire({
            title: '¡Registro exitoso!',
            text: 'Felicidades tu registro se completo correctamente. Ahora puedes iniciar sesion desde la pokebola',
            icon: 'success',
            confirmButtonText: 'Entrar',
          });
          this.registerForm.reset();
        } else {
          Swal.fire({
            title: 'Error',
            text: result.errorMessage,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      },
      error: (err: any) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo registrar el usuario',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
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
              text: 'Credenciales incorrectas',
            });
          }
        },
      });
  }
}
