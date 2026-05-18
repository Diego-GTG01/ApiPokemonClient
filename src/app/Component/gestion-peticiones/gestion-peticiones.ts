import { Component, OnInit } from '@angular/core';
import { Peticion } from '../../Interface/peticion';
import { PeticionService } from '../../Service/peticion-service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'; // <-- Importamos SweetAlert2

@Component({
  selector: 'app-gestion-peticiones',
  imports: [CommonModule],
  templateUrl: './gestion-peticiones.html',
  styleUrl: './gestion-peticiones.css',
})
export class GestionPeticiones implements OnInit {
  peticiones: Peticion[] = [];
  peticionesRecibidas: Peticion[] = [];
  peticionesAceptadas: Peticion[] = [];
  peticionesRechazadas: Peticion[] = [];
  selecTab: Number = 0;

  constructor(private peticionService: PeticionService) {}
  
  ngOnInit(): void {
    this.cargarPeticiones();
  }

  cargarPeticiones() {
    this.peticionService.getAll().subscribe({
      next: (result) => {
        if (result.correct) {
          this.peticiones = result.objects;
          this.filtter(this.peticiones);
          console.log(this.peticiones);
        } else {
          console.warn('Algo salió mal');
        }
      },
      error: (err) => {
        console.warn(err);
      },
    });
  }

  aceptarPeticion(peticion: Peticion) {
    Swal.fire({
      title: '¿Estás seguro de aceptar esta petición?',
      text: 'Por favor, escribe el motivo o una nota de aceptación:',
      icon: 'question',
      input: 'textarea', // Cambiado a textarea por si quieren escribir bastante
      inputPlaceholder: 'Escribe aquí la razón...',
      showCancelButton: true,
      confirmButtonColor: '#2ecc71',
      cancelButtonColor: '#7f8c8d',
      confirmButtonText: 'Sí, aceptar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return '¡Debes escribir una razón para continuar!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const motivo = result.value.trim();
        
        const descOriginal = peticion.descripcion ? peticion.descripcion + ' | ' : '';
        peticion.descripcion = `${descOriginal}Aceptado por: ${motivo}`;
        peticion.status = 1;

        this.peticionService.accept(peticion).subscribe({
          next: (res) => {
            console.log(res);
            this.filtter(this.peticiones);
            
            Swal.fire('¡Aceptada!', 'La petición ha sido aceptada con éxito.', 'success');
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo procesar la solicitud.', 'error');
          }
        });
      }
    });
  }

  rechazarPeticion(peticion: Peticion) {
    Swal.fire({
      title: '¿Estás seguro de declinar esta petición?',
      text: 'Por favor, escribe el motivo del rechazo:',
      icon: 'warning',
      input: 'textarea',
      inputPlaceholder: 'Escribe aquí la razón del rechazo...',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#7f8c8d',
      confirmButtonText: 'Sí, declinar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return '¡Debes escribir una razón para rechazar la petición!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const motivo = result.value.trim();
        
        const descOriginal = peticion.descripcion ? peticion.descripcion + ' | ' : '';
        peticion.descripcion = `${descOriginal}Rechazado por: ${motivo}`;
        peticion.status = 2;

        this.peticionService.decline(peticion).subscribe({
          next: (res) => {
            console.log(res);
            this.filtter(this.peticiones);
            
            Swal.fire('Declinar', 'La petición ha sido rechazada.', 'success');
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo procesar la solicitud.', 'error');
          }
        });
      }
    });
  }

  filtter(peticiones: Peticion[]) {
    this.peticionesRecibidas = peticiones.filter((v: any) => v.status === 0);
    this.peticionesAceptadas = peticiones.filter((v: any) => v.status === 1);
    this.peticionesRechazadas = peticiones.filter((v: any) => v.status === 2);
  }
}