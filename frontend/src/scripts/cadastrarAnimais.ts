import { PetRota } from "./utils/rotaAnimais";
import { atualizarInterfaceUsuario } from "./main";
import authService from "./services/authService";
import { CEPAutocompleter } from "./utils/cepAutocompleter";

function enviarCadastro() {
    const form = document.getElementById('formulario-cadastro-animal') as HTMLFormElement;
    const button = document.getElementById('btn-cadastrar') as HTMLButtonElement;

    if (!form || !button) {
        console.error("Formulário ou botão não encontrado");
        return;
    }

    const formData = new FormData(form);
    console.log(formData);
    button.disabled = true;
    button.textContent = 'Enviando...';

    PetRota.postPet(formData)
        .then((isSucesso: boolean) => {
            if (isSucesso === true) {
                form.reset();
            }
        })
        .finally(() => {
            button.disabled = false;
            button.textContent = 'Cadastrar Animal';
        });
}

function inicializarFormulario() {
    const botao = document.getElementById('btn-cadastrar');

    if (botao) {
        botao.addEventListener('click', (event) => {
            event.preventDefault();
            enviarCadastro();
        });
    } else {
        console.error("Botão de cadastro não encontrado");
    }

    // Configurar autocomplete de CEP usando a classe reutilizável
    CEPAutocompleter.initialize('cep', {
        logradouroId: 'logradouro',
        bairroId: 'bairro',
        cidadeId: 'cidade',
        estadoId: 'estado',
        numeroId: 'numero',
    });
}

// Expor globalmente para compatibilidade com onkeyup
(window as any).formatarCEP = (event: Event) => CEPAutocompleter.formatCEP(event);
console.log('[CADASTRO-ANIMAIS] formatarCEP exposta globalmente.');
// Função para inicializar tudo
function inicializarPagina() {
    console.log('[CADASTRO-ANIMAIS] Inicializando página...');
    
    // Atualizar interface quando o DOM estiver pronto
    atualizarInterfaceUsuario();
    
    const logoutLink = document.querySelector('[data-action="logout"]');
    logoutLink?.addEventListener('click', () => {
        authService.logout();
    });

    // Inicializar formulário com pequeno delay
    setTimeout(() => {
        inicializarFormulario();
    }, 100);
}

// Verificar se o DOM já está pronto
if (document.readyState === 'loading') {
    // DOM ainda está carregando
    document.addEventListener('DOMContentLoaded', inicializarPagina);
} else {
    // DOM já foi carregado, executar imediatamente
    inicializarPagina();
}
