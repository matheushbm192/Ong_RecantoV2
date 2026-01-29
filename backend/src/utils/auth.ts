import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

export function autenticarToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; 

  // Early return sem resposta direta
  if (!token) {
    res.status(401).json({ erro: 'Token não fornecido' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    
    if (config.nodeEnv === 'development') {
      console.log("DECODED TOKEN", decoded);
    }

    req.user = {
      email: decoded.email,
      tipoUsuario: decoded.tipoUsuario
    };
    
    next();
  } catch (err) {
    res.status(403).json({ erro: 'Token inválido' });
    return;
  }
}
