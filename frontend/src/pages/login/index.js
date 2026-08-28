import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({logar, encontrar}){
    const[nome, setNome] = useState([]);
    const[senha, setSenha] = useState([]);
    const navigate = useNavigate();
    const handleLogin = async () => {
        try{
            const isSuccessful = await logar(nome, senha);
            if (isSuccessful) {
                const userId = await encontrar(nome)
                navigate('/inicio', { state: { nomeUsuario: nome, id: userId} }); // Redireciona para a página de inicio após login bem-sucedido
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