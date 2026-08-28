import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Inicio from './pages/inicio/index';
import Cadastro from './pages/cadastro/index';
import Login from './pages/login/index';
import Perfil from './pages/perfil/index';
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

    //obj Repost
    const repost = {
      id: 0,
      botaoRepost: false,
      usuarioId: 0,
      postagemId: 0
    }

  //UseStates
  const [postagens, setPostagens] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [seguidores, setSeguidores] = useState([])
  const [curtidas, setCurtidas] = useState([])
  const [reposts, setReposts] = useState([])
  const [objRepost, setObjRepost] = useState(repost)
  const [objPostagem, setObjPostagem] = useState(postagem)
  const [objUsuario, setObjUsuario] = useState(usuario)
  const [objSeguidor, setObjSeguidor] = useState(seguidor)
  const [btnCadastrar, setBtnCadastrar] = useState(true)

  //UseEffect Postagens
  useEffect(() => {
    fetch(API_URL + '/liste/postagens')
    .then(retorno => retorno.json())
    .then(retorno_convertido => setPostagens(retorno_convertido))
  }, [])

  //UseEffect Usuarios
  useEffect(() => {
    fetch(API_URL + '/liste/usuarios')
      .then(retorno => retorno.json())
      .then(retorno_convertido => setUsuarios(retorno_convertido));
  }, []);

    //UseEffect Seguidores
    useEffect(() => {
      fetch(API_URL + '/liste/seguidores')
        .then(retorno => retorno.json())
        .then(retorno_convertido => setSeguidores(retorno_convertido));
    }, []);

    //UseEffect Curtidas
    useEffect(() => {
      fetch(API_URL + '/liste/curtidas')
        .then(retorno => retorno.json())
        .then(retorno_convertido => setCurtidas(retorno_convertido));
    }, []);

      //UseEffect Reposts
      useEffect(() => {
        fetch(API_URL + '/liste/reposts')
          .then(retorno => retorno.json())
          .then(retorno_convertido => setReposts(retorno_convertido));
      }, []);

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
          setPostagens([...postagens, retorno_convertido])
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
            setPostagens([...postagens, retorno_convertido])
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

        //cópia do vetor de postagens
        let vetorPTemp = [...postagens]

        //cópia do vetor de postagens
        let vetorRTemp = [...reposts]

        //indice
        let indiceP = vetorPTemp.findIndex((p) => {
          return p.postagemId === objPostagem.postagemId
        })

        //indice
        let indiceR = vetorRTemp.findIndex((p) => {
          return p.repostagemId = objRepost.id
        })

        //remover postagem do vetor temporário
        vetorPTemp.splice(indiceP,1)

        //remover postagem do vetor temporário
        vetorRTemp.splice(indiceR,1)

        //atualizar o vetor de postagens
        setPostagens(vetorPTemp)

        //limpar o formulario
        limparFormularioPostagem()
      })
    }

  const comentar = () => {
    fetch(API_URL + '/comente/' + objPostagem.postagemId, {
      method: 'post',
      body: JSON.stringify(objPostagem),
      headers: cabecalhosAutenticados()
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {
        if(retorno_convertido.mensagem !== undefined){
          toast.error(retorno_convertido.mensagem)
        }
        else{
          setPostagens([...postagens, retorno_convertido])
          toast.success("Comentário enviado!")
          limparFormularioPostagem()
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

      //cópia do vetor de postagens
      let vetorTemp = [...postagens]

      //indice
      let indice = vetorTemp.findIndex((p) => {
        return p.codigo = objPostagem.postagemId
      })

      //remover postagem do vetor temporário
      vetorTemp.splice(indice,1)

      //atualizar o vetor de postagens
      setPostagens(vetorTemp)

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

        //vetor temporário
        let vetorTemp = [...postagem]

        //indice
        let indice = vetorTemp.findIndex((p) => {
          return p.postagemId === objPostagem.postagemId
        })

        //alterar postagem do vetor 
        vetorTemp[indice] = objPostagem

        //atualizar o vetor de postagens
        setPostagens(vetorTemp)

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
      .then(retorno_convertido => {
        setObjPostagem(retorno_convertido)
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
      .then(retorno_convertido => {
        setObjPostagem(retorno_convertido)
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
        setUsuarios([...usuarios, retorno_convertido])
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

        //cópia do vetor de usuarios
        let vetorTemp = [...usuarios];

        //indice
        let indice = vetorTemp.findIndex((u) => {
          return u.usuarioId === objUsuario.usuarioId;
        });

        //remover usuario do vetor temp
        vetorTemp.splice(indice, 1);

        //atualizar o vetor de usuarios
        setUsuarios(vetorTemp);

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
  
          //vetor temporário
          let vetorTemp = [...usuario]
  
          //indice
          let indice = vetorTemp.findIndex((u) => {
            return u.usuarioId === objPostagem.usuarioId
          })
  
          //alterar usuario do vetor 
          vetorTemp[indice] = objPostagem
  
          //atualizar o vetor de usuarios
          setUsuarios(vetorTemp)
  
          //limpar formulario
          limparFormularioUsuario()
        }
      })
    }

  //seguir usuario
  const seguirUsuario = (seguidoId, seguindoId) => {
    fetch(API_URL + '/segue/usuarios/' + seguidoId + '/usuarios/' + seguindoId, {
      method: 'post',
      headers: cabecalhosAutenticados()
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      if(retorno_convertido.mensagem !== undefined){
        toast.error(retorno_convertido.mensagem)
      }
      else{
        setSeguidores([...usuarios, retorno_convertido])
        toast.success("Usuário seguido!")
        limparFormularioSeguidores()
      }
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

        //cópia do vetor de usuarios
        let vetorTemp = [...seguidores];

        //indice
        let indice = vetorTemp.findIndex((s) => {
          return s.id === objSeguidor.id;
        });

        //remover usuario do vetor temp
        vetorTemp.splice(indice, 1);

        //atualizar o vetor de usuarios
        setUsuarios(vetorTemp);

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
          <Route path='/inicio' element={<Inicio postar={postarPost} remover={removerPost} repostar={repostarPost} desrepostar={desrepostarPost} vetorR={reposts} vetorP={postagens} vetorU={usuarios} vetorC={curtidas} curtir={curtirPost} descurtir={descurtirPost}/>}/>
          <Route path='/cadastro' element={<Cadastro cadastrar={cadastrarUsuario} eventoTeclado={aoDigitarUsu}/>}/>
          <Route path='/login' element={<Login logar={entrar}/>}/>
          <Route path='/perfil/:id' element={<Perfil seguir={seguirUsuario} desseguir={desseguirUsuario} postar={postarPost} remover={removerPost} curtir={curtirPost} descurtir={descurtirPost} repostar={repostarPost} desrepostar={desrepostarPost} vetorS={seguidores} vetorP={postagens} vetorR={reposts} vetorU={usuarios} vetorC={curtidas}/>}/>
          <Route path='*' element={<Navigate to={destinoPadrao} replace/>}/>
        </Routes>
    </Router>
  );
}

export default App;