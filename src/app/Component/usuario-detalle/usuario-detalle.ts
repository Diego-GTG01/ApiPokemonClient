import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../Service/usuario-service';
import { Usuario } from '../../Interface/Usuario';
import { Result } from '../../Interface/Result';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-detalle',
  standalone: true, // Asegúrate de que sea standalone si usas imports
  imports: [CommonModule],
  templateUrl: './usuario-detalle.html',
  styleUrl: './usuario-detalle.css',
})
export class UsuarioDetalle implements OnInit {
  id: number = 0;
  usuario: Usuario = {} as Usuario;
  usuarioForm!: FormGroup;
  @ViewChild('formContainer') formContainer!: ElementRef;

  roles: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('idUsuario'));
    if (this.id) {
      this.cargarUsuario();
    }
  }

  cargarUsuario(): void {
    this.usuarioService.getById(this.id).subscribe({
      next: (result: Result<Usuario>) => {
        if (result.correct) {
          this.usuario = result.object;
        } else {
          this.notificarError();
        }
      },
      error: () => this.notificarError(),
    });
  }

  compareRoles(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.idRol === o2.idRol : o1 === o2;
  }

  private notificarError() {
    Swal.fire({
      title: 'Error al realizar petición',
      icon: 'warning',
      confirmButtonText: 'Ok',
    });
  }

  // Métodos de navegación
  regresar() {
    this.router.navigate(['/usuarios']);
  }

  editar() {
    this.router.navigate(['/usuario-form', this.id]);
  }

  abrirModalEdicion() {
   

    Swal.fire({
      title: 'ACTUALIZAR DATOS DE ENTRENADOR',
      html: this.formContainer.nativeElement, // Insertamos el HTML del template
      showConfirmButton: false, // Ocultamos botones de Swal para usar los del formulario
      width: '800px',
      background: '#f0f0f0',
      customClass: {
        popup: 'pokedex-modal-border',
      },
      didOpen: () => {
        // Lógica opcional al abrir
      },
    });
  }

  guardarUsuario(event: Event) {
    event.preventDefault();
    if (this.usuarioForm.valid) {
      const datosActualizados = this.usuarioForm.value;
      // Llamar a tu servicio para actualizar
      console.log('Enviando a la base de datos:', datosActualizados);
      Swal.close(); // Cerramos el modal tras éxito
    }
  }

  eliminar() {}
}
