import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './routes/login/Login';
import Usuario from './routes/usuario/Usuario';
import AccessDenied from './routes/AccessDenied';
import Dashboard from './routes/dashboard/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import CadastrarUsuario from './routes/usuario/cadastro/CadastrarUsuario';
import Veiculo from './routes/veiculo/Veiculo';
import CadastrarVeiculo from './routes/veiculo/cadastrar/CadastrarVeiculo';
import UsuarioForm from './routes/usuario/form/UsuarioForm';
import AlterarVeiculo from './routes/veiculo/alterar/AlterarVeiculo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>

        <Route path="/usuario" element={<ProtectedRoute><Usuario /></ProtectedRoute>}/>
        <Route path="/usuario/cadastrar" element={<ProtectedRoute requiredRole="ADMIN"><CadastrarUsuario /></ProtectedRoute>} />
        <Route path="/usuario/editar/:uuid" element={<ProtectedRoute requiredRole="ADMIN"><UsuarioForm /></ProtectedRoute>} />

        <Route path="/veiculos" element={<ProtectedRoute><Veiculo /></ProtectedRoute>}/>
        <Route path="/veiculos/cadastrar" element={<ProtectedRoute requiredRole="ADMIN"><CadastrarVeiculo /></ProtectedRoute>}/>
        <Route path="/veiculo/editar/:uuid" element={<ProtectedRoute requiredRole="ADMIN"><AlterarVeiculo /></ProtectedRoute>} />

        <Route path="/acesso-negado" element={<AccessDenied />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
export default App;