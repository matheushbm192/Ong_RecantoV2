// Serviço de autenticação
import { getApiBaseUrl } from '../../config/env.config';

export interface User {
 
  email: string;
  tipoUsuario: 'COMUM' | 'ADMINISTRADOR' | 'VOLUNTARIO';
}

class AuthService {
  private currentUser: User | null = null;
  private apiBaseUrl = getApiBaseUrl();

  /**
   * Fazer login
   */
  async login(email: string, senha: string): Promise<User> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          senha 
          }),
      });

      if (!response.ok) {
        throw new Error('Falha ao fazer login');
      }

      const data = await response.json();

      this.currentUser = data.user;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      console.error('Erro no login:', error);
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
    return user ? roles.includes(user.tipoUsuario) : false;
  }
}


export default new AuthService();
