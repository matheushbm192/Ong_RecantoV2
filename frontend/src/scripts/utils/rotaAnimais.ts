import { buildApiUrl } from './api';

export class PetRota {

    public static getAllPets() {
        return fetch(buildApiUrl('/api/pets'))
            .then(async (res) => {
                if (!res.ok) {
                    const error = await res.text();
                    throw new Error(error || 'Erro ao carregar tela home');
                }

                return res.json();
            })
            .then(data => {
                console.log(data);
                return data.pets;

            }).catch((error) => {
                console.error('Erro pegar:', error);
                alert('Erro ao pegar animais. ');
            });
    }

    public static postPet(formData: FormData): Promise<boolean> {
        return fetch(buildApiUrl('/api/pets'), {
            method: 'POST',
            body: formData,
        })
            .then(res => {
                if (!res.ok) throw new Error('Erro no envio');
                return res.text();
            })
            .then((res) => {
                console.log(res);

                const mensagem = document.getElementById('mensagem');
                if (mensagem) {
                    mensagem.classList.remove('hidden');
                    setTimeout(() => {
                        mensagem.classList.add('hidden');
                    }, 2000); // 2 segundos
                }
                return true;
            })
            .catch(() => {
                const mensagemErro = document.getElementById('mensagemErro');
                if (mensagemErro) {
                    mensagemErro.classList.remove('hidden');
                    setTimeout(() => {
                        mensagemErro.classList.add('hidden');
                    }, 2000); // 2 segundos
                }
                return false;
            })
    }
}
// public getContratosNomesPorClienteNome(nome: string) : Observable<ContratoNomeCodigoDTO[]>{
//     const url = new URL(ApiPathUtil.Sistemas.CONTRATOS_PATH + "?nome=" + nome);

//     return this._http.get<ContratoNomeCodigoDTO[]>(url.toString(),{
//       headers:{
//         [Constantes.HTTP.HEADER.AUTHORIZATION]: 'Basic ' + Constantes.HTTP.AUTENTICACAO.BASIC_TOKEN,
//       },
//       responseType:'json'
//     })
// }