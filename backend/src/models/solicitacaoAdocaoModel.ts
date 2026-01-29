
export interface SolicitacaoAdocao{
    id: number;
    idUsuario: number;
    idPet: number;
    idAdministrador?: number | null; // Pode ser undefined ou null se não for preenchido
    status: "PENDENTE" | "ANALISE" | "FINALIZADA";
    resultado: "APROVADA" | "REPROVADA" | null;
    data_solicitacao: string;
}