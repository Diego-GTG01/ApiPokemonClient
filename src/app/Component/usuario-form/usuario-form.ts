import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Rol } from '../../Interface/Rol';
import { Router } from '@angular/router';
import { RolService } from '../../Service/rol-service';
import { Result } from '../../Interface/Result';
import { UsuarioService } from '../../Service/usuario-service';
import { Usuario } from '../../Interface/Usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
})
export class UsuarioForm implements OnInit {
  usuarioForm!: FormGroup;
  roles: Rol[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private rolService: RolService,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarRoles();
  }

  private initForm(): void {
    this.usuarioForm = this.formBuilder.group({
      idUsuario: [0],
      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern('^[A-Za-z][A-Za-z0-9_]{7,29}$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern('^[A-Za-z][A-Za-z0-9_]{7,29}$'),
        ],
      ],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$'),
        ],
      ],
      apellidoPaterno: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$'),
        ],
      ],
      apellidoMaterno: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$'),
        ],
      ],
      telefono: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      celular: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
        ],
      ],
      verified: [0],
      rol: [null, Validators.required],
    });
  }

  private cargarRoles(): void {
    this.rolService.getAllRol().subscribe({
      next: (result: Result<Rol[]>) => {
        this.roles = result.objects.flat();
      },
      error: (err) => {
        console.warn("error cargando Roles")
      },
    });
  }

  compareRoles(p1: Rol, p2: Rol): boolean {
    return p1 && p2 ? p1.idRol === p2.idRol : p1 === p2;
  }

  guardarUsuario(event: Event): void {
    event.preventDefault();
    this.usuarioForm.markAllAsTouched();
    if (this.usuarioForm.valid) {
      this.usuarioService.addUser(this.usuarioForm.value).subscribe({
        next: (result: Result<Usuario[]>) => {
          if (result.correct) {
            this.usuarioForm.reset();
            Swal.fire({
              title: 'Usuario guardado exitosamente',
              icon: 'success',
              confirmButtonText: 'OK',
            });

            this.volver();
          } else {
            this.usuarioForm.markAllAsTouched();
            alert('Usuario no guardado');
            Swal.fire({
              title: 'Error al guardar el usuario',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        },
        error: (err) => {
          console.warn(err);

          Swal.fire({
            title: 'Error al guardar el usuario',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
    } else {
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Por favor, corrige los errores antes de guardar.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      this.usuarioForm.markAllAsTouched();
    }
  }

  volver(): void {
    this.router.navigate(['/PokeUsers']);
  }
}
