
import { Link, useNavigate } from 'react-router-dom';
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
        <div>
            NÃO UTILIZE UMA SENHA QUE VOCÊ USA COM FREQUÊNCIA
            <form> 
                <input type='text' placeholder='nome' name='nome' onChange={eventoTeclado} required></input>
                <input type='e-mail' placeholder='e-mail' name='email' onChange={eventoTeclado} required></input>
                <input type='password' placeholder='senha' name='senha' onChange={eventoTeclado} required></input>
                <Link to='/login'
                >possui cadastro?</Link>
                <input onClick={handleCadastro} type='button' value='CADASTRAR'></input>
            </form>
        </div>
    )
}
export default Cadastro;