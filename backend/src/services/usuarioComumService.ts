import { Usuario, UsuarioPost } from '../models/usuarioModel';
import { UsuarioComumDAO } from '../DAO/usuarioComumDAO';

export class UsuarioComumRN {
  private usuarioComumDao: UsuarioComumDAO;

  constructor() {
    this.usuarioComumDao = new UsuarioComumDAO();
  }

  async insertUsuario(usuarioData: UsuarioPost): Promise<Usuario> {
    this.validarCampos(usuarioData);

    try {
      const resultado = await this.usuarioComumDao.insertUsuario(usuarioData);
      console.log("RN RETORNO DO DAO PARA A RN");
      console.log(resultado);
      return resultado;
    } catch (error) {
      console.error("Erro na inserção de usuário:", error);
      throw error;
    }
  }

  validarCampos(usuarioData: UsuarioPost) {
    if (!usuarioData.nome) {
      throw new Error('Primeiro nome é obrigatório.');
    }

    if (!usuarioData.sobrenome) {
      throw new Error('Sobrenome é obrigatório.');
    }

    if (!usuarioData.email) {
      throw new Error('Email é obrigatório.');
    }

    if (!usuarioData.senha) {
      throw new Error('Senha é obrigatória.');
    }

    if (!usuarioData.dataNascimento) {
      throw new Error('Data de nascimento é obrigatória.');
    }

    if (!usuarioData.cpf) {
      throw new Error('CPF é obrigatório.');
    }

    if (!usuarioData.telefone) {
      throw new Error('Telefone é obrigatório.');
    }

    if (!usuarioData.escolaridade) {
      throw new Error('Escolaridade é obrigatória.');
    }

    if (typeof usuarioData.possuiPet !== 'boolean') {
      throw new Error('Campo "possuiPet" é obrigatório e deve ser verdadeiro ou falso.');
    }

    if (typeof usuarioData.contribuir_ong !== 'boolean') {
      throw new Error('Campo "Deseja contribuir com a ONG?" é obrigatório e deve ser verdadeiro ou falso.');
    }
    //apenas checar se veio a variavel preenchida

    if (typeof usuarioData.deseja_adotar !== 'boolean') {
      throw new Error('Campo "Deseja adotar um pet?" é obrigatório e deve ser verdadeiro ou falso.');
    }

    if (!usuarioData.logradouro) {
      throw new Error('Logradouro é obrigatório.');
    }

    if (!usuarioData.bairro) {
      throw new Error('Bairro é obrigatório.');
    }

    if (!usuarioData.cidade) {
      throw new Error('Cidade é obrigatória.');
    }

    if (!usuarioData.estado) {
      throw new Error('Estado é obrigatório.');
    }

    if (usuarioData.tipo_usuario !== 'COMUM') {
      throw new Error('Tipo de usuário inválido para cadastro de usuário comum.');
    }
  }
}
