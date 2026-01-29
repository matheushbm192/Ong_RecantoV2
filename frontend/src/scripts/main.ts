import authService from "./services/authService";

export function atualizarInterfaceUsuario() {

    const user = authService.getTokenPayload();
    type MenuKey =
        | "home"
        | "adocao"
        | "animaisAdotados"
        | "cadastroAnimal"
        | "cadastroVoluntario"
        | "cadastroAdministrador"
        | "cadastroUsuario"
        | "pedidosAdocao"
        | "login";
    const menus: Record<MenuKey, HTMLElement | null> = {
        home: document.getElementById("menu-home"),
        adocao: document.getElementById("menu-adocao"),
        animaisAdotados: document.getElementById("menu-animais-adotados"),
        cadastroAnimal: document.getElementById("menu-cadastro-animal"),
        cadastroVoluntario: document.getElementById("menu-cadastro-voluntario"),
        cadastroAdministrador: document.getElementById("menu-cadastro-administrador"),
        cadastroUsuario: document.getElementById("menu-cadastro-usuario"),
        pedidosAdocao: document.getElementById("menu-pedidos-adocao"),
        login: document.getElementById("menu-login")
    };

    const mostrar = (id: MenuKey) => {
        const menu = menus[id];
        if (menu) {
            menu.style.display = "inline";
        }
    };

    const esconderTodos = () => {
        Object.values(menus).forEach(menu => {
            if (menu) menu.style.display = "none";
        });
    };


    const permissoes: Record<string, MenuKey[]> = {
    DESLOGADO: ["home", "adocao", "cadastroUsuario", "login"],
    COMUM: ["home", "adocao", "cadastroUsuario", "animaisAdotados"],
    VOLUNTARIO: ["home", "adocao", "cadastroUsuario", "animaisAdotados", "pedidosAdocao"],
    ADMINISTRADOR: Object.keys(menus) as MenuKey[]
    };

    esconderTodos();

    // Define o tipo do usuário
    const tipoUsuario: keyof typeof permissoes =
    user && user.id_usuario
        ? user.tipo_usuario
        : "DESLOGADO";

    // Mostra apenas o que é permitido
    permissoes[tipoUsuario].forEach(mostrar);
}


