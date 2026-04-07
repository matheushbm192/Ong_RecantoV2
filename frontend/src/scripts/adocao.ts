import { Pet } from "./models/petModel"
import { PetRota } from "./utils/rotaAnimais";
import { buildApiUrl } from "./utils/api";
import { atualizarInterfaceUsuario } from "./main";
import authService from "./services/authService";
let petList: HTMLUListElement;
let prevBtn: HTMLButtonElement;
let nextBtn: HTMLButtonElement;
let pageInfo: HTMLSpanElement;
let filtroRaca: HTMLSelectElement;
let filtroSexo: HTMLSelectElement;
let filtroIdade: HTMLSelectElement;

let itemsPerPage = 12;
let currentPage = 1;
let allPets: Pet[] = []; // pets carregados da API
let filtroEspecie: HTMLSelectElement;

function getFilteredPets(): Pet[] {
  const raca = filtroRaca.value;
  const sexo = filtroSexo.value;
  const idade = filtroIdade.value;
  const especie = filtroEspecie.value;

  return allPets.filter(pet =>
    (raca === "" || pet.raca === raca) &&
    (sexo === "" || pet.sexo === sexo) &&
    (idade === "" || String(pet.idade) === idade) &&
    (especie === "" || pet.especie === especie)
  );
}
atualizarInterfaceUsuario();
document.addEventListener('DOMContentLoaded', () => {
        const logoutLink = document.querySelector('[data-action="logout"]');

        logoutLink?.addEventListener('click', () => {
            authService.logout();
        });
    });
function popularFiltros(pets: Pet[]): void {
  // Limpa opções antigas
  filtroRaca.innerHTML = "<option value=''>Todas</option>";
  filtroSexo.innerHTML = "<option value=''>Todos</option>";
  filtroIdade.innerHTML = "<option value=''>Todas</option>";
  filtroEspecie.innerHTML = "<option value=''>Todas</option>";

  // Espécies únicas
  const especiesUnicas = [...new Set(pets.map(pet => pet.especie).filter(e => e))];
  especiesUnicas.forEach(especie => {
    if (especie) {
      const option = document.createElement("option");
      option.value = especie;
      option.textContent = especie;
      filtroEspecie.appendChild(option);
    }
  });

  // Raças únicas
  const racasUnicas = [...new Set(pets.map(pet => pet.raca))];
  racasUnicas.forEach(raca => {
    if (raca) {
      const option = document.createElement("option");
      option.value = raca;
      option.textContent = raca;
      filtroRaca.appendChild(option);
    }
  });

  // Sexos únicos (M/F)
  const sexosUnicos = [...new Set(pets.map(pet => pet.sexo))];
  sexosUnicos.forEach(sexo => {
    const option = document.createElement("option");
    option.value = sexo;
    option.textContent = sexo === "M" ? "Macho" : sexo === "F" ? "Fêmea" : sexo;
    filtroSexo.appendChild(option);
  });

  // Idades únicas
  const idadesUnicas = [...new Set(pets.map(pet => String(pet.idade)))];
  idadesUnicas.forEach(idade => {
    const option = document.createElement("option");
    option.value = idade;
    option.textContent = idade;
    filtroIdade.appendChild(option);
  });
}

