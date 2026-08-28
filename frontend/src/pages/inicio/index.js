import { useLocation, useNavigate } from 'react-router-dom';
import PostComp from '../../components/postagemComp';
import { useEffect, useState } from 'react';

function Inicio({postar, remover, repostar, desrepostar, vetorR, vetorP, vetorU, vetorC, curtir, descurtir, botaoCurtida, selecionar}) {
    
    const location = useLocation();
    const navigate = useNavigate();
    const { nomeUsuario, id } = location.state || {}; // Obtém o nome do usuário do estado passado via navigate
    const [texto, setTexto] = useState([]);
    const [objPostagem, setObjPostagem] = useState({
        usuarioPostagemId: id,
        texto: texto
    });

    useEffect(() => {
        if (id) {
            setObjPostagem(prevState => ({
                ...prevState,
                usuarioPostagemId: id, texto: texto
            }));
        }
    }, [id, texto]);

    const handlePerfil = () =>{
        navigate('/perfil/'+id, { state: { nomeUsuario: nomeUsuario, id: id, usuarioLogado: id} });
    }

    return (
        <div>
            <center>
            <table>

                <tbody>
                    <tr>
                        <td>
                        <input type='button' onClick={handlePerfil} value='Perfil'></input>
                        </td>
                        <td>
                        <center>
                            <h1>Bem-vindo, {nomeUsuario || 'Usuário desconhecido'}!</h1> {/* Exibe o nome do usuário ou "Usuário" como padrão */}
                            <p>Poste algo:</p>
                            <form>
                            <textarea placeholder='Digita um trem aí...' name='texto' onChange={(e) => setTexto(e.target.value)} required/>
                            <input onClick={() => postar(objPostagem)} type='button'  value='Postar'/>
                            </form>
                            <PostComp vetorR={vetorR} vetorP={vetorP} vetorU={vetorU} vetorC={vetorC} remover={remover} 
                            repostar={repostar} desrepostar={desrepostar} curtir={curtir} descurtir={descurtir}
                            idUsuarioLogado={id} nomeUsuarioLogado={nomeUsuario} botaoCurtida={botaoCurtida} selecionar={selecionar}/>
                        </center> 
                        </td>
                    </tr>
                </tbody>
            </table>
            </center>
        </div>
    );
}

export default Inicio;
