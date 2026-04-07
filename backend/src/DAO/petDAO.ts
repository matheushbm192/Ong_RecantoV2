import { TransactionSql }  from "postgres";
import sql from "../database/databaseClient";
import { CreatePetDTO, Pet } from "../models/petModel";


export class PetDAO {
    // retorna todos os pets cadastrados no sistema
    async selectPets(): Promise<Pet[]> {
        try {
            console.log("🔍 [DAO - selectPets] Buscando todos os pets com fotos...");
            const petsComFotos = await sql<any[]>`
            SELECT 
                p.id,
                p.nome,
                p.raca,
                p.especie,
                p.sexo,
                p.idade,
                p.complemento,
                p.logradouro,
                p.numero,
                p.bairro,
                p.cidade,
                p.estado,
                p.criado_em,
                p.id_usuario,
                p.data_adocao,
                fp.id as foto_id,
                fp.foto_url
            FROM pet p
            LEFT JOIN foto_pet fp ON p.id = fp.id_pet
            ORDER BY p.id, fp.id
        `;

            console.log(`📊 [DAO - selectPets] ${petsComFotos.length} linhas retornadas da query`);

            // Transforma o resultado em um array de pets com suas fotos
            const petsMap = new Map<number, Pet>();

            petsComFotos.forEach((row) => {
                if (!petsMap.has(row.id)) {
                    petsMap.set(row.id, {
                        id: row.id,
                        nome: row.nome,
                        raca: row.raca,
                        especie: row.especie,
                        sexo: row.sexo,
                        idade: row.idade,
                        complemento: row.complemento,
                        logradouro: row.logradouro,
                        numero: row.numero,
                        bairro: row.bairro,
                        cidade: row.cidade,
                        estado: row.estado,
                        criado_em: row.criado_em,
                        id_usuario: row.id_usuario,
                        data_adocao: row.data_adocao,
                        fotos: []
                    });
                }

                if (row.foto_id) {
                    console.log(`📸 [DAO - selectPets] Pet ID ${row.id} tem foto: ${row.foto_url}`);
                    petsMap.get(row.id)?.fotos?.push({
                        id: row.foto_id,
                        id_pet: row.id,
                        foto_url: row.foto_url
                    });
                }
            });

            const resultado = Array.from(petsMap.values());
            console.log(`✅ [DAO - selectPets] Retornando ${resultado.length} pets processados`);
            return resultado;
        } catch (error) {
            console.error('❌ Erro ao buscar pets:', error);
            throw error; // sobe pro controller
        }
    }

    //DAO - ENVIA PARA O BANCO
    async insertPet( pet: CreatePetDTO, fotoUrl: string | null): Promise<Pet> {

        try {
            console.log("📸 [DAO - insertPet] Foto URL recebida:", fotoUrl);
            const [petInserido] = await sql.begin(
                async (tx: any) => {

                    const pets = await tx<Pet[]>`
                    INSERT INTO pet (
                        nome,
                        raca,
                        especie,
                        sexo,
                        idade,
                        complemento,
                        logradouro,
                        numero,
                        bairro,
                        cidade,
                        estado,
                        criado_em,
                        id_usuario
                    ) VALUES (
                        ${pet.nome},
                        ${pet.raca || null},
                        ${pet.especie || null},
                        ${pet.sexo},
                        ${pet.idade || null},
                        ${pet.complemento || null},
                        ${pet.logradouro || null},
                        ${pet.numero || null},
                        ${pet.bairro || null},
                        ${pet.cidade || null},
                        ${pet.estado || null},
                        ${pet.criado_em},
                        ${pet.id_usuario || null}
                    )
                    RETURNING *
                `;

                    const petCriado = pets[0];
                    console.log("✅ [DAO - insertPet] Pet criado com ID:", petCriado.id);

                    if (fotoUrl) {
                        console.log(`📷 [DAO - insertPet] Inserindo foto: ${fotoUrl} para pet ID: ${petCriado.id}`);
                        await tx`
                        INSERT INTO foto_pet (id_pet, foto_url)
                        VALUES (${petCriado.id}, ${fotoUrl})
                    `;
                        console.log("✅ [DAO - insertPet] Foto inserida com sucesso!");
                    } else {
                        console.log("⚠️ [DAO - insertPet] Nenhuma foto para inserir (fotoUrl é nulo)");
                    }

                    return pets;
                }
            );

            return petInserido;

        } catch (error) {
            console.error('❌ Erro ao inserir pet:', error);
            throw error;
        }
    }



