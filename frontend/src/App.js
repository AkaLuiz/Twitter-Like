import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Inicio from './pages/inicio/index';
import Cadastro from './pages/cadastro/index';
import Login from './pages/login/index';
import Perfil from './pages/perfil/index';
import Postagem from './pages/postagem/index';
import { obterToken, obterUsuarioLogado } from './utils/auth';
import { API_URL } from './utils/api';

function App() {
  //cabeçalhos usados em toda chamada que exige login
  const cabecalhosAutenticados = () => ({
    'Content-type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + obterToken()
  });

  //objeto postagem
  const postagem = {
    postagemId: 0,
    usuarioPostagemId: 0,
    curtidas: null,
    comentarios: null,
    reposts: null,
    texto: ''
  }

  //objeto seguidor
  const seguidor = {
    botaoSeguir: false,
    id: 0,
    usuarioSeguidoId: 0,
    usuarioSeguindoId: 0,
  }

  //obj usuario
  const usuario = {
    usuarioId: null,
    nome: '',
    email: '',
    senha: '',
    seguidores: null,
    seguindo: null
  }

  //obj Curtida
  const curtida = {
    id: 0,
    botaoCurtida: false,
    usuarioId: 0,
    postagemId: 0
  }

  //UseStates
  const [postagens, setPostagens] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [seguidores, setSeguidores] = useState([])
  const [curtidas, setCurtidas] = useState([])
  const [reposts, setReposts] = useState([])
  const [comentariosLista, setComentariosLista] = useState([])
  const [objPostagem, setObjPostagem] = useState(postagem)
  const [objUsuario, setObjUsuario] = useState(usuario)
  const [objSeguidor, setObjSeguidor] = useState(seguidor)
  const [btnCadastrar, setBtnCadastrar] = useState(true)

  //busca a lista de postagens atual no backend
  const buscarPostagens = () => {
    return fetch(API_URL + '/liste/postagens')
      .then(retorno => retorno.json())
      .then(retorno_convertido => setPostagens(retorno_convertido))
  }

  //busca a lista de usuarios atual no backend
  const buscarUsuarios = () => {
    return fetch(API_URL + '/liste/usuarios')
      .then(retorno => retorno.json())
      .then(retorno_convertido => setUsuarios(retorno_convertido))
  }

  //busca a lista de seguidores atual no backend
  const buscarSeguidores = () => {
    return fetch(API_URL + '/liste/seguidores')
      .then(retorno => retorno.json())
      .then(retorno_convertido => setSeguidores(retorno_convertido))
  }

  //busca a lista de curtidas atual no backend
  const buscarCurtidas = () => {
    return fetch(API_URL + '/liste/curtidas')
      .then(retorno => retorno.json())
      .then(retorno_convertido => setCurtidas(retorno_convertido))
  }

  //busca a lista de reposts atual no backend
  const buscarReposts = () => {
    return fetch(API_URL + '/liste/reposts')
      .then(retorno => retorno.json())
      .then(retorno_convertido => setReposts(retorno_convertido))
  }

  //busca os vínculos de comentários (qual postagem comenta qual) atual no backend
  const buscarComentarios = () => {
    return fetch(API_URL + '/liste/comentarios')
      .then(retorno => retorno.json())
      .then(retorno_convertido => setComentariosLista(retorno_convertido))
  }

  //carrega tudo quando o app abre
  useEffect(() => {
    buscarPostagens()
    buscarUsuarios()
    buscarSeguidores()
    buscarCurtidas()
    buscarReposts()
    buscarComentarios()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //dados do formulario usuario
  const aoDigitarUsu = (e) => {
    setObjUsuario({ ...objUsuario, [e.target.name]: e.target.value });
  }


  // postar lol '-'
  const postarPost = (objPostagem) => {
    return fetch(API_URL + '/poste', {
      method: 'POST',
      body: JSON.stringify(objPostagem),
      headers: cabecalhosAutenticados()
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {
        if(retorno_convertido.mensagem !== undefined){
          toast.error(retorno_convertido.mensagem)
          return false;
        }
        else{
          buscarPostagens()
          toast.success("Post enviado!")
          limparFormularioPostagem()
          return true;
        }
      })
  }

    // Repostar 
    const repostarPost = (postagemId, usuarioId) => {
      return fetch(API_URL + '/reposte/' + postagemId + '/usuarios/' + usuarioId, {
        method: 'POST',
        body: JSON.stringify(objPostagem),
        headers: cabecalhosAutenticados()
      })
        .then(retorno => retorno.json())
        .then(retorno_convertido => {
          if(retorno_convertido.mensagem !== undefined){
            toast.error(retorno_convertido.mensagem)
            return false;
          }
          else{
            buscarPostagens()
            buscarReposts()
            toast.success("Repostado!")
            limparFormularioPostagem()
            return true;
          }
        })
    }

    const desrepostarPost = (postagemId, repostagemId) => {
      fetch(API_URL + '/desreposte/' + postagemId + '/repost/' + repostagemId, {
        method: 'DELETE',
        headers: cabecalhosAutenticados()
      })
      .then(async retorno => ({ ok: retorno.ok, dados: await retorno.json() }))
      .then(({ ok, dados }) => {
        //mensagem
        if (!ok) {
          toast.error(dados.mensagem)
          return;
        }
        toast.success(dados.mensagem)

        buscarPostagens()
        buscarReposts()

        //limpar o formulario
        limparFormularioPostagem()
      })
    }

  //idPostagemPai só entra na URL - nunca no corpo, pra não arriscar o Hibernate
  //interpretar o comentário como uma atualização da postagem original
  const comentar = (idPostagemPai, objComentario) => {
    return fetch(API_URL + '/comente/' + idPostagemPai, {
      method: 'post',
      body: JSON.stringify(objComentario),
      headers: cabecalhosAutenticados()
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {
        if(retorno_convertido.mensagem !== undefined){
          toast.error(retorno_convertido.mensagem)
          return false;
        }
        else{
          buscarPostagens()
          buscarComentarios()
          toast.success("Comentário enviado!")
          return true;
        }
      })
  }

  const removerPost = (postagemId) => {
    fetch(API_URL + '/remove/postagem/' + postagemId, {
      method: 'DELETE',
      headers: cabecalhosAutenticados()
    })
    .then(async retorno => ({ ok: retorno.ok, dados: await retorno.json() }))
    .then(({ ok, dados }) => {
      //mensagem
      if (!ok) {
        toast.error(dados.mensagem)
        return;
      }
      toast.success(dados.mensagem)

      buscarPostagens()

      //limpar o formulario
      limparFormularioPostagem()
    })
  }

  //Alterar postagem
  const editarPost = () => {
    fetch(API_URL + '/edite/postagem', {
      method: 'put',
      body: JSON.stringify(objPostagem),
      headers: cabecalhosAutenticados()
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      if(retorno_convertido.mensagem !== undefined){
        toast.error(retorno_convertido.mensagem)
      } else {

        //mensagem
        toast.success('Postagem editada!')

        buscarPostagens()

        //limpar formulario
        limparFormularioPostagem()
      }
    })
  }

  //curtir
  const curtirPost = (postagemId, usuarioId) => {
      return fetch(API_URL + '/curte/postagem/' + postagemId + '/usuario/' + usuarioId, {
        method: 'PUT',
        body: JSON.stringify(objPostagem),
        headers: cabecalhosAutenticados()
      })
      .then(retorno => retorno.json())
      .then(() => {
        buscarPostagens()
        buscarCurtidas()
      })

    }


  //descurtir
  const descurtirPost = (postagemId, usuarioId, curtidaId) => {
      return fetch(API_URL + '/descurte/postagem/' + postagemId + '/usuario/' + usuarioId + '/curtida/' + curtidaId, {
        method: 'PUT',
        body: JSON.stringify(objPostagem),
        headers: cabecalhosAutenticados()
      })
      .then(retorno => retorno.json())
      .then(() => {
        buscarPostagens()
        buscarCurtidas()
      })

    }
  

  //cadastrar usuario
  const cadastrarUsuario = () => {
    return fetch(API_URL + '/cadastre/usuarios', {
      method: 'post',
      body: JSON.stringify(objUsuario),
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      if(retorno_convertido.mensagem !== undefined){
        toast.error(retorno_convertido.mensagem)
        return false;
      }
      else{
        buscarUsuarios()
        toast.success("Usuário cadastrado!")
        limparFormularioUsuario();
        return true;
      }
    })
    .catch(() => {
      toast.error('Erro ao cadastrar usuário.');
      return false; // Indica falha
  });
  }

  //entrar na conta
  const entrar = (nome, senha) => {
    return fetch(API_URL + '/login', {
      method: 'post',
      body: JSON.stringify({ nome, senha }),
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(async retorno => ({ ok: retorno.ok, dados: await retorno.json() }))
    .then(({ ok, dados }) => {
      if (!ok) {
        toast.error(dados.mensagem || "Nome e/ou senha incorretos!");
        return null;
      }
      toast.success("Login efetuado!");
      return { ...dados.usuario, token: dados.token };
    })
  }

  //remover usuario
  const removerUsuario = () => {
    fetch(API_URL + '/remove/usuarios/' + objUsuario.usuarioId, {
      method: 'delete',
      headers: cabecalhosAutenticados()
    })
      .then(async retorno => ({ ok: retorno.ok, dados: await retorno.json() }))
      .then(({ ok, dados }) => {
        //mensagem
        if (!ok) {
          toast.error(dados.mensagem);
          return;
        }
        toast.success(dados.mensagem);

        buscarUsuarios()

        //limpar formulario
        limparFormularioUsuario();

      })
  }

    //alterar usuario
    const alterarUsuario = () => {
      fetch(API_URL + '/altere/usuarios', {
        method: 'put',
        body: JSON.stringify(objUsuario),
        headers: cabecalhosAutenticados()
      })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {
        if(retorno_convertido.mensagem !== undefined){
          toast.error(retorno_convertido.mensagem)
        } else {

          //mensagem
          toast.success('Perfil editado!')

          buscarUsuarios()

          //limpar formulario
          limparFormularioUsuario()
        }
      })
    }

  //enviar foto de perfil
  const enviarFotoPerfil = (usuarioId, arquivo) => {
    const dadosArquivo = new FormData();
    dadosArquivo.append('arquivo', arquivo);

    //não usa cabecalhosAutenticados() aqui - Content-type tem que ser definido
    //automaticamente pelo navegador pra incluir o boundary do multipart
    return fetch(API_URL + '/usuarios/' + usuarioId + '/foto', {
      method: 'post',
      body: dadosArquivo,
      headers: {
        'Authorization': 'Bearer ' + obterToken()
      }
    })
      .then(async retorno => ({ ok: retorno.ok, dados: await retorno.json() }))
      .then(({ ok, dados }) => {
        if (!ok) {
          toast.error(dados.mensagem || 'Erro ao enviar a foto.')
          return false;
        }
        buscarUsuarios()
        toast.success('Foto de perfil atualizada!')
        return true;
      })
  }

  //seguir usuario
  const seguirUsuario = (seguidoId, seguindoId) => {
    fetch(API_URL + '/segue/usuarios/' + seguidoId + '/usuarios/' + seguindoId, {
      method: 'post',
      headers: cabecalhosAutenticados()
    })
    .then(async retorno => ({ ok: retorno.ok, dados: await retorno.json() }))
    .then(({ ok, dados }) => {
      if (!ok) {
        toast.error(dados.mensagem)
        return;
      }
      toast.success(dados.mensagem)
      buscarSeguidores()
      buscarUsuarios()
      limparFormularioSeguidores()
    })
  }

    //desseguir usuario
    const desseguirUsuario = (seguidoId, seguindoId) => {
      fetch(API_URL + '/dessegue/usuarios/' + seguidoId + '/usuarios/' + seguindoId, {
        method: 'delete',
        body: JSON.stringify(objSeguidor),
        headers: cabecalhosAutenticados()
      })
      .then(async retorno => ({ ok: retorno.ok, dados: await retorno.json() }))
      .then(({ ok, dados }) => {
        //mensagem
        if (!ok) {
          toast.error(dados.mensagem);
          return;
        }
        toast.success(dados.mensagem);

        buscarSeguidores()
        buscarUsuarios()

        //limpar formulario
        limparFormularioSeguidores();

      })
    }

  //Limpar formulario de postagem
  const limparFormularioPostagem = () => {
    setObjPostagem(postagem)
    setBtnCadastrar(true)
  }

  //Limpar formulario de usuario
  const limparFormularioUsuario = () => {
    setObjUsuario(usuario)
    setBtnCadastrar(true)
  }

    //Limpar formulario de seguirdores ?
    const limparFormularioSeguidores = () => {
      setObjSeguidor(seguidor)
      setBtnCadastrar(true)
    }

  //pra onde mandar quem cai numa rota sem destino (raiz ou desconhecida)
  const destinoPadrao = obterUsuarioLogado() ? '/inicio' : '/login';

  return (
    <Router >
        <ToastContainer theme="dark" position="top-right" autoClose={3500}/>
        <Routes>
          <Route path='/' element={<Navigate to={destinoPadrao} replace/>}/>
          <Route path='/inicio' element={<Inicio postar={postarPost} remover={removerPost} repostar={repostarPost} desrepostar={desrepostarPost} vetorR={reposts} vetorP={postagens} vetorU={usuarios} vetorC={curtidas} vetorComentarios={comentariosLista} curtir={curtirPost} descurtir={descurtirPost}/>}/>
          <Route path='/cadastro' element={<Cadastro cadastrar={cadastrarUsuario} eventoTeclado={aoDigitarUsu}/>}/>
          <Route path='/login' element={<Login logar={entrar}/>}/>
          <Route path='/perfil/:id' element={<Perfil seguir={seguirUsuario} desseguir={desseguirUsuario} postar={postarPost} remover={removerPost} curtir={curtirPost} descurtir={descurtirPost} repostar={repostarPost} desrepostar={desrepostarPost} enviarFoto={enviarFotoPerfil} vetorS={seguidores} vetorP={postagens} vetorR={reposts} vetorU={usuarios} vetorC={curtidas} vetorComentarios={comentariosLista}/>}/>
          <Route path='/postagem/:id' element={<Postagem vetorP={postagens} vetorU={usuarios} vetorC={curtidas} vetorR={reposts} vetorComentarios={comentariosLista} comentar={comentar} curtir={curtirPost} descurtir={descurtirPost} repostar={repostarPost} desrepostar={desrepostarPost} remover={removerPost}/>}/>
          <Route path='*' element={<Navigate to={destinoPadrao} replace/>}/>
        </Routes>
    </Router>
  );
}

export default App;