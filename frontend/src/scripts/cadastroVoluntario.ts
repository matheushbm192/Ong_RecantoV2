import { atualizarInterfaceUsuario } from "./main";
import { UsuarioVoluntario } from "./models/usuarioVoluntarioModel";
import { buildApiUrl } from "./utils/api";
import authService from "./services/authService";
import { FormValidator } from "./utils/formValidator";
import { PetFieldsManager } from "./utils/petFieldsManager";
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

// Gerenciador de campos de pets
const petFieldsManager = new PetFieldsManager(
    {
        yesInputId: 'temPetSim',
        noInputId: 'naoTemPet',
        quantityInputId: 'quantAnimais',
        quantityContainerId: 'quantAnimaisDiv',
        speciesContainerId: 'especiesPetsContainer',
        speciesSelectorName: 'especiePet',
    },
    [
        { value: '', text: 'Selecione a espécie' },
        { value: 'cachorro', text: 'Cachorro' },
        { value: 'gato', text: 'Gato' },
        { value: 'passarinho', text: 'Passarinho' },
        { value: 'hamster', text: 'Hamster' },
        { value: 'coelho', text: 'Coelho' },
        { value: 'outro', text: 'Outro' },
    ]
);

/**
 * Lida com o envio do formulário de cadastro de voluntário
 */
async function handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const button = document.getElementById('cadastrarVoluntario') as HTMLButtonElement;

    if (!button || button.disabled) {
        return;
    }

    button.disabled = true;
    button.textContent = 'Enviando...';

    try {
        const formData = new FormData(form);

        const voluntario: UsuarioVoluntario = {
            tipo_usuario: "VOLUNTARIO",
            nome: formData.get('nome') as string,
            sobrenome: formData.get('sobrenome') as string,
            email: formData.get('email') as string,
            senha: formData.get('senha') as string,
            dataNascimento: formData.get('dataNascimento') as string,
            cpf: formData.get('cpf') as string,
            logradouro: (formData.get('logradouro') as string) || undefined,
            numero: (formData.get('numero') as string) || undefined,
            complemento: (formData.get('complemento') as string) || undefined,
            bairro: (formData.get('bairro') as string) || undefined,
            cidade: (formData.get('cidade') as string) || undefined,
            estado: (formData.get('estado') as string) || undefined,
            telefone: formData.get('telefone') as string,
            escolaridade: (formData.get('escolaridade') as string) || undefined,
            possuiPet: FormValidator.toBoolean(formData.get('temPet') as string, 'sim'),
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
        ];

        if (!FormValidator.validateRequired(voluntario, validationRules)) {
            return;
        }

        const response = await fetch(buildApiUrl('/usuario/usuarioVoluntarioPost'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authService.getToken()}`,
            },
            body: JSON.stringify(voluntario),
        });

        if (!response.ok) {
            throw new Error('Erro no envio');
        }

        const mensagem = document.getElementById('mensagem-sucesso');
        if (mensagem) {
            mensagem.classList.remove('hidden');
            setTimeout(() => {
                mensagem.classList.add('hidden');
            }, 3000);
        }

        form.reset();
    } catch (error) {
        console.error('Erro ao cadastrar voluntário:', error);
        const mensagemErro = document.getElementById('mensagemErro');
        if (mensagemErro) {
            mensagemErro.classList.remove('hidden');
            setTimeout(() => {
                mensagemErro.classList.add('hidden');
            }, 3000);
        }
    } finally {
        button.disabled = false;
        button.textContent = 'Enviar Cadastro';
    }
}

/**
 * Inicializa a página de cadastro de voluntário
 */
export function initializeCadastroVoluntarioPage(): void {
    const form = document.getElementById('userForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    petFieldsManager.initialize();

    CEPAutocompleter.initialize('cep', {
        logradouroId: 'logradouro',
        bairroId: 'bairro',
        cidadeId: 'cidade',
        estadoId: 'estado',
        numeroId: 'numero',
    });
}

window.addEventListener('DOMContentLoaded', initializeCadastroVoluntarioPage);
