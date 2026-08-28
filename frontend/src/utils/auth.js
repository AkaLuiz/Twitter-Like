const CHAVE_USUARIO_LOGADO = 'usuarioLogado';

export function salvarUsuarioLogado(usuario) {
    try {
        localStorage.setItem(CHAVE_USUARIO_LOGADO, JSON.stringify(usuario));
    } catch (erro) {
        console.error('Não foi possível salvar o usuário logado:', erro);
    }
}

export function obterUsuarioLogado() {
    try {
        const dados = localStorage.getItem(CHAVE_USUARIO_LOGADO);
        return dados ? JSON.parse(dados) : null;
    } catch (erro) {
        console.error('Não foi possível ler o usuário logado:', erro);
        return null;
    }
}

export function limparUsuarioLogado() {
    try {
        localStorage.removeItem(CHAVE_USUARIO_LOGADO);
    } catch (erro) {
        console.error('Não foi possível limpar o usuário logado:', erro);
    }
}

//token JWT salvo junto do usuário logado, usado no header Authorization das chamadas protegidas
export function obterToken() {
    return obterUsuarioLogado()?.token ?? '';
}
