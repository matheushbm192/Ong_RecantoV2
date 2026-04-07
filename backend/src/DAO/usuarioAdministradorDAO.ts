import sql from "../database/databaseClient";
import { UsuarioAdministrador, UsuarioAdministradorPost } from "../models/usuarioAdministradorModel";

export class UsuarioAdministradorDAO {
  async insertUsuario(
    usuario: UsuarioAdministradorPost
  ): Promise<UsuarioAdministrador> {

    try {
      console.log("📝 DAO: Iniciando inserção de administrador");
      console.log("📦 DAO: Dados recebidos:", usuario);
      
      //  1. Verifica se email ou CPF já existem
      console.log("🔍 DAO: Verificando se email ou CPF já existem");
      
      const existente = await sql<{ id: number }[]>`
        SELECT id
        FROM usuario
        WHERE email = ${usuario.email}
           OR cpf   = ${usuario.cpf}
      `;

      if (existente.length > 0) {
        console.warn("⚠️ DAO: Email ou CPF já existe!");
        throw new Error("Já existe um usuário com este email ou CPF.");
      }
      
      console.log("✅ DAO: Email e CPF são únicos, prosseguindo...");

      /* ===============================
         2. Transaction
      =============================== */
      console.log("🔄 DAO: Iniciando transação de inserção");
      
      const usuarioAdministrador = await sql.begin(
        async (tx: any) => {

          /* ---------- INSERE USUARIO ---------- */
          console.log("📝 DAO: Inserindo registro na tabela 'usuario'");
          const [usuarioInserido] = await tx<{
            id: number
          }[]>`
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
              ${usuario.tipo_usuario},
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
            RETURNING id
          `;
          
          console.log("✅ DAO: Usuário inserido com id:", usuarioInserido.id);

          /* ---------- INSERE USUARIO_ADMINISTRADOR ---------- */
          console.log("📝 DAO: Inserindo registro na tabela 'administrador'");
          const adminInserido = await tx<UsuarioAdministrador[]>`
            INSERT INTO administrador (
              id_usuario,
              funcao,
              id_colab_especies_pets
            ) VALUES (
              ${usuarioInserido.id},
              ${usuario.funcao},
              null
            )
            RETURNING *
          `;
          
          console.log("✅ DAO: Administrador inserido com sucesso:", adminInserido[0]);

          return adminInserido[0];
        }
      );

      console.log("✅ DAO: USUÁRIO ADMINISTRADOR INSERIDO COM SUCESSO");
      return usuarioAdministrador;

    } catch (error: any) {
      console.error("❌ DAO: ERRO NO DAO - ADMINISTRADOR");
      console.error("📝 DAO: Mensagem de erro:", error.message);
      console.error("📍 DAO: Stack trace:", error.stack);
      throw new Error(error.message);
    }
  }
}
