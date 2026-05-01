import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Rol } from '../../Interface/Rol';
import { Router } from '@angular/router';
import { RolService } from '../../Service/rol-service';
import { Result } from '../../Interface/Result';
import { UsuarioService } from '../../Service/usuario-service';
import { Usuario } from '../../Interface/Usuario';

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
    this.rolService.getAllRol().subscribe({
      next: (result: Result<Rol[]>) => {
        this.roles = result.objects.flat();
        console.log('roles cargados');
      },
      error: (err) => {},
    });
  }

  compareRoles(p1: Rol, p2: Rol): boolean {
    return p1 && p2 ? p1.idRol === p2.idRol : p1 === p2;
  }

  guardarUsuario(): void {
    if (this.usuarioForm.valid) {
      console.log('Datos del Entrenador:', this.usuarioForm.value);
      this.usuarioService.addUser(this.usuarioForm.value).subscribe({
        next: (result: Result<Usuario[]>) => {
          
          console.log(result);
          if(result.correct){
            this.usuarioForm.reset();
            alert("Usuario guardado exitosamente")
          }else{
            this.usuarioForm.markAllAsTouched();
            alert("Usuario no guardado")
          }
        },
        error: (err) => {
          console.warn(err)
        },
      });
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }

  volver(): void {
    this.router.navigate(['/PokeUsers']);
  }
}
