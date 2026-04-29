import { Routes } from '@angular/router';
import { VistaMain } from './Component/vista-main/vista-main';
import { VistaLogin } from './Component/vista-login/vista-login';
import { authGuard } from './Guards/auth-guard';

export const routes: Routes = [
    {
        path: "", component: VistaMain, canActivate: [authGuard]
    },
    {
        path: "login", component: VistaLogin
    }
];
