import { UUID } from "crypto"

export interface Pet {
  idPet: UUID
  nome: string
  raca?: string | null
  especie?: string | null
  sexo: "M" | "F" 
  idade?: number | null
  fotoUrl?: string | null
  cep?: string | null
  logradouro: string
  numero?: number | null
  complemento?: string | null
  bairro: string
  cidade: string
  estado: string
  createdAt: string
  }