import { atualizarInterfaceUsuario } from "./main";
import { UsuarioAdministrador } from "./models/usuarioAdministradorModel";
import { buildApiUrl } from "./utils/api";
import authService from "./services/authService";
import { FormValidator } from "./utils/formValidator";
import { CEPAutocompleter } from "./utils/cepAutocompleter";
import { PetFieldsManager } from "./utils/petFieldsManager";

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
        speciesSelectorName: 'especiesPets[]',
    },
    [
        { value: '', text: 'Selecione uma espécie' },
        { value: 'cachorro', text: 'Cachorro' },
        { value: 'gato', text: 'Gato' },
        { value: 'passaro', text: 'Pássaro' },
        { value: 'peixe', text: 'Peixe' },
        { value: 'roedor', text: 'Roedor' },
        { value: 'outro', text: 'Outro' },
    ]
);

/**
 * Lida com o envio do formulário de cadastro de administrador
 */
async function handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const button = form.querySelector('button[type="submit"]') as HTMLButtonElement;

    if (button.disabled) {
        return;
    }

    button.disabled = true;
    button.textContent = 'Enviando...';

    try {
        const formData = new FormData(form);

        const adm: UsuarioAdministrador = {
            tipo_usuario: "ADMINISTRADOR",
            nome: formData.get('nome') as string,
            sobrenome: formData.get('sobrenome') as string,
            email: formData.get('email') as string,
            senha: formData.get('senha') as string,
            dataNascimento: formData.get('dataNascimento') as string,
            cpf: formData.get('cpf') as string,
            logradouro: formData.get('logradouro') as string,
            numero: (formData.get('numero') as string) || undefined,
            complemento: (formData.get('complemento') as string) || undefined,
            bairro: formData.get('bairro') as string,
            cidade: formData.get('cidade') as string,
            estado: formData.get('estado') as string,
            telefone: formData.get('telefone') as string,
            escolaridade: formData.get('escolaridade') as string,
            possuiPet: FormValidator.toBoolean(formData.get('temPet') as string),
            funcao: formData.get('funcao') as string,
            contribuir_ong: FormValidator.toBoolean(formData.get('contribuirOng') as string),
            deseja_adotar: FormValidator.toBoolean(formData.get('desejaAdotar') as string),
        };

        // Validações
        const validationRules = [
            { field: 'nome', message: 'Preencha o nome.' },
            { field: 'email', message: 'Preencha o e-mail.' },
            { field: 'senha', message: 'Preencha a senha.' },
            { field: 'dataNascimento', message: 'Preencha a data de nascimento.' },
            { field: 'cpf', message: 'Preencha o CPF.' },
            { field: 'telefone', message: 'Preencha o telefone.' },
        ];

        if (!FormValidator.validateRequired(adm, validationRules)) {
            return;
        }

        console.log("🚀 Enviando requisição para cadastrar administrador");
        console.log("📦 Dados sendo enviados:", JSON.stringify(adm, null, 2));

        const response = await fetch(buildApiUrl('/usuarios/usuarioAdministradorPost'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authService.getToken()}`,
            },
            body: JSON.stringify(adm),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error || 'Erro ao cadastrar administrador.');
            return;
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
        console.error("Erro ao cadastrar administrador:", error);
        const mensagemErro = document.getElementById('mensagemErro');
        if (mensagemErro) {
            mensagemErro.classList.remove('hidden');
            setTimeout(() => {
                mensagemErro.classList.add('hidden');
            }, 3000);
        }
    } finally {
        button.disabled = false;
        button.textContent = 'Cadastrar';
    }
}

/**
 * Inicializa a página de cadastro de administrador
 */
export function inicializarCadastroAdm(): void {
    // 🔍 DEBUG: Verifica o token JWT armazenado
    const token = authService.getToken();
    if (token) {
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            console.log('🔑 Token decodificado:', decoded);
            console.log('👤 Seu tipo_usuario no token:', decoded.tipo_usuario);
            console.log('⏰ Token expira em:', new Date(decoded.exp * 1000));
            if (decoded.tipo_usuario !== 'ADMINISTRADOR') {
                console.warn('⚠️ AVISO: Você NÃO é um ADMINISTRADOR! Seu tipo é:', decoded.tipo_usuario);
            }
        } catch (e) {
            console.error('❌ Erro ao decodificar token:', e);
        }
    } else {
        console.warn('⚠️ Nenhum token encontrado!');
    }

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

export function initializeCadastroAdm(): void {
    inicializarCadastroAdm();
}

window.addEventListener('DOMContentLoaded', inicializarCadastroAdm); 