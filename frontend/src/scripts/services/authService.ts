// Serviço de autenticação
import { atualizarInterfaceUsuario } from '@scripts/main';
import { getApiBaseUrl } from '../../config/env.config';

export interface User {
  id_usuario: number;
  email: string;
  tipo_usuario: 'COMUM' | 'ADMINISTRADOR' | 'VOLUNTARIO';
}

class AuthService {
  private currentUser: User | null = null;
  private apiBaseUrl = getApiBaseUrl();

  /**
   * Fazer login
   */
  async login(email: string, senha: string): Promise<User> {
    try {
      const url = `${this.apiBaseUrl}/api/login`;
      console.log('[AuthService] Iniciando login...');
      console.log('[AuthService] URL:', url);
      console.log('[AuthService] Email:', email);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          senha
        }),
      });

      console.log('[AuthService] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.log('[AuthService] Error response:', errorData);
        throw new Error('Falha ao fazer login: ' + errorData);
      }

      const data = await response.json();
      console.log('[AuthService] Login sucesso, dados:', data);

      this.currentUser = data.user;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      atualizarInterfaceUsuario();
      return data.user;
    } catch (error) {
      console.error('[AuthService] Erro no login:', error);
      throw error;
    }
  }

  /**
   * Fazer logout
   */
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    atualizarInterfaceUsuario()
  }

  /**
   * Obter usuário atual
   */
  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      return this.currentUser;
    }

    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    return JSON.parse(payloadJson);
  }
  /**
   * Verificar se está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Verificar se usuário tem permissão (tipo)
   */
  temPermissao(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.tipo_usuario) : false;
  }
}


export default new AuthService();
