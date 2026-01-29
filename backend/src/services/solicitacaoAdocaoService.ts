import { SolicitacaoAdocaoDAO } from "../DAO/solicitacaoAdocaoDAO";
import { UsuarioDAO } from "../DAO/usuarioDAO";
import { SolicitacaoAdocao } from "../models/solicitacaoAdocaoModel";
import { PetDAO }  from "../DAO/petDAO";
import { Usuario } from "../models/usuarioModel";
import { Pet } from "../models/petModel";
export class SolicitacaoAdocaoRN {
    private solicitacaoAdocaoDAO: SolicitacaoAdocaoDAO;
    private usuarioDAO: UsuarioDAO;
    private petDAO: PetDAO ;
    constructor() {
        this.solicitacaoAdocaoDAO = new SolicitacaoAdocaoDAO();
        this.usuarioDAO = new UsuarioDAO();
        this.petDAO = new PetDAO();
    }

    async getAllSolicitacoesPendentes() {
        try {
            const resultado = await this.solicitacaoAdocaoDAO.getAllSolicitacoesPendentes();
            const solicitacaoList = [];
            let usuario: Usuario;
            let pet: Pet;
            for(const solicitacao of resultado){
                usuario = await this.usuarioDAO.selectUsuarioById(solicitacao.id_usuario);
                pet = await this.petDAO.selectPetById(solicitacao.id_pet);
                solicitacao.usuario = usuario;
                solicitacao.pet = pet;
                solicitacaoList.push(solicitacao);
            }
            return solicitacaoList;
        } catch (error) {
            console.error("=== ADOCAO RN - ERRO NO DAO ===");
            console.error("Erro capturado na SolicitacaoAdocaoRN:", error);
            throw error;
        }
    }

    async aprovarSolicitacaoAdocao(id_solicitacao: number, id_administrador: number) {

        try {
            await this.solicitacaoAdocaoDAO.aprovarSolicitacaoAdocao(id_solicitacao, id_administrador);
            console.log("=== ADOCAO APROVADA COM SUCESSO ===");
        } catch (error) {
            console.error("=== ADOCAO RN - ERRO NO DAO ===");
            console.error("Erro capturado na SolicitacaoAdocaoRN:", error);
            throw error;
        }   
    }

    async reprovarSolicitacaoAdocao(id_solicitacao: number, id_administrador: number) {
        
        try {   
            await this.solicitacaoAdocaoDAO.reprovarSolicitacaoAdocao(id_solicitacao, id_administrador);
            console.log("=== ADOCAO REPROVADA COM SUCESSO ===");
        } catch (error) {
            console.error("=== ADOCAO RN - ERRO NO DAO ===");
            console.error("Erro capturado na SolicitacaoAdocaoRN:", error);
            throw error;
        }
    }

    async insertSolicitacaoAdocao(id_pet: number, id_usuario: number) {
        if (!id_pet) {
            throw new Error("Erro no ID do Pet");
        }

        if (!id_usuario) {
            throw new Error("Erro no ID do Usuario");
        }

        try {
            const resultado = await this.solicitacaoAdocaoDAO.insertSolicitarAdocao(id_usuario, id_pet);
            console.log("=== ADOCAO INSERIDA COM SUCESSO ===");
            return resultado;
        } catch (error) {
            console.error("=== ADOCAO RN - ERRO NO DAO ===");
            console.error("Erro capturado na SolicitacaoAdocaoRN:", error);
            throw error;
        }
    }
}
