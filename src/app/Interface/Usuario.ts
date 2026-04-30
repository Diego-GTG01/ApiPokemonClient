import { Rol } from "./Rol";

export interface Usuario {
  idUsuario: number;
  userName: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  celular: string;
  email: string;
  verified: number;
  rol: Rol; 
}