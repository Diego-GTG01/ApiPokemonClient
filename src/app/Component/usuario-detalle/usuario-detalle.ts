import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../Service/usuario-service';
import { RolService } from '../../Service/rol-service';
import { Usuario } from '../../Interface/Usuario';
import { Rol } from '../../Interface/Rol';
import { Result } from '../../Interface/Result';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-detalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-detalle.html',
  styleUrl: './usuario-detalle.css',
})
export class UsuarioDetalle implements OnInit {
  id: number = 0;
  usuario!: Usuario;
  roles: Rol[] = [];
  usuarioForm!: FormGroup;
  mostrarModal = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('idUsuario'));
    this.cargarUsuario();
    this.cargarRoles();
  }

  initForm(usuario: Usuario) {
    this.usuarioForm = this.fb.group({
      idUsuario: [usuario.idUsuario],

      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern('^[A-Za-z][A-Za-z0-9_]{7,29}$'),
        ],
      ],
      password: [''],
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
      verified: [usuario.verified],
      rol: [null, Validators.required],
    });
  }

  cargarUsuario() {
    this.usuarioService.getById(this.id).subscribe({
      next: (res: Result<Usuario>) => {
        this.usuario = res.object;
        this.initForm(this.usuario);
      },
    });
  }

  cargarRoles() {
    this.rolService.getAllRol().subscribe({
      next: (res: Result<Rol[]>) => {
        this.roles = res.objects.flat();
      },
    });
  }

  editarEntrenador(user: Usuario) {
    this.usuarioForm.patchValue(user);
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarUsuario(e: Event) {
    e.preventDefault();

    const data: Usuario = this.usuarioForm.value;

    Object.keys(this.usuarioForm.controls).forEach((key) => {
      const controlErrors = this.usuarioForm.get(key)?.errors;
      if (controlErrors != null) {
      }
    });
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Por favor, corrige los errores antes de guardar.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    } else {
      this.usuarioService.updateUser(data).subscribe({
        next: () => {
          Swal.fire({
            title: 'Actualizado correctamente',
            icon: 'success',
          });

          this.mostrarModal = false;
          this.cargarUsuario();
        },
        error: (err) => {
          console.warn(err);
          Swal.fire({
            title: 'Error al actualizar',
            icon: 'error',
          });
        },
      });
    }
  }

  compareRoles(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.idRol === o2.idRol : o1 === o2;
  }

  volver(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/main']);
    }
  }

  EliminarUsuario(user: Usuario) {
    Swal.fire({
      title: '¿Eliminar usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
    }).then((res) => {
      if (res.isConfirmed) {
        this.usuarioService.deleteUser(user.idUsuario).subscribe(() => {
          Swal.fire('Eliminado', '', 'success');
          this.router.navigate(['/PokeUsers']);
        });
      }
    });
  }
}
