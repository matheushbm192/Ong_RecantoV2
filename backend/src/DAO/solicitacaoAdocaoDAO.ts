import sql from "../database/databaseClient";
import { SolicitacaoAdocao } from "../models/solicitacaoAdocaoModel";

export class SolicitacaoAdocaoDAO {

    async getAllSolicitacoesPendentes(): Promise<SolicitacaoAdocao[]> {
        try {
            const solicitacoes = await sql<SolicitacaoAdocao[]>`
                SELECT * FROM solicitacao_adocao
                WHERE status = 'PENDENTE' 
            `;
            return solicitacoes;
        } catch (error) {
            console.error("Erro ao buscar solicitações de adoção:", error);
            throw error;
        }
    }


    async aprovarSolicitacaoAdocao(id_solicitacao: number, id_administrador: number): Promise<void> {

        try {
            await sql.begin(async (tx: any) => {

                /* 1️⃣ Buscar dados da solicitação */
                const [solicitacao] = await tx<{
                    id_usuario: number;
                    id_pet: number;
                }[]>`
                SELECT id_usuario, id_pet
                FROM solicitacao_adocao
                WHERE id = ${id_solicitacao}
                AND status = 'PENDENTE'
                `;

                if (!solicitacao) {
                    throw new Error("Solicitação não encontrada ou já finalizada.");
                }

                /* 2️⃣ Atualiza solicitação */
                await tx`
                UPDATE solicitacao_adocao
                SET
                status = 'APROVADA',
                id_administrador = ${id_administrador}
                WHERE id = ${id_solicitacao}
                `;

                /* 3️⃣ Atualiza PET (atribui usuário) */
                await tx`
                UPDATE pet
                SET
                id_usuario = ${solicitacao.id_usuario},
                data_adocao = NOW()
                WHERE id = ${solicitacao.id_pet}
                `;
            });

        } catch (error) {
            console.error("Erro ao aprovar solicitação de adoção:", error);
            throw error;
        }
    }

    async reprovarSolicitacaoAdocao(id_solicitacao: number, id_administrador: number): Promise<void> {
        try {
            await sql`
                UPDATE solicitacao_adocao
                SET id_administrador = ${id_administrador}, status = 'REPROVADA'
                WHERE id = ${id_solicitacao}
            `;
            console.log(`✅ [DAO] Solicitação ${id_solicitacao} reprovada com sucesso`);
        } catch (error) {
            console.error("Erro ao rejeitar solicitação de adoção:", error);
            throw error;
        }
    }

    /**
     * Verifica se existe uma solicitação ativa (não reprovada) para o mesmo usuário e animal
     * @returns Retorna a solicitação se existir, null caso contrário
     */
    async checkSolicitacaoExistente(id_usuario: number, id_pet: number): Promise<SolicitacaoAdocao | null> {
        try {
            const solicitacoes = await sql<SolicitacaoAdocao[]>`
                SELECT * FROM solicitacao_adocao
                WHERE id_usuario = ${id_usuario}
                AND id_pet = ${id_pet}
                AND status IN ('PENDENTE', 'APROVADA')
            `;
            
            if (solicitacoes.length > 0) {
                console.log(`📋 [DAO - checkSolicitacaoExistente] Solicitação encontrada para usuário ${id_usuario} e pet ${id_pet}: ${solicitacoes[0].status}`);
                return solicitacoes[0];
            }
            
            console.log(`✅ [DAO - checkSolicitacaoExistente] Nenhuma solicitação ativa encontrada para usuário ${id_usuario} e pet ${id_pet}`);
            return null;
        } catch (error) {
            console.error("Erro ao verificar solicitação existente:", error);
            throw error;
        }
    }

    async insertSolicitarAdocao(id_usuario: number, id_pet: number): Promise<SolicitacaoAdocao> {

        try {
            const [solicitacao] = await sql<SolicitacaoAdocao[]>`
        INSERT INTO solicitacao_adocao (
          id_usuario,
          id_pet,
          status,
          data_solicitacao
        ) VALUES (
          ${id_usuario},
          ${id_pet},
          'PENDENTE',
          NOW()
        )
        RETURNING *
      `;

            return solicitacao;

        } catch (error: any) {
            console.error("=== DAO - ERRO AO INSERIR SOLICITAÇÃO DE ADOÇÃO ===");
            throw new Error(error.message);
        }
    }

}
