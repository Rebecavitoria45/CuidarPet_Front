import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Telas/Login';
import Layout from './Telas/Layout';
import DashboardPrincipal from './Telas/DashBoardAdmin';
import { ProtectedRoute } from './config/ProtectRouter'; 
import GerenciarUsuarios from './Telas/usuarios/GerenciarUsuarios';
import CadastrarUsuario from './Telas/usuarios/CadastrarUsuario';
import EditarUsuario from './Telas/usuarios/EdicaoUsuario';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* ROTA PROTEGIDA */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
              <DashboardPrincipal />
             </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
  path="/usuarios/cadastro" 
  element={
    <ProtectedRoute>
       <CadastrarUsuario />
    </ProtectedRoute>
  } 
/>
<Route path="/usuarios/editar/:id" 
element={<ProtectedRoute>
  <EditarUsuario />
</ProtectedRoute>} />
        <Route 
           path="/usuarios" 
          element={
               <ProtectedRoute>
                  <Layout>
                    <GerenciarUsuarios />
                 </Layout>
               </ProtectedRoute>
           } 
         />
        {/* Redirecionamento para a tela de login*/}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;