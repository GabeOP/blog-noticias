import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home  } from './pages/Home/Home.jsx';
import { Header } from './components/Header/Header.jsx';
import { PaginaCadastro } from './pages/Cadastro/Cadastro.jsx';
import PaginaLogin from './pages/Login/Login.jsx';
import { DetalhesPost } from './pages/DetalhesPost/DetalhesPost.jsx';
import { CriarPost } from './pages/CriarPost/CriarPost.jsx';

function AppRoutes() {
    const isLoginPage = window.location.pathname === '/login';
    const isCadastroPage = window.location.pathname === '/cadastro';
    const showHeader = !isLoginPage && !isCadastroPage;  

    return (
        
        <BrowserRouter>
          {showHeader && <Header />}
            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route path="/login" element={<PaginaLogin />}></Route>
                <Route path="/cadastro" element={<PaginaCadastro />}></Route>
                <Route path="/post" element={<DetalhesPost />}></Route>
                <Route path="/adm/criar-post" element={<CriarPost />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
