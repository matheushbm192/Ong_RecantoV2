
import { buildApiUrl } from './api';

export class PedidoAdocaoRota {
    public static getAllPedidosAdocao(token: string | null): Promise<Response | null>  {
        return fetch(buildApiUrl('/pedidos-adocao/'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // ✅ Adicionar token de autenticação
            }
        }).then(response => {

            if (!response.ok) {
                throw new Error('Erro ao buscar pedidos de adoção.');
            }
            console.log("Resposta da API de Pedidos de Adoção:", response);
            return response; // Armazena a lista completa

        }).catch((error) => {
            console.error('Erro ao carregar todos os pedidos de adoção:', error); 
            alert('Não foi possível carregar os pedidos de adoção. Tente novamente mais tarde.');
            return null;
        });
    }
}
