import { buildApiUrl } from './api';

/**
 * Configuração para um formulário de cadastro genérico
 */
export interface RegistrationConfig {
    formId: string;
    submitButtonId: string;
    successMessageId: string;
    errorMessageId: string;
    apiEndpoint: string;
    useJson?: boolean; // Se true, envia JSON; se false, envia FormData
    onBeforeSubmit?: (data: any) => any; // Hook para processar dados antes do envio
    onSuccess?: (response: any) => void; // Callback após sucesso
    onError?: (error: any) => void; // Callback após erro
}

/**
 * Serviço genérico para registros/cadastros
 */
export class RegistrationService {
    private config: RegistrationConfig;

    constructor(config: RegistrationConfig) {
        this.config = {
            useJson: false,
            ...config,
        };
    }

    /**
     * Inicializa o serviço de registro
     */
    initialize(): void {
        const form = document.getElementById(this.config.formId) as HTMLFormElement;
        if (form) {
            form.addEventListener('submit', (event) => this.handleSubmit(event));
        }
    }

    /**
     * Lida com o envio do formulário
     */
    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const button = document.getElementById(this.config.submitButtonId) as HTMLButtonElement;

        if (!button) {
            console.error(`Botão com ID "${this.config.submitButtonId}" não encontrado`);
            return;
        }

        // Previne múltiplos envios
        if (button.disabled) {
            return;
        }

        button.disabled = true;
        const originalText = button.textContent;
        button.textContent = 'Enviando...';

        try {
            const formData = new FormData(form);

            // Prepara os dados
            let body: any;
            let headers: Record<string, string> = {};

            if (this.config.useJson) {
                // Converte FormData para objeto simples
                const jsonData: Record<string, any> = {};
                formData.forEach((value, key) => {
                    if (!jsonData.hasOwnProperty(key)) {
                        jsonData[key] = value;
                    }
                });

                body = this.config.onBeforeSubmit
                    ? this.config.onBeforeSubmit(jsonData)
                    : jsonData;

                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            } else {
                body = formData;
                if (this.config.onBeforeSubmit) {
                    // Para FormData, o hook não altera a forma de envio
                    this.config.onBeforeSubmit(formData);
                }
            }

            // Faz a requisição
            const response = await fetch(buildApiUrl(this.config.apiEndpoint), {
                method: 'POST',
                headers,
                body,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || 'Erro ao registrar');
            }

            const responseData = await response.json();

            // Exibe mensagem de sucesso
            const successMessage = document.getElementById(this.config.successMessageId);
            if (successMessage) {
                successMessage.classList.remove('hidden');
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 3000);
            }

            // Reseta o formulário
            form.reset();

            // Callback customizado
            if (this.config.onSuccess) {
                this.config.onSuccess(responseData);
            }
        } catch (error) {
            console.error(error);

            // Exibe mensagem de erro
            const errorMessage = document.getElementById(this.config.errorMessageId);
            if (errorMessage) {
                errorMessage.classList.remove('hidden');
                setTimeout(() => {
                    errorMessage.classList.add('hidden');
                }, 3000);
            }

            // Callback customizado
            if (this.config.onError) {
                this.config.onError(error);
            }
        } finally {
            button.disabled = false;
            button.textContent = originalText;
        }
    }
}
