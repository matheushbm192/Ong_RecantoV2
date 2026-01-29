import { UUID } from "crypto"
import { FotoPet } from "./fotoPet"

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
  bairro: string
  cidade: string
  estado: string
  criado_em: string
  id_usuario?: number | null
  data_adocao?: string | null
}