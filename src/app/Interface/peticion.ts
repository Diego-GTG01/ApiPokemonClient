    import { Usuario } from "./Usuario";

    export interface Peticion{
        idPeticion: number,
        usuario: Usuario,
        fechaHora: Date,
        status: number,
        descripcion: String
        
    }