
import sql from "../database/databaseClient";
import { Usuario, UsuarioPost } from "../models/usuarioModel";

export class UsuarioComumDAO {

    async insertUsuario(usuario: UsuarioPost): Promise<Usuario> {
    console.log("=== DAO - INSERINDO USUÁRIO NO BANCO ===");
    console.log("Dados a serem inseridos:", usuario);

    try {
      /* ===============================
         1. Verifica se email ou CPF já existem
      =============================== */
      const usuarioExistente = await sql<{ id: number }[]>`
        SELECT id
        FROM usuario
        WHERE email = ${usuario.email}
           OR cpf   = ${usuario.cpf}
      `;

      if (usuarioExistente.length > 0) {
        throw new Error("Já existe um usuário com este email ou CPF.");
      }

      /* ===============================
         2. Insere usuário
      =============================== */
      const [usuarioInserido] = await sql<Usuario[]>`
        INSERT INTO usuario (
          nome,
          sobrenome,
          email,
          senha,
          data_nascimento,
          cpf,
          telefone,
          tipo_usuario,
          escolaridade,
          possui_pet,
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          contribuir_ong,
          deseja_adotar
        ) VALUES (
          ${usuario.nome},
          ${usuario.sobrenome},
          ${usuario.email},
          ${usuario.senha},
          ${usuario.dataNascimento},
          ${usuario.cpf},
          ${usuario.telefone ?? null},
          'COMUM',
          ${usuario.escolaridade ?? null},
          ${usuario.possuiPet},
          ${usuario.logradouro ?? null},
          ${usuario.numero ?? null},
          ${usuario.complemento ?? null},
          ${usuario.bairro ?? null},
          ${usuario.cidade ?? null},
          ${usuario.estado ?? null},
          ${usuario.contribuir_ong},
          ${usuario.deseja_adotar}
        )
        RETURNING *
      `;

      console.log("=== DAO - USUÁRIO INSERIDO COM SUCESSO ===");
      console.log(usuarioInserido);

      return usuarioInserido;

    } catch (error: any) {
      console.error("=== DAO - ERRO AO INSERIR USUÁRIO ===");
      throw new Error(error.message);
    }
  }
}
