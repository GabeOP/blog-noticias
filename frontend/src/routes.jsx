import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home/Home.jsx';
import { Header } from './components/Header/Header.jsx';
import { PaginaCadastro } from './pages/Cadastro/Cadastro.jsx';
import PaginaLogin from './pages/Login/Login.jsx';
import { DetalhesPost } from './pages/DetalhesPost/DetalhesPost.jsx';
import { CriarPost } from './pages/CriarPost/CriarPost.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute.jsx';

function AppRoutes() {
  const isLoginPage = window.location.pathname === '/login';
  const isCadastroPage = window.location.pathname === '/cadastro';
  const showHeader = !isLoginPage && !isCadastroPage;

  return (
    <AuthProvider>
      <BrowserRouter>
        {showHeader && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/page/:pageNumber" element={<Home />} />
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/cadastro" element={<PaginaCadastro />} />
          <Route path="/post" element={<DetalhesPost />} />
          <Route
            path="/adm/criar-post"
            element={
              <ProtectedRoute requiredPermission="POST_CREATE">
                <CriarPost />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRoutes;
