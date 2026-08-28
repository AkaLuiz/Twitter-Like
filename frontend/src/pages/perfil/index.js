import {useState, useEffect} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obterUsuarioLogado } from '../../utils/auth';
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
        fetch('http://localhost:8090/liste/usuarios/' + id)
          .then(retorno => retorno.json())
          .then(retorno_convertido => setUsuario(retorno_convertido));
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [id]);
    

      const seguidores = vetorS.find(follow => follow.usuarioSeguidoId === id && follow.usuarioSeguindoId === usuarioLogado);
      const botaoSeguir = seguidores ? true : false;
      console.log(botaoSeguir);
      
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
        <>
            {
                usuarioLogado === id
                ?
                <div>
                    <p>Perfil de: {usuario.nome || "Carregando..." }</p>
                    <p>seguidores: {usuario.seguidores}</p>
                    <p>seguindo: {usuario.seguindo}</p>

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
                                    <fieldset>
                                    <p>{donoRepost}</p>
                                    <Link to={`/perfil/${id}`}
                                    >{usuario.nome}
                                    </Link>
                                    <p>{obj.texto}</p>

                                    {   
                                        !repostagem
                                        ?
                                        <input
                                        type="button"
                                        value={"Remover"}
                                        onClick={() => remover(obj.postagemId)}
                                        />
                                        :
                                        <div></div>
                                    }
    
                                    <input
                                        type="button"
                                        value={botaoCurtida ? "Descurtir" : "Curtir"}
                                        onClick={() => handleCurtir(botaoCurtida, obj.postagemId, idCurtida)}
                                    /> {obj.curtidas}

                                    {
                                        botaoRepost 
                                        ?
                                        <div>
                                            <input
                                            type="button"
                                            value={"Remover repost"}
                                            onClick={() => handleRepost(botaoRepost, idPostRepostado, idRepostagem)}
                                            /> {obj.reposts}
                                        </div>
            
                                        :
                                        <div>
                                            <input
                                            type="button"
                                            value={"Repostar"}
                                            onClick={() => handleRepost(botaoRepost, idPostRepostado, idRepostagem)}
                                            /> {obj.reposts}
                                        </div>
                                        
                                    }
                                    
            
                                    <p>Comentários: {obj.comentarios}</p>
                                    </fieldset>
                                    :
                                    <></>
                                }
                                </>
                                )
                        })
                    }

                </div>

                :
                <div>
                    <p>Perfil de: {usuario.nome || "Carregando..." }</p>
                    <p>seguidores: {usuario.seguidores}</p>
                    <p>seguindo: {usuario.seguindo}</p>


                    <input type='button' onClick={handleSeguir} value={botaoSeguir ? "Desseguir" : "Seguir"}></input>

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
                                    <fieldset>
                                    <p>{usuario.nome}</p>
                                    <Link to={`/perfil/${id}`}
                                    >{usuario.nome}
                                    </Link>
                                    <p>{obj.texto}</p>
    
                                    <input
                                        type="button"
                                        value={botaoCurtida ? "Descurtir" : "Curtir"}
                                        onClick={() => handleCurtir(botaoCurtida, obj.postagemId, idCurtida)}
                                    /> {obj.curtidas}
                                    {
                                        botaoRepost 
                                        ?
                                        <div>
                                            <input
                                            type="button"
                                            value={"Remover repost"}
                                            onClick={() => handleRepost(botaoRepost, idPostRepostado, idRepostagem)}
                                            /> {obj.reposts}
                                        </div>
            
                                        :
                                        <div>
                                            <input
                                            type="button"
                                            value={"Repostar"}
                                            onClick={() => handleRepost(botaoRepost, idPostRepostado, idRepostagem)}
                                            /> {obj.reposts}
                                        </div>
                                        
                                    }
                                    
            
                                    <p>Comentários: {obj.comentarios}</p>
                                    </fieldset>
                                    :
                                    <></>
                                }

                                </>
                                )
                        })
                    }

                </div>
            }
            
        </>
    )
}

export default Perfil;