import express from 'express';
import path from 'path';
import { config } from '../config/environment';

/**
 * Middleware para servir arquivos estáticos (imagens e uploads)
 */
export function setupStaticFiles(app: express.Application) {
  const imagensPath = path.join(__dirname, '../../', config.uploadsDir);

  // Servir uploads na raiz (para compatibilidade)
  app.use('/uploads', express.static(config.uploadsDir));

  // Servir uploads também em /api/uploads (para chamadas via buildApiUrl)
  app.use('/api/uploads', express.static(config.uploadsDir));

  // Servir imagens estáticas
  app.use('/imagens', express.static(imagensPath));

  console.log(`[${config.nodeEnv.toUpperCase()}] Servindo imagens estáticas de: ${imagensPath} em /imagens`);
  console.log(`[${config.nodeEnv.toUpperCase()}] Servindo uploads de: ${config.uploadsDir}/ em /uploads e /api/uploads`);
}
