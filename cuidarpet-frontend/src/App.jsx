import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Telas/Login';
import Layout from './Telas/Layout';
import { ProtectedRoute } from './config/ProtectRouter'; 
import GerenciarUsuarios from './Telas/usuarios/GerenciarUsuarios';
import CadastrarUsuario from './Telas/usuarios/CadastrarUsuario';
import EditarUsuario from './Telas/usuarios/EdicaoUsuario';
import GerenciarClientes from './Telas/clientes/GerenciarClientes';
import CadastrarCliente from './Telas/clientes/CadastrarCliente';
import EditarCliente from './Telas/clientes/EdicaoCliente';
import GerenciarPets from './Telas/pets/GerenciamentoPets';
import CadastrarPet from './Telas/pets/CadastrarPet';
import EditarPet from './Telas/pets/EdicaoPet';
import Dashboard from './Telas/DashBoardAdmin';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
              <Dashboard />
             </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
  path="/usuarios/cadastro" 
  element={
    <ProtectedRoute  adminOnly={true}>
       <CadastrarUsuario />
    </ProtectedRoute>
  } 
/>
<Route path="/clientes" 
element={<ProtectedRoute>
  <GerenciarClientes />
  </ProtectedRoute>} />

  <Route path="/clientes/cadastro" 
  element={<ProtectedRoute>
    <CadastrarCliente />
  </ProtectedRoute>} />

  <Route path="/pets" element={<ProtectedRoute><GerenciarPets /></ProtectedRoute>} />

      <Route path="/pets/cadastro" element={
            <ProtectedRoute>
               <Layout> <CadastrarPet /> </Layout>
            </ProtectedRoute>
        } />

        <Route path="/pets/editar/:id" element={<ProtectedRoute><EditarPet /></ProtectedRoute>} />

 <Route path="/clientes/editar/:id" 
 element={<ProtectedRoute>
  <EditarCliente />
  </ProtectedRoute>} />
<Route path="/usuarios/editar/:id" 
element={<ProtectedRoute  adminOnly={true}>
  <EditarUsuario />
</ProtectedRoute>} />
        <Route 
           path="/usuarios" 
          element={
               <ProtectedRoute  adminOnly={true}>
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