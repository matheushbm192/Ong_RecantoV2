import { Request, Response, NextFunction } from 'express';
import { config } from '../config/environment';

export function autorizarTipoUsuario(...tiposPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    console.log('\n🚀🚀🚀 [MIDDLEWARE autorizarTipoUsuario] FOI CHAMADO! 🚀🚀🚀');
    console.log(`📍 ${req.method} ${req.path}`);
    console.log('👤 Tipos permitidos:', tiposPermitidos);
    
    if (!req.user) {
      console.error('❌ [autorizarTipoUsuario] req.user não existe!');
      res.status(401).json({ erro: 'Usuário não autenticado' });
      return;
    }
    
    const { tipo_usuario } = req.user;
    console.log('👥 tipo_usuario do token:', tipo_usuario);

    const temPermissao = tiposPermitidos.includes(tipo_usuario);
    console.log(`🔍 Comparando: "${tipo_usuario}" em [${tiposPermitidos.join(', ')}]? ${temPermissao}`);

    if (!temPermissao) {
      console.error(`❌ [autorizarTipoUsuario] Acesso negado! Tipo ${tipo_usuario} não autorizado`);
      res.status(403).json({ 
        erro: `Acesso negado. Tipo ${tipo_usuario} não autorizado. Permitidos: ${tiposPermitidos.join(', ')}` 
      });
      return;  
    }

    console.log('✅ [autorizarTipoUsuario] Acesso permitido!');
    console.log('✅ [autorizarTipoUsuario] Chamando next()...\n');
    next();
  };
}