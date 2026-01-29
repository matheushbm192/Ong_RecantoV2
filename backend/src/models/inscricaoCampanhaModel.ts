export interface inscricaoCampanha{
    id_inscricao: number;
    id_campanha: number;
    id_pet: number;
    data_incricao: string;
    status: "PENDENTE" | "APROVADA" | "REPROVADA";
}