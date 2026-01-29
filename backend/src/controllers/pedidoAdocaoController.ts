import { Request, Response } from 'express'
import { PedidoAdocaoRN } from '../services/pedidoAdocaoServices';
import { SolicitacaoAdocao } from '../models/solicitacaoAdocaoModel';
import { PedidoAdocaoCompleto } from '../models/pedidoAdocao';


export class PedidoAdocaoController {
    public pedidoAdocaoRN = new PedidoAdocaoRN();
    async getPedidosAdocao(req: Request, res: Response) {
        console.log("Obtendo pedidos de adoção...");
        let pedidos = await this.pedidoAdocaoRN.getPedidosAdocao();
        console.log("Pedidos de adoção obtidos:", pedidos);
        if (!pedidos ) {
            res.status(404).json({ message: "Nenhum pedido de adoção encontrado." });
            return;
        }
        const results: PedidoAdocaoCompleto[] = pedidos;
        res.json(results); // Envia os resultados paginados
     
    }

    async aprovarPedidoAdocao(req: Request, res: Response) {
        const resultado = req.body as SolicitacaoAdocao;

        if (!resultado.id) {
            res.status(400).json({ message: "ID do pedido é obrigatório." });
            return;
        }

        await this.pedidoAdocaoRN.resultadoPedidoAdocao(resultado);
        res.json({ message: `Pedido de adoção ID ${resultado.id} foi concluído!` });
   
    }
}

