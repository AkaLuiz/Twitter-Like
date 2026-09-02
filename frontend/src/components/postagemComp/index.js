import { useEffect, useState } from "react";
import {Link} from 'react-router-dom'
import Avatar from '../avatar';
import { resolverRepost } from '../../utils/repost';

const OPCOES_POR_PAGINA = [10, 15, 20];

function PostComp({vetorR, vetorP, vetorU, vetorC, vetorComentarios, remover, repostar, desrepostar, curtir, descurtir, idUsuarioLogado, nomeUsuarioLogado}) {

    //comentários são postagens por baixo dos panos, mas não devem aparecer soltos no feed
    const idsComentarios = new Set(vetorComentarios.map(c => c.comentarioId));
    const vetorInvertido = [...vetorP].filter(p => !idsComentarios.has(p.postagemId)).reverse();

    const [pagina, setPagina] = useState(0);
    const [porPagina, setPorPagina] = useState(OPCOES_POR_PAGINA[1]);
    const totalPaginas = Math.max(1, Math.ceil(vetorInvertido.length / porPagina));

    //se um post sumir da lista (removido, ou trocou de página) e a página atual deixar de existir, volta pra última válida
    useEffect(() => {
        if (pagina > totalPaginas - 1) {
            setPagina(Math.max(0, totalPaginas - 1));
        }
    }, [totalPaginas, pagina]);

    const inicio = pagina * porPagina;
    const vetorDaPagina = vetorInvertido.slice(inicio, inicio + porPagina);

    const handleTrocarPorPagina = (novoValor) => {
        setPorPagina(novoValor);
        setPagina(0);
    }

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
        <>
        <div className="lista-posts">
            {

            vetorDaPagina.map((obj) => {

                //autor real do texto (o dono do post original, não de quem repostou)
                const { ehRepost, postagemOriginal, autor, reposter } = resolverRepost(obj, vetorP, vetorR, vetorU);
                const nomeAutor = autor ? autor.nome : 'Usuário desconhecido';
                const donoRepost = ehRepost ? 'Repost de: ' + (reposter ? reposter.nome : 'Usuário desconhecido') : 'Post original';

                // Encontre uma curtida especifica
                const curtida = vetorC.find(like => like.usuarioId === idUsuarioLogado && like.postagemId === obj.postagemId)
                // Id da curtida
                const idCurtida = curtida ? curtida.id : 'curtida sem Id';
                // booleano da curtida
                const botaoCurtida = curtida ? curtida.botaoCurtida : false;

                //repost do usuário logado em cima do post original (pra saber se já repostou e com que id),
                //independente de qual card (original ou repost de outra pessoa) está sendo mostrado
                const meuRepost = vetorR.find(repost => repost.usuarioId === idUsuarioLogado && repost.postagemId === postagemOriginal.postagemId)
                const idRepostagem = meuRepost ? meuRepost.id : null;
                const botaoRepost = !!meuRepost;

                const postagemDono = obj.usuarioPostagemId === idUsuarioLogado;

                    return(
                        <div className="post-card" key={obj.postagemId}>
                        <p className="post-repost-de">{donoRepost}</p>
                        <div className="post-cabecalho">
                            <Avatar usuario={autor}/>
                            <Link className="post-handle" to={`/perfil/${postagemOriginal.usuarioPostagemId}`}
                            state={{nomeUsuario:nomeAutor, id:postagemOriginal.usuarioPostagemId, usuarioLogado: idUsuarioLogado}}
                            >@{nomeAutor}
                            </Link>
                        </div>
                        <p className="post-texto">{obj.texto}</p>
                        <div className="post-acoes">
                            {
                                postagemDono && !ehRepost
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
                                <button className="post-acao" onClick={() => handleRepost(botaoRepost, postagemOriginal.postagemId, idRepostagem)}>
                                    Remover repost · {postagemOriginal.reposts}
                                </button>
                                :
                                <button className="post-acao" onClick={() => handleRepost(botaoRepost, postagemOriginal.postagemId, idRepostagem)}>
                                    Repostar · {postagemOriginal.reposts}
                                </button>
                            }
                            <Link className="post-acao" to={`/postagem/${obj.postagemId}`}>{obj.comentarios} comentários</Link>
                        </div>
                        </div>
                    )
                })
            }
        </div>

        <div className="paginacao">
            <button className="post-acao" onClick={() => setPagina(p => Math.max(0, p - 1))} disabled={pagina === 0}>
                Anterior
            </button>
            <span className="paginacao-info">Página {pagina + 1} de {totalPaginas}</span>
            <button className="post-acao" onClick={() => setPagina(p => Math.min(totalPaginas - 1, p + 1))} disabled={pagina >= totalPaginas - 1}>
                Próxima
            </button>
            <select className="campo campo-paginacao" value={porPagina} onChange={(e) => handleTrocarPorPagina(Number(e.target.value))}>
                {OPCOES_POR_PAGINA.map(opcao => (
                    <option key={opcao} value={opcao}>{opcao} por página</option>
                ))}
            </select>
        </div>
        </>
    );
}

export default PostComp;