    async selectPetById(id_pet: number) {
        try {
            const petsComFotos = await sql<any[]>`
            SELECT 
                p.id,
                p.nome,
                p.raca,
                p.especie,
                p.sexo,
                p.idade,
                p.complemento,
                p.logradouro,
                p.numero,
                p.bairro,
                p.cidade,
                p.estado,
                p.criado_em,
                p.id_usuario,
                p.data_adocao,
                fp.id as foto_id,
                fp.foto_url
            FROM pet p
            LEFT JOIN foto_pet fp ON p.id = fp.id_pet
            WHERE p.id = ${id_pet}
            ORDER BY p.id, fp.id
        `;

            if (petsComFotos.length === 0) {
                throw new Error('Pet não encontrado');
            }

            // Transforma o resultado em um pet com suas fotos
            const petMap = new Map<number, Pet>();

            petsComFotos.forEach((row) => {
                if (!petMap.has(row.id)) {
                    petMap.set(row.id, {
                        id: row.id,
                        nome: row.nome,
                        raca: row.raca,
                        especie: row.especie,
                        sexo: row.sexo,
                        idade: row.idade,
                        complemento: row.complemento,
                        logradouro: row.logradouro,
                        numero: row.numero,
                        bairro: row.bairro,
                        cidade: row.cidade,
                        estado: row.estado,
                        criado_em: row.criado_em,
                        id_usuario: row.id_usuario,
                        data_adocao: row.data_adocao,
                        fotos: []
                    });
                }

                if (row.foto_id) {
                    petMap.get(row.id)?.fotos?.push({
                        id: row.foto_id,
                        id_pet: row.id,
                        foto_url: row.foto_url
                    });
                }
            });

            return Array.from(petMap.values())[0];
        } catch (error) {
            console.error('Erro ao buscar pet por ID:', error);
            throw error;
        }
    }

    async selectPetsPorUsuarioId(id_usuario: number): Promise<Pet[]> {
        try {
            const petsComFotos = await sql<any[]>`
            SELECT 
                p.id,
                p.nome,
                p.raca,
                p.especie,
                p.sexo,
                p.idade,
                p.complemento,
                p.logradouro,
                p.numero,
                p.bairro,
                p.cidade,
                p.estado,
                p.criado_em,
                p.id_usuario,
                p.data_adocao,
                fp.id as foto_id,
                fp.foto_url
            FROM pet p
            LEFT JOIN foto_pet fp ON p.id = fp.id_pet
            WHERE p.id_usuario = ${id_usuario}
            ORDER BY p.id, fp.id
        `;

            // Transforma o resultado em um array de pets com suas fotos
            const petsMap = new Map<number, Pet>();

            petsComFotos.forEach((row) => {
                if (!petsMap.has(row.id)) {
                    petsMap.set(row.id, {
                        id: row.id,
                        nome: row.nome,
                        raca: row.raca,
                        especie: row.especie,
                        sexo: row.sexo,
                        idade: row.idade,
                        complemento: row.complemento,
                        logradouro: row.logradouro,
                        numero: row.numero,
                        bairro: row.bairro,
                        cidade: row.cidade,
                        estado: row.estado,
                        criado_em: row.criado_em,
                        id_usuario: row.id_usuario,
                        data_adocao: row.data_adocao,
                        fotos: []
                    });
                }

                if (row.foto_id) {
                    petsMap.get(row.id)?.fotos?.push({
                        id: row.foto_id,
                        id_pet: row.id,
                        foto_url: row.foto_url
                    });
                }
            });

            return Array.from(petsMap.values());
        } catch (error) {
            console.error('Erro ao buscar pets por usuário:', error);
            throw error; 
        }
    }
}




