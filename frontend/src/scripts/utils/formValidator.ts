/**
 * Interface para representar uma validação de campo obrigatório
 */
export interface ValidationRule {
    field: string;
    message: string;
}

/**
 * Utilitário para validações de formulário
 */
export class FormValidator {
    /**
     * Valida campos obrigatórios
     * @param data - Objeto com os dados a validar
     * @param rules - Array de regras de validação
     * @returns true se tudo está válido, false caso contrário
     */
    static validateRequired(data: Record<string, any>, rules: ValidationRule[]): boolean {
        for (const rule of rules) {
            const value = data[rule.field];

            // Verifica se está vazio
            if (value === undefined || value === null || value === '' || (typeof value === 'string' && value.trim() === '')) {
                alert(rule.message);
                return false;
            }
        }

        return true;
    }

    /**
     * Extrai valores de especiePet/especies de pets do formulário
     * @param form - Elemento do formulário
     * @param selectorName - Nome do seletor (e.g., "especiePet" ou "especiesPets[]")
     * @returns Array com valores das espécies
     */
    static extractPetSpecies(form: HTMLFormElement, selectorName: string): string[] {
        const species: string[] = [];
        const selects = form.querySelectorAll(`select[name="${selectorName}"]`);

        selects.forEach((select) => {
            const value = (select as HTMLSelectElement).value;
            if (value) {
                species.push(value);
            }
        });

        return species;
    }

    /**
     * Converte valores de checkbox/radio para booleano
     * @param value - Valor do FormData
     * @param truthyValue - Valor que representa true (default: "sim")
     * @returns true ou false
     */
    static toBoolean(value: any, truthyValue: string = 'sim'): boolean {
        return value === truthyValue;
    }

    /**
     * Valida email
     */
    static isValidEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Valida CPF (validação básica de formato)
     */
    static isValidCPF(cpf: string): boolean {
        // Remove caracteres especiais
        const cleanCPF = cpf.replace(/\D/g, '');
        // Verifica se tem 11 dígitos
        return cleanCPF.length === 11;
    }
}
