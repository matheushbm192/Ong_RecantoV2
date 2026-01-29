import sql from "../database/databaseClient";
import database from "../database/databaseClient";
import { UsuarioVoluntario } from "../models/usuarioVoluntarioModel";

export class UsuarioVoluntarioDAO{
    
    async insertUsuarioVoluntario(usuario: UsuarioVoluntario): Promise<UsuarioVoluntario> {

    try {
        const {
            id_colab_especies_pets,
            area_interesse,
            disponibilidade,
            aprovado,
            ...dadosUsuario
        } = usuario;

        const [voluntarioInserido] = await sql.begin(async (tx:any) => {

            // 1️⃣ Verifica email ou CPF
            const existente = await tx<{ id: number }[]>`
                SELECT id
                FROM usuario
                WHERE email = ${dadosUsuario.email}
                   OR cpf   = ${dadosUsuario.cpf}
            `;

            if (existente.length > 0) {
                throw new Error("Já existe um usuário com este email ou CPF.");
            }

            const usuarios = await tx<{ id: number }[]>`
                INSERT INTO usuario (
                    nome,
                    sobrenome,
                    email,
                    senha,
                    data_nascimento,
                    cpf,
                    telefone,
                    tipo_usuario,
                    id_rede_social,
                    escolaridade,
                    possui_pet,
                    logradouro,
                    numero,
                    complemento,
                    bairro,
                    cidade,
                    estado,
                    contribuir_ong,
                    deseja_adotar,
                    criado_em
                ) VALUES (
                    ${dadosUsuario.nome},
                    ${dadosUsuario.sobrenome},
                    ${dadosUsuario.email},
                    ${dadosUsuario.senha},
                    ${dadosUsuario.dataNascimento},
                    ${dadosUsuario.cpf},
                    ${dadosUsuario.telefone},
                    'VOLUNTARIO',
                    ${dadosUsuario.id_rede_social},
                    ${dadosUsuario.escolaridade},
                    ${dadosUsuario.possuiPet},
                    ${dadosUsuario.logradouro},
                    ${dadosUsuario.numero},
                    ${dadosUsuario.complemento},
                    ${dadosUsuario.bairro},
                    ${dadosUsuario.cidade},
                    ${dadosUsuario.estado},
                    ${dadosUsuario.contribuir_ong},
                    ${dadosUsuario.deseja_adotar},
                    NOW()
                )
                RETURNING *
            `;

            const usuarioInserido = usuarios[0];

            // 3️⃣ Insere USUARIO_VOLUNTARIO
            const voluntarios = await tx<UsuarioVoluntario[]>`
                INSERT INTO usuario_voluntario (
                    id_usuario,
                    id_colab_especies_pets,
                    area_interesse,
                    disponibilidade,
                    aprovado
                ) VALUES (
                    ${usuarioInserido.id},
                    ${id_colab_especies_pets},
                    ${area_interesse},
                    ${disponibilidade},
                    ${aprovado}
                )
                RETURNING *
            `;

            // 4️⃣ Junta dados (Usuario + Voluntario)
            return [{
                ...usuarioInserido,
                ...voluntarios[0]
            }];
        });

        return voluntarioInserido;

    } catch (error: any) {
        console.error("ERRO NO DAO:", error.message);
        throw error;
    }
}


}