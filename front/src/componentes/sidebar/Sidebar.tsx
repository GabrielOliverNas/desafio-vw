import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../../hooks/useAuth';

const Sidebar: React.FC = () => {

  const { isAdmin } = useAuth();
  
  return (
    <div className="sidebar">
      <h2 className="logo">VW</h2>
      <nav>
        <NavLink to="/dashboard" className="nav-item">Dashboard</NavLink>
        <div className="submenu">
          <div className="submenu-title">Usuários</div>
          <NavLink to="/usuario" className="nav-item submenu-item">Listar</NavLink>
          {isAdmin && (
            <NavLink to="/usuario/cadastrar" className="nav-item submenu-item">Cadastrar</NavLink>
          )}
        </div>
        
        <div className="submenu">
          <div className="submenu-title">Veículos</div>
          <NavLink to="/veiculos" className="nav-item submenu-item">Listar</NavLink>
          {isAdmin && (
            <NavLink to="/veiculos/cadastrar" className="nav-item submenu-item">Cadastrar</NavLink>
          )}
        </div>

      </nav>
    </div>
  );
};

export default Sidebar;
