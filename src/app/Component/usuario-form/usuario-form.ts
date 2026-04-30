import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Rol } from '../../Interface/Rol';
import { Router } from '@angular/router';

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
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarRoles();
  }

  private initForm(): void {
    this.usuarioForm = this.formBuilder.group({
      idUsuario: [0],
      userName: [''],
      password: [''],
      nombre: [''],
      apellidoPaterno: [''],
      apellidoMaterno: [''],
      telefono: [''],
      celular: [''],
      email: [''],
      verified: [0],
      rol: [null],
    });
  }

  private cargarRoles(): void {
    this.roles = [
      { idRol: 1, nombre: 'Entrenador' },
      { idRol: 2, nombre: 'Líder de Gimnasio' },
      { idRol: 3, nombre: 'Investigador' },
    ];
  }

  compareRoles(p1: Rol, p2: Rol): boolean {
    return p1 && p2 ? p1.idRol === p2.idRol : p1 === p2;
  }

  guardarUsuario(): void {
    if (this.usuarioForm.valid) {
      console.log('Datos del Entrenador:', this.usuarioForm.value);
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }

  volver(): void {
    this.router.navigate(['/PokeUsers']);
  }
}
