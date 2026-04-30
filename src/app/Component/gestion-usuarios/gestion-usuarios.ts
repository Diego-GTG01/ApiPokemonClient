import { Component } from '@angular/core';
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
  constructor(private usuarioService: UsuarioService) {
    this.cargarUsuarios();
  }
  usuarios: Usuario[] = [];

  cargarUsuarios(): void {
    this.usuarioService.getPokemonFavorite().subscribe({
      next: (usuarios: Result<Usuario[]>) => {
        console.log(usuarios)
        this.usuarios=usuarios.objects.flat()
        
      },
      error: (err) => {
        
      },
    });
  }
}
