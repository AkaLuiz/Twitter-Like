import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from './pages/inicio/index';
import Cadastro from './pages/cadastro/index';
import Login from './pages/login/index';
import Perfil from './pages/perfil/index';
import { obterToken } from './utils/auth';

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
    fetch('http://localhost:8090/liste/postagens')
    .then(retorno => retorno.json())
    .then(retorno_convertido => setPostagens(retorno_convertido))
  }, [])

  //UseEffect Usuarios
  useEffect(() => {
    fetch('http://localhost:8090/liste/usuarios')
      .then(retorno => retorno.json())
      .then(retorno_convertido => setUsuarios(retorno_convertido));
  }, []);

    //UseEffect Seguidores
    useEffect(() => {
      fetch('http://localhost:8090/liste/seguidores')
        .then(retorno => retorno.json())
        .then(retorno_convertido => setSeguidores(retorno_convertido));
    }, []);

    //UseEffect Curtidas
    useEffect(() => {
      fetch('http://localhost:8090/liste/curtidas')
        .then(retorno => retorno.json())
        .then(retorno_convertido => setCurtidas(retorno_convertido));
    }, []);

      //UseEffect Reposts
      useEffect(() => {
        fetch('http://localhost:8090/liste/reposts')
          .then(retorno => retorno.json())
          .then(retorno_convertido => setReposts(retorno_convertido));
      }, []);

  //dados do formulario usuario
  const aoDigitarUsu = (e) => {
    setObjUsuario({ ...objUsuario, [e.target.name]: e.target.value });
  }


  // postar lol '-'
  const postarPost = (objPostagem) => {
    return fetch('http://localhost:8090/poste', {
      method: 'POST',
      body: JSON.stringify(objPostagem),
      headers: cabecalhosAutenticados()
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {
        if(retorno_convertido.mensagem !== undefined){
          alert(retorno_convertido.mensagem)
          return false;
        }
        else{
          setPostagens([...postagens, retorno_convertido])
          alert("Post enviado!")
          limparFormularioPostagem()
          return true;
        }
      })
  }

    // Repostar 
    const repostarPost = (postagemId, usuarioId) => {
      return fetch('http://localhost:8090/reposte/' + postagemId + '/usuarios/' + usuarioId, {
        method: 'POST',
        body: JSON.stringify(objPostagem),
        headers: cabecalhosAutenticados()
      })
        .then(retorno => retorno.json())
        .then(retorno_convertido => {
          if(retorno_convertido.mensagem !== undefined){
            alert(retorno_convertido.mensagem)
            return false;
          }
          else{
            setPostagens([...postagens, retorno_convertido])
            alert("Repostado!")
            limparFormularioPostagem()
            return true;
          }
        })
    }

    const desrepostarPost = (postagemId, repostagemId) => {
      fetch('http://localhost:8090/desreposte/' + postagemId + '/repost/' + repostagemId, {
        method: 'DELETE',
        headers: cabecalhosAutenticados()
      })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {
        //mensagem
        alert(retorno_convertido.mensagem)
  
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
    fetch('http://localhost:8090/comente/' + objPostagem.postagemId, {
      method: 'post',
      body: JSON.stringify(objPostagem),
      headers: cabecalhosAutenticados()
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {
        if(retorno_convertido.mensagem !== undefined){
          alert(retorno_convertido.mensagem)
        }
        else{
          setPostagens([...postagens, retorno_convertido])
          alert("Comentário enviado!")
          limparFormularioPostagem()
        }
      })
  }

  const removerPost = (postagemId) => {
    fetch('http://localhost:8090/remove/postagem/' + postagemId, {
      method: 'DELETE',
      headers: cabecalhosAutenticados()
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      //mensagem
      alert(retorno_convertido.mensagem)

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
    fetch('http://localhost:8090/edite/postagem', {
      method: 'put',
      body: JSON.stringify(objPostagem),
      headers: cabecalhosAutenticados()
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      if(retorno_convertido.mensagem !== undefined){
        alert(retorno_convertido.mensagem)
      } else {
         
        //mensagem
        alert('Postagem editada!')

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
      return fetch('http://localhost:8090/curte/postagem/' + postagemId + '/usuario/' + usuarioId, {
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
      return fetch('http://localhost:8090/descurte/postagem/' + postagemId + '/usuario/' + usuarioId + '/curtida/' + curtidaId, {
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
    return fetch('http://localhost:8090/cadastre/usuarios', {
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
        alert(retorno_convertido.mensagem)
        return false;
      }
      else{
        setUsuarios([...usuarios, retorno_convertido])
        console.log("Enviando para o backend:", objUsuario);
        alert("Usuário cadastrado!")
        limparFormularioUsuario();
        return true;
      }
    })
    .catch(() => {
      alert('Erro ao cadastrar usuário.');
      return false; // Indica falha
  });
  }

  //entrar na conta
  const entrar = (nome, senha) => {
    return fetch('http://localhost:8090/login', {
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
        alert(dados.mensagem || "Nome e/ou senha incorretos!");
        return null;
      }
      alert("Login efetuado!");
      return { ...dados.usuario, token: dados.token };
    })
  }

  //remover usuario
  const removerUsuario = () => {
    fetch('http://localhost:8090/remove/usuarios/' + objUsuario.usuarioId, {
      method: 'delete',
      headers: cabecalhosAutenticados()
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {
        //mensagem
        alert(retorno_convertido.mensagem);

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
      fetch('http://localhost:8090/altere/usuarios', {
        method: 'put',
        body: JSON.stringify(objUsuario),
        headers: cabecalhosAutenticados()
      })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {
        if(retorno_convertido.mensagem !== undefined){
          alert(retorno_convertido.mensagem)
        } else {
           
          //mensagem
          alert('Perfil editado!')
  
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
    fetch('http://localhost:8090/segue/usuarios/' + seguidoId + '/usuarios/' + seguindoId, {
      method: 'post',
      headers: cabecalhosAutenticados()
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      if(retorno_convertido.mensagem !== undefined){
        alert(retorno_convertido.mensagem)
      }
      else{
        setSeguidores([...usuarios, retorno_convertido])
        alert("Usuário seguido!")
        limparFormularioSeguidores()
      }
    })
  }
  
    //desseguir usuario
    const desseguirUsuario = (seguidoId, seguindoId) => {
      fetch('http://localhost:8090/dessegue/usuarios/' + seguidoId + '/usuarios/' + seguindoId, {
        method: 'delete',
        body: JSON.stringify(objSeguidor),
        headers: cabecalhosAutenticados()
      })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {
        //mensagem
        alert(retorno_convertido.mensagem);

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

  return (
    <Router >
        <Routes>
          <Route path='/inicio' element={<Inicio postar={postarPost} remover={removerPost} repostar={repostarPost} desrepostar={desrepostarPost} vetorR={reposts} vetorP={postagens} vetorU={usuarios} vetorC={curtidas} curtir={curtirPost} descurtir={descurtirPost}/>}/>
          <Route path='/cadastro' element={<Cadastro cadastrar={cadastrarUsuario} eventoTeclado={aoDigitarUsu}/>}/>
          <Route path='/login' element={<Login logar={entrar}/>}/>
          <Route path='/perfil/:id' element={<Perfil seguir={seguirUsuario} desseguir={desseguirUsuario} postar={postarPost} remover={removerPost} curtir={curtirPost} descurtir={descurtirPost} repostar={repostarPost} desrepostar={desrepostarPost} vetorS={seguidores} vetorP={postagens} vetorR={reposts} vetorU={usuarios} vetorC={curtidas}/>}/>
        </Routes>
    </Router>
  );
}

export default App;