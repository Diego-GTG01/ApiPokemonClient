import { Routes } from '@angular/router';
import { VistaMain } from './Component/vista-main/vista-main';
import { VistaLogin } from './Component/vista-login/vista-login';
import { authGuard } from './Guards/auth-guard';
import { VerifyPendingComponent } from './Component/verify-pending/verify-pending';
import { GestionUsuarios } from './Component/gestion-usuarios/gestion-usuarios';
import { UsuarioForm } from './Component/usuario-form/usuario-form';
import { UsuarioDetalle } from './Component/usuario-detalle/usuario-detalle';

export const routes: Routes = [
  {
    path: "", component: VistaMain, canActivate: [authGuard]
  },
  {
    path: "login", component: VistaLogin
  },
  {
    path: "verify-pending", component: VerifyPendingComponent
  },
  {
    path: 'PokeUsers',
    component: GestionUsuarios,
  },
  {
    path: "PokeForm",
    component: UsuarioForm
  }, 
  {
    path: "PokeUsers/:idUsuario",
    component: UsuarioDetalle
  }
];
