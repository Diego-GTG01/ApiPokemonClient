import { Routes } from '@angular/router';
import { VistaMain } from './Component/vista-main/vista-main';
import { GestionUsuarios } from './Component/gestion-usuarios/gestion-usuarios';

export const routes: Routes = [
  {
    path: '',
    component: VistaMain,
  },
  {
    path: 'PokeUsers',
    component: GestionUsuarios,
  },
];
