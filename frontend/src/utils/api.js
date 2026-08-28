//monta a URL da API a partir do host que o navegador usou pra abrir a página
//(localhost pra você, o IP/hostname da máquina pra quem acessa pela rede)
export const API_URL = `http://${window.location.hostname}:8090`;

//monta a URL de uma foto de perfil salva no backend
export function urlFoto(nomeArquivo) {
    return nomeArquivo ? `${API_URL}/uploads/${nomeArquivo}` : null;
}
