import { TransactionSql }  from "postgres";
import sql from "../database/databaseClient";
import { CreatePetDTO, Pet } from "../models/petModel";


export class PetDAO {
    // retorna todos os pets cadastrados no sistema
    async selectPets(): Promise<Pet[]> {
        try {
            const pets = await sql<Pet[]>`
            SELECT * FROM pet
        `;
            return pets;
        } catch (error) {
            console.error('Erro ao buscar pets:', error);
            throw error; // sobe pro controller
        }
    }

    //DAO - ENVIA PARA O BANCO
    async insertPet( pet: CreatePetDTO,fotoUrl: string | null): Promise<Pet> {

        try {
            const [petInserido] = await sql.begin(
                async (tx: any) => {

                    const pets = await tx<Pet[]>`
                    INSERT INTO pet (
                        nome,
                        especie,
                        idade,
                        porte,
                        descricao
                    ) VALUES (
                        ${pet.nome},
                        ${pet.especie},
                        ${pet.idade},
                       
                    )
                    RETURNING *
                `;

                    const petCriado = pets[0];

                    if (fotoUrl) {
                        await tx`
                        INSERT INTO foto_pet (id_pet, url)
                        VALUES (${petCriado.id}, ${fotoUrl})
                    `;
                    }

                    return pets;
                }
            );

            return petInserido;

        } catch (error) {
            console.error('Erro ao inserir pet:', error);
            throw error;
        }
    }



    async selectPetById(id_pet: number) {
        const pet = await sql<Pet[]>`SELECT * FROM pet WHERE id_pet = ${id_pet}`
           
        if (pet.length === 0) {
            throw new Error('Pet não encontrado');
        }

        return pet[0];
    }

    async selectPetsPorUsuarioId(id_usuario: number): Promise<Pet[]> {
        try {
            const pets = await sql<Pet[]>`
            SELECT * FROM pet WHERE id_usuario = ${id_usuario}
        `;
            return pets;
        } catch (error) {
            console.error('Erro ao buscar pets por usuário:', error);
            throw error; 
        }
    }
}




