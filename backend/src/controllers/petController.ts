import { Request, Response } from 'express'
import { MulterRequest } from '../interfaceConfig/MulterRequest';
import { CreatePetDTO, Pet } from '../models/petModel'
import { PetRN } from '../services/petService';


const petRN = new PetRN();

export class PetCTR {
  /**
   * Retorna todos os animais adotados (pets com id_usuario preenchido)
   */
  async getAllAnimaisAdotados(req: Request, res: Response) {
    try {
      console.log("🐾 [CONTROLLER - getAllAnimaisAdotados] Requisição recebida");
      const pets = await petRN.selectAllPets();

      // Filtrar apenas os pets que foram adotados (têm id_usuario)
      const animaisAdotados = pets.filter(pet => pet.id_usuario !== null && pet.id_usuario !== undefined);

      console.log(`✅ [CONTROLLER - getAllAnimaisAdotados] ${animaisAdotados.length} animais adotados retornados`);
      res.status(200).json(animaisAdotados);

    } catch (error: any) {
      console.error("❌ Erro ao buscar animais adotados:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getAnimaisAdotadosPorUsuarioId(req: Request, res: Response) {
    try {

      console.log("REQUEST CONTROLLER")
      console.log(req.body)

      console.log("ANIMAIS ADOTADOOOO")
   
      const id_usuario = req.body.id_usuario;

      const animaisAdotados = await petRN.selectPetsPorUsuarioId(id_usuario);
      console.log("CONTROLLER ANIMAIS ADOTADOS")
      console.log(animaisAdotados)
      res.status(200).json({ animaisAdotados });

    } catch (error: any) {
      console.error("Erro ao buscar animais:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getAllPets(req: Request, res: Response) {
    try {
      console.log("🐾 [CONTROLLER - getAllPets] Requisição recebida");
      const pets = await petRN.selectAllPets();

      console.log(`✅ [CONTROLLER - getAllPets] ${pets.length} pets retornados`);
      pets.forEach((pet, index) => {
        console.log(`   Pet ${index + 1}: ${pet.nome} - Fotos: ${pet.fotos?.length || 0}`);
        if (pet.fotos && pet.fotos.length > 0) {
          pet.fotos.forEach((foto) => {
            console.log(`      📸 ${foto.foto_url}`);
          });
        }
      });
      res.json({ pets });

    } catch (error: any) {
      console.error("❌ Erro ao buscar animais:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async postPet(req: MulterRequest, res: Response) {
    try {
      console.log("=== INÍCIO DO POST PET ===");
      console.log("Body recebido:", req.body);
      console.log("File recebido:", req.file);

      const {
        nome,
        raca,
        especie,
        sexo,
        idade,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado
      } = req.body;

      console.log("Dados extraídos:", {
        nome,
        raca,
        especie,
        sexo,
        idade,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado
      });

      const fotoUrl = req.file ? `/uploads/${req.file.filename}` : null;
      console.log("Foto URL:", fotoUrl);


      const novoPet: CreatePetDTO = {
        nome,
        raca: raca || null,
        especie: especie || null,
        sexo,
        idade: idade ? parseInt(idade, 10) : null,
        logradouro,
        numero: numero || null,
        complemento: complemento || null,
        bairro,
        cidade,
        estado,
        criado_em: new Date().toISOString()
      };

      console.log("Pet a ser inserido:", novoPet);

      // Chama a regra de negócio
      console.log("Chamando PetRN.insertPet...");
      const resultado = await petRN.insertPet(novoPet, fotoUrl);
      console.log("Pet inserido com sucesso:", resultado);

      res.status(201).send('<p>Animal cadastrado com sucesso!</p>');

    } catch (error: any) {
      console.error("=== ERRO CAPTURADO NO CONTROLLER ===");
      console.error("Erro completo:", error);

      // Se for erro de validação da PetRN, retorna 400 Bad Request
      if (error.message.includes('obrigatório') || error.message.includes('não pode ser')) {
        res.status(400).send('<p>Erro de validação: ' + error.message + '</p>');
      } else {
        // Se for erro de banco ou outro, retorna 500 Internal Server Error
        res.status(500).send('<p>Erro interno do servidor: ' + error.message + '</p>');
      }
    }
  }
}
