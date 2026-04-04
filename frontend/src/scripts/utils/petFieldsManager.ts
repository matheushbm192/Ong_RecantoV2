/**
 * Interface para configuração de campos de pets
 */
export interface PetFieldsConfig {
    yesInputId: string; // ID do radio/checkbox "Sim"
    noInputId: string; // ID do radio/checkbox "Não"
    quantityInputId: string; // ID do input de quantidade
    quantityContainerId: string; // ID do container onde aparecem os inputs de quantidade
    speciesContainerId: string; // ID do container onde aparecem os selects de espécies
    speciesSelectorName: string; // Nome do seletor para as espécies (e.g., "especiePet" ou "especiesPets[]")
}

/**
 * Interface para opção de espécie de pet
 */
export interface SpeciesOption {
    value: string;
    text: string;
}

/**
 * Utilitário para gerenciar campos de pets
 */
export class PetFieldsManager {
    private config: PetFieldsConfig;
    private speciesOptions: SpeciesOption[];

    constructor(
        config: PetFieldsConfig,
        speciesOptions?: SpeciesOption[]
    ) {
        this.config = config;
        this.speciesOptions =
            speciesOptions ||
            this.getDefaultSpeciesOptions();
    }

    /**
     * Opções padrão de espécies
     */
    private getDefaultSpeciesOptions(): SpeciesOption[] {
        return [
            { value: '', text: 'Selecione a espécie' },
            { value: 'cachorro', text: 'Cachorro' },
            { value: 'gato', text: 'Gato' },
            { value: 'passaro', text: 'Pássaro' },
            { value: 'passarinho', text: 'Passarinho' },
            { value: 'hamster', text: 'Hamster' },
            { value: 'coelho', text: 'Coelho' },
            { value: 'peixe', text: 'Peixe' },
            { value: 'roedor', text: 'Roedor' },
            { value: 'outro', text: 'Outro' },
        ];
    }

    /**
     * Inicializa os event listeners para campos de pets
     */
    initialize(): void {
        const yesInput = document.getElementById(this.config.yesInputId) as HTMLInputElement | null;
        const noInput = document.getElementById(this.config.noInputId) as HTMLInputElement | null;
        const quantityInput = document.getElementById(this.config.quantityInputId) as HTMLInputElement | null;

        if (yesInput && noInput) {
            yesInput.addEventListener('change', () => this.togglePetFields());
            noInput.addEventListener('change', () => this.togglePetFields());
        }

        if (quantityInput) {
            quantityInput.addEventListener('input', () => this.updateSpeciesSelects());
        }

        // Inicializa o estado
        this.togglePetFields();
    }

    /**
     * Alterna visibilidade dos campos de pets
     */
    private togglePetFields(): void {
        const yesInput = document.getElementById(this.config.yesInputId) as HTMLInputElement | null;
        const quantityContainer = document.getElementById(this.config.quantityContainerId) as HTMLDivElement | null;
        const speciesContainer = document.getElementById(this.config.speciesContainerId) as HTMLDivElement | null;

        if (!yesInput) return;

        if (yesInput.checked) {
            if (quantityContainer) quantityContainer.style.display = 'block';
            if (speciesContainer) speciesContainer.style.display = 'block';
            this.updateSpeciesSelects();
        } else {
            if (quantityContainer) quantityContainer.style.display = 'none';
            if (speciesContainer) {
                speciesContainer.innerHTML = '';
                speciesContainer.style.display = 'none';
            }

            const quantityInput = document.getElementById(this.config.quantityInputId) as HTMLInputElement | null;
            if (quantityInput) quantityInput.value = '';
        }
    }

    /**
     * Atualiza os selects de espécies baseado na quantidade
     */
    private updateSpeciesSelects(): void {
        const quantityInput = document.getElementById(this.config.quantityInputId) as HTMLInputElement | null;
        const speciesContainer = document.getElementById(this.config.speciesContainerId) as HTMLDivElement | null;

        if (!quantityInput || !speciesContainer) return;

        speciesContainer.innerHTML = '';

        const quantity = parseInt(quantityInput.value, 10);
        if (!isNaN(quantity) && quantity > 0) {
            for (let i = 1; i <= quantity; i++) {
                speciesContainer.appendChild(this.createSpeciesSelect(i));
            }
            speciesContainer.style.display = 'block';
        } else {
            speciesContainer.style.display = 'none';
        }
    }

    /**
     * Cria um select de espécies
     */
    private createSpeciesSelect(index: number): HTMLElement {
        const div = document.createElement('div');
        div.className = 'mb-4';

        const label = document.createElement('label');
        label.className = 'block text-gray-700 text-sm font-bold mb-2';
        label.textContent = `Espécie do ${index}º animal:`;

        const select = document.createElement('select');
        select.name = this.config.speciesSelectorName;
        select.className = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';
        select.required = true;

        this.speciesOptions.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            if (option.value === '') {
                optionElement.disabled = true;
                optionElement.selected = true;
            }
            select.appendChild(optionElement);
        });

        div.appendChild(label);
        div.appendChild(select);
        return div;
    }
}
