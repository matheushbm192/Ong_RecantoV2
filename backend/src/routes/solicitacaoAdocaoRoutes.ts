import { Router } from 'express';
import { SolicitacaoAdocaoController } from '../controllers/solicitacaoAdocaoController';
import { autenticarToken } from '../utils/auth';
import { autorizarTipoUsuario } from '../utils/nivelAutorarizacao';

const solicitacaoAdocaoController = new SolicitacaoAdocaoController();
const router = Router();


// router.post('/',
//     autenticarToken,
//     solicitacaoAdocaoController.postSolicitacaoAdocao
// );

router.get('/',
    autenticarToken,
    autorizarTipoUsuario("ADMINISTRADOR","VOLUNTARIO"),
    solicitacaoAdocaoController.getAllSolicitacoesAdocaesPendentes
);

router.post('/aprovar',
    autenticarToken,
    autorizarTipoUsuario("ADMINISTRADOR","VOLUNTARIO"),
    solicitacaoAdocaoController.postAprovarSolicitacaoAdocao
);

router.post('/reprovar',
    autenticarToken,
    autorizarTipoUsuario("ADMINISTRADOR","VOLUNTARIO"),
    solicitacaoAdocaoController.postReprovarSolicitacaoAdocao
);

export default router;