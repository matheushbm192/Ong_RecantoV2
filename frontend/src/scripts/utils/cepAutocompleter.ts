/**
 * Utilitário para AutoCompletar endereço pelo CEP
 */
export class CEPAutocompleter {
    /**
     * Formata CEP no formato 00000-000
     */
    static formatCEP(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, ''); // Remove tudo que não for dígito

        if (value.length > 8) {
            value = value.substring(0, 8);
        }

        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5);
        }

        input.value = value;
    }

    /**
     * Inicializa o autocomplete de CEP
     * @param cepInputId - ID do input de CEP
     * @param fieldMap - Mapeamento de IDs dos campos de endereço
     */
    static initialize(
        cepInputId: string,
        fieldMap: {
            logradouroId: string;
            bairroId: string;
            cidadeId: string;
            estadoId: string;
            numeroId?: string;
        }
    ): void {
        const cepInput = document.getElementById(cepInputId) as HTMLInputElement | null;

        if (!cepInput) {
            console.warn(`Input com ID "${cepInputId}" não encontrado`);
            return;
        }

        cepInput.addEventListener('blur', () => {
            const cep = cepInput.value.replace(/\D/g, '');

            if (cep.length === 8) {
                this.fetchAndFillCEP(cep, fieldMap);
            }
        });
    }

    /**
     * Busca dados do CEP e preenche os campos
     */
    private static async fetchAndFillCEP(
        cep: string,
        fieldMap: {
            logradouroId: string;
            bairroId: string;
            cidadeId: string;
            estadoId: string;
            numeroId?: string;
        }
    ): Promise<void> {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                console.warn('CEP não encontrado ou inválido.');
                return;
            }

            // Preenche os campos
            const logradouro = document.getElementById(fieldMap.logradouroId) as HTMLInputElement | null;
            const bairro = document.getElementById(fieldMap.bairroId) as HTMLInputElement | null;
            const cidade = document.getElementById(fieldMap.cidadeId) as HTMLInputElement | null;
            const estado = document.getElementById(fieldMap.estadoId) as HTMLSelectElement | null;
            const numero = fieldMap.numeroId ? (document.getElementById(fieldMap.numeroId) as HTMLInputElement | null) : null;

            if (logradouro) logradouro.value = data.logradouro || '';
            if (bairro) bairro.value = data.bairro || '';
            if (cidade) cidade.value = data.localidade || '';
            if (estado) estado.value = data.uf || '';
            if (numero) numero.focus();
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        }
    }
}
