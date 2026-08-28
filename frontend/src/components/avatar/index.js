import { urlFoto } from '../../utils/api';

//avatar de um usuário: mostra a foto de perfil se tiver, senão o círculo padrão
function Avatar({ usuario, tamanho }) {
    const foto = usuario?.fotoPerfil ? urlFoto(usuario.fotoPerfil) : null;
    const estilo = tamanho ? { width: tamanho, height: tamanho } : undefined;

    if (foto) {
        return <img className="avatar" src={foto} alt={usuario.nome || 'avatar'} style={estilo}/>;
    }
    return <span className="avatar" style={estilo}></span>;
}

export default Avatar;
