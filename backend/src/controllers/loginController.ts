import { Request, Response } from 'express'
import { LoginRN } from "../services/loginService";

const loginRN = new LoginRN();

export class LoginCTR {
    loginHandler = async (req: Request, res: Response) => {
        const { email, senha } = req.body;

        try {
            const emailNormalizado = email?.trim();

            if (!emailNormalizado || !senha) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            const result = await loginRN.autenticarUsuario(emailNormalizado, senha);
            
            if (process.env.NODE_ENV === 'development') {
                console.log("CONTROLLER LOGIN - Resultado:", result);
            }

            // result já é { token, user } vindo do service
            return res.status(200).json(result);
        } catch (error: any) {
            const statusCode = error.message.includes('não encontrado') || error.message.includes('Senha') ? 401 : 500;
            return res.status(statusCode).json({ error: error.message });
        }
    }
}