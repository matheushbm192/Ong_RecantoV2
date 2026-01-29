// pedidosAdocaoRoutes.ts
import { Router, Request, Response } from 'express'
import { PedidoAdocaoController } from "../controllers/pedidoAdocaoController";
import { autenticarToken } from '../utils/auth';
import { autorizarTipoUsuario } from '../utils/nivelAutorarizacao';

const router = Router();

const pedidoAdocao = new PedidoAdocaoController();

router.get("/", 
    autenticarToken,
    autorizarTipoUsuario("ADMINISTRADOR"),
    pedidoAdocao.getPedidosAdocao);

router.post("/aprovar",
    autenticarToken,
    autorizarTipoUsuario("ADMINISTRADOR"),
    pedidoAdocao.aprovarPedidoAdocao
);

export default router;