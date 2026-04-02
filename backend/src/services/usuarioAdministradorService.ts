import { UsuarioAdministrador, UsuarioAdministradorPost } from '../models/usuarioAdministradorModel';
import { UsuarioAdministradorDAO } from '../DAO/usuarioAdministradorDAO';

export class UsuarioAdministradorRN {
  private usuarioAdministradorDao: UsuarioAdministradorDAO;

  constructor() {
    this.usuarioAdministradorDao = new UsuarioAdministradorDAO();
  }

  async insertUsuarioAdministrador(usuarioData: UsuarioAdministradorPost): Promise<UsuarioAdministrador> {
    console.log("🔍 RN: Iniciando validação de campos");
    console.log("📋 RN: Dados recebidos:", usuarioData);
    
    this.validarCampos(usuarioData);
    
    console.log("✅ RN: Validação passou successfully");

    try {
      console.log("🔄 RN: Chamando DAO para inserção");
      const resultado = await this.usuarioAdministradorDao.insertUsuario(usuarioData);
      console.log("✅ RN RETORNO DO DAO PARA A RN");
      console.log("📦 Resultado retornado:", resultado);
      
      return resultado;
    } catch (error) {
      console.error("❌ RN: Erro na inserção de usuário:", error);
      throw error;
    }
  }

  validarCampos(usuarioData: UsuarioAdministradorPost) {
    console.log("🔍 Validando campos...");
    
    if (!usuarioData.nome) {
      console.warn("⚠️ Nome vazio:", usuarioData.nome);
      throw new Error('Primeiro nome é obrigatório.');
    }

    if (!usuarioData.sobrenome) {
      console.warn("⚠️ Sobrenome vazio:", usuarioData.sobrenome);
      throw new Error('Sobrenome é obrigatório.');
    }

    if (!usuarioData.email) {
      console.warn("⚠️ Email vazio:", usuarioData.email);
      throw new Error('Email é obrigatório.');
    }

    if (!usuarioData.senha) {
      console.warn("⚠️ Senha vazia:", usuarioData.senha);
      throw new Error('Senha é obrigatória.');
    }
    if (!usuarioData.dataNascimento) {
      console.warn("⚠️ Data nascimento vazia:", usuarioData.dataNascimento);
      throw new Error('Data de nascimento é obrigatória.');
    }
    if (!usuarioData.cpf) {
      console.warn("⚠️ CPF vazio:", usuarioData.cpf);
      throw new Error('CPF é obrigatório.');
    }
    if (!usuarioData.logradouro) {
      console.warn("⚠️ Logradouro vazio:", usuarioData.logradouro);
      throw new Error('Logradouro é obrigatório.');
    }
    if (!usuarioData.bairro) {
      console.warn("⚠️ Bairro vazio:", usuarioData.bairro);
      throw new Error('Bairro é obrigatório.');
    }
    if (!usuarioData.cidade) {
      console.warn("⚠️ Cidade vazia:", usuarioData.cidade);
      throw new Error('Cidade é obrigatória.');
    }
    if (!usuarioData.estado) {
      console.warn("⚠️ Estado vazio:", usuarioData.estado);
      throw new Error('Estado é obrigatório.');
    }
    if (!usuarioData.telefone) {
      console.warn("⚠️ Telefone vazio:", usuarioData.telefone);    
      throw new Error('Telefone é obrigatório.');
    }
    if (!usuarioData.escolaridade) {
      console.warn("⚠️ Escolaridade vazia:", usuarioData.escolaridade);
      throw new Error('Escolaridade é obrigatória.');
    }
    if(!usuarioData.funcao) {
      console.warn("⚠️ Função vazia:", usuarioData.funcao);
      throw new Error('A função do administrador é obrigatória.')
    }
    
    console.log("✅ Todos os campos validados com sucesso");
  }
}
