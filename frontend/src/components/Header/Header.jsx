import { useEffect } from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom'
import "./Header.css"

export const Header = () => {

    const nomeUsuario = sessionStorage.getItem('nome');
    const isAdmin = sessionStorage.getItem('cargo');

    return (
            <header>
                <Link to="/" id='h1-header'><h1>Blog</h1></Link>

                <div>
                    <span>Seja bem-vindo(a), {nomeUsuario}</span>

                    <nav id="usuario-container">
                        {isAdmin ? (
                            <>
                                <Link to="./frontend/pages/criarPost.html" id="btnCriarPost">Criar post</Link>
                                <Link to="./frontend/pages/gerenciarUsuarios.html" id="btnGerenciar">Gerenciar</Link>
                            </>
                        ) : null}
                        <Link to="/" id='btnPagInicial'>Página inicial</Link>
                        <Link to="/login" onClick={location.reload} id="btnSair">Sair</Link>
                    </nav>
                </div>
            </header>
    );
}