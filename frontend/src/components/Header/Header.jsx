import { useEffect } from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom'
import "./Header.css"

export const Header = ({ pageTitle }) => {

    const nomeUsuario = sessionStorage.getItem('nome');
    const isAdmin = sessionStorage.getItem('cargo');

    return (
            <header>
                <h1>{ pageTitle } Teste</h1>

                <div>
                    <span>Seja bem-vindo(a), {nomeUsuario}</span>

                    <nav id="usuario-container">
                        {isAdmin ? (
                            <>
                                <Link to="./frontend/pages/criarPost.html" id="btnCriarPost">Criar post</Link>
                                <Link to="./frontend/pages/gerenciarUsuarios.html" id="btnGerenciar">Gerenciar</Link>
                            </>
                        ) : null}
                        <Link to="./frontend/pages/login.html" id="btnSair">Sair</Link>
                    </nav>
                </div>
            </header>
    );
}