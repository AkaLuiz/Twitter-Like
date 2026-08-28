import { useNavigate } from 'react-router-dom';
import PostComp from '../../components/postagemComp';
import { useEffect, useState } from 'react';
import { obterUsuarioLogado, limparUsuarioLogado } from '../../utils/auth';

function Inicio({postar, remover, repostar, desrepostar, vetorR, vetorP, vetorU, vetorC, curtir, descurtir, botaoCurtida, selecionar}) {

    const navigate = useNavigate();
    const usuarioLogado = obterUsuarioLogado();
    const nomeUsuario = usuarioLogado?.nome;
    const id = usuarioLogado?.usuarioId;
    const [texto, setTexto] = useState([]);
    const [objPostagem, setObjPostagem] = useState({
        usuarioPostagemId: id,
        texto: texto
    });

    useEffect(() => {
        if (!usuarioLogado) {
            navigate('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (id) {
            setObjPostagem(prevState => ({
                ...prevState,
                usuarioPostagemId: id, texto: texto
            }));
        }
    }, [id, texto]);

    const handlePerfil = () =>{
        navigate('/perfil/'+id);
    }

    const handleSair = () => {
        limparUsuarioLogado();
        navigate('/login');
    }

    return (
        <div>
            <center>
            <table>

                <tbody>
                    <tr>
                        <td>
                        <input type='button' onClick={handlePerfil} value='Perfil'></input>
                        <input type='button' onClick={handleSair} value='Sair'></input>
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
