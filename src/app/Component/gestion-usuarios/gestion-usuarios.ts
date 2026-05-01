import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../Interface/Usuario';
import { UsuarioService } from '../../Service/usuario-service';
import { Result } from '../../Interface/Result';

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
        console.log(usuarios);
        this.usuarios = usuarios.objects.flat();
      },
      error: (err) => {},
    });
  }
  agregarUsuario(): void {
    this.router.navigate(['/PokeForm']);
  }
}
