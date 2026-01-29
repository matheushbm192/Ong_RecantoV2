
    export interface Usuario {
        id: number;
        nome: string;
        sobrenome: string;
        email: string;
        senha: string;
        dataNascimento: string;
        cpf: string;    
        telefone: string;
        tipo_usuario: "COMUM" | "VOLUNTARIO" | "ADMINISTRADOR";
        escolaridade?: string | null;
        possuiPet: boolean;
        logradouro?: string;
        numero?: string | null;
        complemento?: string | null;
        bairro?: string | null;
        cidade?:  string | null;
        estado?: string | null;
        contribuir_ong: boolean; //TROCAR NO FRONT PARA BOOL
        deseja_adotar: boolean; 
        criado_em: string;
    }