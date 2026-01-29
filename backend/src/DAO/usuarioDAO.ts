import sql from "../database/databaseClient";
import { Usuario } from "../models/usuarioModel";

export class UsuarioDAO {
    async selectUsuarioById(id_usuario: number) {
        const usuario = await sql<Usuario[]>`
            SELECT * FROM usuario WHERE id_usuario = ${id_usuario}
        `;

        if (usuario.length === 0) {
            throw new Error("Usuário não encontrado");
        }

        return usuario[0] as Usuario;
    }
}