import { useNavigate } from 'react-router-dom';
import PostComp from '../../components/postagemComp';
import Logo from '../../components/logo';
import { useEffect, useState } from 'react';
import { obterUsuarioLogado, limparUsuarioLogado } from '../../utils/auth';

function Inicio({postar, remover, repostar, desrepostar, vetorR, vetorP, vetorU, vetorC, curtir, descurtir, botaoCurtida, selecionar}) {

    const navigate = useNavigate();
    const usuarioLogado = obterUsuarioLogado();
    const nomeUsuario = usuarioLogado?.nome;
    const id = usuarioLogado?.usuarioId;
    const [texto, setTexto] = useState('');
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

    const handlePostar = async () => {
        const sucesso = await postar(objPostagem);
        if (sucesso) {
            setTexto('');
        }
    }

    return (
        <div className="layout-app">
            <aside className="barra-lateral">
                <Logo tamanho={26}/>
                <div className="usuario-chip">
                    <span className="avatar"></span>
                    <span>@{nomeUsuario || 'usuário'}</span>
                </div>
                <nav className="nav-lista">
                    <button className="nav-item ativo">Início</button>
                    <button className="nav-item inerte" title="Em construção">Procurar</button>
                    <button className="nav-item inerte" title="Em construção">Notificações</button>
                    <button className="nav-item inerte" title="Em construção">Papo</button>
                    <button className="nav-item" onClick={handlePerfil}>Perfil</button>
                    <button className="nav-item inerte" title="Em construção">Configurações</button>
                </nav>
                <button className="link-sutil sair" onClick={handleSair}>sair</button>
            </aside>

            <main className="feed">
                <div className="compositor">
                    <textarea
                        className="campo"
                        placeholder='Digita um trem aí...'
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        required
                    />
                    <button className="botao-primario" onClick={handlePostar}>Postar</button>
                </div>
                <PostComp vetorR={vetorR} vetorP={vetorP} vetorU={vetorU} vetorC={vetorC} remover={remover}
                repostar={repostar} desrepostar={desrepostar} curtir={curtir} descurtir={descurtir}
                idUsuarioLogado={id} nomeUsuarioLogado={nomeUsuario} botaoCurtida={botaoCurtida} selecionar={selecionar}/>
            </main>

            <aside className="coluna-busca">
                <input className="campo campo-busca" type="text" placeholder="Buscar" title="Em construção" disabled/>
            </aside>
        </div>
    );
}

export default Inicio;
