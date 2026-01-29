import { getApiBaseUrl } from '../../config/env.config';

// Funções utilitárias reutilizáveis

/**
 * Fetch com tratamento de erro padrão
 */
export async function fetchAPI(url: string, options: RequestInit = {}): Promise<any> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

/**
 * Constrói URL completa da API
 */
export function buildApiUrl(endpoint: string | null | undefined): string {
  const baseUrl = getApiBaseUrl();
  if (endpoint === null || endpoint === undefined) {
    return baseUrl;
  }
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
}

/**
 * Validar email
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Formatar data
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}

/**
 * Mostrar notificação
 */
export function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease-in-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
