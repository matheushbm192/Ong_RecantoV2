import { SolicitacaoAdocao } from "./solicitacaoAdocaoModel";
import { Usuario } from "./usuarioModel";
import { Pet } from "./petModel";

/**
 * Interface para representar um pedido de adoção completo com todas as informações
 * do usuário adotante e do animal solicitado
 * @interface PedidoAdocaoCompleto
 */
export interface PedidoAdocaoCompleto {
  idPedido: number;
  dataSolicitacao: string;
  status: "Pendente" | "Concluido";
  resultado: "Aprovado" | "Reprovado" | null;

  adotante: {
    idUsuario: number;
    nomeCompleto: string;
    email: string;
    telefone: string;
    cpf: string;
    enderecoCompleto: string | null;
    redeSocial: string | null;
    escolaridade: string;
    possuiPet: boolean | null;
  };

  animal: {
    id_pet: number;
    nome: string;
    raca: string | null;
    especie: string | null;
    sexo: string;
    idade: number | null;
    foto_url: string | null;
    localizacaoCompleta: string;
  };
}

/**
 * Mapeia uma SolicitacaoAdocao com seus relacionamentos (Usuario e Pet) para PedidoAdocaoCompleto
 * @param solicitacao - A solicitação de adoção do banco
 * @param usuario - Os dados do usuário que fez a solicitação
 * @param pet - Os dados do animal solicitado
 * @returns PedidoAdocaoCompleto formatado para o frontend
 */
export function mapSolicitacaoToPedidoCompleto(
  solicitacao: SolicitacaoAdocao,
  usuario: Usuario,
  pet: Pet
): PedidoAdocaoCompleto {
  return {
    idPedido: solicitacao.id,
    dataSolicitacao: solicitacao.data_solicitacao,
    status: "Pendente", // TODO: Buscar do banco quando houver transição de status
    resultado: null, // TODO: Buscar do banco quando houver coluna de resultado
    
    adotante: {
      idUsuario: usuario.id,
      nomeCompleto: `${usuario.nome} ${usuario.sobrenome}`.trim() || "Usuário desconhecido",
      email: usuario.email || "",
      telefone: usuario.telefone || "",
      cpf: usuario.cpf || "",
      enderecoCompleto: formatarEndereco(usuario),
      redeSocial: null,
      escolaridade: usuario.escolaridade || "",
      possuiPet: usuario.possuiPet || null,
    },
    
    animal: {
      id_pet: pet.id,
      nome: pet.nome || "Animal desconhecido",
      raca: pet.raca || null,
      especie: pet.especie || null,
      sexo: pet.sexo || "",
      idade: pet.idade || null,
      foto_url: pet.fotos?.[0]?.foto_url || null,
      localizacaoCompleta: formatarLocalizacao(pet),
    },
  };
}

/**
 * Formata o endereço do usuário em uma string legível
 * @param usuario - O usuário com dados de endereço
 * @returns Endereço formatado ou null se vazio
 */
function formatarEndereco(usuario: Usuario): string | null {
  const partes = [
    usuario.logradouro,
    usuario.numero,
    usuario.complemento,
    usuario.bairro,
    usuario.cidade,
    usuario.estado,
  ].filter(Boolean);

  const endereco = partes.join(", ").trim();
  return endereco || null;
}

/**
 * Formata a localização do pet em uma string legível
 * @param pet - O pet com dados de localização
 * @returns Localização formatada ou mensagem padrão
 */
function formatarLocalizacao(pet: Pet): string {
  const partes = [pet.bairro, pet.cidade].filter(Boolean);
  const localizacao = partes.join(", ").trim();
  return localizacao || "Local não especificado";
}
