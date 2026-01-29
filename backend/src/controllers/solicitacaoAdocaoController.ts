import { Request, Response } from "express";
import { SolicitacaoAdocaoRN } from "../services/solicitacaoAdocaoService";

const solicitacaoAdocaoRN = new SolicitacaoAdocaoRN();

export class SolicitacaoAdocaoController {

    async getAllSolicitacoesAdocaesPendentes(req: Request, res: Response) {
        try {
            const solicitacoes = await solicitacaoAdocaoRN.getAllSolicitacoesPendentes();
            
            res.status(200).json({ dados: solicitacoes });
        } catch (error: any) {
            console.error("=== ERRO CAPTURADO NO CONTROLLER ===");
            console.error("Erro completo:", error);
            res.status(500).json({ erro: error.message || "Erro interno no servidor" });
        }
    }

    async postSolicitacaoAdocao(req: Request, res: Response) {
        try {
    
            const { id_pet } = req.body;
            const { id_usuario } = req.user!;

            const resultado = await solicitacaoAdocaoRN.insertSolicitacaoAdocao(Number(id_pet), id_usuario);
            res.status(201).json({ mensagem: "Solicitação enviada com sucesso", dados: resultado });
            
        } catch (error: any) {
            console.error("=== ERRO CAPTURADO NO CONTROLLER ===");
            console.error("Erro completo:", error);
            res.status(500).json({ erro: error.message || "Erro interno no servidor" });
           
        }
    }

    async postAprovarSolicitacaoAdocao(req: Request, res: Response) {
        try {
            const { id_solicitacao } = req.body;
            const { id_usuario } = req.user!;
            await solicitacaoAdocaoRN.aprovarSolicitacaoAdocao(Number(id_solicitacao), id_usuario);
            res.status(200).json({ mensagem: "Solicitação aprovada com sucesso" });
        } catch (error: any) {
            console.error("=== ERRO CAPTURADO NO CONTROLLER ===");
            console.error("Erro completo:", error);
            res.status(500).json({ erro: error.message || "Erro interno no servidor" });
        }
    }

    async postReprovarSolicitacaoAdocao(req: Request, res: Response) {
        try {
            const { id_solicitacao } = req.body;
            const { id_usuario } = req.user!;
            await solicitacaoAdocaoRN.reprovarSolicitacaoAdocao(Number(id_solicitacao), id_usuario);
            res.status(200).json({ mensagem: "Solicitação reprovada com sucesso" });
        } catch (error: any) {
            console.error("=== ERRO CAPTURADO NO CONTROLLER ===");
            console.error("Erro completo:", error);
            res.status(500).json({ erro: error.message || "Erro interno no servidor" });
        }
    }
}