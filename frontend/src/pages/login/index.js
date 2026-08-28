import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { salvarUsuarioLogado } from '../../utils/auth';
import Logo from '../../components/logo';

function Login({logar}){
    const[nome, setNome] = useState('');
    const[senha, setSenha] = useState('');
    const navigate = useNavigate();
    const handleLogin = async () => {
        try{
            const usuario = await logar(nome, senha);
            if (usuario) {
                salvarUsuarioLogado(usuario);
                navigate('/inicio'); // Redireciona para a página de inicio após login bem-sucedido
            }
        }
        catch(error){
            console.error("Erro ao fazer login:", error);
        }
    }

    return(
        <div className="tela-auth">
            <div className="cartao-auth">
                <Logo tamanho={32}/>
                <h1>Login</h1>
                <form className="formulario-auth" onSubmit={(e) => e.preventDefault()}>
                    <input className="campo" type='text' placeholder='nome' onChange={(e) => setNome(e.target.value)} value={nome}/>
                    <input className="campo" type='password' placeholder='senha' onChange={(e) => setSenha(e.target.value)} value={senha}/>
                    <span className="link-sutil">esqueceu sua senha?</span>
                    <button className="botao-primario" type="button" onClick={handleLogin}>Entrar</button>
                </form>
                <Link className="link-sutil" to='/cadastro'>Não possui cadastro?</Link>
            </div>
        </div>
    )
}
export default Login;
