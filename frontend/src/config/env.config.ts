/**
 * Configuração centralizada para diferentes ambientes
 * Desenvolvimento, Staging e Produção
 */

interface EnvironmentConfig {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
}

// URLs configuradas via webpack DefinePlugin a partir dos arquivos .env
const configs: Record<string, EnvironmentConfig> = {
  development: {
    apiBaseUrl: 'http://localhost:3000/api',
    environment: 'development',
    debug: true,
  },
  staging: {
    // ✅ Injetado pelo webpack a partir de .env.staging
    apiBaseUrl: process.env.REACT_APP_API_URL_STAGING || 'https://api-staging.suaong.com.br',
    environment: 'staging',
    debug: true,
  },
  production: {
    // ✅ Injetado pelo webpack a partir de .env.production
    apiBaseUrl: process.env.REACT_APP_API_URL_PRODUCTION || 'https://api.suaong.com.br',
    environment: 'production',
    debug: false,
  },
};

/**
 * Detecta o ambiente baseado em NODE_ENV injetado pelo webpack
 */
function getEnvironment(): string {
  // ✅ process.env.NODE_ENV é injetado pelo webpack.DefinePlugin
  const env = process.env.NODE_ENV;

  console.log(`🔧 [ENV CONFIG] Environment detectado: ${env}`);

  if (env === 'production') {
    return 'production';
  }

  if (env === 'staging') {
    return 'staging';
  }

  // Padrão é desenvolvimento
  return 'development';
}

/**
 * Obtém a configuração do ambiente atual
 */
export function getConfig(): EnvironmentConfig {
  const environment = getEnvironment();
  const config = configs[environment];

  if (!config) {
    console.warn(
      ` Ambiente "${environment}" não encontrado. Usando configuração padrão (development)`
    );
    return configs.development;
  }

  if (config.debug) {
    console.log(`[CONFIG] Ambiente: ${environment}`);
    console.log(`[CONFIG] API Base URL: ${config.apiBaseUrl}`);
  }

  return config;
}

/**
 * Obtém apenas a URL base da API
 */
export function getApiBaseUrl(): string {
  return getConfig().apiBaseUrl;
}

/**
 * Obtém o ambiente atual
 */
export function getCurrentEnvironment(): string {
  return getConfig().environment;
}

/**
 * Verifica se está em modo debug
 */
export function isDebugMode(): boolean {
  return getConfig().debug;
}

// Export da configuração padrão
export default getConfig();
