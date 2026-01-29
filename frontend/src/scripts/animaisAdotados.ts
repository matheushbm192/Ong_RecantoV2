import { Pet } from './models/petModel';
import { buildApiUrl } from './utils/api';
import { atualizarInterfaceUsuario } from "./main";

atualizarInterfaceUsuario();
export async function InitializeAnimaisAdotadosPage() {
  const lista = document.getElementById('adotados-list');
  if (!lista) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(buildApiUrl('/animais-adotados/'), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log("FRONTEND RESPOSTA!!!!!!")
    console.log(response)

    if (!response.ok) throw new Error('Erro ao buscar animais adotados');

    const { animaisAdotados } = await response.json();

    console.log(animaisAdotados);

    if (animaisAdotados.length === 0) {
      lista.innerHTML = `<p class="text-gray-600 text-center">Nenhum animal adotado encontrado.</p>`;
      return;
    }

    lista.innerHTML = animaisAdotados.map((animal : any) => `
      <div id="card-${animal.id_pet}" class="flex flex-col bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer group max-w-xl mx-auto mb-4">
        <div class="flex items-center justify-start gap-4">
          <img src="${buildApiUrl(animal.foto_url) || 'https://via.placeholder.com/80x80.png?text=Animal'}"
               alt="Imagem do animal"
               class="h-20 w-24 object-cover rounded bg-gray-100 border group-hover:scale-105 transition-transform" />
          <div class="flex-1 flex flex-col md:flex-row md:items-center gap-8">
            <p class="font-bold text-[#27387f] mr-4">
              <span class="text-black">Nome:</span>
              <span class="font-normal text-gray-700">${animal.nome}</span>
            </p>

            <p class="font-bold text-[#27387f] mr-4">
              <span class="text-black">Raça:</span>
              <span class="font-normal text-gray-700">${animal.raca ?? 'Não informada'}</span>
            </p>

            <p class="font-bold text-[#27387f]">
              <span class="text-black">Idade:</span>
              <span class="font-normal text-gray-700">${animal.idade !== null ? `${animal.idade} ano(s)` : 'Não informada'}</span>
            </p>

          </div>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error('Erro ao renderizar animais adotados:', err);
    lista.innerHTML = `<p class="text-red-500">Erro ao carregar animais adotados.</p>`;
  }
}

