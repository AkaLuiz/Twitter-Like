import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obterUsuarioLogado } from '../../utils/auth';
import Avatar from '../../components/avatar';
function Perfil({seguir, desseguir, postar, remover, curtir, descurtir, repostar, desrepostar, enviarFoto, vetorS, vetorP, vetorR, vetorU, vetorC, vetorComentarios}){

    const { id: idParam } = useParams();
    const id = Number(idParam);
    const navigate = useNavigate();
    const usuarioAutenticado = obterUsuarioLogado();
    const usuarioLogado = usuarioAutenticado?.usuarioId;
    //pega sempre da lista global (já atualizada pelo App.js) em vez de manter um fetch próprio
    //que ficava desatualizado, por exemplo depois de trocar a foto de perfil
    const usuario = vetorU.find(u => u.usuarioId === id) || {};
    //comentários são postagens por baixo dos panos, mas não devem aparecer soltos no perfil
    const idsComentarios = new Set(vetorComentarios.map(c => c.comentarioId));
    const vetorInvertido = [...vetorP].filter(p => !idsComentarios.has(p.postagemId)).reverse();

      useEffect(() => {
        if (!usuarioAutenticado) {
            navigate('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);


      const seguidores = vetorS.find(follow => follow.usuarioSeguidoId === id && follow.usuarioSeguindoId === usuarioLogado);
      const botaoSeguir = seguidores ? true : false;

      //seguido, seguindo
      const handleSeguir = () => {
        if(botaoSeguir === false){
            seguir(id, usuarioLogado);
        }
        else{
            desseguir(id, usuarioLogado);
        }
      }

      const handleCurtir = (botao, postId, idC) => {
        if(botao === false){
            curtir(postId, usuarioLogado)
        }
        else{
            descurtir(postId, usuarioLogado, idC)
        }
    }

    const handleRepost = (botao, postId, repostId) => {
        if(botao === false){
            repostar(postId, usuarioLogado);
        }


        else{
            desrepostar(postId, repostId);
        }
    }

    const handleTrocarFoto = (e) => {
        const arquivo = e.target.files[0];
        if (arquivo) {
            enviarFoto(usuarioLogado, arquivo);
        }
        e.target.value = '';
    }

    return(
        <div className="tela-perfil">
            <Link className="link-sutil" to="/inicio">← início</Link>
            {
                usuarioLogado === id
                ?
                <div>
                    <div className="cabecalho-perfil">
                        <div className="cabecalho-perfil-topo">
                            <Avatar usuario={usuario} tamanho={72}/>
                            <div>
                                <h2>{usuario.nome || "Carregando..." }</h2>
                                <label htmlFor="input-foto-perfil" className="link-sutil">Trocar foto</label>
                                <input
                                    id="input-foto-perfil"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleTrocarFoto}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                        <div className="estatisticas-perfil">
                            <span>{usuario.seguidores ?? 0} seguidores</span>
                            <span>{usuario.seguindo ?? 0} seguindo</span>
                        </div>
                    </div>

                    <div className="lista-posts">
                    {
                        vetorInvertido.map((obj, indice) => {

                            // Encontre uma curtida especifica
                            const curtida = vetorC.find(like => like.usuarioId === usuarioLogado && like.postagemId === obj.postagemId)
                            // Id da curtida
                            const idCurtida = curtida ? curtida.id : 'curtida sem Id';
                            // booleano da curtida
                            const botaoCurtida = curtida ? curtida.botaoCurtida : false;


                            // Encontre um repost especifico
                            const repostagem = vetorR.find(repost => repost.usuarioId === usuarioLogado && repost.id === obj.postagemId)
                            // Encontre os reposts do logado
                            const repostagemDono = vetorR.find(repost => repost.usuarioId === obj.usuarioPostagemId && repost.id === obj.postagemId)
                            // Encontre os posts do logado
                            const postagemDono = vetorP.find(post => post.usuarioPostagemId === usuarioLogado && post.usuarioPostagemId === obj.usuarioPostagemId)
                            const idRepostagem = repostagem ? repostagem.id : 'respostagem sem Id';
                            const idPostRepostado = repostagem ? repostagem.postagemId : obj.postagemId;
                            const botaoRepost = repostagem ? repostagem.botaoRepost : false;
                            const donoRepost = repostagemDono ? 'Repost de: '+ usuario.nome : 'Post original';
                            const postagemRepostada = vetorP.find(post => post.postagemId ===  idPostRepostado);
                            const idUsuarioDaPostagemRepostada = postagemRepostada ? postagemRepostada.usuarioPostagemId : "Usuário sem Id"

                            return(
                                <>
                                {
                                    postagemDono
                                    ?
                                    <div className="post-card">
                                    <p className="post-repost-de">{donoRepost}</p>
                                    <div className="post-cabecalho">
                                        <Avatar usuario={usuario}/>
                                        <Link className="post-handle" to={`/perfil/${id}`}
                                        >@{usuario.nome}
                                        </Link>
                                    </div>
                                    <p className="post-texto">{obj.texto}</p>

                                    <div className="post-acoes">
                                    {
                                        !repostagem
                                        ?
                                        <button className="post-acao" onClick={() => remover(obj.postagemId)}>Remover</button>
                                        :
                                        null
                                    }

                                    <button className="post-acao" onClick={() => handleCurtir(botaoCurtida, obj.postagemId, idCurtida)}>
                                        {botaoCurtida ? "Descurtir" : "Curtir"} · {obj.curtidas}
                                    </button>

                                    {
                                        botaoRepost
                                        ?
                                        <button className="post-acao" onClick={() => handleRepost(botaoRepost, idPostRepostado, idRepostagem)}>
                                            Remover repost · {obj.reposts}
                                        </button>
                                        :
                                        <button className="post-acao" onClick={() => handleRepost(botaoRepost, idPostRepostado, idRepostagem)}>
                                            Repostar · {obj.reposts}
                                        </button>
                                    }

                                    <Link className="post-acao" to={`/postagem/${obj.postagemId}`}>{obj.comentarios} comentários</Link>
                                    </div>
                                    </div>
                                    :
                                    <></>
                                }
                                </>
                                )
                        })
                    }
                    </div>

                </div>

                :
                <div>
                    <div className="cabecalho-perfil">
                        <div className="cabecalho-perfil-topo">
                            <Avatar usuario={usuario} tamanho={72}/>
                            <h2>{usuario.nome || "Carregando..." }</h2>
                        </div>
                        <div className="estatisticas-perfil">
                            <span>{usuario.seguidores ?? 0} seguidores</span>
                            <span>{usuario.seguindo ?? 0} seguindo</span>
                        </div>
                        <button className="botao-primario" onClick={handleSeguir}>{botaoSeguir ? "Desseguir" : "Seguir"}</button>
                    </div>

                    <div className="lista-posts">
                    {
                        vetorInvertido.map((obj, indice) => {

                            // Encontre uma curtida especifica
                            const curtida = vetorC.find(like => like.usuarioId === usuarioLogado && like.postagemId === obj.postagemId)
                            // Id da curtida
                            const idCurtida = curtida ? curtida.id : 'curtida sem Id';
                            // booleano da curtida
                            const botaoCurtida = curtida ? curtida.botaoCurtida : false;


                            // Encontre um repost especifico
                            const repostagem = vetorR.find(repost => repost.usuarioId === usuarioLogado && repost.id === obj.postagemId)
                            // Encontre os reposts do logado
                            const repostagemDono = vetorR.find(repost => repost.usuarioId === obj.usuarioPostagemId && repost.id === obj.postagemId)
                            // Encontre os posts do logado
                            const postagemDono = vetorP.find(post => post.usuarioPostagemId === id && post.usuarioPostagemId === obj.usuarioPostagemId)
                            const idRepostagem = repostagem ? repostagem.id : 'respostagem sem Id';
                            const idPostRepostado = repostagem ? repostagem.postagemId : obj.postagemId;
                            const botaoRepost = repostagem ? repostagem.botaoRepost : false;
                            const donoRepost = repostagemDono ? 'Repost de: '+ usuario.nome : 'Post original';
                            const postagemRepostada = vetorP.find(post => post.postagemId ===  idPostRepostado);
                            const idUsuarioDaPostagemRepostada = postagemRepostada ? postagemRepostada.usuarioPostagemId : "Usuário sem Id"

                            return(
                                <>
                                {
                                    postagemDono
                                    ?
                                    <div className="post-card">
                                    <p className="post-repost-de">{donoRepost}</p>
                                    <div className="post-cabecalho">
                                        <Avatar usuario={usuario}/>
                                        <Link className="post-handle" to={`/perfil/${id}`}
                                        >@{usuario.nome}
                                        </Link>
                                    </div>
                                    <p className="post-texto">{obj.texto}</p>

                                    <div className="post-acoes">
                                    <button className="post-acao" onClick={() => handleCurtir(botaoCurtida, obj.postagemId, idCurtida)}>
                                        {botaoCurtida ? "Descurtir" : "Curtir"} · {obj.curtidas}
                                    </button>
                                    {
                                        botaoRepost
                                        ?
                                        <button className="post-acao" onClick={() => handleRepost(botaoRepost, idPostRepostado, idRepostagem)}>
                                            Remover repost · {obj.reposts}
                                        </button>
                                        :
                                        <button className="post-acao" onClick={() => handleRepost(botaoRepost, idPostRepostado, idRepostagem)}>
                                            Repostar · {obj.reposts}
                                        </button>
                                    }

                                    <Link className="post-acao" to={`/postagem/${obj.postagemId}`}>{obj.comentarios} comentários</Link>
                                    </div>
                                    </div>
                                    :
                                    <></>
                                }

                                </>
                                )
                        })
                    }
                    </div>

                </div>
            }

        </div>
    )
}

export default Perfil;
