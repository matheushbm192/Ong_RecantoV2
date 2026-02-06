import { atualizarInterfaceUsuario } from "./main";
import authService from "./services/authService";

console.log('[LOGIN.TS] Arquivo carregado');

atualizarInterfaceUsuario();
document.addEventListener('DOMContentLoaded', () => {
        const logoutLink = document.querySelector('[data-action="logout"]');

        logoutLink?.addEventListener('click', () => {
            authService.logout();
        });
    });
export function initializeLogin() {
  setTimeout(() => {
    const form = document.getElementById('login-form') as HTMLFormElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const senhaInput = document.getElementById('senha') as HTMLInputElement;

    const mensagemErro = document.getElementById('mensagemErro') as HTMLElement;

    if (!form || !emailInput || !senhaInput) {
      console.error('Formulário ou campos não encontrados na tela de login.');
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = emailInput.value.trim();
      const senha = senhaInput.value.trim();

      if (!email || !senha) {
        if (mensagemErro) {
          mensagemErro.classList.remove('hidden');
          mensagemErro.querySelector('p')!.textContent = 'Por favor, preencha todos os campos.';
          setTimeout(() => mensagemErro.classList.add('hidden'), 3000);
        }
        return;
      }

      const mensagemSucesso = document.getElementById('mensagem') as HTMLElement;

      try {
        await authService.login(email, senha);

        if (mensagemErro) mensagemErro.classList.add('hidden');

        if (mensagemSucesso) {
          mensagemSucesso.classList.remove('hidden');
          mensagemSucesso.querySelector('p')!.textContent = 'Login realizado com sucesso!';
          setTimeout(() => mensagemSucesso.classList.add('hidden'), 3000);
        }
      } catch (error) {
        console.error('Erro no login:', error);
        if (mensagemSucesso) mensagemSucesso.classList.add('hidden');
        if (mensagemErro) {
          mensagemErro.classList.remove('hidden');
          mensagemErro.querySelector('p')!.textContent = 'Erro ao fazer login. Verifique seu e-mail e senha.';
          setTimeout(() => mensagemErro.classList.add('hidden'), 3000);
        }
      }

    });
  }, 100);
}
// Chamar a função quando a página está pronta
console.log('[LOGIN.TS] Inicializando formulário de login');
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLogin);
} else {
  initializeLogin();
}