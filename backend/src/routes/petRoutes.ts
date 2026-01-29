import { Router, Request, Response } from 'express'
import { PetCTR } from '../controllers/petController';
import upload from '../storage/uploads';
import { autenticarToken } from '../utils/auth';
import { autorizarTipoUsuario } from '../utils/nivelAutorarizacao';

const petCTR = new PetCTR();
const router = Router()

router.get('/',
  petCTR.getAllPets
);
router.post('/animais-adotados-por-usuario',
    autenticarToken,
    petCTR.getAnimaisAdotadosPorUsuarioId
);

router.post(
  '/',
  autenticarToken,  
  autorizarTipoUsuario('ADMINISTRADOR', 'VOLUNTARIO'), 
  upload.single('foto'),
  petCTR.postPet
);

export default router
