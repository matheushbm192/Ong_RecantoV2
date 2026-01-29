import { Usuario} from "./models/usuarioModel";
import { buildApiUrl } from "./utils/api";
//import { cadastrarUsuarioComum } from "./routes/rota-cadastro-usuario-comum";


// Função para inicializar a página de cadastro de usuário
export function initializeCadastroUsuarioComumPage(): void {
    const form = document.getElementById('formulario-cadastro-usuario-comum') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// Função para lidar com o envio do formulário
async function handleFormSubmit(event: Event): Promise<void> {

    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Coletar dados do formulário
    const usuario: Usuario = {

    nome: formData.get('nome') as string,
    sobrenome: formData.get('sobrenome') as string,
    email: formData.get('email') as string,
    senha: formData.get('senha') as string,
    dataNascimento: formData.get('dataNascimento') as string,
    cpf: formData.get('cpf') as string,
    telefone: formData.get('telefone') as string,
    tipo_usuario: "COMUM",
    escolaridade: formData.get('escolaridade') as string,
    possuiPet: formData.get('possuiPet') === "sim"? true : false as boolean,
    logradouro: formData.get('logradouro') as string || undefined,
    numero: formData.get('numero') as string || undefined,
    complemento: formData.get('complemento') as string || undefined,
    bairro: formData.get('bairro') as string || undefined,
    cidade: formData.get('cidade') as string || undefined,
    estado: formData.get('estado') as string || undefined,
    contribuir_ong: formData.get('contribuirOng') === "sim"? true : false as boolean,
    deseja_adotar: formData.get('desejaAdotar') === "sim"? true : false as boolean

    };
    
    // Validar dados obrigatórios
    if (!usuario.nome.trim()) {
        alert('Por favor, preencha o nome .');
        return;
    }
    
    if (!usuario.sobrenome.trim()) {
        alert('Por favor, preencha o sobrenome.');
        return;
    }

    if (!usuario.email.trim()) {
        alert('Por favor, preencha o e-mail.');
        return;
    }
    if (!usuario.senha.trim()) {
        alert('Por favor, preencha a senha.');
        return;
    }
    if (!usuario.dataNascimento) {
        alert('Por favor, preencha a data de nascimento.');
        return;
    }
    if (!usuario.cpf.trim()) {
        alert('Por favor, preencha o CPF.');
        return;
    }
    if (!usuario.telefone.trim()) {
        alert('Por favor, preencha o telefone.');
        return;
    }
    if (!usuario.escolaridade) {
        alert('Por favor, selecione sua formação.');
        return;
    }
    if (usuario.possuiPet === undefined) {
        alert('Por favor, selecione se você tem animalzinho.');
        return;
    }
    
    if (!usuario.deseja_adotar) {
        alert('Por favor, selecione se deseja adotar um animal.');
        return;
    }
    
    if (!usuario.contribuir_ong) {
        alert('Por favor, selecione se gostaria de contribuir com a ONG.');
        return;
    }
 
    try {
        const button = document.getElementById('cadastrarUsuario') as HTMLButtonElement;
        await cadastrarUsuarioComum(formData, form, button);
            
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro ao realizar cadastro. Tente novamente.');
    }
}


async function cadastrarUsuarioComum(formData: FormData, form: HTMLFormElement, button: HTMLButtonElement): Promise<void> {
    button.disabled = true;
    button.textContent = 'Enviando...';
  
    fetch(buildApiUrl('/usuario/usuarioPost'), {
      method: 'POST',
      body: formData,
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro no envio');
        return res.json(); 
      })
      .then((res) => {
        console.log(res);
  
        const mensagem = document.getElementById('mensagem');
        if (mensagem) {
          mensagem.classList.remove('hidden');
          setTimeout(() => {
            mensagem.classList.add('hidden');
          }, 2000);
        }
  
        form.reset();
      })
      .catch(() => {
        const mensagemErro = document.getElementById('mensagemErro');
        if (mensagemErro) {
          mensagemErro.classList.remove('hidden');
          setTimeout(() => {
            mensagemErro.classList.add('hidden');
          }, 2000);
        }
      })
      .finally(() => {
        button.disabled = false;
        button.textContent = 'Cadastrar Usuário';
      });
  }




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

// Expor a função globalmente para compatibilidade com onkeyup
(window as any).formatarCEP = formatarCEP;

// Seleciona o campo de CEP
const cepInput = document.getElementById('cep') as HTMLInputElement | null;

if (cepInput) {
    // Adiciona o evento ao sair do campo
    cepInput.addEventListener('blur', function () {
        const cep = this.value.replace(/\D/g, '');

        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then((data: any) => {
                    if (!data.erro) {
                        const rua = document.getElementById('rua') as HTMLInputElement | null;
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
                        // Você pode limpar os campos aqui se quiser
                        
                    }
                })
                .catch((error: unknown) => {
                    console.error('Erro ao buscar CEP:', error);
                });
        }
    });
}
