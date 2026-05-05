import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('idUsuario'));
    this.cargarUsuario();
    this.cargarRoles();
  }

  initForm(usuario: Usuario) {
    this.usuarioForm = this.fb.group({
      idUsuario: [usuario.idUsuario],
      userName: [usuario.userName],
      nombre: [usuario.nombre],
      apellidoPaterno: [usuario.apellidoPaterno],
      apellidoMaterno: [usuario.apellidoMaterno],
      celular: [usuario.celular],
      telefono: [usuario.telefono],
      email: [usuario.email],
      rol: [usuario.rol],
      verified: [usuario.verified]
    });
  }

  cargarUsuario() {
    this.usuarioService.getById(this.id).subscribe({
      next: (res: Result<Usuario>) => {
        this.usuario = res.object;
        console.log(this.usuario);
        this.initForm(this.usuario);
      }
    });
  }

  cargarRoles() {
    this.rolService.getAllRol().subscribe({
      next: (res: Result<Rol[]>) => {
        this.roles = res.objects.flat();
      }
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

    this.usuarioService.updateUser(data).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado correctamente',
          icon: 'success'
        });

        this.mostrarModal = false;
        this.cargarUsuario();
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error al actualizar',
          icon: 'error'
        });
      }
    });
  }

  compareRoles(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.idRol === o2.idRol : o1 === o2;
  }

  volver() {
    this.router.navigate(['/PokeUsers']);
  }

  EliminarUsuario(user: Usuario) {
    Swal.fire({
      title: '¿Eliminar usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'
    }).then(res => {
      if (res.isConfirmed) {
        this.usuarioService.deleteUser(user.idUsuario).subscribe(() => {
          Swal.fire('Eliminado', '', 'success');
          this.router.navigate(['/PokeUsers']);
        });
      }
    });
  }
}