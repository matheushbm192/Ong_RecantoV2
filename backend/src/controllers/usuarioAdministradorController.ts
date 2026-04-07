  import { Request, Response } from 'express';
  import { Usuario } from '../models/usuarioModel';
  import { UsuarioAdministradorRN } from '../services/usuarioAdministradorService';
  import { MulterRequest } from '../interfaceConfig/MulterRequest';
  import { UsuarioAdministrador, UsuarioAdministradorPost } from '../models/usuarioAdministradorModel';

  const usuarioAdministradorRN = new UsuarioAdministradorRN();

  export class UsuarioAdministradorCTR {
    async postUsuario(req:  MulterRequest, res: Response) {
      try {
        console.log('\n\n🚀🚀🚀 [CONTROLLER postUsuario] FOI CHAMADO! 🚀🚀🚀\n');
        console.log("📦 Body recebido:", JSON.stringify(req.body, null, 2));

        const {
          nome,
          sobrenome,
          email,
          senha,
          dataNascimento,
          cpf,
          funcao, 
          telefone,
          escolaridade,
          contribuir_ong,
          deseja_adotar,
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          possuiPet
        } = req.body;

        // Remove máscara do CPF (remove pontos e hífen)
        const cpfLimpo = cpf?.replace(/[.\-]/g, '') || '';

        const novoUsuario: UsuarioAdministradorPost = {
          nome,
          sobrenome,
          email,
          senha,
          dataNascimento,
          cpf: cpfLimpo,
          funcao: (funcao || "Admin").substring(0, 11), // Limita a 11 caracteres
          telefone,
          escolaridade: escolaridade || null,
          possuiPet: possuiPet === true || possuiPet === 'true',
          contribuir_ong: contribuir_ong || false,
          deseja_adotar: deseja_adotar || false,
          logradouro: logradouro || null,
          numero: numero || null,
          complemento: complemento || null,
          bairro: bairro || null,
          cidade: cidade || null,
          estado: estado || null,
          tipo_usuario: 'ADMINISTRADOR',
          criado_em: new Date().toISOString(),
        };

        console.log("🔄 Dados processados para RN:", JSON.stringify(novoUsuario, null, 2));

        const resultado = await usuarioAdministradorRN.insertUsuarioAdministrador(novoUsuario);
        
        console.log("✅ Usuário criado com sucesso:", resultado);

        res.status(201).json({ message: "Usuário criado com sucesso", data: resultado });

      } catch (error: any) {
        console.log("❌ ACONTECEU UM ERRO NO CONTROLLER");
        console.error("💥 Erro completo:", error);
        console.error("📝 Mensagem de erro:", error.message);
        console.error("🔍 Stack trace:", error.stack);

        if (error.message.includes('obrigatório') || error.message.includes('não pode ser')) {
          res.status(400).json({ error: 'Erro de validação: ' + error.message });
        } else {
          res.status(500).json({ error: 'Erro interno do servidor: ' + error.message });
        }
      }
    }
  }
