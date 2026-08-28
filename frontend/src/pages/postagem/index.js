import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obterUsuarioLogado } from '../../utils/auth';

const LIMITE_CARACTERES_COMENTARIO = 280;

function Postagem({ vetorP, vetorU, vetorC, vetorR, vetorComentarios, comentar, curtir, descurtir, repostar, desrepostar, remover }) {

    const { id: idParam } = useParams();
    const postagemId = Number(idParam);
    const navigate = useNavigate();
    const usuarioAutenticado = obterUsuarioLogado();
    const usuarioLogado = usuarioAutenticado?.usuarioId;
    const [textoComentario, setTextoComentario] = useState('');

    useEffect(() => {
        if (!usuarioAutenticado) {
            navigate('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const postagem = vetorP.find(p => p.postagemId === postagemId);
    const autor = vetorU.find(u => u.usuarioId === postagem?.usuarioPostagemId);
    const nomeAutor = autor ? autor.nome : 'Usuário desconhecido';

    //acha os comentários dessa postagem: pega os vínculos e resolve o texto de cada um na lista de postagens
    const comentariosDoPost = vetorComentarios
        .filter(c => c.postagemId === postagemId)
        .map(c => vetorP.find(p => p.postagemId === c.comentarioId))
        .filter(Boolean);

    const curtida = vetorC.find(like => like.usuarioId === usuarioLogado && like.postagemId === postagemId);
    const idCurtida = curtida ? curtida.id : null;
    const botaoCurtida = curtida ? curtida.botaoCurtida : false;

    const repostagem = vetorR.find(r => r.usuarioId === usuarioLogado && r.id === postagemId);
    const idRepostagem = repostagem ? repostagem.id : null;
    const botaoRepost = repostagem ? repostagem.botaoRepost : false;

    const handleCurtir = () => {
        if (!botaoCurtida) curtir(postagemId, usuarioLogado);
        else descurtir(postagemId, usuarioLogado, idCurtida);
    }

    const handleRepost = () => {
        if (!botaoRepost) repostar(postagemId, usuarioLogado);
        else desrepostar(postagemId, idRepostagem);
    }

    const handleRemover = () => {
        remover(postagemId);
        navigate('/inicio');
    }

    const handleComentar = async () => {
        const sucesso = await comentar(postagemId, {
            usuarioPostagemId: usuarioLogado,
            texto: textoComentario
        });
        if (sucesso) {
            setTextoComentario('');
        }
    }

    if (!postagem) {
        return (
            <div className="tela-perfil">
                <Link className="link-sutil" to="/inicio">← início</Link>
                <p className="post-comentarios">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="tela-perfil">
            <Link className="link-sutil" to="/inicio">← início</Link>

            <div className="post-card">
                <div className="post-cabecalho">
                    <span className="avatar"></span>
                    <Link className="post-handle" to={`/perfil/${postagem.usuarioPostagemId}`}>@{nomeAutor}</Link>
                </div>
                <p className="post-texto">{postagem.texto}</p>
                <div className="post-acoes">
                    {postagem.usuarioPostagemId === usuarioLogado && (
                        <button className="post-acao" onClick={handleRemover}>Remover</button>
                    )}
                    <button className="post-acao" onClick={handleCurtir}>
                        {botaoCurtida ? "Descurtir" : "Curtir"} · {postagem.curtidas}
                    </button>
                    <button className="post-acao" onClick={handleRepost}>
                        {botaoRepost ? "Remover repost" : "Repostar"} · {postagem.reposts}
                    </button>
                    <span className="post-comentarios">{postagem.comentarios} comentários</span>
                </div>
            </div>

            <div className="compositor">
                <textarea
                    className="campo"
                    placeholder="Escreva um comentário..."
                    value={textoComentario}
                    onChange={(e) => setTextoComentario(e.target.value)}
                    maxLength={LIMITE_CARACTERES_COMENTARIO}
                />
                <div className="compositor-rodape">
                    <span className={
                        "contador-caracteres" +
                        (LIMITE_CARACTERES_COMENTARIO - textoComentario.length <= 20 ? " contador-perto-limite" : "")
                    }>
                        {LIMITE_CARACTERES_COMENTARIO - textoComentario.length}
                    </span>
                    <button className="botao-primario" onClick={handleComentar}>Comentar</button>
                </div>
            </div>

            <div className="lista-posts">
                {comentariosDoPost.length === 0 && (
                    <p className="post-comentarios">Nenhum comentário ainda.</p>
                )}
                {comentariosDoPost.map((c) => {
                    const autorComentario = vetorU.find(u => u.usuarioId === c.usuarioPostagemId);
                    const nomeAutorComentario = autorComentario ? autorComentario.nome : 'Usuário desconhecido';
                    return (
                        <div className="post-card" key={c.postagemId}>
                            <div className="post-cabecalho">
                                <span className="avatar"></span>
                                <Link className="post-handle" to={`/perfil/${c.usuarioPostagemId}`}>@{nomeAutorComentario}</Link>
                            </div>
                            <p className="post-texto">{c.texto}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Postagem;
