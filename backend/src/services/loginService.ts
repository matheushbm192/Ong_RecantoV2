import { LoginDAO } from "../DAO/loginDAO";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/environment";
import { Usuario } from "../models/usuarioModel";
import { loggerMiddleware } from "../middlewares/loggerMiddleware";

export class LoginRN {
    private loginDAO: LoginDAO;

    constructor() {
        this.loginDAO = new LoginDAO();
    }

    /** Autentica usuário e retorna objeto com token e dados públicos do usuário */
    async autenticarUsuario(email: string, senha: string): Promise<{ token: string, user: { id_usuario: number, email: string, tipo_usuario: string } }> {
        const user: Usuario = await this.loginDAO.selectUserByEmail(email)

        if (config.nodeEnv === 'development') {
            console.log("USER RETORNADO DO BANCO: ", user)
        }
        
        // alterar para comparacao entre senha digitada e senha criptografada no banco
        if(!user) {
            throw new Error("Usuario não encontrado")
        }

        if(user.senha !== senha) {
            throw new Error("Senha incorreta")
        }
        
        // Construir payload e objeto público do usuário com campos esperados pelo frontend
        const payload = {
            id_usuario: user.id,
            email: user.email,
            tipo_usuario: user.tipo_usuario
        }

        if (config.nodeEnv === 'development') {
            console.log("*********RN*********")
            console.log("PAYLOAD!!!")
            console.log(payload)
        }
        
        const signOptions: SignOptions = {
            expiresIn: config.jwtExpiration
        };
        
        const token = jwt.sign(payload, config.jwtSecret, signOptions)
        
        if (config.nodeEnv === 'development') {
            console.log("token: " + token)
            console.log("*********TOKEN DECODIFICADO*********")
            console.log(jwt.decode(token))
        }

        // Retornar objeto unificado com token e dados públicos do usuário
        const publicUser = {
            id_usuario: user.id,
            email: user.email,
            tipo_usuario: user.tipo_usuario
        }

        return { token, user: publicUser }     
    }
}