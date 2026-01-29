import { Usuario } from "./usuarioModel";

export interface UsuarioVoluntario extends Usuario {
  id: number;
  id_usuario: number;
  id_colab_especies_pets: number;
  area_interesse: string;
  disponibilidade: string;
  aprovado: boolean; 
}