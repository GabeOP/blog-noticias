import { useEffect } from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom'
import "./Header.css"

export const Header = () => {

    const handleLogout = () => {
        sessionStorage.clear();
        location.href="/login"
    }

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
                                <Link to="/adm/criar-post" id="btnCriarPost">Criar post</Link>
                                <Link to="#" id="btnGerenciar">Gerenciar</Link>
                            </>
                        ) : null}
                        <Link to="/" id='btnPagInicial'>Página inicial</Link>
                        <Link id="btnSair" onClick={handleLogout}> Sair</Link>
                    </nav>
                </div>
            </header>
    );
}