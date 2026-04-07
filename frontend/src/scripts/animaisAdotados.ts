import { Pet } from './models/petModel';
import { buildApiUrl } from './utils/api';
import { atualizarInterfaceUsuario } from "./main";
import authService from "./services/authService";

atualizarInterfaceUsuario();

// --- VARIÁVEIS DE ESTADO ---
let allAnimaisAdotados: any[] = [];
let currentPage: number = 1;
const itemsPerPage: number = 10;
let sortBy: "recentes" | "antigos" = "recentes";

document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.querySelector('[data-action="logout"]');

    logoutLink?.addEventListener('click', () => {
        authService.logout();
    });
});

/**
 * Busca todos os animais adotados do backend
 */
async function fetchAnimaisAdotados(): Promise<void> {
    try {
        console.log('📥 Buscando animais adotados do backend...');
        
        const response = await fetch(buildApiUrl('/pets/adotados/todos'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("Resposta do servidor:", response);

        if (!response.ok) {
            throw new Error('Erro ao buscar animais adotados');
        }

        const data = await response.json();
        console.log("Dados recebidos:", data);

        // Suporta ambos os formatos: array direto ou { animaisAdotados: [] }
        allAnimaisAdotados = Array.isArray(data) ? data : (data.animaisAdotados || []);
        
        console.log(`✅ ${allAnimaisAdotados.length} animais adotados carregados`);
        
        // Renderizar a página inicial
        renderAnimaisAdotados(1);
        setupEventListeners();

    } catch (err) {
        console.error('❌ Erro ao buscar animais adotados:', err);
        const lista = document.getElementById('adotados-list');
        if (lista) {
            lista.innerHTML = `<p class="text-red-500 text-center py-8">Erro ao carregar animais adotados. Por favor, tente novamente.</p>`;
        }
    }
}

/**
 * Renderiza os animais adotados com paginação
 */
function renderAnimaisAdotados(page: number = 1): void {
    const lista = document.getElementById('adotados-list');
    if (!lista) return;

    // Ordenar baseado na seleção
    let animaisOrdenados = [...allAnimaisAdotados];
    if (sortBy === "antigos") {
        animaisOrdenados.reverse();
    }

    // Paginação
    const totalPages = Math.ceil(animaisOrdenados.length / itemsPerPage);
    currentPage = Math.min(page, totalPages) || 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, animaisOrdenados.length);
    const animaisToDisplay = animaisOrdenados.slice(startIndex, endIndex);

    if (animaisToDisplay.length === 0) {
        lista.innerHTML = `<p class="text-gray-600 text-center py-8">Nenhum animal adotado encontrado.</p>`;
        updatePaginationInfo(totalPages);
        return;
    }

    lista.innerHTML = animaisToDisplay.map((animal: any) => {
        // Busca a primeira foto do array de fotos
        const primeiraFoto = animal.fotos && animal.fotos.length > 0 ? animal.fotos[0].foto_url : null;
        const fotoUrl = primeiraFoto ? buildApiUrl(primeiraFoto) : 'https://via.placeholder.com/200x200.png?text=Sem+Foto';
        const dataAdocao = animal.data_adocao ? new Date(animal.data_adocao).toLocaleDateString('pt-BR') : 'Data não disponível';
        
        return `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div class="flex flex-col md:flex-row">
                    <!-- Foto do Animal -->
                    <img src="${fotoUrl}"
                         alt="Foto de ${animal.nome}"
                         class="w-full md:w-48 h-48 object-cover" />
                    
                    <!-- Informações -->
                    <div class="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            <h2 class="text-2xl font-bold text-[#1f2a5a] mb-3">${animal.nome}</h2>
                            <div class="grid grid-cols-2 gap-4 text-gray-700">
                                <div>
                                    <p class="font-semibold text-[#357a38]">Espécie</p>
                                    <p>${animal.especie || 'Não informada'}</p>
                                </div>
                                <div>
                                    <p class="font-semibold text-[#357a38]">Raça</p>
                                    <p>${animal.raca || 'Não informada'}</p>
                                </div>
                                <div>
                                    <p class="font-semibold text-[#357a38]">Sexo</p>
                                    <p>${animal.sexo === 'M' ? 'Macho' : animal.sexo === 'F' ? 'Fêmea' : animal.sexo}</p>
                                </div>
                                <div>
                                    <p class="font-semibold text-[#357a38]">Idade</p>
                                    <p>${animal.idade !== null ? `${animal.idade} ano(s)` : 'Não informada'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Adotado em -->
                        <p class="text-sm text-gray-500 mt-4">
                            <i class="fas fa-heart text-red-500 mr-2"></i>
                            Adotado em ${dataAdocao}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    updatePaginationInfo(totalPages);
}

/**
 * Atualiza informações de paginação
 */
function updatePaginationInfo(totalPages: number): void {
    const infoElement = document.getElementById('pagination-info');
    if (infoElement) {
        infoElement.textContent = `Página ${currentPage} de ${totalPages || 1}`;
    }
}

/**
 * Configura event listeners para ordenação e outras interações
 */
function setupEventListeners(): void {
    const sortSelect = document.getElementById('sort') as HTMLSelectElement;
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortBy = (e.target as HTMLSelectElement).value as "recentes" | "antigos";
            currentPage = 1;
            renderAnimaisAdotados(1);
        });
    }
}

/**
 * Função de inicialização da página de animais adotados
 */
export async function InitializeAnimaisAdotadosPage() {
    console.log('🚀 Inicializando página de animais adotados...');
    await fetchAnimaisAdotados();
}

// 🚀 Inicializar automaticamente quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('📖 Página de animais adotados carregada - inicializando...');
    InitializeAnimaisAdotadosPage();
});

