import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../Interface/Usuario';
import { UsuarioService } from '../../Service/usuario-service';
import { Result } from '../../Interface/Result';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-usuarios',
  imports: [CommonModule],
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css',
})
export class GestionUsuarios {
  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
  ) {}
  usuarios: Usuario[] = [];

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getAllUsers().subscribe({
      next: (usuarios: Result<Usuario[]>) => {
        this.usuarios = usuarios.objects.flat();
      },
      error: (err) => {
        console.error('Error al cargar los usuarios:', err);  
        Swal.fire({
          title: 'Error al cargar los usuarios',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        this.router.navigate(['/PokeUsers']);
      },
    });
  }

  public EliminarUsuario(user: Usuario): void {
    Swal.fire({
      title: 'Esta seguro de eliminar este usuario?',
      text: 'No podrás revertir esto',
      icon: 'warning',

      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#d33',
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUser(user.idUsuario).subscribe({
          next: (result) => {
            if (result.status == 204) {
              Swal.fire({
                title: 'Usuario eliminado Correctamente',
                icon: 'success',
                showConfirmButton: true,
                confirmButtonText: 'Ok',
              }).then(() => {
                window.location.reload();
              });

              this.router.navigate([this.router.url]);
            } else if (result.status == 401) {
              Swal.fire({
                title: 'Error al realizar petición',
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: 'Ok',
              });
            } else {
              Swal.fire({
                title: 'Algo salió mal :(',
                icon: 'error',
                showConfirmButton: true,
                confirmButtonText: 'Ok',
              });
            }
          },
          error: (err) => {
            Swal.fire({
              title: 'Algo salió mal :(',
              icon: 'error',
              showConfirmButton: true,
              confirmButtonText: 'Ok',
            }).then(() => {
              window.location.reload(); // ✅ aquí
            });
          },
        });
      }
    });

    this.router.navigate([this.router.url]);
  }
  verPerfil(idUsuario: Number): void{
    this.router.navigate(['/PokeUsers/', idUsuario]);
  }
  agregarUsuario(): void {
    this.router.navigate(['/PokeForm']);
  }
}
