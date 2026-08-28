import {useState, useEffect} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obterUsuarioLogado } from '../../utils/auth';
import { API_URL } from '../../utils/api';
function Perfil({seguir, desseguir, postar, remover, curtir, descurtir, repostar, desrepostar, vetorS, vetorP, vetorR, vetorU, vetorC}){

    const { id: idParam } = useParams();
    const id = Number(idParam);
    const navigate = useNavigate();
    const usuarioAutenticado = obterUsuarioLogado();
    const usuarioLogado = usuarioAutenticado?.usuarioId;
    const [usuario, setUsuario] = useState({});
    const vetorInvertido = [...vetorP].reverse();

      useEffect(() => {
        if (!usuarioAutenticado) {
            navigate('/login');
            return;
        }
        fetch(API_URL + '/liste/usuarios/' + id)
          .then(retorno => retorno.json())
          .then(retorno_convertido => setUsuario(retorno_convertido));
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [id]);


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

    return(
        <div className="tela-perfil">
            <Link className="link-sutil" to="/inicio">← início</Link>
            {
                usuarioLogado === id
                ?
                <div>
                    <div className="cabecalho-perfil">
                        <h2>{usuario.nome || "Carregando..." }</h2>
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
                                        <span className="avatar"></span>
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

                                    <span className="post-comentarios">{obj.comentarios} comentários</span>
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
                        <h2>{usuario.nome || "Carregando..." }</h2>
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
                            const curtida = vetorC.find(like => like.usuarioId === id && like.postagemId === obj.postagemId)
                            // Id da curtida
                            const idCurtida = curtida ? curtida.id : 'curtida sem Id';
                            // booleano da curtida
                            const botaoCurtida = curtida ? curtida.botaoCurtida : false;


                            // Encontre um repost especifico
                            const repostagem = vetorR.find(repost => repost.usuarioId === id && repost.id === obj.postagemId)
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
                                        <span className="avatar"></span>
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

                                    <span className="post-comentarios">{obj.comentarios} comentários</span>
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
