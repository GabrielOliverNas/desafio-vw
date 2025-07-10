import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">VW</h2>
      <nav>
        <NavLink to="/dashboard" className="nav-item">Dashboard</NavLink>
        <div className="submenu">
          <div className="submenu-title">Usuários</div>
          <NavLink to="/usuario" className="nav-item submenu-item">Listar</NavLink>
          <NavLink to="/usuario/cadastrar" className="nav-item submenu-item">Cadastrar</NavLink>
        </div>
        
        <div className="submenu">
          <div className="submenu-title">Veículos</div>
          <NavLink to="/veiculos" className="nav-item submenu-item">Listar</NavLink>
          <NavLink to="/veiculos/cadastrar" className="nav-item submenu-item">Cadastrar</NavLink>
        </div>

      </nav>
    </div>
  );
};

export default Sidebar;
