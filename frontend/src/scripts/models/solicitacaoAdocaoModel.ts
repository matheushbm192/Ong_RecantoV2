
export interface SolicitacaoAdocao{
    id: number;
    id_usuario: number;
    id_pet: number;
    id_administrador?: number | null; // Pode ser undefined ou null se não for preenchido
    status: "PENDENTE" | "APROVADA" | "REPROVADA";
    data_solicitacao?: string;
}