export async function renderPage(page: number = 1): Promise<void> {
  const filteredPets = getFilteredPets();
  const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
  currentPage = Math.min(page, totalPages) || 1;

  petList.innerHTML = "";
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredPets.length);
  const pageItems = filteredPets.slice(startIndex, endIndex);

  pageItems.forEach((pet) => {
    const li = document.createElement("li");
    li.className = "bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300";
    // buildApiUrl() automaticamente ajusta para desenvolvimento (localhost) ou produção
    const fotoUrl = pet.fotos && pet.fotos.length > 0 
      ? buildApiUrl(pet.fotos[0].foto_url) 
      : "https://via.placeholder.com/300x200.png?text=Sem+Foto";
    li.innerHTML = `
      <img src="${fotoUrl}" alt="${pet.nome}" class="w-full h-48 object-cover" />
      <div class="p-4 flex flex-col flex-grow">
        <h2 class="text-xl font-semibold mb-2 text-[#357a38]">${pet.nome}</h2>
        <ul class="text-gray-700 flex-grow space-y-1">
          <li><strong>Espécie:</strong> ${pet.especie || "N/A"}</li>
          <li><strong>Raça:</strong> ${pet.raca || "N/A"}</li>
          <li><strong>Sexo:</strong> ${pet.sexo === "M" ? "Macho" : pet.sexo === "F" ? "Fêmea" : pet.sexo}</li>
          <li><strong>Idade:</strong> ${pet.idade} ano(s)</li>
          ${pet.bairro && pet.cidade ? `<li><strong>Local:</strong> ${pet.bairro}, ${pet.cidade}</li>` : ""}
        </ul>

        <button class="adotar-btn mt-4 bg-yellow-400 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-300 transition" 
          type="button" 
          data-pet-id="${pet.id}">
            Adotar
        </button>

      </div>
    `;
    petList.appendChild(li);
  });

  document.querySelectorAll(".adotar-btn").forEach(btn => {
    btn.addEventListener("click", async (event) => {
      const button = event.currentTarget as HTMLButtonElement;
      const petId = button.dataset.petId;

      console.log("TYPE DE PET ID: ", typeof (petId));
      console.log("Adotar clicado para pet id:", petId);
      await solicitarAdocao(petId || "");
    });
  });

  pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// Função de inicialização que será chamada quando a página for carregada

// Aguarda um pouco para garantir que o DOM foi atualizado
await new Promise(resolve => setTimeout(resolve, 100));

// Busca os elementos do DOM
petList = document.getElementById("animal-list") as HTMLUListElement;
prevBtn = document.getElementById("prev-btn") as HTMLButtonElement;
nextBtn = document.getElementById("next-btn") as HTMLButtonElement;
pageInfo = document.getElementById("page-info") as HTMLSpanElement;
filtroRaca = document.getElementById("filtro-raca") as HTMLSelectElement;
filtroSexo = document.getElementById("filtro-sexo") as HTMLSelectElement;
filtroIdade = document.getElementById("filtro-idade") as HTMLSelectElement;
filtroEspecie = document.getElementById("filtro-especie") as HTMLSelectElement;

// Verifica se os elementos existem
if (!petList || !prevBtn || !nextBtn || !pageInfo || !filtroRaca || !filtroSexo || !filtroIdade || !filtroEspecie) {
  console.error("Elementos da página de adoção não encontrados");
}

// Carrega os pets da API
allPets = await PetRota.getAllPets();
popularFiltros(allPets);
renderPage(1);

