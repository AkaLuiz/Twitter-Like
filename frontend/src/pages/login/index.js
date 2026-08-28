import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { salvarUsuarioLogado } from '../../utils/auth';

function Login({logar}){
    const[nome, setNome] = useState([]);
    const[senha, setSenha] = useState([]);
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
        <div>
            <form>
                <input type='text' placeholder='nome' onChange={(e) => setNome(e.target.value)} value={nome}></input>
                <input type='text' placeholder='senha' onChange={(e) => setSenha(e.target.value)} value={senha}></input>
                <Link to='/cadastro'
                >Não possui cadastro?</Link>
                <input type='button' onClick={handleLogin} value='Entrar'></input>
            </form>
        </div>
    )
}
export default Login;