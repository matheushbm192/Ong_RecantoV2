import { Request, Response } from 'express'
import { AnimaisAdotadosRN } from "../services/animaisAdotadosService";
import { MulterRequest } from '../interfaceConfig/MulterRequest';

const animaisAdotadosRN = new AnimaisAdotadosRN();

export class AnimaisAdotadosCTR {
    async getAnimaisAdotadosByUsuarioId(req: MulterRequest, res: Response) {
        try {
            
            console.log("REQUEST CONTROLLER")
            console.log(req.body)

            console.log("ANIMAIS ADOTADOOOO")
            
            const idUsuario = req.body.idUsuario; 
            
            const animaisAdotados = await animaisAdotadosRN.selectAnimaisAdotadoByUsuarioId(idUsuario);
            console.log("CONTROLLER ANIMAIS ADOTADOS")
            console.log(animaisAdotados)
            res.status(200).json({ animaisAdotados });
           
        } catch (error: any) {
            console.error("Erro ao buscar animais:", error);
            res.status(500).json({ error: error.message });
        }
    }
}
