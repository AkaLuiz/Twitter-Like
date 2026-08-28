//monta a URL da API a partir do host que o navegador usou pra abrir a página
//(localhost pra você, o IP/hostname da máquina pra quem acessa pela rede)
export const API_URL = `http://${window.location.hostname}:8090`;