// Adiciona event listeners
[filtroRaca, filtroSexo, filtroIdade, filtroEspecie].forEach(filtro => {
  filtro.addEventListener("change", () => renderPage(1));
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

nextBtn.addEventListener("click", () => {
  const filteredPets = getFilteredPets();
  const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderPage(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// Limpar filtros
const btnClearFilters = document.getElementById("btn-clear-filters") as HTMLButtonElement;
if (btnClearFilters) {
  btnClearFilters.addEventListener("click", () => {
    filtroRaca.value = "";
    filtroSexo.value = "";
    filtroIdade.value = "";
    filtroEspecie.value = "";
    renderPage(1);
  });
}


//TODO: completar a função de solicitação de adoção

/**
 * Cria um popup customizado com mensagem e botão de ação
 */
function mostrarPopupErro(titulo: string, mensagem: string, nomeBotao: string = "Ir para Login", callback?: () => void) {
  // Criar overlay
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  
  // Criar modal
  const modal = document.createElement('div');
  modal.className = 'bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4';
  modal.innerHTML = `
    <div class="text-center">
      <div class="mb-4">
        <i class="fas fa-exclamation-circle text-red-500 text-5xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-[#1f2a5a] mb-3">${titulo}</h2>
      <p class="text-gray-700 mb-6">${mensagem}</p>
      <div class="flex gap-3">
        <button class="btn-cancelar flex-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded transition">
          Cancelar
        </button>
        ${callback ? `<button class="btn-acao flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded transition">
          ${nomeBotao}
        </button>` : ''}
      </div>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Event listeners
  const btnCancelar = modal.querySelector('.btn-cancelar') as HTMLButtonElement;
  const btnAcao = modal.querySelector('.btn-acao') as HTMLButtonElement;
  
  btnCancelar.addEventListener('click', () => {
    overlay.remove();
  });
  
  if (btnAcao && callback) {
    btnAcao.addEventListener('click', () => {
      overlay.remove();
      callback();
    });
  }
}

async function solicitarAdocao(petId: string) {
  const token = localStorage.getItem("token");

  // Verificar se usuário está autenticado
  if (!token) {
    mostrarPopupErro(
      "Autenticação Necessária",
      "Para solicitar a adoção de um animal, você precisa estar logado.",
      "Ir para Login",
      () => {
        window.location.href = './login.html';
      }
    );
    return;
  }

  // Obter dados do usuário atual usando authService
  const user = authService.getCurrentUser();
  if (!user) {
    mostrarPopupErro(
      "Sessão Expirada",
      "Sua sessão expirou. Por favor, faça login novamente.",
      "Ir para Login",
      () => {
        authService.logout();
        window.location.href = './login.html';
      }
    );
    return;
  }

  const { id_usuario } = user;
  console.log("👤 Usuário autenticado:", user);
  
  const usuarioPetObj = {
    id_usuario: id_usuario,
    id_pet: petId
  };

  console.log("📝 Dados da solicitação:", usuarioPetObj);

  try {
    // Usar buildApiUrl() para construir a URL corretamente em qualquer ambiente
    const url = buildApiUrl('/solicitar-adocao');
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuarioPetObj)
    });

    if (!response.ok) {
      let mensagemErro = "Erro ao solicitar adoção";
      let titulo = "Erro na Requisição";
      let botaoCallback: (() => void) | null = () => {
        window.location.href = './login.html';
      };
      
      try {
        const errorData = await response.json();
        mensagemErro = errorData.erro || mensagemErro;
      } catch {
        // Se não conseguir parsear JSON, tenta obter texto simples
        const errorText = await response.text();
        if (errorText) {
          mensagemErro = errorText;
        }
      }

      // Se for erro 409 (solicitação duplicada), não redirecionar para login
      if (response.status === 409) {
        titulo = "Solicitação Duplicada";
        botaoCallback = null; // Apenas botão de cancelar (sem ação)
      }

      throw { message: mensagemErro, titulo, botaoCallback };
    }

    const resultado = await response.json();
    
    // Sucesso - mostrar popup positivo
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    const modal = document.createElement('div');
    modal.className = 'bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4';
    modal.innerHTML = `
      <div class="text-center">
        <div class="mb-4">
          <i class="fas fa-check-circle text-green-500 text-5xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-[#1f2a5a] mb-3">Sucesso!</h2>
        <p class="text-gray-700 mb-6">Sua solicitação de adoção foi enviada com sucesso! Em breve você receberá notícias.</p>
        <button class="btn-ok w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded transition">
          OK
        </button>
      </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    (modal.querySelector('.btn-ok') as HTMLButtonElement).addEventListener('click', () => {
      overlay.remove();
      console.log("✅ Resposta do servidor:", resultado);
    });
    
  } catch (error: any) {
    console.error("❌ Erro ao solicitar adoção:", error);
    
    // Extrair informações do erro customizado ou usar valores padrão
    const titulo = error.titulo || "Erro na Requisição";
    const mensagem = error.message || (error instanceof Error ? error.message : 'Tente novamente mais tarde.');
    
    // Se botaoCallback for null, não mostrar botão de ação
    const callback = error.botaoCallback === null 
      ? undefined 
      : (error.botaoCallback || (() => {
          window.location.href = './login.html';
        }));
    
    mostrarPopupErro(
      titulo,
      mensagem,
      "Ir para Login",
      callback
    );
  }
}
