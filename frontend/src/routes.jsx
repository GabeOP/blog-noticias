import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './pages/Home/Home.jsx';
import { Header } from './components/Header/Header.jsx';
import { PaginaCadastro } from './pages/Cadastro/Cadastro.jsx';
import PaginaLogin from './pages/Login/Login.jsx';
import { DetalhesPost } from './pages/DetalhesPost/DetalhesPost.jsx';
import { CriarPost } from './pages/CriarPost/CriarPost.jsx';
import { EditarPost } from './pages/EditarPost/EditarPost.jsx';
import { GerenciarUsuarios } from './pages/GerenciarUsuarios/GerenciarUsuarios.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute.jsx';

function AppLayout() {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/cadastro'];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page/:pageNumber" element={<Home />} />
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/cadastro" element={<PaginaCadastro />} />
        <Route path="/post" element={<DetalhesPost />} />
        <Route
          path="/post/editar"
          element={
            <ProtectedRoute>
              <EditarPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adm/criar-post"
          element={
            <ProtectedRoute requiredPermission="POST_CREATE">
              <CriarPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adm/usuarios"
          element={
            <ProtectedRoute requiredPermission="USER_READ">
              <GerenciarUsuarios />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRoutes;
