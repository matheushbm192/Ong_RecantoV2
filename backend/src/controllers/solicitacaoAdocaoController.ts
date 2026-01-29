import { Request, Response } from "express";
import { SolicitacaoAdocaoRN } from "../services/solicitacaoAdocaoService";

const solicitacaoAdocaoRN = new SolicitacaoAdocaoRN();

export class SolicitacaoAdocaoController {
    async postSolicitacaoAdocao(req: Request, res: Response) {
        try {
    
            const { id_usuario, id_pet } = req.body;

            const resultado = await solicitacaoAdocaoRN.insertSolicitacaoAdocao(id_pet, id_usuario);
            res.status(201).json({ mensagem: "Solicitação enviada com sucesso", dados: resultado });
            
        } catch (error: any) {
            console.error("=== ERRO CAPTURADO NO CONTROLLER ===");
            console.error("Erro completo:", error);
            res.status(500).json({ erro: error.message || "Erro interno no servidor" });
           
        }
    }
}
