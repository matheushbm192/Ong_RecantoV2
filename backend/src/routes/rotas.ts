// routes/index.ts
import { Router } from 'express';
import petRoutes from './petRoutes';
import loginRoutes from './loginRoutes';
import usuarioRoutes from './usuarioRoutes';
import solicitacaoAdocaoRoutes from './solicitacaoAdocaoRoutes';


const router = Router();

// Definição centralizada de todas as rotas da API
router.use('/pets', petRoutes);
router.use('/login', loginRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/solicitar-adocao', solicitacaoAdocaoRoutes);


// Rota padrão da API
router.get('/', (req, res) => {
  res.json({
    message: 'API da ONG Recanto dos Animais',
    version: '1.0.0',
    endpoints: {
      pets: '/api/pets',
      login: '/api/login',
      usuarios: '/api/usuarios',
      pedidos: '/api/pedidos-adocao',
      animaisAdotados: '/api/animais-adotados',
      solicitarAdocao: '/api/solicitar-adocao'
    }
  });
});

export default router;