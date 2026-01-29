import { UUID } from "crypto";

export interface SolicitacaoAdocao{
    id: UUID;
    idPet: UUID;
    idUsuario: UUID;
    idAdministrador?: UUID | null; // Pode ser undefined ou null se não for preenchido
    status: "PENDENTE" | "CONCLUIDA" | "APROVADA";
    resultado: "APROVADA" | "REPROVADA" | null;
}