import { Usuario } from "./usuarioModel";

export interface UsuarioAdministrador extends Usuario {
    id: number; 
    id_usuario: number
    id_colab_especies_pets: number
    funcao: string;
}