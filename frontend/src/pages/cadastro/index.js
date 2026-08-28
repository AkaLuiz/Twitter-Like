import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/logo';

function Cadastro({cadastrar, eventoTeclado}){

    const navigate = useNavigate();
    const handleCadastro = () => {
        cadastrar().then((isSuccessful) => {
            if (isSuccessful) {
                navigate('/login'); // Redireciona para a página de login após login cadastro-sucedido
            }
        });
    }
    return(
        <div className="tela-auth">
            <div className="cartao-auth">
                <Logo tamanho={32}/>
                <h1>Cadastre-se</h1>
                <form className="formulario-auth" onSubmit={(e) => e.preventDefault()}>
                    <input className="campo" type='text' placeholder='nome' name='nome' onChange={eventoTeclado} required/>
                    <input className="campo" type='email' placeholder='e-mail' name='email' onChange={eventoTeclado} required/>
                    <input className="campo" type='password' placeholder='senha' name='senha' onChange={eventoTeclado} required/>
                    <button className="botao-primario" type="button" onClick={handleCadastro}>Cadastrar</button>
                </form>
                <Link className="link-sutil" to='/login'>possui cadastro?</Link>
                <p className="aviso-auth">Não utilize uma senha que você usa com frequência</p>
            </div>
        </div>
    )
}
export default Cadastro;
