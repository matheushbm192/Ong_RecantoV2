
import { Router, Request, Response } from 'express';
import multer from 'multer';

import { MulterRequest } from '../interfaceConfig/MulterRequest';
import { UsuarioComumCTR } from '../controllers/usuarioComumController';
import { UsuarioAdministradorCTR } from '../controllers/usuarioAdministradorController';
import { UsuarioVoluntarioCTR } from '../controllers/usuarioVoluntarioController';
import { autorizarTipoUsuario } from '../utils/nivelAutorarizacao';
import { autenticarToken } from '../utils/auth';


const usuarioCTR = new UsuarioComumCTR();
const usuarioAdministradorCTR = new UsuarioAdministradorCTR();
const usuarioVoluntarioCTR = new UsuarioVoluntarioCTR();

const router = Router();

const upload = multer(); // Para processar multipart/form-data sem arquivos

// Log no início de todas as requisições para /usuarios
router.use((req, res, next) => {
    console.log(`\n🚀 [ROTA /USUARIOS] ${req.method} ${req.path}`);
    console.log(`⏰ ${new Date().toISOString()}`);
    console.log(`🔐 Authorization: ${req.headers.authorization ? 'PRESENTE' : 'AUSENTE'}`);
    next();
});

// Rota POST: cadastra novo usuário comum
router.post('/usuarioPost',
    upload.none(), 
    usuarioCTR.postUsuario
);

// Rota POST: cadastra novo usuário administrador
router.post('/usuarioAdministradorPost',
    (req, res, next) => {
        console.log(`\n📍 [ROTA /usuarioAdministradorPost ESPECÍFICA] Chegou!`);
        console.log(`📦 Body: ${JSON.stringify(req.body).substring(0, 100)}...`);
        next();
    },
    (req, res, next) => {
        try {
            console.log('\n⏳ [ANTES de autenticarToken]');
            next();
        } catch (err) {
            console.error('❌ Erro antes de autenticarToken:', err);
            next(err);
        }
    },
    autenticarToken,
    (req, res, next) => {
        try {
            console.log('\n⏳ [DEPOIS de autenticarToken, ANTES de autorizarTipoUsuario]');
            next();
        } catch (err) {
            console.error('❌ Erro depois de autenticarToken:', err);
            next(err);
        }
    },
    autorizarTipoUsuario('ADMINISTRADOR'),
    (req, res, next) => {
        try {
            console.log('\n⏳ [DEPOIS de autorizarTipoUsuario, ANTES de upload.none()]');
            next();
        } catch (err) {
            console.error('❌ Erro depois de autorizarTipoUsuario:', err);
            next(err);
        }
    },
    upload.none(), 
    (req, res, next) => {
        try {
            console.log('\n⏳ [DEPOIS de upload.none(), ANTES de controller]');
            next();
        } catch (err) {
            console.error('❌ Erro depois de upload.none():', err);
            next(err);
        }
    },
    usuarioAdministradorCTR.postUsuario
);

// Rota POST: cadastra novo voluntário
router.post('/usuarioVoluntarioPost',
    autenticarToken,  
    autorizarTipoUsuario('ADMINISTRADOR'),
    upload.none(),
    usuarioVoluntarioCTR.postUsuario
);

export default router;

