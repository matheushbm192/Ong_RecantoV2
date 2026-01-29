import { buildApiUrl } from './api';

export class RotaLogin {

    public static async postLogin(email: string, senha: string) {
        const mensagemSucesso = document.getElementById('mensagem') as HTMLElement;
        const mensagemErro = document.getElementById('mensagemErro') as HTMLElement;
        fetch(buildApiUrl('/api/login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        }).then(async (response) => {
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Falha ao fazer login');
            }

            const token = await response.json();
            localStorage.setItem('token', token);


            if (mensagemErro) mensagemErro.classList.add('hidden');

            if (mensagemSucesso) {
                mensagemSucesso.classList.remove('hidden');
                mensagemSucesso.querySelector('p')!.textContent = 'Login realizado com sucesso!';
                setTimeout(() => mensagemSucesso.classList.add('hidden'), 3000);
            }

        }).catch((error) => {
            console.error('Erro ao fazer login:', error);

            if (mensagemSucesso) mensagemSucesso.classList.add('hidden');
            if (mensagemErro) {
                mensagemErro.classList.remove('hidden');
                mensagemErro.querySelector('p')!.textContent = 'Erro ao fazer login. Verifique seu e-mail e senha.';
                setTimeout(() => mensagemErro.classList.add('hidden'), 3000);
            }
        });
    }
}