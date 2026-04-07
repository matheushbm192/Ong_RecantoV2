import express from 'express';
import path from 'path';

// Importar configurações do ambiente
import { config } from './config/environment';

// Importar middlewares
import { corsMiddleware } from './middlewares/corsMiddleware';
import { setupStaticFiles } from './middlewares/staticFilesMiddleware';
import { setupBodyParser } from './middlewares/bodyParserMiddleware';
import { loggerMiddleware } from './middlewares/loggerMiddleware';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';

// Importar rotas
import rotas from './routes/rotas';

const app = express();
const PORT = config.port;

// --- Configurar Middlewares ---
app.use((req, res, next) => {
    console.log('\n🌐 ===== REQUISIÇÃO CHEGOU NO SERVIDOR =====');
    console.log(`📍 ${req.method} ${req.path}`);
    console.log(`⏰ ${new Date().toISOString()}`);
    console.log(`🔐 Authorization: ${req.headers.authorization ? 'PRESENTE' : 'AUSENTE'}`);
    console.log(`📦 Content-Type: ${req.headers['content-type']}`);
    console.log('='.repeat(50));
    next();
});

app.use(corsMiddleware);
setupStaticFiles(app);
setupBodyParser(app);

// Log após body parser
app.use((req, res, next) => {
    console.log('✅ [APÓS BODY PARSER] req.body está disponível');
    const bodyStr = req.body ? JSON.stringify(req.body).substring(0, 100) : 'undefined';
    console.log(`📦 Body: ${bodyStr}...`);
    next();
});

app.use(loggerMiddleware);
//http://localhost:3000/api/pets
// Log antes de rotear para /api
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        console.log(`🎯 [ANTES DE /api] ${req.method} ${req.path}`);
    }
    next();
});

// --- Definição de Rotas ---
app.use('/api', rotas);

// --- Middleware de Erro Global---
app.use(errorHandlerMiddleware);

// --- Iniciar o Servidor ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================`);
    console.log(`[${config.nodeEnv.toUpperCase()}] Servidor ONG iniciado com sucesso!`);
    console.log(`======================================`);
    console.log(`URL Base: ${config.apiBaseUrl}`);
    console.log(`Porta: ${PORT}`);
    console.log(`Ambiente: ${config.nodeEnv}`);
    console.log(`CORS Origins: ${config.corsOrigins.join(', ')}`);
    console.log(`Log Level: ${config.logLevel}`);
    console.log(`======================================\n`);
});


export default app;