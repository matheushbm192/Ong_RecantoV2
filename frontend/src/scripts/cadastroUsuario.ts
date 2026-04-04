import { atualizarInterfaceUsuario } from "./main";
import { Usuario } from "./models/usuarioModel";
import { buildApiUrl } from "./utils/api";
import authService from "./services/authService";
import { FormValidator } from "./utils/formValidator";
import { CEPAutocompleter } from "./utils/cepAutocompleter";

atualizarInterfaceUsuario();

document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.querySelector('[data-action="logout"]');
    logoutLink?.addEventListener('click', () => {
        authService.logout();
    });
});

// Expor globalmente para compatibilidade com onkeyup
(window as any).formatarCEP = (event: Event) => CEPAutocompleter.formatCEP(event);

/**
 * Lida com o envio do formulário de cadastro de usuário comum
 */
async function handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const button = document.getElementById('cadastrarUsuario') as HTMLButtonElement;

    if (!button || button.disabled) {
        return;
    }

    button.disabled = true;
    button.textContent = 'Enviando...';

    try {
        const formData = new FormData(form);

        const usuario: Usuario = {
            nome: formData.get('nome') as string,
            sobrenome: formData.get('sobrenome') as string,
            email: formData.get('email') as string,
            senha: formData.get('senha') as string,
            dataNascimento: formData.get('dataNascimento') as string,
            cpf: formData.get('cpf') as string,
            telefone: formData.get('telefone') as string,
            tipo_usuario: "COMUM",
            escolaridade: formData.get('escolaridade') as string,
            possuiPet: FormValidator.toBoolean(formData.get('possuiPet') as string, 'sim'),
            logradouro: (formData.get('logradouro') as string) || undefined,
            numero: (formData.get('numero') as string) || undefined,
            complemento: (formData.get('complemento') as string) || undefined,
            bairro: (formData.get('bairro') as string) || undefined,
            cidade: (formData.get('cidade') as string) || undefined,
            estado: (formData.get('estado') as string) || undefined,
            contribuir_ong: FormValidator.toBoolean(formData.get('contribuirOng') as string, 'sim'),
            deseja_adotar: FormValidator.toBoolean(formData.get('desejaAdotar') as string, 'sim'),
        };

        // Validações
        const validationRules = [
            { field: 'nome', message: 'Por favor, preencha o nome.' },
            { field: 'sobrenome', message: 'Por favor, preencha o sobrenome.' },
            { field: 'email', message: 'Por favor, preencha o e-mail.' },
            { field: 'senha', message: 'Por favor, preencha a senha.' },
            { field: 'dataNascimento', message: 'Por favor, preencha a data de nascimento.' },
            { field: 'cpf', message: 'Por favor, preencha o CPF.' },
            { field: 'telefone', message: 'Por favor, preencha o telefone.' },
            { field: 'escolaridade', message: 'Por favor, selecione sua formação.' },
        ];

        if (!FormValidator.validateRequired(usuario, validationRules)) {
            return;
        }

        const response = await fetch(buildApiUrl('/usuarios/usuarioPost'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authService.getToken()}`,
            },
            body: JSON.stringify(usuario),
        });

        if (!response.ok) {
            throw new Error('Erro no envio');
        }

        const mensagem = document.getElementById('mensagem');
        if (mensagem) {
            mensagem.classList.remove('hidden');
            setTimeout(() => {
                mensagem.classList.add('hidden');
            }, 3000);
        }

        form.reset();
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        const mensagemErro = document.getElementById('mensagemErro');
        if (mensagemErro) {
            mensagemErro.classList.remove('hidden');
            setTimeout(() => {
                mensagemErro.classList.add('hidden');
            }, 3000);
        }
    } finally {
        button.disabled = false;
        button.textContent = 'Cadastrar Usuário';
    }
}

/**
 * Inicializa a página de cadastro de usuário comum
 */
export function initializeCadastroUsuarioComumPage(): void {
    const form = document.getElementById('formulario-cadastro-usuario-comum') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    CEPAutocompleter.initialize('cep', {
        logradouroId: 'logradouro',
        bairroId: 'bairro',
        cidadeId: 'cidade',
        estadoId: 'estado',
        numeroId: 'numero',
    });
}

window.addEventListener('DOMContentLoaded', initializeCadastroUsuarioComumPage);
