export interface noticia {
    id: number;
    id_autor: number;
    titulo: string;
    corpo: string;
    data_publicacao?: string | null;
    categoria: string; 
}