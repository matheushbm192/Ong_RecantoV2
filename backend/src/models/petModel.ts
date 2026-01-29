import { FotoPet } from "./fotoPetModel"

export interface Pet {
  id: number
  nome: string
  raca?: string | null
  especie: string 
  sexo: "M" | "F" 
  idade?: number | null
  complemento?: string | null
  fotoUrl?: FotoPet[] | null
  cep?: string | null
  logradouro?: string | null
  numero?: string | null
  bairro?: string | null
  cidade?: string | null
  estado?: string | null
  criado_em?: string | null
  id_usuario?: number | null
  data_adocao?: string | null
}