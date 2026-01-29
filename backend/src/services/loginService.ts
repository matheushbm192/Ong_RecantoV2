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

    async autenticarUsuario(email: string, senha: string): Promise<string> {
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
        
        // possivelmente alterar para user
        const payload = {
            email: user.email,
            tipo_usuario: user.tipoUsuario
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

        return token     
    }
}