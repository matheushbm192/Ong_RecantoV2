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
app.use(corsMiddleware);
setupStaticFiles(app);
setupBodyParser(app);
app.use(loggerMiddleware);
//http://localhost:3000/api/pets
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