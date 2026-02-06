import sql from "../database/databaseClient"
import { Usuario } from "../models/usuarioModel"

export class LoginDAO {
    // Alterar para retornar Promise<User>
    async selectUserByEmail(email: string) {
        const usuario = await sql<Usuario[]>`
            SELECT * FROM usuario WHERE email = ${email}
        `

        if (usuario.length === 0) {
            throw new Error("Usuario não encontrado")
        }

        return usuario[0]
    }
}

