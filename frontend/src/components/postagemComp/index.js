import { useEffect, useState } from "react";
import {Link} from 'react-router-dom'

function PostComp({vetorR, vetorP, vetorU, vetorC, vetorComentarios, remover, repostar, desrepostar, curtir, descurtir, idUsuarioLogado, nomeUsuarioLogado}) {

    //comentários são postagens por baixo dos panos, mas não devem aparecer soltos no feed
    const idsComentarios = new Set(vetorComentarios.map(c => c.comentarioId));
    const vetorInvertido = [...vetorP].filter(p => !idsComentarios.has(p.postagemId)).reverse();
    const [idPostagem, setIdPostagem] = useState();
    
    const [objCurtida, setObjCurtida] = useState({
        usuarioId: idUsuarioLogado,
        postagemId: idPostagem
    });

    useEffect(() => {
        if (idPostagem) {
            setObjCurtida(prevState => ({
                ...prevState,
                postagemId: idPostagem
            }));
        }
    }, [idPostagem]);

    const handleCurtir = (botao, postId, idC) => {
        if(botao === false){
            curtir(postId, idUsuarioLogado)
        }
        else{
            descurtir(postId, idUsuarioLogado, idC)
        }
    }

    const handleRepost = (botao, postId, repostId) => {
        if(botao === false){
            repostar(postId, idUsuarioLogado);
        }
        
        
        else{
            desrepostar(postId, repostId);
        }
    }
    
    return (
        <div className="lista-posts">
            {

            vetorInvertido.map((obj, indice) => {
                
                // Encontre o usuário com o id correspondente
                const usuario = vetorU.find(user => user.usuarioId === obj.usuarioPostagemId);
                const idUsuario = vetorU.find(user => user.id = obj.usuarioPostagemId).id;
                // Se o usuário for encontrado, pega o nome
                const nomeUsuario = usuario ? usuario.nome : 'Usuário desconhecido';


                // Encontre uma curtida especifica
                const curtida = vetorC.find(like => like.usuarioId === idUsuarioLogado && like.postagemId === obj.postagemId)
                // Id da curtida
                const idCurtida = curtida ? curtida.id : 'curtida sem Id';
                // booleano da curtida
                const botaoCurtida = curtida ? curtida.botaoCurtida : false;


                // Encontre um repost especifico
                const repostagem = vetorR.find(repost => repost.usuarioId === idUsuarioLogado && repost.id === obj.postagemId)
                // Encontre os reposts do logado
                const repostagemDono = vetorR.find(repost => repost.usuarioId === obj.usuarioPostagemId && repost.id === obj.postagemId)
                // Encontre os posts do logado
                const postagemDono = vetorP.find(post => post.usuarioPostagemId === idUsuarioLogado && post.usuarioPostagemId === obj.usuarioPostagemId)

                const idRepostagem = repostagem ? repostagem.id : 'respostagem sem Id';
                const idPostRepostado = repostagem ? repostagem.postagemId : obj.postagemId;
                const botaoRepost = repostagem ? repostagem.botaoRepost : false;
                const donoRepost = repostagemDono ? 'Repost de: '+ usuario.nome : 'Post original';
                const postagemRepostada = vetorP.find(post => post.postagemId ===  idPostRepostado);
                const idUsuarioDaPostagemRepostada = postagemRepostada ? postagemRepostada.usuarioPostagemId : "Usuário sem Id"

                // Encontre o usuário com o id correspondente
                const nomeUsuarioRepostado = vetorU.find(user => user.usuarioId === idUsuarioDaPostagemRepostada);
                // Id do usuario de um repost
                const nomeUsuarioRepost = nomeUsuarioRepostado ? nomeUsuarioRepostado.nome : 'Usuário desconhecido';
                // Retorna o nome do usuário que postou o post
                const UsuarioNome = repostagem ? nomeUsuarioRepost : nomeUsuario;
            
                

                    return(
                        <div className="post-card" key={indice}>
                        <p className="post-repost-de">{donoRepost}</p>
                        <div className="post-cabecalho">
                            <span className="avatar"></span>
                            <Link className="post-handle" to={`/perfil/${idUsuario}`}
                            state={{nomeUsuario:UsuarioNome, id:idUsuario, usuarioLogado: idUsuarioLogado}}
                            >@{UsuarioNome}
                            </Link>
                        </div>
                        <p className="post-texto">{obj.texto}</p>
                        <div className="post-acoes">
                            {
                                postagemDono && !repostagem
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
                    )
                })
            }
        </div>
    );
}

export default PostComp;