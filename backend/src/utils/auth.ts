import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

export function autenticarToken(req: Request, res: Response, next: NextFunction): void {
  console.log('\n🚀🚀🚀 [MIDDLEWARE autenticarToken] FOI CHAMADO! 🚀🚀🚀');
  console.log(`📍 ${req.method} ${req.path}`);
  
  const authHeader = req.headers['authorization'];
  console.log('🔑 Authorization header:', authHeader ? 'PRESENTE' : 'AUSENTE');
  
  const token = authHeader?.split(' ')[1]; 

  if (!token) {
    console.error('❌ [autenticarToken] Token não fornecido!');
    res.status(401).json({ erro: 'Token não fornecido' });
    return;
  }

  try {
    console.log('✅ Token extraído, verificando JWT...');
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    
    console.log('✅ [autenticarToken] JWT válido!');
    console.log('[autenticarToken] Dados:', decoded);

    req.user = {
      id_usuario: decoded.id_usuario,
      email: decoded.email,
      tipo_usuario: decoded.tipo_usuario
    };
    
    console.log('✅ [autenticarToken] req.user setado:', req.user);
    console.log('✅ [autenticarToken] Chamando next()...\n');
    
    next();
  } catch (err: any) {
    console.error('❌ [autenticarToken] Erro ao validar JWT:', err.message);
    res.status(403).json({ erro: 'Token inválido' });
    return;
  }
}
