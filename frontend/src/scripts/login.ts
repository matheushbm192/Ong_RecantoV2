import { atualizarInterfaceUsuario } from "./main";
import { RotaLogin } from "./utils/rotaLogin";


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
      
      await RotaLogin.postLogin(email, senha);

    });
  }, 100);
}
