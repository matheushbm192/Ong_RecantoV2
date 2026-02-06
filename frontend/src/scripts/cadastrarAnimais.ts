import { PetRota } from "./utils/rotaAnimais";
import { atualizarInterfaceUsuario } from "./main";
import authService from "./services/authService";

// Função para aplicar máscara de CEP (00000-000)
function formatarCEP(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value: string = input.value.replace(/\D/g, ''); // Remove tudo que não for dígito

    if (value.length > 8) {
        value = value.substring(0, 8);
    }

    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5);
    }

    input.value = value;
}

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

    // Configurar máscara de CEP
    const cepInput = document.getElementById('cep') as HTMLInputElement | null;

    if (cepInput) {
        cepInput.addEventListener('blur', function () {
            const cep = this.value.replace(/\D/g, '');

            if (cep.length === 8) {
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(response => response.json())
                    .then((data: any) => {
                        if (!data.erro) {
                            const rua = document.getElementById('logradouro') as HTMLInputElement | null;
                            const bairro = document.getElementById('bairro') as HTMLInputElement | null;
                            const cidade = document.getElementById('cidade') as HTMLInputElement | null;
                            const estado = document.getElementById('estado') as HTMLSelectElement | null;
                            const numero = document.getElementById('numero') as HTMLInputElement | null;

                            if (rua) rua.value = data.logradouro || '';
                            if (bairro) bairro.value = data.bairro || '';
                            if (cidade) cidade.value = data.localidade || '';
                            if (estado) estado.value = data.uf || '';
                            if (numero) numero.focus();
                        } else {
                            console.warn('CEP não encontrado ou inválido.');
                        }
                    })
                    .catch((error: unknown) => {
                        console.error('Erro ao buscar CEP:', error);
                    });
            }
        });
    }
}

// Expor a função globalmente para compatibilidade com onkeyup
(window as any).formatarCEP = formatarCEP;
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
